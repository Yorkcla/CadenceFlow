import React, { useRef, useState, useEffect } from 'react'
import MiniSquareButton from './MiniSquareButton'

export default function ReviewCard({ asset, onOpenVideo }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleToggleAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="w-[340px] max-w-sm bg-white border rounded-xl shadow p-4 space-y-3">
      <div className="text-sm font-semibold text-gray-800">
        {asset.type === 'phase' ? 'Phase' : 'Step'}: {asset.title}
      </div>

      <div className="text-sm text-gray-600">{asset.description}</div>

      <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-100">
        {asset.imageUrl ? (
          <img src={asset.imageUrl} alt="Visual" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="text-right flex items-center justify-end gap-2">
        <MiniSquareButton onClick={handleToggleAudio}>
          {isPlaying ? '⏸️' : '🎵'}
        </MiniSquareButton>

        <MiniSquareButton onClick={onOpenVideo}>
          🎬
        </MiniSquareButton>

        <audio ref={audioRef} src={asset.soundUrl} preload="auto" />
      </div>
    </div>
  )
}

