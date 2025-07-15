import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import useStore from '../store/useStore'
import StepCard from '../components/StepCard'
import SquareButton from '../components/SquareButton'
import { uploadStepImageToStorage } from '../utils/uploadImageToStorage'
import { saveStepsToFirestore } from '../utils/saveSteps'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'  
import PageJoyride from '../components/PageJoyride'

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
  const canvasRefs = useRef({})  // ✅ step.id 기준으로 저장

  // ✅ 초기 세팅
  useEffect(() => {
    if (!stepsByPhase[phaseId]) {
      setSteps(phaseId, [{ id: Date.now(), description: '', imageUrl: '' }])
    }
  }, [phaseId, setSteps, stepsByPhase])

  const handleStepChange = (updatedStep, index) => {
    updateStep(phaseId, index, updatedStep)
  }

  const handleAddStep = () => {
    addStep(phaseId, { id: Date.now(), description: '', imageUrl: '' })
  }

  const handleRemoveStep = () => {
    removeStep(phaseId)
  }

  const handleSaveSteps = async () => {
    try {
      const updatedSteps = await Promise.all(
        steps.map(async (step) => {
          let imageUrl = step.imageUrl

          // blob: URL이면 Firebase Storage에 업로드
          if (imageUrl?.startsWith('blob:')) {
            const blob = await fetch(imageUrl).then((res) => res.blob())
            imageUrl = await uploadStepImageToStorage(blob, userId, projectId, phaseId, step.id)
          }

          // 캔버스 이미지가 있을 경우
          if (!imageUrl && canvasRefs.current[step.id]?.getCanvasBlob) {
            const blob = await canvasRefs.current[step.id].getCanvasBlob()
            if (blob) {
              imageUrl = await uploadStepImageToStorage(blob, userId, projectId, phaseId, step.id)
            }
          }

          return { ...step, imageUrl }
        })
      )

      setSteps(phaseId, updatedSteps)
      await saveStepsToFirestore(userId, projectId, phaseId, updatedSteps)
      toast.success('Steps Saved')
    } catch (error) {
      console.error('Error saving steps:', error)
      toast.error('Failed to Save')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <PageJoyride />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <StepCard
            key={step.id || index}
            step={step}
            phaseId={phaseId}
            onChange={(updated) => handleStepChange(updated, index)}
            canvasRef={(ref) => { canvasRefs.current[step.id] = ref }}
          />
        ))}

        <div className="flex flex-col gap-2">
          <SquareButton onClick={handleAddStep}>➕</SquareButton>
          <SquareButton onClick={handleRemoveStep}>❌</SquareButton>
          <SquareButton onClick={handleSaveSteps}>💾</SquareButton>
          <Link to="/storyboard">
            <SquareButton>←</SquareButton>
          </Link>
        </div>
      </div>
    </div>
  )
}











