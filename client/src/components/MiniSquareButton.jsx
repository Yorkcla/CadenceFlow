// src/components/MiniSquareButton.jsx
import React from 'react'

export default function MiniSquareButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-24 h-7 bg-blue-100 border border-blue-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-blue-900 text-sm font-semibold disabled:opacity-50"
    >
      {children}
    </button>
  )
}



