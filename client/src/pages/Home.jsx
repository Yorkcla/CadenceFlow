import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function Home() {
  const navigate = useNavigate()

  const sections = [
    { title: 'Onboarding', path: '/onboarding'},
    { title: 'Scenario Builder', path: '/storyboard' },
    { title: 'Sound Mapping', path: '/sound' },
    { title: 'Review', path: '/review' },
  ]

  return (
    <div className="p-8 space-y-6 max-w-xl mx-auto">
      {sections.map((section, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
        >
          <div className="text-lg font-semibold">{section.title}</div>
          <Button onClick={() => navigate(section.path)}>Move</Button>
        </div>
      ))}
    </div>
  )
}
