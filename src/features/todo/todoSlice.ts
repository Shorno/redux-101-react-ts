import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";
import {loadFromLocalStorage, saveToLocalStorage} from "../../utils/localStorage.ts";

export interface TodoState {
    id: string,
    title: string,
    completed: boolean
}

const STORAGE_KEY = 'todos';

const initialState: TodoState[] = loadFromLocalStorage<TodoState[]>(STORAGE_KEY, []);


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
            saveToLocalStorage(STORAGE_KEY, state)
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.find((todo) => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
                saveToLocalStorage(STORAGE_KEY, state)
            }
        },
        editTodo: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
                saveToLocalStorage(STORAGE_KEY, state)
            }
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            const newState = state.filter((todo) => todo.id != action.payload)
            saveToLocalStorage(STORAGE_KEY, newState)
            return newState
        }
    }
})


export const {addTodo, toggleTodo, editTodo, deleteTodo} = todoSlice.actions
export default todoSlice.reducer