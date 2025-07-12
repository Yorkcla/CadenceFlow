// server/genai/imageService.js
import { GoogleGenAI, Modality } from '@google/genai';
import fs from 'fs';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateImage(prompt) {
  const model = genAI.models;

  const result = await model.generateContent({
    model: 'gemini-2.0-flash-preview-image-generation',
    contents: [{ text: prompt }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const parts = result.candidates?.[0]?.content?.parts;

  if (!parts) throw new Error('No candidates returned from API');

  const imagePart = parts.find(part => part.inlineData?.mimeType?.startsWith('image'));

  if (!imagePart) throw new Error('No image found in response');

  console.log('✅ Image successfully generated.')
  return 'success'
}






