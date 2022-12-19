import express from 'express'
import { registerHandler, loginHandler, getUserInfo } from '../controller/user.js'
import {verifyToken} from '../middleware/tokenHandler.js'

const router = express.Router()

router.post('/register', registerHandler)
router.post('/login', loginHandler)
router.post('/verify-token', verifyToken)
router.get('/user', verifyToken, getUserInfo)

export default router