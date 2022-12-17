import express from 'express'
import { createBoard, deleteBoard, getAllBoard, getFavouriteBoard, getOneBoard, updateBoard, updateFavouritePosition, updatePositionBoard } from '../controller/board.js'
import { verifyToken } from '../middleware/tokenHandler.js'
import { validate } from '../middleware/validation.js'

const router = express.Router()

router.post('/', verifyToken, createBoard)
router.get('/', verifyToken, getAllBoard)
router.put('/', verifyToken, updatePositionBoard)
router.get('/favorites', verifyToken, getFavouriteBoard)
router.put('/favorites', verifyToken, updateFavouritePosition)
router.get(':boardId',validate, verifyToken, getOneBoard)
router.put('/:boardId', validate, verifyToken, updateBoard)
router.delete('/:boardId', validate, verifyToken, deleteBoard)

export default router