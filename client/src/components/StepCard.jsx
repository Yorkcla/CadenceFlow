import React, { useRef, useState } from 'react'
import P5Canvas from './P5Canvas'
import toast from 'react-hot-toast'
import { generateText } from '../utils/generateText'
import { makeStepTextPrompt } from '../utils/promptTemplates'

export default function StepCard({ step, onChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const localCanvasRef = useRef(null)

  const handleChange = (field, value) => {
    onChange({ ...step, [field]: value })
  }

  const handleAiEdit = async () => {
  const userInput = step.description?.trim();
  if (!userInput) {
    toast.error('먼저 내용을 입력하세요!');
    return;
  }

  setIsEditing(true);
  try {
    const prompt = makeStepTextPrompt(userInput); 
    const revised = await generateText(prompt);       
    handleChange('description', revised);             
  } catch (err) {
    toast.error(err.message || 'AI 호출 실패');
  }
  setIsEditing(false);
  };


  const handleAiImage = async () => {
    setIsGenerating(true)
    const url = await fakeGeminiImage(step.description)
    handleChange('imageUrl', url)
    setIsGenerating(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      handleChange('imageUrl', url)
    }
  }

  const handleCanvasSave = async () => {
    if (localCanvasRef.current?.getCanvasBlob) {
      const blob = await localCanvasRef.current.getCanvasBlob()
      const url = URL.createObjectURL(blob)
      handleChange('imageUrl', url)
      setShowCanvas(false)
      toast.success('Canvas Saved')
    }
  }

  const fakeGeminiEdit = async (text) => {
    return new Promise((res) => setTimeout(() => res(`[AI Result] ${text}`), 1000))
  }

  const fakeGeminiImage = async (text) => {
    return new Promise((res) => setTimeout(() => res(`https://via.placeholder.com/300x180?text=${encodeURIComponent(text)}`), 1500))
  }

  return (
    <div className="bg-white border rounded-xl p-4 shadow space-y-3 w-72">
      <input
        type="text"
        value={step.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Step description"
        className="text-sm w-full border-b border-gray-300 pb-1 focus:outline-none"
      />

      <div className="relative w-full h-40 border bg-gray-100 rounded overflow-hidden">
        {step.imageUrl ? (
          <img src={step.imageUrl} alt="Step" className="absolute inset-0 w-full h-full object-cover" />
        ) : showCanvas ? (
          <div className="absolute inset-0 z-10">
            <P5Canvas ref={localCanvasRef} />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        {(isEditing || isGenerating) && (
          <div className="text-xs text-gray-500 italic mr-auto">
            {isEditing ? '✏️ Editing...' : '🎨 Drawing...'}
          </div>
        )}

        <button onClick={handleAiEdit} disabled={isEditing || isGenerating} className="w-8 h-8 bg-blue-100 border rounded shadow text-xs">✏️</button>
        <button onClick={handleAiImage} disabled={isEditing || isGenerating} className="w-8 h-8 bg-blue-100 border rounded shadow text-xs">🖼️</button>

        <input id={`upload-${step.id}`} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <label htmlFor={`upload-${step.id}`} className="w-8 h-8 bg-blue-100 border rounded shadow text-xs cursor-pointer flex items-center justify-center">📁</label>

        <button onClick={() => setShowCanvas(!showCanvas)} className="w-8 h-8 bg-blue-100 border rounded shadow text-xs">🧑‍🎨</button>

        {showCanvas && (
          <button onClick={handleCanvasSave} className="w-8 h-8 bg-green-100 border rounded shadow text-xs">💾</button>
        )}
      </div>
    </div>
  )
}










