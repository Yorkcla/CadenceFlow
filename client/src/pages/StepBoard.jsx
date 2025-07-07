import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import StepCard from '../components/StepCard'
import SquareButton from '../components/SquareButton'

export default function StepBoard() {
  const { phaseId } = useParams()
  const [steps, setSteps] = useState([])

  const handleStepChange = (updatedStep, index) => {
    const newSteps = [...steps]
    newSteps[index] = updatedStep
    setSteps(newSteps)
  }

  const addStep = () => {
    setSteps([...steps, { description: '' }])
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
        <SquareButton onClick={addStep}>+ Add Step</SquareButton>
      </div>
    </div>
  )
}






