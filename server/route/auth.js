import express from 'express'
import { registerHandler, loginHandler } from '../controller/user.js'
import {verifyToken} from '../middleware/tokenHandler.js'

const router = express.Router()

router.post('/register', registerHandler)
router.post('/login', loginHandler)
router.post('/verify-token', verifyToken)

export default router