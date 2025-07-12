// controllers/videoController.js
import { generateVideo } from '../genai/videoService.js';

export const handleVideoGeneration = async (req, res) => {
  const { prompt, aspectRatio = '16:9' } = req.body;
  try {
    const videoUrl = await generateVideo({ prompt, aspectRatio });
    res.json({ success: true, videoUrl });
  } catch (e) {
    console.error('Video generation error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
};


