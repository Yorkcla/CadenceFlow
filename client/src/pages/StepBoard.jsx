import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useStore from '../store/useStore'
import StepCard from '../components/StepCard'
import SquareButton from '../components/SquareButton'
import { uploadStepImageToStorage } from '../utils/uploadImageToStorage'
import { saveStepsToFirestore } from '../utils/saveSteps' // 이건 Firestore 저장 유틸이 필요함

export default function StepBoard() {
  const { phaseId } = useParams()

  const {
    userId,
    projectId,
    stepsByPhase,
    setSteps,
    addStep,
    updateStep,
    removeStep
  } = useStore()

  const steps = stepsByPhase[phaseId] || []

  // Step 초기화
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

  // ✅ 저장 로직 추가
  const handleSaveSteps = async () => {
    try {
      const updatedSteps = await Promise.all(
        steps.map(async (step) => {
          if (step.imageUrl?.startsWith('blob:')) {
            const blob = await fetch(step.imageUrl).then((res) => res.blob())
            const url = await uploadStepImageToStorage(blob, userId, projectId, phaseId, step.id)
            return { ...step, imageUrl: url }
          }
          return step
        })
      )

      setSteps(phaseId, updatedSteps)
      await saveStepsToFirestore(userId, projectId, phaseId, updatedSteps)

      alert('Steps saved successfully!')
    } catch (error) {
      console.error('Error saving steps:', error)
      alert('Failed to save steps.')
    }
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
          <SquareButton onClick={handleAddStep}>+</SquareButton>
          <SquareButton onClick={handleRemoveStep}>❌</SquareButton>
          <SquareButton onClick={handleSaveSteps}>💾</SquareButton>
        </div>
      </div>
    </div>
  )
}









