import Task from "../models/Task.js";
import { sendResponse } from "../utils/ApiResponse.js";

export const getTasks = async(req, res) => {
    try{
        const tasks = await Task.find({tenantId: req.user.tenantId}).populate('contactId', 'firstName lastName')
        return sendResponse(res, 200, tasks)
    }catch(error){
        return sendResponse(res, 500, null, error.message)
    }
}

export const createTask = async(req, res) => {
    try{
        const newTask = await Task.create({
            ...req.body,
            tenantId: req.user.tenantId
        })

        const populatedTask = await Task.findById(newTask._id).populate('contactId', 'firstName lastName')
        return sendResponse(res, 201, populatedTask)
    } catch(error){
        return sendResponse(res, 500, null, error.message)
    }
}

export const deleteTask = async(req, res) => {
    try{
        const task = await Task.findByIdAndDelete({
            _id: req.params.id,
            tenantId: req.user.tenantId
        })

        if(!task) {
            return sendResponse(res, 404, null, "Task not found ")
        }
        return sendResponse(res, 200, {id: req.params.id}, 'Task deleted Successfully')

    } catch(error){
        return sendResponse(res, 500, null, error.message )
    }
}

export const updateTaskStatus = async(req, res) => {
    try{
        const {status} = req.body
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.user.tenantId },
            { status },
            { new: true }
        ).populate('contactId', 'firstName lastName ')

        if(!task) {
            return sendResponse(res, 404, null, 'Task not found')
        }
        return sendResponse(res, 200, task, 'Task updated successfully')
    } catch(error) {
        return sendResponse(res, 500, null, error.message)
    }
}