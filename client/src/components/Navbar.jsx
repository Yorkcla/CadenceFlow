import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white text-gray-900 px-6 py-4 shadow border-b flex gap-6 items-center">
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
    </nav>
  )
}
