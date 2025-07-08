import React, { useEffect, useRef, useState } from 'react'
import useStore from '../store/useStore'
import PhaseCard from '../components/PhaseCard'
import SquareButton from '../components/SquareButton'
import ProjectNameModal from '../components/ProjectNameModal'
import { v4 as uuidv4 } from 'uuid'

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
    const uniqueProjectId = `${userId || 'guest'}-${name}-${uuidv4()}`
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
          <SquareButton onClick={handleAddPhase}>+ Add Phase</SquareButton>
          <SquareButton onClick={handleRemoveLastPhase}>❌ Remove</SquareButton>
        </div>
      </div>
    </div>
  )
}










