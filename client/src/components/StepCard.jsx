import React, { useId, useRef, useState } from 'react'
import P5Canvas from './P5Canvas'

export default function StepCard({ step, onChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const canvasRef = useRef(null) // ✅ 캔버스 참조
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
    onChange({ ...step, imageUrl })
    setIsGenerating(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)

    if (file.type.startsWith('image/')) {
      onChange({ ...step, imageUrl: url })
    }
  }

  const handleCanvasSave = async () => {
    if (canvasRef.current?.getCanvasBlob) {
      const blob = await canvasRef.current.getCanvasBlob()
      const url = URL.createObjectURL(blob)
      onChange({ ...step, imageUrl: url })
    }
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
            <P5Canvas ref={canvasRef} />
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

        <button onClick={handleAiEdit} disabled={isEditing || isGenerating} className="w-8 h-8 bg-blue-100 border rounded-md shadow text-xs">
          ✏️
        </button>

        <button onClick={handleImageGenerate} disabled={isEditing || isGenerating} className="w-8 h-8 bg-blue-100 border rounded-md shadow text-xs">
          🖼️
        </button>

        <input id={uploadId} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <label htmlFor={uploadId} className="w-8 h-8 bg-blue-100 border rounded-md shadow text-xs cursor-pointer flex items-center justify-center">
          📁
        </label>

        <button onClick={() => setShowCanvas(!showCanvas)} className="w-8 h-8 bg-blue-100 border rounded-md shadow text-xs">
          🧑‍🎨
        </button>

        {/* ✅ 그림 저장 버튼 */}
        {showCanvas && (
          <button onClick={handleCanvasSave} className="w-8 h-8 bg-green-100 border rounded-md shadow text-xs">
            💾
          </button>
        )}
      </div>
    </div>
  )
}








