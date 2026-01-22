import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import contactReducer from '../features/contacts/contactSlics'
import taskReducer from '../features/tasks/taskSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        contacts: contactReducer,
        tasks: taskReducer,
    }
})

