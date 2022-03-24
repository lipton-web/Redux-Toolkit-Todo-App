// 할 일 제어하고 업데이트
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTodosAsync = createAsyncThunk(
	'todos/getTodosAsync',
	async () => {
		const response = await fetch("http://localhost:7000/todos");
		if(response.ok) {
			const todos = await response.json();
			return {todos}
		}
	}
);

export const addTodoAsync = createAsyncThunk(
	'todos/addTodoAsync',
	async (payload) => {
		const response = await fetch("http://localhost:7000/todos", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({title: payload.title})
		});

		if(response.ok) {
			const todo = await response.json();
			return {todo}
		}
	}
);

export const toggleCompleteAsync = createAsyncThunk(
	'todos/completeTodoAsync',
	async (payload) => {
		const response = await fetch(`http://localhost:7000/todos/${payload.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({completed: payload.completed})
		});

		if(response.ok) {
			const todo = await response.json();
			return { id: todo.id, completed: todo.completed };
		}
	}
);

const todoSlice = createSlice({
	name: "todos",
	initialState: [
		{ id:1, title:"todo1", completed:false },
		{ id:2, title:"todo2", completed:false },
		{ id:3, title:"todo3", completed:true },
	],
	reducers: {
		//  todo 항목 추가
		addTodo: (state, action) => {
			const newTodo = {
				id: Date.now(),
				title: action.payload.title,
				completed: false,
			};
			state.push(newTodo);
		},

		// todo 완료 체크
		// toggleComplete: (state, action) => {
		// 	const index = state.findIndex((todo) => todo.id === action.payload.id);
		// 	state[index].completed = action.payload.completed;
		// },

		// todo 삭제
		deleteTodo: (state, action) => {
			return state.filter((todo) => todo.id !== action.payload.id);
		}
	},

	// 비동기 처리, thunk 이후 작업 처리 리듀서
	extraReducers: {
		// 불러오기
		[getTodosAsync.pending]: (state, action) => {
			console.log("fetching data...")
		},
		[getTodosAsync.fulfilled]: (state, action) => {
			console.log("fetching data successfully!")
			return action.payload.todos;
		},

		// 추가하기
		[addTodoAsync.fulfilled]: (state, action) => {
			state.push(action.payload.todo);
		},

		//완료하기
		[toggleCompleteAsync.fulfilled]: (state, action) => {
			const index = state.findIndex((todo) => todo.id === action.payload.id);
			state[index].completed = action.payload.completed;
		},
	}
});

export const { 
	addTodo,
	toggleComplete, 
	deleteTodo,
} = todoSlice.actions;

// 스토어에 추가해주기 위해서
export default todoSlice.reducer;