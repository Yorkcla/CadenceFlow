import { generateImageBase64 } from '../genai/imageService.js'

export async function handleImageGeneration(req, res) {
  const { prompt } = req.body
  try {
    const imageBase64Url = await generateImageBase64(prompt)
    res.json({ image: imageBase64Url })          // ← 키 이름을 'image'로
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Image generation failed' })
  }
}


