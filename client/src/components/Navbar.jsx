import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white text-gray-900 px-6 py-4 shadow border-b">
      <Link className="mr-4" to="/">CadenceFlow</Link>
    </nav>
  )
}