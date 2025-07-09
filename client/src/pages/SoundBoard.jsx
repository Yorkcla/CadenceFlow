import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import SoundPhaseCard from '../components/SoundPhaseCard'
import SoundStepCard from '../components/SoundStepCard'

export default function Soundboard() {
  const { userId, projectId } = useStore()
  const [phases, setPhases] = useState([])
  const [stepsByPhase, setStepsByPhase] = useState({})
  const [selected, setSelected] = useState({})

  useEffect(() => {
    const fetchPhases = async () => {
      if (!userId || !projectId) return
      const projectRef = doc(db, 'users', userId, 'projects', projectId)
      const projectSnap = await getDoc(projectRef)
      if (projectSnap.exists()) {
        setPhases(projectSnap.data().phases || [])
      }
    }

    fetchPhases()
  }, [userId, projectId])

  useEffect(() => {
    const fetchSteps = async () => {
      if (!userId || !projectId || phases.length === 0) return

      const stepsMap = {}
      for (const phase of phases) {
        const stepRef = doc(db, 'users', userId, 'projects', projectId, 'phases', String(phase.id))
        const stepSnap = await getDoc(stepRef)
        if (stepSnap.exists()) {
          stepsMap[phase.id] = stepSnap.data().steps || []
        } else {
          stepsMap[phase.id] = []
        }
      }
      setStepsByPhase(stepsMap)
    }

    fetchSteps()
  }, [userId, projectId, phases])

  const toggleSelect = (type, id) => {
    setSelected(prev => ({
      ...prev,
      [type + '-' + id]: !prev[type + '-' + id],
    }))
  }

  return (
    <div className="w-screen h-[calc(100vh-80px)] overflow-x-auto overflow-y-hidden">
      <div className="flex gap-10 items-start min-w-fit p-10">
        {phases.map(phase => (
          <React.Fragment key={phase.id}>
            {/* Phase 카드 */}
            <div className={`${selected['phase-' + phase.id] ? 'bg-yellow-100' : ''}`}>
              <SoundPhaseCard
                phase={phase}
                selected={selected['phase-' + phase.id]}
                onSelect={() => toggleSelect('phase', phase.id)}
              />
            </div>

            {/* Step 카드들 */}
            {(stepsByPhase[phase.id] || []).map(step => (
              <div
                key={step.id}
                className={`${selected['step-' + step.id] ? 'bg-blue-100' : ''}`}
              >
                <SoundStepCard
                  step={step}
                  selected={selected['step-' + step.id]}
                  onSelect={() => toggleSelect('step', step.id)}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}








