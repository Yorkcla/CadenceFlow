import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useStore from '../store/useStore'
import MiniSquareButton from './MiniSquareButton'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { logout } = useAuth()
  const setShowProjectModal = useStore((state) => state.setShowProjectModal)
  const projectTitle = useStore((state) => state.projectTitle)
  const navigate = useNavigate()

  return (
    <nav className="bg-white text-gray-900 px-6 py-4 shadow border-b flex justify-between items-center">
      <div className="flex gap-6 items-center">
        <NavLink to="/" className="font-black font-lato bg-gradient-to-r from-emerald-900 to-cyan-200 bg-clip-text text-transparent">
          CadenceFlow
        </NavLink>
        <NavLink
          to="/onboarding"
          className={({ isActive }) =>
            isActive ? "text-emerald-300 font-semibold" : "text-gray-500"
          }
        >
          Onboarding
        </NavLink>
        <NavLink
          to="/storyboard"
          className={({ isActive }) =>
            isActive ? "text-emerald-300 font-semibold" : "text-gray-500"
          }
        >
          Storyboarding
        </NavLink>
        <NavLink
          to="/soundboard"
          className={({ isActive }) =>
            isActive ? "text-emerald-300 font-semibold" : "text-gray-500"
          }
        >
          Sounding
        </NavLink>
        <NavLink
          to="/review"
          className={({ isActive }) =>
            isActive ? "text-emerald-300 font-semibold" : "text-gray-500"
          }
        >
          Reviewing
        </NavLink>
      </div>

      {/* 버튼 묶음 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">{projectTitle}</span>
          <MiniSquareButton onClick={() => navigate('/onboarding', { state: { forceModal: true } })}>
            ➕
          </MiniSquareButton>
          <MiniSquareButton onClick={logout}>
            👋
          </MiniSquareButton>
      </div>
    </nav>
  )
}


