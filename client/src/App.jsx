import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Storyboard from './pages/Storyboard'
import SoundBoard from './pages/SoundBoard'
import Review from './pages/Review'
import Navbar from './components/Navbar'
import StepBoard from './pages/StepBoard'
import LoginModal from './components/LoginModal'
import useAuth from './hooks/useAuth'

export default function App() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const hideNavbarOnPaths = ['/']

  if (loading) return null // or a loading spinner

  return (
    <div>
      {/* 로그인 안 됐으면 로그인 모달 */}
      {!user && <LoginModal />}

      {/* 로그인 됐을 때만 페이지 보여주기 */}
      {user && (
        <>
          {!hideNavbarOnPaths.includes(location.pathname) && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/storyboard" element={<Storyboard />} />
            <Route path="/soundboard" element={<SoundBoard />} />
            <Route path="/review" element={<Review />} />
            <Route path="/phase/:phaseId/steps" element={<StepBoard />} />
          </Routes>
        </>
      )}
    </div>
  )
}







