import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useStore from '../store/useStore'

export default function Navbar() {
  const { logout } = useAuth()
  const setShowProjectModal = useStore((state) => state.setShowProjectModal)
  const projectTitle = useStore((state) => state.projectTitle)

  return (
    <nav className="bg-white text-gray-900 px-6 py-4 shadow border-b flex justify-between items-center">
      <div className="flex gap-6 items-center">
        <NavLink to="/" className="font-bold text-md mr-4">
          CadenceFlow
        </NavLink>
        <NavLink
          to="/onboarding"
          className={({ isActive }) =>
            isActive ? "text-blue-400 font-semibold" : "text-gray-700"
          }
        >
          Onboarding
        </NavLink>
        <NavLink
          to="/storyboard"
          className={({ isActive }) =>
            isActive ? "text-blue-400 font-semibold" : "text-gray-700"
          }
        >
          Storyboarding
        </NavLink>
        <NavLink
          to="/soundboard"
          className={({ isActive }) =>
            isActive ? "text-blue-400 font-semibold" : "text-gray-700"
          }
        >
          Assigning Sounds
        </NavLink>
        <NavLink
          to="/review"
          className={({ isActive }) =>
            isActive ? "text-blue-400 font-semibold" : "text-gray-700"
          }
        >
          Reviewing
        </NavLink>
      </div>

      {/* 버튼 묶음 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700 italic">{projectTitle}</span>
        <div className="flex items-center gap-2 bg-sky-100 px-1 py-1 rounded-lg">
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-2 py-0 bg-white-200 text-white rounded hover:bg-blue-400 transition"
          >
            ➕
          </button>
          <button
            onClick={logout}
            className="px-2 py-0 bg-white-200 text-white rounded hover:bg-blue-400 transition"
          >
            👋
          </button>
        </div>
      </div>
    </nav>
  )
}


