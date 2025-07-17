import React, { useState } from 'react'

export default function ProjectNameModal({ onSubmit }) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
        <h2 className="text-lg font-bold">New Project</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project title"
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded text-sm font-semibold"
        >
          Start
        </button>
      </div>
    </div>
  )
}
