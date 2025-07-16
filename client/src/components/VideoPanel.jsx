import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { generateVideo } from '../utils/generateVideo'
import { makeVideoPrompt } from '../utils/promptTemplates'
import MiniSquareButton from './MiniSquareButton'

export default function VideoPanel({ asset }) {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const [videoUrl, setVideoUrl] = useState(asset.videoUrl || '')
  const [loading, setLoading] = useState(false)
  const [delaySec, setDelaySec] = useState(0)

  const handleGenerateVideo = async () => {
    if (!asset?.description) {
      toast.error('📄 설명이 필요합니다');
      return;
    }

    setLoading(true)
    const toastId = toast.loading('🎬 비디오 생성 중...')

    try {
      const prompt = makeVideoPrompt({
        title: asset.title,
        description: asset.description,
        imageUrl: asset.imageUrl,
      })

      const url = await generateVideo({ prompt, aspectRatio: '16:9' })
      setVideoUrl(url)
      toast.success('✅ 비디오 생성 완료')
    } catch (err) {
      console.error(err)
      toast.error('❌ 비디오 생성 실패')
    } finally {
      toast.dismiss(toastId)
      setLoading(false)
    }
  }

  const handlePlay = () => {
    if (!videoRef.current || !audioRef.current) return

    videoRef.current.currentTime = 0
    videoRef.current.play()

    // 지정한 초만큼 delay 후 사운드 재생
    setTimeout(() => {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }, delaySec * 1000)
  }

  return (
    <div className="flex-shrink-0 w-[340px] bg-white border-2 border-blue-100 rounded-2xl shadow-lg p-5 space-y-4">
      <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-100">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls={false}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic">
            No video generated yet.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <label className="flex items-center gap-1">
          ⏱️
          <input
            type="number"
            min="0"
            max="6"
            step="0.1"
            value={delaySec}
            onChange={(e) => setDelaySec(parseFloat(e.target.value))}
            className="w-16 px-1 border rounded text-center"
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2">
        <MiniSquareButton onClick={handlePlay} disabled={!videoUrl || !asset.soundUrl}>
          ▶️ 
        </MiniSquareButton>
        <MiniSquareButton onClick={handleGenerateVideo} disabled={loading}>
          {loading ? '…' : '✨'}
        </MiniSquareButton>
      </div>

      {/* 사운드 연결 */}
      <audio ref={audioRef} src={asset.soundUrl} preload="auto" />
    </div>
  )
}

