import React from 'react'
import useStore from '../store/useStore'
import PhaseCard from '../components/PhaseCard'
import SquareButton from '../components/SquareButton'

export default function Storyboard() {
  const { phases, addPhase } = useStore()

  const handleAddPhase = () => {
    const newPhase = {
      id: Date.now(),
      title: '',
      description: '',
      image: '',
    }
    addPhase(newPhase)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Scenario Builder</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
        <SquareButton onClick={handleAddPhase}>+ Add Phase</SquareButton>
      </div>
    </div>
  )
}


