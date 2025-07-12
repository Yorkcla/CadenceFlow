import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import textRoutes from './routes/textRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import videoRoutes from './routes/videoroutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route mounting
app.use('/api/text', textRoutes);      // 예: POST /api/text/generate
app.use('/api/image', imageRoutes);    // 예: POST /api/image/generate
app.use('/api/video', videoRoutes);    // 예: POST /api/video/generate

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

