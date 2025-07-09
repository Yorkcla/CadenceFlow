// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import useStore from '../store/useStore'
import useAuth from '../hooks/useAuth'

export default function Home() {
  const { userId, setUserId } = useStore()
  const { logout } = useAuth()

  const sections = [
    { title: 'Onboarding', path: '/onboarding' },
    { title: 'Storyboarding', path: '/storyboard' },
    { title: 'Assigning Sounds', path: '/soundboard' },
    { title: 'Reviewing', path: '/review' },
  ]

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col items-center">
      
      <button
        onClick={logout}
        className="absolute top-6 right-6 px-2 py-0 bg-white-200 text-white rounded hover:bg-blue-400 transition"
      >
      👋
      </button>
      
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">CadenceFlow</h1>
      </div>
      {/* 가운데 박스 정사각형 4개 */}
      <div className="grid grid-cols-2 gap-10">
        {sections.map((section, index) => (
          <Link
            key={index}
            to={section.path}
            className="w-48 h-48 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-center"
          >
            <div className="text-lg font-semibold text-gray-900 px-2">{section.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}



