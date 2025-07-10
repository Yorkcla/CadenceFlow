import React, { useRef, useState, useEffect } from 'react'

export default function SoundCard({ phase }) {
  const videoRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white border rounded-xl p-4 shadow w-full max-w-md space-y-3">
      <div className="font-semibold text-gray-800 text-sm mb-1">
        Phase: {phase.title}
      </div>

      <video
        ref={videoRef}
        controls
        className="w-full rounded"
        src={phase.videoUrl}
      />

      <div className="text-sm text-gray-600">
        ⏱️ Current Time: {currentTime.toFixed(1)}s
      </div>
    </div>
  )
}
