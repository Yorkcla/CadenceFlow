import React from 'react'
import MiniSquareButton from './MiniSquareButton'

export default function SoundPanel({ id, config = {}, onUpdate }) {
  const updateField = (field, value) => onUpdate(id, field, value)

  return (
    <div className="border rounded-xl p-4 shadow w-64 bg-white mt-2 space-y-3 text-sm">
      <p className="font-semibold text-gray-800">Sound for {id}</p>

      {/* 🎵 Pitch (up to 4) */}
      <div>
        <p className="mb-1 font-medium">Pitch</p>
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map(i => (
            <input
              key={i}
              type="text"
              maxLength={3}
              value={config.pitch?.[i] || ''}
              onChange={e => {
                const newPitch = [...(config.pitch || [])]
                newPitch[i] = e.target.value
                updateField('pitch', newPitch)
              }}
              className="border p-1 rounded text-xs text-center"
              placeholder={`C${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 🕒 Duration */}
      <div>
        <p className="mb-1 font-medium">Duration (sec)</p>
        <input
          type="number"
          value={config.duration || ''}
          onChange={e => updateField('duration', e.target.value)}
          className="w-full border p-1 rounded"
          placeholder="e.g. 3.5"
        />
      </div>

      {/* 🔊 Volume */}
      <div>
        <p className="mb-1 font-medium">Volume</p>
        <input
          type="number"
          value={config.volume || ''}
          onChange={e => updateField('volume', e.target.value)}
          className="w-full border p-1 rounded"
          placeholder="e.g. 0.8"
        />
      </div>

      {/* 🎼 Tempo */}
      <div>
        <p className="mb-1 font-medium">Tempo (BPM)</p>
        <input
          type="number"
          value={config.tempo || ''}
          onChange={e => updateField('tempo', e.target.value)}
          className="w-full border p-1 rounded"
          placeholder="e.g. 120"
        />
      </div>

      {/* 🥁 Rhythm */}
      <div>
        <p className="mb-1 font-medium">Rhythm Pattern</p>
        <input
          type="text"
          value={config.rhythm || ''}
          onChange={e => updateField('rhythm', e.target.value)}
          className="w-full border p-1 rounded"
          placeholder="e.g. together, staggered, separate"
        />
      </div>

      {/* 🔊 Preview Button */}
      <div className="text-right flex items-center justify-end gap-2">
        <MiniSquareButton>
          🔊
        </MiniSquareButton>
      </div>
    </div>
  )
}


