import { GoogleGenAI } from '@google/genai';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateVideo(prompt) {
  let operation = await genAI.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt,
    config: {
      aspectRatio: '16:9',
      durationSeconds: 6,
      personGeneration: 'dont_allow',
    },
  });

  while (!operation.done) {
    await new Promise((res) => setTimeout(res, 10000));
    operation = await genAI.operations.getVideosOperation({ operation });
  }

  const videos = operation.response?.generatedVideos || [];
  const savedPaths = [];

  for (let i = 0; i < videos.length; i++) {
    const uri = videos[i].video?.uri;
    if (!uri) continue;

    const res = await fetch(`${uri}&key=${process.env.GEMINI_API_KEY}`);
    const writer = createWriteStream(`video${i}.mp4`);
    Readable.fromWeb(res.body).pipe(writer);
    savedPaths.push(`video${i}.mp4`);
  }

  return savedPaths;
}

