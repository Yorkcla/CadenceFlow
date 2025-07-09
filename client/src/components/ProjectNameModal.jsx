// components/ProjectNameModal.jsx
import React, { useState } from 'react'

export default function ProjectNameModal({ onSubmit }) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
        <h2 className="text-lg font-bold">New Project</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Title"
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-semibold"
        >
          Start
        </button>
      </div>
    </div>
  )
}
