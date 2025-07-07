import React from 'react'
import { Link } from 'react-router-dom'
import useStore from '../store/useStore'

export default function Home() {
  const { userId, setUserId } = useStore()

  const sections = [
    { title: 'Onboarding', path: '/onboarding' },
    { title: 'Storyboarding', path: '/storyboard' },
    { title: 'Assigning Sound', path: '/sound' },
    { title: 'Final Overview', path: '/overview' },
  ]

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">CadenceFlow</h1>
      </div>
      {/* 상단 Participant ID 입력 */}
      <div className="w-full max-w-md mb-6 flex items-center gap-2">
        <label className="text-sm text-gray-700 font-medium" htmlFor="userId">G’day, who’s this?</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. Minsik, p01"
          className="h-8 w-40 border rounded px-2 text-sm"
        />
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


