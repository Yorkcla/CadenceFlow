import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const sections = [
    { title: '스토리보드 만들기', icon: '📘', path: '/storyboard' },
    { title: '사운드 배치하기', icon: '🎵', path: '/sound' },
    { title: '최종 확인하기', icon: '✅', path: '/review' },
  ]

  return (
    <div className="p-8 space-y-6 max-w-xl mx-auto">
      {sections.map((section, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition"
        >
          <div className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">{section.icon}</span>
            {section.title}
          </div>
          <button
            onClick={() => navigate(section.path)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            이동하기
          </button>
        </div>
      ))}
    </div>
  )
}
