import React, { useEffect } from 'react'
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
import useStore from './store/useStore'

export default function App() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const hideNavbarOnPaths = ['/']
  const setUserId = useStore((state) => state.setUserId)


  useEffect(() => {
    if (user) {
      setUserId(user.uid)
    }
  }, [user, setUserId])

  if (loading) return null

  return (
    <div>
      {!user && <LoginModal />}
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








