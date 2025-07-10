import React from 'react'
import MiniSquareButton from './MiniSquareButton'

export default function SoundPhaseCard({ phase, selected, onSelect, soundConfig = {}, onUpdateSoundConfig }) {
  return (
    <div className={`border rounded-xl p-4 shadow space-y-3 w-64 flex-shrink-0 ${selected ? 'bg-sky-100' : 'bg-white'}`}>
      <h3 className="text-lg font-semibold border-b border-gray-300 pb-1">{phase.title}</h3>
      <p className="text-sm text-gray-700">{phase.description}</p>

      <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-gray-100">
        {phase.imageUrl ? (
          <img src={phase.imageUrl} alt="Phase" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {selected && (
        <div className="flex flex-col gap-2 pt-2">
          <select
            value={soundConfig.cognitivePhase || ''}
            onChange={e => onUpdateSoundConfig(phase.id, 'cognitivePhase', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Cognitive Phase</option>
            <option value="start">Start</option>
            <option value="rising">Rising</option>
            <option value="peak">Peak</option>
            <option value="falling">Falling</option>
            <option value="end">End</option>
          </select>

          <select
            value={soundConfig.interactionIntent || ''}
            onChange={e => onUpdateSoundConfig(phase.id, 'interactionIntent', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Interaction Intent</option>
            <option value="warning">Warning</option>
            <option value="confirmation">Confirmation</option>
            <option value="welcome">Welcome</option>
            <option value="error">Error</option>
            <option value="notification">Notification</option>
          </select>
        </div>
      )}

      <div className="text-right flex items-center justify-end gap-2">
        <MiniSquareButton onClick={onSelect}>✔️</MiniSquareButton>
      </div>
    </div>
  )
}




