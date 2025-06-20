import React from 'react'

export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white text-gray-900 font-semibold px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
    >
      {children}
    </button>
  )
}
