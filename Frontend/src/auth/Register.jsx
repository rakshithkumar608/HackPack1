import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.signup(formData)
      console.log('Registration successful:', response)
      // Redirect to login after successful registration
      navigate('/login')
    } catch (err) {
      setError(err.error || 'Registration failed. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left side: text + image space */}
      <div className="w-1/2 bg-[#fff1db] flex flex-col justify-center px-16 py-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Sign up for <span className="text-blue-700">FREE</span>
          </h1>
          <ul className="space-y-2 text-base text-slate-800 list-disc list-inside mb-10">
            <li>Practice trading stocks, cryptos &amp; options with virtual money</li>
            <li>Gain confidence before risking your own money</li>
            <li>Learn how the markets work in a safe space with no risk</li>
          </ul>
        </div>

        {/* Image placeholder area */}
        <div className="mt-4">
          <div className="w-full max-w-xl">
            {/* Replace src with your actual illustration */}
            <img
              src=""
              alt="Trading simulator illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right side: form */}
      <div className="w-1/2 flex items-center justify-center px-16 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            Register for Simulator
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                Username
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter a Username"
                className="w-full border border-slate-300 rounded-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email Address"
                className="w-full border border-slate-300 rounded-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="w-full border border-slate-300 rounded-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Username rules box */}
            <div className="bg-slate-100 border border-slate-200 px-4 py-3 rounded-sm text-xs text-slate-700">
              <p className="font-semibold mb-1">Your username may only contain:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Letters, numbers, hyphens (-), and underscores (_).</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-48 mx-auto block rounded-full bg-[#f9f904] text-black font-semibold tracking-[0.18em] text-xs px-6 py-3 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="h-px w-10 bg-slate-300" />
              <span>or</span>
              <span className="h-px w-10 bg-slate-300" />
            </div>

            <div className="text-center text-sm">
              <button
              onClick={() => navigate('/login')}
                type="button"
                className="text-blue-700 font-semibold hover:underline"
              >
                Sign In Now
              </button>
            </div>
          </form>

          <p className="mt-10 text-[11px] leading-relaxed text-slate-500">
            By registering, you agree to the{' '}
            <span className="text-blue-700 underline cursor-pointer">Terms of Use</span> and{' '}
            <span className="text-blue-700 underline cursor-pointer">Privacy Policy</span>. If you
            live in the US you&apos;ll also be subscribed to The Market Sum and The Express
            newsletters.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register