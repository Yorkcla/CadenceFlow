// controllers/videoController.js
import { generateVideo } from '../genai/videoService.js';

export async function handleVideoGeneration(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const paths = await generateVideo(prompt);
    res.json({ message: 'Video generated', files: paths });
  } catch (err) {
    console.error('Video generation error:', err);
    res.status(500).json({ error: 'Failed to generate video' });
  }
}

