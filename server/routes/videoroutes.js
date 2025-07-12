import express from 'express';
import { handleVideoGeneration } from '../controllers/videoController.js';

const router = express.Router();

router.post('/', handleVideoGeneration);   // POST /api/video

export default router;
