import { generateImage } from '../genai/imageService.js'

export const handleImageGeneration = async (req, res) => {
  const { prompt } = req.body
  try {
    const filename = await generateImage(prompt)
    res.json({ image: filename })
  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({ error: 'Image generation failed' })
  }
}

