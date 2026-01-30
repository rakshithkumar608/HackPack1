import React from 'react'

const Login = () => {
  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left side: text + image space (reuse layout from register) */}
      <div className="w-1/2 bg-[#fff1db] flex flex-col justify-center px-16 py-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome back to{' '}
            <span className="text-blue-700">
              Stock<span className="text-slate-900">Learn</span>
            </span>
          </h1>
          <p className="text-base text-slate-800 mb-6">
            Continue practicing trading with virtual money and track your progress in a risk‑free
            environment.
          </p>
        </div>

        {/* Image placeholder area */}
        <div className="mt-4">
          <div className="w-full max-w-xl">
            {/* Replace src with your actual illustration */}
            <img
              src=""
              alt="Trading dashboard illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right side: login form */}
      <div className="w-1/2 flex items-center justify-center px-16 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">Sign In to Simulator</h2>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                Email or Username
              </label>
              <input
                type="text"
                placeholder="Enter Email or Username"
                className="w-full border border-slate-300 rounded-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">Password</label>
              <input
                type="password"
                placeholder="Enter Your Password"
                className="w-full border border-slate-300 rounded-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-3 w-3" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-blue-700 font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-48 mx-auto block rounded-full bg-[#f9f904] text-black font-semibold tracking-[0.18em] text-xs px-6 py-3 uppercase"
            >
              Log In
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="h-px w-10 bg-slate-300" />
              <span>or</span>
              <span className="h-px w-10 bg-slate-300" />
            </div>

            <div className="text-center text-sm">
              <span className="text-slate-600 mr-1">New here?</span>
              <a href="/register" className="text-blue-700 font-semibold hover:underline">
                Register Now
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login