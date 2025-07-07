import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../utils/firebase' // 경로는 네 프로젝트에 맞게 수정

export default function LoginModal({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLoginSuccess()
    } catch (err) {
      console.error('Login error:', err.message)
      setError('Invalid credentials')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl space-y-4 w-80">
        <h2 className="text-lg font-bold">CadenceFlow</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full px-3 py-2 rounded"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={!email || !password}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

  