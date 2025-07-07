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
    onChange({ ...step, imageUrl })
    setIsGenerating(false)
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

      {(isEditing || isGenerating) && (
        <div className="text-sm text-blue-600 italic">
          {isEditing ? '✨...' : '✨...'}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <MiniSquareButton onClick={handleAiEdit} disabled={isEditing || isGenerating}>
          ✏️
        </MiniSquareButton>
        <MiniSquareButton onClick={handleImageGenerate} disabled={isEditing || isGenerating}>
          🖼️
        </MiniSquareButton>
      </div>

      {step.imageUrl && (
        <img
          src={step.imageUrl}
          alt="Image"
          className="w-full h-auto rounded-md border"
        />
      )}
    </div>
  )
}



