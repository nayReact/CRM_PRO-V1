import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate:{type: Date},
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['To Do','In Progress','Completed'],
        default: 'To Do'
    },
    //To Link task specific contact
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    tenantId: {
        type: String,
        required: true
    }
}, {timestamps: true})

export default mongoose.model('Task',taskSchema)