import React from 'react'
import MiniSquareButton from './MiniSquareButton'

export default function SoundStepCard({ step, selected, onSelect, soundParams = {}, onUpdateSoundConfig }) {
  return (
    <div className={`border rounded-xl p-4 shadow space-y-3 w-64 flex-shrink-0 ${selected ? 'bg-sky-100' : 'bg-white'}`}>
      <p className="text-sm font-medium border-b border-gray-300 pb-1">{step.description}</p>

      <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-gray-100">
        {step.imageUrl ? (
          <img src={step.imageUrl} alt="Step" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {selected && (
        <div className="flex flex-col gap-2 pt-2">
          <select
            value={soundParams.cognitivePhase || ''}
            onChange={e => onUpdateSoundConfig(step.id, 'cognitivePhase', e.target.value)}
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
            value={soundParams.interactionIntent || ''}
            onChange={e => onUpdateSoundConfig(step.id, 'interactionIntent', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Interaction Intent</option>
            <option value="warning">Warning</option>
            <option value="confirmation">Confirmation</option>
            <option value="welcome">Welcome</option>
            <option value="error">Error</option>
            <option value="notification">Notification</option>
          </select>

          <select
            value={soundParams.urgency || ''}
            onChange={e => onUpdateSoundConfig(step.id, 'urgency', e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Level of Urgency</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      )}

      <div className="text-right flex items-center justify-end gap-2">
        <MiniSquareButton onClick={onSelect}>✔️</MiniSquareButton>
      </div>
    </div>
  )
}




