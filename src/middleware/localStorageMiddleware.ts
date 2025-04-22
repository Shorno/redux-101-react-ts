import {Middleware} from "@reduxjs/toolkit";


export const localStorageMiddleware: Middleware = storeAPI => next => action => {
    const result = next(action);
    const state = storeAPI.getState()
    localStorage.setItem("app_state", JSON.stringify({
        todo: state.todo,
    }))
    return result
}