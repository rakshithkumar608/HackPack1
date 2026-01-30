import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './auth/Login'
import Register from './auth/Register'
import Dashboard from './components/Dashboard'
import Portfolio from './pages/Portfolio'
import Leaderboard from './pages/Leaderboard'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/portfolio' element={<Portfolio />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
      </Routes>
    </Router>
  )
}

export default App