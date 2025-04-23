import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";
import {loadFromLocalStorage, saveToLocalStorage} from "../../utils/localStorage.ts";

export interface TodoState {
    id: string,
    title: string,
    completed: boolean,
    category?: string
}

const STORAGE_KEY = 'todos';


const initialState: TodoState[] = loadFromLocalStorage<TodoState[]>(STORAGE_KEY, []);


export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<{ title: string, category: string }>) => {
            const newTodo: TodoState = {
                id: nanoid(),
                title: action.payload.title,
                completed: false,
                category: action.payload.category === "" ? "All" : action.payload.category
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
        editTodo: (state, action: PayloadAction<{ id: string, title: string, category: string }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
                todo.category = action.payload.category
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