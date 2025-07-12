import { generateText } from '../genai/textService.js'

export async function handleTextGeneration(req, res) {
  const { prompt } = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing prompt' })
  }

  try {
    const text = await generateText(prompt)
    res.json({ text })
  } catch (error) {
    console.error('Text generation error:', error)
    res.status(500).json({ error: 'Failed to generate text' })
  }
}



