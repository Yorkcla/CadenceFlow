import React, { useState } from 'react'
import MiniSquareButton from './MiniSquareButton'
import P5Canvas from './P5Canvas' // 캔버스 컴포넌트 import

export default function StepCard({ step, onChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)

  const handleChange = (value) => {
    onChange({ ...step, description: value })
  }

  const handleAiEdit = async () => {
    setIsEditing(true)
    const revised = await fakeGeminiEdit(step.description)
    handleChange(revised)
    setIsEditing(false)
  }

  const handleImageGenerate = async () => {
    setIsGenerating(true)
    const imageUrl = await fakeGenerateImage(step.description)
    onChange({ ...step, imageUrl, videoUrl: '' })
    setIsGenerating(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)

    if (file.type.startsWith('video/')) {
      onChange({ ...step, videoUrl: url, imageUrl: '' })
    } else if (file.type.startsWith('image/')) {
      onChange({ ...step, imageUrl: url, videoUrl: '' })
    }
  }

  const toggleCanvas = () => {
    setShowCanvas((prev) => !prev)
  }

  const fakeGeminiEdit = async (text) => {
    return new Promise((res) =>
      setTimeout(() => res(`[AI Revised] ${text}`), 1000)
    )
  }

  const fakeGenerateImage = async (text) => {
    return new Promise((res) =>
      setTimeout(() => res('https://via.placeholder.com/200'), 1000)
    )
  }

  return (
    <div className="bg-white border rounded-xl p-4 shadow space-y-3 w-72">
      {/* 텍스트 입력 */}
      <input
        type="text"
        value={step.description}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Step description"
        className="text-sm w-full border-b border-gray-300 pb-1 focus:outline-none"
      />

      {/* 미디어/캔버스 영역 */}
      <div className="relative w-full h-40 border rounded-lg overflow-hidden">
        {step.videoUrl && (
          <video
            src={step.videoUrl}
            controls
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {step.imageUrl && !step.videoUrl && (
          <img
            src={step.imageUrl}
            alt="Uploaded"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {showCanvas && (
          <div className="absolute inset-0 z-10">
            <P5Canvas />
          </div>
        )}
        {!step.imageUrl && !step.videoUrl && !showCanvas && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm bg-gray-100">
            No media
          </div>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="flex items-center justify-end gap-2">
        {(isEditing || isGenerating) && (
          <div className="text-xs text-gray-500 italic mr-auto">
            {isEditing ? '✏️ Editing...' : '🎨 Drawing...'}
          </div>
        )}
        <MiniSquareButton onClick={handleAiEdit} disabled={isEditing || isGenerating}>
          ✏️
        </MiniSquareButton>
        <MiniSquareButton onClick={handleImageGenerate} disabled={isEditing || isGenerating}>
          🖼️
        </MiniSquareButton>
        <label className="cursor-pointer">
          <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
          <MiniSquareButton>📁</MiniSquareButton>
        </label>
        <MiniSquareButton onClick={toggleCanvas}>
          🧑‍🎨
        </MiniSquareButton>
      </div>
    </div>
  )
}







