import React, { useRef, useState } from 'react'
import useStore from '../store/useStore'
import { Link } from 'react-router-dom'
import P5Canvas from './P5Canvas'
import toast from 'react-hot-toast'

export default function PhaseCard({ phase }) {
  const { phases, setPhases } = useStore()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(phase.imageUrl || '')
  const [showCanvas, setShowCanvas] = useState(false)
  const canvasRef = useRef(null)

  const handleChange = (field, value) => {
    const updated = phases.map((p) =>
      p.id === phase.id ? { ...p, [field]: value } : p
    )
    setPhases(updated)
  }

  const handleAiEdit = async () => {
    setLoading(true)
    const revised = await fakeGeminiEdit(phase.description)
    handleChange('description', revised)
    setLoading(false)
  }

  const handleAiImage = async () => {
    setImageLoading(true)
    const url = await fakeGeminiImage(phase.description)
    setImageUrl(url)
    handleChange('imageUrl', url)
    setImageLoading(false)
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
      toast.success('Canvas saved!') // ✅ 알림 추가
    }
  }

  const fakeGeminiEdit = async (text) => {
    return new Promise((res) =>
      setTimeout(() => res(`[AI Result] ${text}`), 1000)
    )
  }

  const fakeGeminiImage = async (text) => {
    return new Promise((res) =>
      setTimeout(() => res(`https://via.placeholder.com/300x180?text=${encodeURIComponent(text)}`), 1500)
    )
  }

  return (
    <div className="bg-white border rounded-xl p-4 shadow space-y-3 w-full max-w-sm">
      <input
        type="text"
        value={phase.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Phase title"
        className="text-lg font-semibold w-full border-b border-gray-300 pb-1 focus:outline-none"
      />
      <textarea
        value={phase.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Add description..."
        className="w-full text-sm text-gray-700 border border-gray-200 rounded p-2 focus:outline-none resize-none"
        rows={3}
      />

      {/* 이미지 or 캔버스 표시 */}
      <div className="relative w-full h-40 border rounded-lg overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {showCanvas && (
          <div className="absolute inset-0 z-10">
            <P5Canvas ref={canvasRef} />
          </div>
        )}
        {!imageUrl && !showCanvas && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm bg-gray-100">
            No image
          </div>
        )}
      </div>

      {/* 버튼들 */}
      <div className="text-right flex items-center justify-end gap-2">
        {(loading || imageLoading) && (
          <div className="text-xs text-gray-500 italic mr-auto">
            {loading ? '✏️ Editing...' : '🎨 Drawing...'}
          </div>
        )}

        <button
          onClick={handleAiEdit}
          disabled={loading || imageLoading}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow text-xs"
        >
          ✏️
        </button>

        <button
          onClick={handleAiImage}
          disabled={loading || imageLoading}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow text-xs"
        >
          🖼️
        </button>

        <input
          id={`upload-${phase.id}`}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <label
          htmlFor={`upload-${phase.id}`}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow text-xs cursor-pointer flex items-center justify-center"
        >
          📁
        </label>

        <button
          onClick={() => setShowCanvas(!showCanvas)}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow text-xs"
        >
          🧑‍🎨
        </button>

        {showCanvas && (
          <button
            onClick={handleCanvasSave}
            className="w-8 h-8 bg-green-100 border border-green-200 rounded-md shadow text-xs"
          >
            💾
          </button>
        )}

        <Link to={`/phase/${phase.id}/steps`}>
          <button className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow text-xs">
            📋
          </button>
        </Link>
      </div>
    </div>
  )
}







