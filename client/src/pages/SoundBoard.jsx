import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import SoundPhaseCard from '../components/SoundPhaseCard'
import SoundStepCard from '../components/SoundStepCard'
import SoundPanel from '../components/SoundPanel'
import SquareButton from '../components/SquareButton'
import { renderToneToWav } from '../utils/renderToneToWav'
import { uploadSoundBlob } from '../utils/uploadSoundBlob'
import { saveSoundConfig } from '../utils/saveSoundConfig'
import { saveFinalAsset, deleteAllFinalAssets } from '../utils/saveFinalAsset'
import toast from 'react-hot-toast'
import * as Tone from 'tone'

// SessionStorage 키
const SESSION_SELECTED_KEY = 'soundboard-selected'
const SESSION_CONFIG_KEY = 'soundboard-config'

export default function Soundboard() {
  const { userId, projectId } = useStore()
  const [phases, setPhases] = useState([])
  const [stepsByPhase, setStepsByPhase] = useState({})

  // ✅ 세션스토리지에서 초기값 복원
  const initialSelected = JSON.parse(sessionStorage.getItem(SESSION_SELECTED_KEY) || '{}')
  const initialConfig = JSON.parse(sessionStorage.getItem(SESSION_CONFIG_KEY) || '{}')
  const [selected, setSelected] = useState(initialSelected)
  const [soundConfig, setSoundConfig] = useState(initialConfig)

  // ✅ selected 변경될 때 저장
  useEffect(() => {
    sessionStorage.setItem(SESSION_SELECTED_KEY, JSON.stringify(selected))
  }, [selected])

  // ✅ soundConfig 변경될 때 저장
  useEffect(() => {
    sessionStorage.setItem(SESSION_CONFIG_KEY, JSON.stringify(soundConfig))
  }, [soundConfig])

  // Phase 불러오기
  useEffect(() => {
    const fetchPhases = async () => {
      if (!userId || !projectId) return
      const projectRef = doc(db, 'users', userId, 'projects', projectId)
      const projectSnap = await getDoc(projectRef)
      if (projectSnap.exists()) setPhases(projectSnap.data().phases || [])
    }
    fetchPhases()
  }, [userId, projectId])

  // Steps 불러오기
  useEffect(() => {
    const fetchSteps = async () => {
      if (!userId || !projectId || phases.length === 0) return
      const stepsMap = {}
      for (const phase of phases) {
        const stepRef = doc(db, 'users', userId, 'projects', projectId, 'phases', String(phase.id))
        const stepSnap = await getDoc(stepRef)
        stepsMap[phase.id] = stepSnap.exists() ? (stepSnap.data().steps || []) : []
      }
      setStepsByPhase(stepsMap)
    }
    fetchSteps()
  }, [userId, projectId, phases])

  const toggleSelect = (type, id) => {
    setSelected(prev => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`],
    }))
  }

  const onUpdateSoundConfig = (id, key, value) => {
    setSoundConfig(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }))
  }

  const onUpdateSoundPanel = (id, key, value) => {
    setSoundConfig(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }))
  }  

  const handleSaveSounds = async () => {
    const selectedKeys = Object.keys(selected).filter(k => selected[k])
    if (selectedKeys.length === 0) {
      toast.error('No cards selected')
      return
    }
  
    const toastId = toast.loading('Saving sounds…')
  
    try {
      await deleteAllFinalAssets(userId, projectId)
  
      for (const key of selectedKeys) {
        const [type, id] = key.split('-')
        const config = soundConfig[id]
        if (!config) continue
  
        let phase = null
        let step = null
        let phaseId = null
        let stepId = null
  
        if (type === 'phase') {
          phase = phases.find(p => String(p.id) === id)
          phaseId = phase?.id
        } else if (type === 'step') {
          const stepPhaseEntry = Object.entries(stepsByPhase).find(([pid, steps]) =>
            steps.some(s => String(s.id) === id)
          )
          phaseId = stepPhaseEntry?.[0]
          step = stepPhaseEntry?.[1].find(s => String(s.id) === id)
          stepId = step?.id
          phase = phases.find(p => String(p.id) === phaseId)
        }
  
        if (!phaseId) continue // phaseId가 반드시 있어야 저장 가능
  
        const isSample = config.instrument === 'Sample'
        const wavBlob = isSample ? null : await renderToneToWav(config)
        const soundUrl = isSample
          ? config.sampleUrl
          : await uploadSoundBlob(userId, projectId, phaseId, stepId, wavBlob)
  
        await saveSoundConfig(userId, projectId, phaseId, stepId, config, soundUrl)
  
        await saveFinalAsset(userId, projectId, {
          type,
          id,
          phaseId,
          stepId,
          title: phase?.title || '',
          description: step?.description || phase?.description || '',
          imageUrl: step?.imageUrl || phase?.imageUrl || '',
          soundConfig: config,
          soundUrl
        })
      }
  
      await Tone.context.resume()
      toast.success('Sounds Saved')
    } catch (err) {
      console.error('Error saving sounds:', err)
      toast.error('Failed to Save')
    } finally {
      toast.dismiss(toastId)
    }
  }  

  return (
    <div className="w-screen h-[calc(100vh-80px)] overflow-x-auto overflow-y-auto px-10 pb-40">
      <div className="flex gap-10 items-start min-w-fit p-10">
        {phases.map(phase => (
          <React.Fragment key={phase.id}>
            <div>
              <SoundPhaseCard
                phase={phase}
                selected={selected[`phase-${phase.id}`]}
                onSelect={() => toggleSelect('phase', phase.id)}
                soundConfig={soundConfig}
                onUpdateSoundConfig={onUpdateSoundConfig}
                onUpdateSoundPanel={onUpdateSoundPanel}
              />
              {selected[`phase-${phase.id}`] && (
                <SoundPanel
                  id={phase.id}
                  config={soundConfig[phase.id] || {}}
                  onUpdate={onUpdateSoundConfig}
                  userId={userId}
                  projectId={projectId}
                  phaseId={phase.id}
                  isSampleOnly={soundConfig[phase.id]?.instrument === 'Sample'}
                />
              )}
            </div>

            {(stepsByPhase[phase.id] || []).map(step => (
              <div key={step.id}>
                <SoundStepCard
                  step={step}
                  selected={selected[`step-${step.id}`]}
                  onSelect={() => toggleSelect('step', step.id)}
                  soundConfig={soundConfig}
                  onUpdateSoundConfig={onUpdateSoundConfig}
                  onUpdateSoundPanel={onUpdateSoundPanel}
                />
                {selected[`step-${step.id}`] && (
                  <SoundPanel
                    id={step.id}
                    config={soundConfig[step.id] || {}}
                    onUpdate={onUpdateSoundConfig}
                    userId={userId}
                    projectId={projectId}
                    phaseId={phase.id}
                    stepId={step.id}
                    isSampleOnly={soundConfig[step.id]?.instrument === 'Sample'}
                  />
                )}
              </div>
            ))}
          </React.Fragment>
        ))}

        <div className="flex flex-col gap-2">
          <SquareButton onClick={handleSaveSounds}>💾</SquareButton>
        </div>
      </div>
    </div>
  )
}















