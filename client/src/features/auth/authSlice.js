import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance.js'

export const loginUser = createAsyncThunk('/auth/login', async (credentials, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials)

        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('user',JSON.stringify(response.data.data.user))
        return response.data.data
    } catch(error) {
        const message = error.response?.data?.message || 'server is unreachable'
        return rejectWithValue(message)
    }
})

export const getMe = createAsyncThunk('auth/getMe', async(_, {rejectWithValue}) => {
    try{
        const response = await axiosInstance.get('/auth/me')
        localStorage.setItem('user', JSON.stringify(response.data.data))
        return response.data.data
    } catch(error){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return rejectWithValue(error.response?.data?.message || 'Session Expired')
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: (localStorage.getItem('user') && localStorage.getItem('user') !== "undefined") 
            ? JSON.parse(localStorage.getItem('user')) : null,
            
        token: localStorage.getItem('token'),
        loading: false,
        error: null
    },
    reducers: {
        logout: (state)=> {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            state.user = null,
            state.token = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state)=> {state.loading = true})
            .addCase(loginUser.fulfilled, (state, action)=> {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            }) 
            .addCase(getMe.pending, (state) => {
                state.loading = true
            }) 
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false,
                state.user = action.payload
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false,
                state.user = null,
                state.token= null,
                state.error = action.payload
            })
    }

})

export const {logout} = authSlice.actions
export default authSlice.reducer