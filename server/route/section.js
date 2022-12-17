import express from 'express'
import { createSection, deleteSection, updateSection } from '../controller/section.js'
import { verifyToken } from '../middleware/tokenHandler.js'
import { validate } from '../middleware/validation.js'

const router = express.Router()

router.post('/', validate, verifyToken, createSection)
router.put('/:sectionId', validate, verifyToken, updateSection)
router.delete('/:sectionId', validate, verifyToken, deleteSection)

export default router