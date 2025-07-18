import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import useStore from '../store/useStore'
import ProjectNameModal from '../components/ProjectNameModal'
import ReactMarkdown from 'react-markdown'

export default function Onboarding() {
  const [markdown, setMarkdown] = useState('')
  const {
    userId,
    projectId,
    setProjectId,
    setProjectTitle,
    showProjectModal,
    setShowProjectModal,
  } = useStore()

  useEffect(() => {
    fetch('/docs/onboarding.md')
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch((err) => console.error('Markdown load error:', err))
  }, [])

  const navigate = useNavigate()
  const location = useLocation()
  const forceModal = location.state?.forceModal === true

  const handleProjectNameSubmit = (name) => {
    const uniqueId = `${userId || 'guest'}-${name}`
    setProjectId(uniqueId)
    setProjectTitle(name)
    setShowProjectModal(false)
    navigate('/onboarding')
  }

  useEffect(() => {
  if (!projectId && !showProjectModal) {
    setShowProjectModal(true)
  }

  if (forceModal) {
    setShowProjectModal(true)
  }
  }, [projectId, forceModal, showProjectModal, setShowProjectModal])

  return (
  <div className="flex flex-col items-center p-6 space-y-6 text-center mt-12">

    <div className="prose prose-lato prose-sm max-w-2xl text-left w-full">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>

    {showProjectModal && (
      <ProjectNameModal onSubmit={handleProjectNameSubmit} />
    )}
  </div>
  )
}



