import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Storyboard from './pages/Storyboard'
import Sound from './pages/Sound'
import Overview from './pages/Overview'
import Navbar from './components/Navbar'
import StepBoard from './pages/StepBoard'

export default function App() {
  const location = useLocation()
  const hideNavbarOnPaths = ['/']  // 숨길 경로 목록

  return (
    <div>
      {!hideNavbarOnPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/storyboard" element={<Storyboard />} />
        <Route path="/sound" element={<Sound />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/phase/:phaseId/steps" element={<StepBoard />} />
      </Routes>
    </div>
  )
}


