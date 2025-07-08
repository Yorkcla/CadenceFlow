import React from 'react'
import useStore from '../store/useStore'
import PhaseCard from '../components/PhaseCard'
import SquareButton from '../components/SquareButton'

export default function Storyboard() {
  const { phases, addPhase, setPhases } = useStore()

  const handleAddPhase = () => {
    const newPhase = {
      id: Date.now(),
      title: '',
      description: '',
      image: '',
    }
    addPhase(newPhase)
  }

  const handleRemoveLastPhase = () => {
    setPhases(phases.slice(0, -1))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Storyboarding</h2>

      {/* 카드와 버튼을 함께 배치 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}

        {/* 버튼 2개를 하나의 flex 컨테이너로 묶어서 한 칸에 배치 */}
        <div className="flex flex-col gap-2">
          <SquareButton onClick={handleAddPhase}>+ Add Phase</SquareButton>
          <SquareButton onClick={handleRemoveLastPhase}>❌ Remove</SquareButton>
        </div>
      </div>
    </div>
  )
}




