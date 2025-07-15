import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import ProjectNameModal from '../components/ProjectNameModal'

export default function Onboarding() {
  const {
    userId,
    projectId,
    setProjectId,
    setProjectTitle,
    showProjectModal,
    setShowProjectModal,
  } = useStore()

  const navigate = useNavigate()

  const handleProjectNameSubmit = (name) => {
    const uniqueId = `${userId || 'guest'}-${name}`
    setProjectId(uniqueId)
    setProjectTitle(name)
    setShowProjectModal(false)
    navigate('/onboarding')
  }

  useEffect(() => {
    if (!projectId) {
      setShowProjectModal(true)
    }
  }, [projectId, setShowProjectModal])

  return (
  <div className="flex flex-col items-center p-6 space-y-6 text-center mt-12">

    <div className="text-2xl font-bold text-gray-800">
      CadenceFlow: Sonic Interactions with Musical Tension and Release
    </div>

    <p className="text-gray-600 text-base max-w-2xl">
    CadenceFlow helps you design interactive experiences by assigning sound cues using musical tension and release. From visual storyboarding to audio mapping, this tool supports your creative process step by step.
    It consists of three key stages: Storyboarding (where you define task situations requiring sound), Sounding (where you assign appropriate sounds to key moments), and Reviewing (where you preview and compare final designs).
    With integrated text, image, and video generation powered by GenAI, CadenceFlow enables accessible and streamlined design exploration for non-experts.
    </p>

    <p className="text-sky-500 font-bold text-sm">
      Click the black button to start the onboarding tour and explore how it all works!
    </p>

    {showProjectModal && (
      <ProjectNameModal onSubmit={handleProjectNameSubmit} />
    )}
  </div>
)
}



