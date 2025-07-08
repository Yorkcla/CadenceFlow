import React, { useEffect, useRef, useState } from 'react'
import useStore from '../store/useStore'
import PhaseCard from '../components/PhaseCard'
import SquareButton from '../components/SquareButton'
import ProjectNameModal from '../components/ProjectNameModal'
import { savePhasesToFirestore } from '../utils/savePhases'
import { uploadImageToStorage } from '../utils/uploadImageToStorage'

export default function Storyboard() {
  const {
    phases,
    addPhase,
    setPhases,
    projectId,
    setProjectId,
    userId,
    projectTitle,
    setProjectTitle, // ✅ projectTitle setter 포함
  } = useStore()

  const [showModal, setShowModal] = useState(false)
  const initializedRef = useRef(false)

  // 최초 진입 시 모달 띄우기
  useEffect(() => {
    if (!projectId) {
      setShowModal(true)
    }
  }, [projectId])

  const handleProjectNameSubmit = (name) => {
    const uniqueProjectId = `${userId || 'guest'}-${name}`
    setProjectId(uniqueProjectId)
    setProjectTitle(name) // ✅ 프로젝트 타이틀 저장
    setShowModal(false)
  }

  // 초기 phase 추가
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
      // Step 1: 모든 phase의 imageUrl이 blob이면 업로드
      const updatedPhases = await Promise.all(phases.map(async (phase) => {
        if (phase.imageUrl.startsWith('blob:')) {
          const blob = await fetch(phase.imageUrl).then(res => res.blob())
          const url = await uploadImageToStorage(blob, userId, projectId, phase.id)
          return { ...phase, imageUrl: url }
        }
        return phase
      }))
  
      // Step 2: Firestore에 저장
      await savePhasesToFirestore(userId, projectId, projectTitle, updatedPhases)
      alert('Phases saved successfully!')
    } catch (error) {
      console.error('Error saving phases:', error)
      alert('Failed to save phases.')
    }
  }  

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {showModal && <ProjectNameModal onSubmit={handleProjectNameSubmit} />}

      <h2 className="text-2xl font-bold">
        Storyboarding <span className="text-sm text-green-500">{projectTitle}</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
        <div className="flex flex-col gap-2">
          <SquareButton onClick={handleAddPhase}>+</SquareButton>
          <SquareButton onClick={handleRemoveLastPhase}>❌</SquareButton>
          <SquareButton onClick={handleSave}>💾</SquareButton>
        </div>
      </div>
    </div>
  )
}










