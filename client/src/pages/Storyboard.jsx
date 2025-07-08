import React, { useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import PhaseCard from '../components/PhaseCard'
import SquareButton from '../components/SquareButton'

export default function Storyboard() {
  const { phases, addPhase, setPhases } = useStore()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current && phases.length === 0) {
      const initialPhase = {
        id: Date.now(),
        title: '',
        description: '',
        imageUrl: '',
      }
      addPhase(initialPhase)
      initializedRef.current = true
    }
  }, [phases])

  const handleAddPhase = () => {
    const newPhase = {
      id: Date.now(),
      title: '',
      description: '',
      imageUrl: '',
    }
    addPhase(newPhase)
  }

  const handleRemoveLastPhase = () => {
    setPhases(phases.slice(0, -1))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Storyboarding</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
        <div className="flex flex-col gap-2">
          <SquareButton onClick={handleAddPhase}>+ Add Phase</SquareButton>
          <SquareButton onClick={handleRemoveLastPhase}>❌ Remove</SquareButton>
        </div>
      </div>
    </div>
  )
}







