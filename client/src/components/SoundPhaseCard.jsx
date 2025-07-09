import React from 'react'
import MiniSquareButton from './MiniSquareButton'

export default function SoundPhaseCard({ phase, selected, onSelect }) {
  return (
    <div className={`border rounded-xl p-4 shadow space-y-3 w-64 flex-shrink-0 ${selected ? 'bg-yellow-100' : 'bg-white'}`}>
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

      <div className="text-right">
        <MiniSquareButton onClick={onSelect}>✔️</MiniSquareButton>
      </div>
    </div>
  )
}


