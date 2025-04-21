import {configureStore} from '@reduxjs/toolkit'
import counterReducer from "../src/features/counter/counterSlice"
import dynamicCounter from "../src/features/counter/dynamicCounterSlice.tsx"
import todoReducer from "../src/features/todo/todoSlice.ts"

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        dynamicCounter: dynamicCounter,
        todo: todoReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch