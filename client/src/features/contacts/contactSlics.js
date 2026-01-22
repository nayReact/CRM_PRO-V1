import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";


export const fetchContacts = createAsyncThunk('contacts/fetchAll', async(_, {rejectWithValue}) => {
    try{
        const response = await axiosInstance.get('/contacts')
        console.log('API response:', response.data)
        return response.data.data
    } catch(error){
        return rejectWithValue(error.response?.data?.message || 'failed to fetch contacts')
    }
})

//new thunk
export const addContact = createAsyncThunk('/contacts/add', async(contactData, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post('/contacts', contactData)
        console.log('New Contact from server', response.data.data)
        return response.data.data
    }catch(error){
        return rejectWithValue(error.response?.data?.message || "Failed to add contact ")
    }
})

//new Thunk for delete
export const deleteContact = createAsyncThunk('contacts/delete', async(id, {rejectWithValue}) => {
    try {
        await axiosInstance.delete(`/contacts/${id}`)
        return id
    } catch(error){
        return rejectWithValue(error.response?.data?.message || 'Delete Failed')
    }
})

//new thunk for update
export const editContact = createAsyncThunk('contacts/edit', async({id, contactData}, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.put(`/contacts/${id}`, contactData)
        return response.data.data

    } catch(error) {
        return rejectWithValue(error.response?.data?.message || "Edit Failed")
    }
})

//new thunk for status pipeline
export const updateContactStatus = createAsyncThunk('contacts/updateStatus', async({id, status}, { rejectWithValue}) => {
    try {
        const response = await axiosInstance.patch(`/contacts/${id}/status`, {status})
        return response.data.data
    } catch(error) {
        return rejectWithValue(error.response?.data?.message || 'Status update failed')
    }
})

//new Thunk for addNote
export const addNote = createAsyncThunk('contacts/addNote', async({id, text }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/contacts/${id}/notes`, { text })
        return {contactId: id, note: response.data.data}
    } catch(error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add Note')
    }
})

//new thunk for delete note
export const removeNote = createAsyncThunk('contacts/removeNote', async({id, noteId}, {rejectWithValue}) => {
    try {
        await axiosInstance.delete(`/contacts/${id}/notes/${noteId}`)
        return {contactId: id, noteId}
    } catch(error){
        return rejectWithValue(error.response?.data?.message || 'Failed to delete note')
    }
})

const contactSlice = createSlice({
    name: 'contacts',
    initialState: { items: [], loading: false, error: null},
    extraReducers: (builder) => {
        builder 
            .addCase(fetchContacts.pending, (state)=> {
                 state.loading = true
                 })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false,
                state.items = action.payload || [];
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading= false,
                state.error = action.payload
            })
            .addCase(addContact.fulfilled, (state, action) => {
                state.loading= false
                if(action.payload) {
                    state.items.push(action.payload)
                }        
            })
            .addCase(addContact.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload
            })
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !==action.payload)
            })
            .addCase(editContact.fulfilled, (state, action) => {
                state.loading = false
                if(action.payload && action.payload._id) {
                    const index = state.items.findIndex(item => item._id === action.payload._id)
                    if(index !== -1) {
                        state.items[index] = action.payload
                    }
                }
                
            })

            .addCase(updateContactStatus.fulfilled, (state, action) => {
                state.loading = false
                if(action.payload && action.payload._id) {
                    const index = state.items.findIndex(item => item._id === action.payload._id)
                    if(index !== -1) {
                        if(!state.items[index].notes) {
                            state.items[index].notes.unshift(note)
                        }
                    }
                }
            })

            .addCase(removeNote.fulfilled, (state, action ) => {
                const {contactId, noteId } = action.payload
                const contact = state.items.find(item => item._id === contactId)
                if(contact) {
                    contact.notes = contact.notes.filter(note => note._id !== noteId )
                }
            })


    }
})

export default contactSlice.reducer