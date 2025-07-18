// src/components/MiniSquareButton.jsx
import React from 'react'

export default function MiniSquareButton({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-8 h-8 text-xs font-medium text-gray-800 flex items-center justify-center hover:bg-gray-100 rounded transition-colors duration-150 disabled:opacity-50"
      >
      {children}
    </button>
  )
}




