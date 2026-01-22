import express from 'express'
import { getTasks, createTask, deleteTask, updateTaskStatus } from '../controllers/TaskController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(protect)
router.route('/')
    .get(getTasks)
    .post(createTask)

router.route('/:id')
    .delete(deleteTask)
    .patch(updateTaskStatus)

export default router