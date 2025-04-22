import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";

interface Category {
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
const initialState: Category[] = categories || []

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
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            return state.filter((category) => category.id !== action.payload)
        }
    }
})

export const {addCategory, removeCategory} = categorySlice.actions
export default categorySlice.reducer