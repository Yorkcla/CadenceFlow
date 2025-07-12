// genai/videoService.js
import { GoogleGenAI } from '@google/genai';
import fetch from 'node-fetch';               // node 20↓이면 추가 설치 필요

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * @param {object} opts {prompt, aspectRatio}
 * @returns {string} signed mp4 URL
 */
export async function generateVideo(opts) {
  // 1) 비디오 생성 요청
  let operation = await genAI.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: opts.prompt,
    config: {
      aspectRatio: opts.aspectRatio,
      personGeneration: 'dont_allow', // 필요 시 변경
      durationSeconds: 6,
    },
  });

  // 2) 폴링 (10초 간격)
  while (!operation.done) {
    await new Promise(r => setTimeout(r, 10_000));
    operation = await genAI.operations.getVideosOperation({ operation });
  }

  // 3) 결과 URL 추출
  const videoObj = operation.response?.generatedVideos?.[0];
  if (!videoObj?.video?.uri) throw new Error('No video URI returned');
  // 서명 URL에 API 키 붙이기
  return `${videoObj.video.uri}&key=${process.env.GEMINI_API_KEY}`;
}


