import React, { useState } from 'react'
import useStore from '../store/useStore'
import MiniSquareButton from './MiniSquareButton'
import { Link } from 'react-router-dom'

export default function PhaseCard({ phase }) {
  const { phases, setPhases } = useStore()
  const [loading, setLoading] = useState(false)

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

  const fakeGeminiEdit = async (text) => {
    return new Promise((res) =>
      setTimeout(() => res(`[AI Result] ${text}`), 1000)
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

      <div className="text-right flex items-center justify-end gap-2">
        {loading && (
          <div className="text-xs text-gray-500 animate-pulse">
            ✨...
          </div>
        )}
        <MiniSquareButton onClick={handleAiEdit} disabled={loading}>
          ✏️
        </MiniSquareButton>
        <Link to={`/phase/${phase.id}/steps`}>
            <MiniSquareButton>📋</MiniSquareButton>
        </Link>
      </div>
    </div>
  )
}





