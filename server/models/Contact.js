import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type: String
    },
    status:{ 
        type: String,
        enum: ['Lead','Client'],
        default: 'Lead'
    },
    tenantId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [noteSchema]
}, {timestamps: true })

export default mongoose.model('Contact', contactSchema)