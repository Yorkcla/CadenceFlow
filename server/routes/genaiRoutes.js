import express from 'express'
import { handleGenAIRequest } from '../controllers/genaiController.js'

const router = express.Router()

router.post('/', handleGenAIRequest)

export default router
