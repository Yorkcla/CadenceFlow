import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useStore from '../store/useStore'
import StepCard from '../components/StepCard'
import SquareButton from '../components/SquareButton'

export default function StepBoard() {
  const { phaseId } = useParams()

  const {
    stepsByPhase,
    setSteps,
    addStep,
    updateStep,
    removeStep
  } = useStore()

  const steps = stepsByPhase[phaseId] || []

  // phaseId에 해당하는 step이 아예 없으면 기본 step 하나 추가
  useEffect(() => {
    if (!stepsByPhase[phaseId]) {
      setSteps(phaseId, [{ description: '' }])
    }
  }, [phaseId, setSteps, stepsByPhase])

  const handleStepChange = (updatedStep, index) => {
    updateStep(phaseId, index, updatedStep)
  }

  const handleAddStep = () => {
    addStep(phaseId, { description: '' })
  }

  const handleRemoveStep = () => {
    removeStep(phaseId)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Steps for Phase {phaseId}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            onChange={(updated) => handleStepChange(updated, index)}
          />
        ))}

        <div className="flex flex-col gap-2">
          <SquareButton onClick={handleAddStep}>+ Add Step</SquareButton>
          <SquareButton onClick={handleRemoveStep}>❌ Remove</SquareButton>
        </div>
      </div>
    </div>
  )
}








