import {configureStore} from '@reduxjs/toolkit'
import counterReducer from "../src/features/counter/counterSlice"
import dynamicCounter from "../src/features/counter/dynamicCounterSlice.tsx"
import todoReducer from "../src/features/todo/todoSlice.ts"
import categoryReducer from "../src/features/category/categorySlice.ts"

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        dynamicCounter: dynamicCounter,
        todo: todoReducer,
        category: categoryReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch