import { GoogleGenAI, Modality } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateVideo({ prompt, aspectRatio = '16:9' }) {

  if (typeof prompt !== 'string') {
    throw new Error('prompt must be a plain string');
  }

  /** 1️⃣ 비디오 생성 요청 */
  let op = await genAI.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt,
    config: {
      aspectRatio,
      durationSeconds: 6,
      personGeneration: 'dont_allow',
      responseModalities: [Modality.VIDEO],
    },
  });

  /** 2️⃣ 폴링 */
  while (!op.done) {
    await new Promise(r => setTimeout(r, 10_000));
    op = await genAI.operations.getVideosOperation({ operation: op });
  }

  /** 3️⃣ 결과 URL */
  const uri = op.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) throw new Error('No video URI returned');
  return `${uri}&key=${process.env.GEMINI_API_KEY}`;
}



