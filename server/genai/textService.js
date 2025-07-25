import { GoogleGenAI } from '@google/genai'
import 'dotenv/config'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function generateText(prompt) {
  const result = await genAI.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  })

  const text = result.candidates[0].content.parts[0].text
  return text
}






