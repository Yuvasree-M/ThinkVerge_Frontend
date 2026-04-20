import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Layers, ArrowRight, Home } from 'lucide-react'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await login(form)
      const role = (data.role || data.user?.role || '').toString().toUpperCase()
      const dest = from || (role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : '/student')
      navigate(dest, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || ''
      if (msg.toLowerCase().includes('pending') || msg.toLowerCase().includes('approv')) {
        setError('Your account is pending admin approval. Please wait for an administrator to approve your registration.')
      } else {
        setError(msg || 'Invalid email or password')
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-royal-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full translate-y-40 -translate-x-20" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg">ThinkVerge</p>
              <p className="text-royal-200 text-xs">Learning Management System</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-royal-200 hover:text-white transition-colors text-xs">
            <Home size={14} />
            <span>Home</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="font-display font-bold text-white text-4xl leading-tight mb-4">
            Empowering<br />Learning at<br />
            <span className="text-gold-300">Every Level</span>
          </h1>
          <p className="text-royal-200 text-base leading-relaxed max-w-sm">
            A unified platform for students, instructors, and administrators to manage the full learning lifecycle.
          </p>
        </div>

        <div className="flex gap-6 relative z-10">
          {[['Students', '1.2k+'], ['Courses', '340+'], ['Instructors', '85+']].map(([label, val]) => (
            <div key={label}>
              <p className="text-white font-display font-bold text-xl">{val}</p>
              <p className="text-royal-300 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-royal-gradient flex items-center justify-center">
                <Layers size={18} className="text-white" />
              </div>
              <p className="font-display font-bold text-navy-900">ThinkVerge LMS</p>
            </div>
            <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-lms hover:text-royal-600 transition-colors">
              <Home size={14} />
              <span>Home</span>
            </Link>
          </div>

          <h2 className="font-display font-bold text-navy-900 text-3xl mb-1">Welcome back</h2>
          <p className="text-slate-lms text-sm mb-8">Sign in to continue to your dashboard</p>

          {error && (
            <div className={`mb-4 p-3 rounded-xl text-sm border ${error.includes('pending') || error.includes('approval')
              ? 'bg-amber-50 border-amber-100 text-amber-700'
              : 'bg-red-50 border-red-100 text-red-600'}`}>
              {error.includes('pending') || error.includes('approval')
                ? '⏳ ' + error
                : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email" required
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-lms hover:text-navy-600" onClick={() => setShowPw(p => !p)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 mt-2" disabled={loading}>
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-lms mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-royal-600 font-semibold hover:text-royal-700">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
