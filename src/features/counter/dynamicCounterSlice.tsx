import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface DynamicCounterState {
    value: number
}

const initialState: DynamicCounterState = {
    value: 0
}

export const dynamicCounterSlice = createSlice({
    name: "dynamicCounter",
    initialState,
    reducers: {
        dynamicIncrement: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },
        dynamicDecrement: (state, action: PayloadAction<number>) => {
            state.value -= action.payload
        }
    }
})


export const {dynamicIncrement, dynamicDecrement} = dynamicCounterSlice.actions

export default dynamicCounterSlice.reducer