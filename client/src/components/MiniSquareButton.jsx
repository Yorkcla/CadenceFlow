// src/components/MiniSquareButton.jsx
import React from 'react'

export default function MiniSquareButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-md shadow hover:shadow-md transition-all duration-200 text-blue-900 text-xs font-medium flex items-center justify-center disabled:opacity-50"
    >
      {children}
    </button>
  )
}




