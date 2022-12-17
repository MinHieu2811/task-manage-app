import express from 'express'
import { validate } from '../middleware/validation.js'
import { verifyToken } from '../middleware/tokenHandler.js'
import { createTask, deleteTask, updatePositionTask, updateTask } from '../controller/task.js'

const router = express.Router()

router.post('/', validate, verifyToken, createTask)
router.put('/update-position', validate, verifyToken, updatePositionTask)
router.delete('/:taskId', validate, verifyToken, deleteTask)
router.put('/:taskId', validate, verifyToken, updateTask)

export default router