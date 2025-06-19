import express from 'express';
import { handleGenAIRequest } from '../controllers/genai.js';

const router = express.Router();

router.post('/', handleGenAIRequest);

export default router;