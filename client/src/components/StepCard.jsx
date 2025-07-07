import React, { useState } from 'react'
import MiniSquareButton from './MiniSquareButton'

export default function StepCard({ step, onChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

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
    onChange({ ...step, imageUrl, videoUrl: '' }) // 이미지 생성 시 비디오 제거
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

      {/* 이미지 또는 비디오 미리보기 */}
      {step.videoUrl ? (
        <video src={step.videoUrl} controls className="w-full h-auto rounded-md border" />
      ) : step.imageUrl ? (
        <img src={step.imageUrl} alt="Step" className="w-full h-auto rounded-md border" />
      ) : null}

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
      </div>
    </div>
  )
}






