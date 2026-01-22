import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../api/axiosInstance'

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async(_, {rejectWithValue}) =>{
    try {
        const response = await axiosInstance.get('/tasks')
        return response.data.data
    } catch(error){
        return rejectWithValue(error.response?.data?.message || 'Failed to load tasks')
    }
})

export const deleteTask = createAsyncThunk('tasks/delete', async(id, {rejectWithValue}) => {
    try{
        await axiosInstance.delete(`/tasks/${id}`)
        return id
    } catch(error){
        return rejectWithValue(error.response?.data?.message || 'Failed to delete Task')
    }
})

export const addTask =  createAsyncThunk('tasks/add', async(taskData, { rejectWithValue }) => {
    try {
        const response  = await axiosInstance.post('/tasks', taskData)
        return response.data.data || response.data

    } catch(error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create Task')
    }
})

export const toggleTaskStatus = createAsyncThunk('tasks/toggleStatus', async({ id, status}, { rejectWithValue}) => {
    try {
        const response = await axiosInstance.patch(`/tasks/${id}`, { status })
        return response.data.data
    } catch(error){
        return rejectWithValue(error.response?.data?.message || 'Failed status')
    }
})

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    //reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false
                state.items.unshift(action.payload)
            })         
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter((task) => task._id !== action.payload)
            })
            .addCase(toggleTaskStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id)
                if(index !== -1) {
                    state.items[index] = action.payload
                } 
                state.loading= false
            })
    }
})

export default taskSlice.reducer