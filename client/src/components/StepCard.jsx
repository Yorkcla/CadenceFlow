import React, { useId, useState } from 'react'
import P5Canvas from './P5Canvas'

export default function StepCard({ step, onChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const uploadId = useId()

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
      <input
        type="text"
        value={step.description}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Step description"
        className="text-sm w-full border-b border-gray-300 pb-1 focus:outline-none"
      />

      {/* 이미지 공간 */}
      <div className="relative w-full h-40 bg-gray-100 rounded-md border overflow-hidden">
        {step.imageUrl ? (
          <img src={step.imageUrl} alt="Generated" className="absolute inset-0 w-full h-full object-cover" />
        ) : showCanvas ? (
          <div className="absolute inset-0">
            <P5Canvas />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex items-center justify-end gap-2">
        {(isEditing || isGenerating) && (
          <div className="text-xs text-gray-500 italic mr-auto">
            {isEditing ? '✏️ Editing...' : '🎨 Drawing...'}
          </div>
        )}

        <button
          onClick={handleAiEdit}
          disabled={isEditing || isGenerating}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow hover:shadow-md transition-all duration-200 text-blue-900 text-xs font-medium flex items-center justify-center disabled:opacity-50"
        >
          ✏️
        </button>

        <button
          onClick={handleImageGenerate}
          disabled={isEditing || isGenerating}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow hover:shadow-md transition-all duration-200 text-blue-900 text-xs font-medium flex items-center justify-center disabled:opacity-50"
        >
          🖼️
        </button>

        <input
          id={uploadId}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor={uploadId}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow hover:shadow-md transition-all duration-200 text-blue-900 text-xs font-medium flex items-center justify-center cursor-pointer"
        >
          📁
        </label>

        <button
          onClick={() => setShowCanvas(!showCanvas)}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow hover:shadow-md transition-all duration-200 text-blue-900 text-xs font-medium flex items-center justify-center"
        >
          🧑‍🎨
        </button>
      </div>
    </div>
  )
}







