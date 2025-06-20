import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function Home() {
  const navigate = useNavigate()

  const sections = [
    { title: 'Onboarding', path: '/onboarding'},
    { title: 'Storyboard', path: '/storyboard' },
    { title: 'Sound', path: '/sound' },
    { title: 'Overview', path: '/review' },
  ]

  return (
    <div className="p-8 space-y-6 max-w-xl mx-auto">
      {sections.map((section, index) => (
        <div
          key={index}
          className="bg-blue-100 shadow-md rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition"
        >
          <div className="text-lg font-semibold">{section.title}</div>
          <Button onClick={() => navigate(section.path)}>Move</Button>
        </div>
      ))}
    </div>
  )
}
