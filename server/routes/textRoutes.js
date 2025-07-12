import express from 'express'
import { handleTextGeneration } from '../controllers/textController.js'

const router = express.Router()

router.post('/text', handleTextGeneration)

export default router


