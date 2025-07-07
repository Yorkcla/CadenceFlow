import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { logout } = useAuth()

  return (
    <nav className="bg-white text-gray-900 px-6 py-4 shadow border-b flex justify-between items-center">
      <div className="flex gap-6 items-center">
        <NavLink to="/" className="font-bold text-lg mr-4">
          CadenceFlow
        </NavLink>
        <NavLink
          to="/onboarding"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Onboarding
        </NavLink>
        <NavLink
          to="/storyboard"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Storyboarding
        </NavLink>
        <NavLink
          to="/soundboard"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Assigning Sounds
        </NavLink>
        <NavLink
          to="/overview"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Final Overview
        </NavLink>
      </div>
      <button
        onClick={logout}
        className="px-2 py-0 bg-blue-200 text-white rounded hover:bg-blue-600 transition"
      >
        👋
      </button>
    </nav>
  )
}

