import React, { useRef, useState } from 'react'
import P5Canvas from './P5Canvas'
import toast from 'react-hot-toast'
import { generateText } from '../utils/generateText'
import { generateImage } from '../utils/generateImage'
import { makeStepTextPrompt } from '../utils/promptTemplates'
import { makeStepImagePrompt } from '../utils/promptTemplates'
import MiniSquareButton from './MiniSquareButton'

export default function StepCard({ step, onChange }) {
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
      toast.error('Please fill in the details first!')
      return
    }

    setIsEditing(true)
    try {
      const prompt = makeStepTextPrompt(input)
      const result = await generateText(prompt)
      handleChange('description', result)
    } catch (err) {
      toast.error(err.message || 'Text generation failed!')
    }
    setIsEditing(false)
  }

  const handleAiImage = async () => {
    if (!step.description?.trim()) {
      toast.error('Please fill in the details first!')
      return
    }

    setIsGenerating(true)
    try {
      const prompt = makeStepImagePrompt(step.description)
      const base64 = await generateImage(prompt)

      if (!base64.startsWith('data:image')) {
        throw new Error('올바른 이미지 형식이 아닙니다.')
      }

      const blob = await fetch(base64).then(res => res.blob())
      const url = URL.createObjectURL(blob)

      setImageUrl(url)
      handleChange('imageUrl', url)
    } catch (err) {
      toast.error(err.message || 'Image generation failed!')
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
      toast.success('Canvas Saved!')
    }
  }

  return (
    <div className="w-72 max-w-sm bg-white border rounded-xl shadow p-4 space-y-3">
      <input
        type="text"
        value={step.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Step description"
        className="text-sm placeholder:text-xs w-full border-b border-gray-300 pb-1 focus:outline-none"
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

        <MiniSquareButton onClick={handleAiEdit} disabled={isEditing || isGenerating}>
          ✏️
        </MiniSquareButton>

        <MiniSquareButton onClick={handleAiImage} disabled={isEditing || isGenerating}>
          🖼️
        </MiniSquareButton>

        <input
          id={`upload-${step.id}`}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <label
          htmlFor={`upload-${step.id}`}
          className="w-8 h-8 text-xs font-medium text-gray-800 flex items-center justify-center hover:bg-gray-100 rounded transition-colors duration-150 disabled:opacity-50"
        >
          📁
        </label>

        <MiniSquareButton onClick={() => setShowCanvas(!showCanvas)}>
          🧑‍🎨
        </MiniSquareButton>

        {showCanvas && (
          <MiniSquareButton onClick={handleCanvasSave} className="bg-green-100">
            💾
          </MiniSquareButton>
        )}
      </div>
    </div>
  )
}












