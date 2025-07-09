// src/pages/Storyboard.jsx
import React, { useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import PhaseCard from '../components/PhaseCard'
import SquareButton from '../components/SquareButton'
import ProjectNameModal from '../components/ProjectNameModal'
import { savePhasesToFirestore } from '../utils/savePhases'
import { uploadPhaseImageToStorage } from '../utils/uploadImageToStorage'
import { cleanRemovedPhases } from '../utils/cleanupPhases'
import toast from 'react-hot-toast'

export default function Storyboard() {
  const {
    phases,
    addPhase,
    setPhases,
    projectId,
    setProjectId,
    userId,
    projectTitle,
    setProjectTitle,
    showProjectModal,
    setShowProjectModal,
  } = useStore()

  const initializedRef = useRef(false)
  const canvasRefs = useRef({})  // ✅ 캔버스 ref 저장용

  // 처음 진입 시 모달 자동 열기
  useEffect(() => {
    if (!projectId) {
      setShowProjectModal(true)
    }
  }, [projectId, setShowProjectModal])

  const handleProjectNameSubmit = (name) => {
    const uniqueProjectId = `${userId || 'guest'}-${name}`
    setProjectId(uniqueProjectId)
    setProjectTitle(name)
    setShowProjectModal(false)
  }

  useEffect(() => {
    if (!initializedRef.current && phases.length === 0 && projectId) {
      const initialPhase = {
        id: Date.now(),
        title: '',
        description: '',
        imageUrl: '',
      }
      addPhase(initialPhase)
      initializedRef.current = true
    }
  }, [phases, addPhase, projectId])

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

  const handleSave = async () => {
    try {
      const updatedPhases = await Promise.all(phases.map(async (phase) => {
        let imageUrl = phase.imageUrl

        if (imageUrl?.startsWith('blob:')) {
          const blob = await fetch(imageUrl).then(res => res.blob())
          imageUrl = await uploadPhaseImageToStorage(blob, userId, projectId, phase.id)
        }

        if (!imageUrl && canvasRefs.current[phase.id]?.getCanvasBlob) {
          const blob = await canvasRefs.current[phase.id].getCanvasBlob()
          if (blob) {
            imageUrl = await uploadPhaseImageToStorage(blob, userId, projectId, phase.id)
          }
        }

        return { ...phase, imageUrl }
      }))

      await savePhasesToFirestore(userId, projectId, projectTitle, updatedPhases)
      await cleanRemovedPhases(userId, projectId, updatedPhases)
      setPhases(updatedPhases)
      toast.success('Phases Saved')
    } catch (error) {
      console.error('Error saving phases:', error)
      toast.error('Failed to Save')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {showProjectModal && <ProjectNameModal onSubmit={handleProjectNameSubmit} />}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            canvasRef={(ref) => { canvasRefs.current[phase.id] = ref }}
          />
        ))}
        <div className="flex flex-col gap-2">
          <SquareButton onClick={handleAddPhase}>➕</SquareButton>
          <SquareButton onClick={handleRemoveLastPhase}>❌</SquareButton>
          <SquareButton onClick={handleSave}>💾</SquareButton>
        </div>
      </div>
    </div>
  )
}












