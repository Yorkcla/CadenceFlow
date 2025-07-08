import React, { useState } from 'react'
import useStore from '../store/useStore'
import MiniSquareButton from './MiniSquareButton'
import { Link } from 'react-router-dom'
import P5Canvas from './P5Canvas' // 그림판 추가

export default function PhaseCard({ phase }) {
  const { phases, setPhases } = useStore()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(phase.imageUrl || '')
  const [showCanvas, setShowCanvas] = useState(false)

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
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      handleChange('imageUrl', url)
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
        {/* 이미지 (있을 경우에만) */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* 캔버스 (켜져 있을 경우) */}
        {showCanvas && (
          <div className="absolute inset-0 z-10">
            <P5Canvas />
          </div>
        )}

        {/* 이미지도 없고 캔버스도 꺼져있을 경우 */}
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
        <MiniSquareButton onClick={handleAiEdit} disabled={loading || imageLoading}>✏️</MiniSquareButton>
        <MiniSquareButton onClick={handleAiImage} disabled={loading || imageLoading}>🖼️</MiniSquareButton>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <MiniSquareButton>📁</MiniSquareButton>
        </label>
        <MiniSquareButton onClick={() => setShowCanvas(!showCanvas)}>🧑‍🎨</MiniSquareButton>
        <Link to={`/phase/${phase.id}/steps`}>
          <MiniSquareButton>📋</MiniSquareButton>
        </Link>
      </div>
    </div>
  )
}







