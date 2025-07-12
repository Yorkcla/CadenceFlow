import { GoogleGenAI } from '@google/genai'
import 'dotenv/config'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function generateText(prompt) {
  const result = await genAI.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  })

  // SDK 0.3.x 기준: response 바로 candidates 배열
  const text = result.candidates[0].content.parts[0].text
  return text
}






