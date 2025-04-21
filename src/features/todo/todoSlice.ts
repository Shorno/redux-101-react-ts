import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";

export interface TodoState {
    id: string,
    title: string,
    completed: boolean
}

const initialState: TodoState[] = []

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<string>) => {
            const newTodo = {
                id: nanoid(),
                title: action.payload,
                completed: false
            }
            state.push(newTodo)
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.find((todo) => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
            }
        },
        editTodo: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
            }
        },
        deleteTodo: (state, action: PayloadAction<string>) => state.filter((todo) => todo.id != action.payload)

    }
})


export const {addTodo, toggleTodo, editTodo, deleteTodo} = todoSlice.actions
export default todoSlice.reducer