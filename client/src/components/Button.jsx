import React from 'react'

export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-red-600 transition-all duration-200"
    >
      {children}
    </button>
  )
}
