// src/pages/SoundBoard.jsx
import React from 'react'
import useStore from '../store/useStore'
import SoundCard from '../components/SoundCard'

export default function SoundBoard() {
  const { phases } = useStore()

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Assigning Sounds</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phases.map((phase) => (
          phase.videoUrl && (
            <SoundCard key={phase.id} phase={phase} />
          )
        ))}
      </div>
    </div>
  )
}

