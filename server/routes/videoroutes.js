import express from 'express';
import { handleVideoGeneration } from '../controllers/videoController.js';

const router = express.Router();

router.post('/generate', handleVideoGeneration);

export default router;
