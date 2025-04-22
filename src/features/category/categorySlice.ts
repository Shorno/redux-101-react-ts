import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";
import {loadFromLocalStorage, saveToLocalStorage} from "../../utils/localStorage.ts";

export interface Category {
    id: string,
    label: string
}

const categories: Category[] = [
    {
        id: "GfWqfIz6Ot7qYiiiHiu",
        label: "Personal"
    },
    {
        id: "mVsYMUcL9oyeBWrCrrbsF",
        label: "Work"
    }
]
const STORAGE_KEY = "categories"
const initialState: Category[] = loadFromLocalStorage<Category[]>(STORAGE_KEY, categories)

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        addCategory: (state, action: PayloadAction<string>) => {
            const newCategory = {
                id: nanoid(),
                label: action.payload
            }
            state.push(newCategory)
            saveToLocalStorage(STORAGE_KEY, state)
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            const newState = state.filter((category) => category.id !== action.payload)
            saveToLocalStorage(STORAGE_KEY, newState)
            return newState

        }
    }
})

export const {addCategory, removeCategory} = categorySlice.actions
export default categorySlice.reducer