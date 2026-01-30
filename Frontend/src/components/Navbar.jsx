import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + text */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">i</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">
            <span className="font-bold">Stock</span>
            <span className="text-blue-600 text-2xl font-bold">Learn</span>
          </span>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/register')}
            className="rounded-full bg-yellow-300 text-black font-bold tracking-[0.18em] text-xs px-6 py-2 uppercase"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-slate-800 text-white font-bold tracking-[0.18em] text-xs px-6 py-2 uppercase"
          >
            Log In
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar