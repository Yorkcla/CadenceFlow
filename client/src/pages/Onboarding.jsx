import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import PageJoyride from '../components/PageJoyride'
import ProjectNameModal from '../components/ProjectNameModal'
import SquareButton from '../components/SquareButton'

export default function Onboarding() {
  const navigate = useNavigate()
  const {
    userId,
    projectId,
    setProjectId,
    setProjectTitle,
    showProjectModal,
    setShowProjectModal,
    startTour,
  } = useStore()

  const [tempName, setTempName] = useState('')

  const steps = [
    { target: '[data-tour="intro"]', content: 'CadenceFlow에 오신 걸 환영합니다!' },
    { target: '[data-tour="add-phase-button"]', content: '스토리보드 단계를 여기에 추가하세요.' },
    { target: '[data-tour="sound-panel"]', content: '사운드를 배치하고 조절할 수 있어요.' },
    { target: '[data-tour="review-button"]', content: '완성된 결과를 여기서 확인해요.' },
  ]

  useEffect(() => {
    if (!projectId) {
      setShowProjectModal(true)
    } else {
      startTour(steps) // 프로젝트가 이미 설정되어 있으면 Joyride만 실행
    }
  }, [])

  const handleProjectNameSubmit = (name) => {
    const uniqueId = `${userId || 'guest'}-${name}`
    setProjectId(uniqueId)
    setProjectTitle(name)
    setShowProjectModal(false)
    startTour(steps)
    navigate('/onboarding')
  }

  return (
    <div className="p-6">
      <PageJoyride />
      <div data-tour="intro" className="text-2xl font-bold mb-4">CadenceFlow 투어를 시작해볼까요?</div>

      {showProjectModal && (
        <ProjectNameModal onSubmit={handleProjectNameSubmit} />
      )}
    </div>
  )
}



