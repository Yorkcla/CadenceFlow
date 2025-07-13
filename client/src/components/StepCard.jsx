import React, { useRef, useState } from 'react'
import P5Canvas from './P5Canvas'
import toast from 'react-hot-toast'
import { generateText } from '../utils/generateText'
import { generateImage } from '../utils/generateImage'
import { makeStepTextPrompt } from '../utils/promptTemplates'
import { uploadStepImageToStorage } from '../utils/uploadImageToStorage'
import useStore from '../store/useStore'

export default function StepCard({ step, phaseId, onChange }) {
  const { userId, projectId } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [imageUrl, setImageUrl] = useState(step.imageUrl || '')
  const canvasRef = useRef(null)

  const handleChange = (field, value) => {
    onChange({ ...step, [field]: value })
  }

  const handleAiEdit = async () => {
    const input = step.description?.trim()
    if (!input) {
      toast.error('먼저 내용을 입력하세요!')
      return
    }

    setIsEditing(true)
    try {
      const prompt = makeStepTextPrompt(input)
      const result = await generateText(prompt)
      handleChange('description', result)
    } catch (err) {
      toast.error(err.message || 'AI 편집 실패')
    }
    setIsEditing(false)
  }

  const handleAiImage = async () => {
    if (!step.description?.trim()) {
      toast.error('먼저 설명을 입력하세요!')
      return
    }

    setIsGenerating(true)
    try {
      const base64 = await generateImage(step.description)

      if (!base64.startsWith('data:image')) {
        throw new Error('올바른 이미지 형식이 아닙니다.')
      }

      const blob = await fetch(base64).then(res => res.blob())
      const url = await uploadStepImageToStorage(blob, userId, projectId, phaseId, step.id)

      setImageUrl(url)
      handleChange('imageUrl', url)
    } catch (err) {
      toast.error(err.message || '이미지 생성 실패')
    }
    setIsGenerating(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      handleChange('imageUrl', url)
    }
  }

  const handleCanvasSave = async () => {
    if (canvasRef.current?.getCanvasBlob) {
      const blob = await canvasRef.current.getCanvasBlob()
      const url = URL.createObjectURL(blob)
      setImageUrl(url)
      handleChange('imageUrl', url)
      setShowCanvas(false)
      toast.success('Canvas Saved')
    }
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
        {imageUrl && (
          <img src={imageUrl} alt="Step" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {showCanvas && (
          <div className="absolute inset-0 z-10">
            <P5Canvas ref={canvasRef} />
          </div>
        )}
        {!imageUrl && !showCanvas && (
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











