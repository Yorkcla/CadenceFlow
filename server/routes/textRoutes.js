import express from 'express'
import { handleTextGeneration } from '../controllers/textController.js'

const router = express.Router()

router.post('/', handleTextGeneration)

export default router


