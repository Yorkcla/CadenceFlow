import React, { useState } from 'react'
import SquareButton from '../components/SquareButton'

const onboardingSteps = [
  { id: 1, title: 'Basic Intro with Tool Purpose', video: 'https://via.placeholder.com/400x250?text=Video+1' },
  { id: 2, title: 'Storyboarding and Sound Assignment', video: 'https://via.placeholder.com/400x250?text=Video+2' },
  { id: 3, title: 'Final Review with Comparison', video: 'https://via.placeholder.com/400x250?text=Video+3' },
]

export default function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [chatInput, setChatInput] = useState('')

  const nextStep = () => {
    if (stepIndex < onboardingSteps.length - 1) setStepIndex(stepIndex + 1)
  }

  const prevStep = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-6">
      <h2 className="text-2xl font-bold">{onboardingSteps[stepIndex].title}</h2>

      <img src={onboardingSteps[stepIndex].video} alt={`Step ${stepIndex + 1}`} className="rounded-xl shadow-lg" />

      <div className="flex space-x-4">
        <SquareButton onClick={prevStep} disabled={stepIndex === 0}>Previous</SquareButton>
        <SquareButton onClick={nextStep} disabled={stepIndex === onboardingSteps.length - 1}>Next</SquareButton>
        <SquareButton onClick={() => setShowModal(true)}>❓</SquareButton>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold">CadenceFlow</h3>
            <div className="border rounded-md h-40 p-2 text-gray-500 flex items-center justify-center">
              <p>(Chat history will appear here)</p>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-grow border rounded px-3 py-2"
              />
              <SquareButton onClick={() => setChatInput('')}>Send</SquareButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

