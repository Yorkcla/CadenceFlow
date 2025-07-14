// src/components/VideoPanel.jsx
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { generateVideo } from '../utils/generateVideo'
import { makeVideoPrompt } from '../utils/promptTemplates'
import MiniSquareButton from './MiniSquareButton'

export default function VideoPanel({ asset }) {
  const [videoUrl, setVideoUrl] = useState(asset.videoUrl || '')
  const [loading, setLoading] = useState(false)

  const handleGenerateVideo = async () => {
    if (!asset?.title || !asset?.description || !asset?.imageUrl) {
      toast.error('📄 타이틀, 설명, 이미지가 모두 필요합니다');
      return;
    }
  
    setLoading(true);
    const toastId = toast.loading('🎬 비디오 생성 중...');
  
    try {
      const prompt = makeVideoPrompt({
        title: asset.title,
        description: asset.description,
      });

      console.log('Prompt type:', typeof prompt);
      console.log('Prompt content:', prompt);
  
      const url = await generateVideo({ prompt, aspectRatio: '16:9' });
      setVideoUrl(url);
  
      toast.dismiss(toastId);
      toast.success('✅ 비디오 생성 완료');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('❌ 비디오 생성 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }  

  return (
    <div className="flex-shrink-0 w-[340px] bg-white border-2 border-blue-100 rounded-2xl shadow-lg p-5 space-y-4">
      <div className="w-full h-48 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            style={{ aspectRatio: '16 / 9' }}
          />
        ) : (
          <div className="text-gray-400 text-sm italic">No video generated yet.</div>
        )}
      </div>
  
      <div className="text-right flex items-center justify-end gap-2">
        <MiniSquareButton onClick={handleGenerateVideo} disabled={loading}>
          {loading ? '…' : '🎥'}
        </MiniSquareButton>
      </div>
    </div>
  );
}
