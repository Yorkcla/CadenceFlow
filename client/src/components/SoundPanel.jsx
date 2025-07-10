import React from 'react'

export default function SoundPanel({ id, config = {}, onUpdate }) {
  return (
    <div className="border rounded-xl p-4 shadow w-64 bg-white mt-2 space-y-3">
      <p className="text-sm font-semibold text-gray-800">🎚️ Sound Config for {id}</p>

      <textarea
        className="w-full border rounded p-2 text-sm"
        placeholder="Optional prompt or notes..."
        value={config.description || ''}
        onChange={e => onUpdate(id, 'description', e.target.value)}
      />

      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
        🔊 Preview Sound
      </button>
    </div>
  )
}

