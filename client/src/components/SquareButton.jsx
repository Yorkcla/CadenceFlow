import React from 'react'

export default function SquareButton({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-40 h-14 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-gray-900 font-semibold disabled:opacity-50"
    >
      {children}
    </button>
  )
}
