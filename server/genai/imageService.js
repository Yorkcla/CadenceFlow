// server/genai/imageService.js
import { GoogleGenAI, Modality } from '@google/genai'
import fs from 'fs'

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function generateImage(prompt) {
  const result = await genAI.models.generateContent({
    model: 'gemini-2.0-flash-preview-image-generation',
    contents: prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  })

  const parts = result.candidates?.[0]?.content?.parts
  if (!parts || parts.length === 0) {
    throw new Error('No candidates returned from API')
  }

  for (const part of parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, 'base64')
      const filename = `gemini-image-${Date.now()}.png`
      const outputPath = `./generated/${filename}`
      fs.writeFileSync(outputPath, buffer)
      return filename
    }
  }

  throw new Error('No image data found in response')
}





