import { GoogleGenAI, Modality } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateImageBase64(prompt) {
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

  const { mimeType, data } = imagePart.inlineData;
  const dataUrl = data.startsWith('data:image')
    ? data
    : `data:${mimeType};base64,${data}`;

  console.log('✅ Image generated and returned as data URL');
  return dataUrl;
}

export { generateImageBase64 };









