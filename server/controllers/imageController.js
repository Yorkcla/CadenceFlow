// server/controllers/imageController.js
import { generateImage } from "../genai/imageService.js";

export const handleImageGeneration = async (req, res) => {
  const { prompt } = req.body;
  try {
    const image = await generateImage(prompt);
    res.json({ success: true, image });
  } catch (error) {
    console.error("Image generation error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
