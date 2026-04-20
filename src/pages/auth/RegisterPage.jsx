import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Layers, Eye, EyeOff, ArrowRight, CheckCircle, Home } from 'lucide-react'

const ROLES = ['STUDENT', 'INSTRUCTOR']

export default function RegisterPage() {
  const { register: regFn, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await regFn(form)
      setRegistered(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="w-full max-w-md animate-slide-up text-center">
          <div className="card shadow-royal-lg space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="font-display font-bold text-navy-900 text-2xl mb-2">Registration Submitted!</h2>
              <p className="text-slate-lms text-sm leading-relaxed">
                Your account has been created and is <strong>pending admin approval</strong>. You'll be able to log in once an administrator approves your account.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <Link to="/login" className="btn-primary w-full justify-center py-3 flex items-center gap-2">
                <span>Go to Login</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="btn-ghost w-full justify-center flex items-center gap-2 text-slate-lms">
                <Home size={15} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-royal-gradient flex items-center justify-center shadow-royal">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-navy-900">ThinkVerge LMS</p>
              <p className="text-xs text-slate-lms">Learning Management System</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-lms hover:text-royal-600 transition-colors">
            <Home size={14} />
            <span>Home</span>
          </Link>
        </div>

        <div className="card shadow-royal-lg">
          <h2 className="font-display font-bold text-navy-900 text-2xl mb-1">Create account</h2>
          <p className="text-sm text-slate-lms mb-2">Join ThinkVerge — admin approval required before login</p>

          <div className="mb-5 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
            ⏳ After registering, an admin will review and approve your account before you can log in.
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-lms hover:text-navy-600" onClick={() => setShowPw(p => !p)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">I am joining as</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r} type="button"
                    onClick={() => setForm(p => ({ ...p, role: r }))}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.role === r ? 'border-royal-500 bg-royal-50 text-royal-700' : 'border-royal-100 text-slate-lms hover:border-royal-300'}`}
                  >
                    {r === 'STUDENT' ? '🎓 Student' : '👨‍🏫 Instructor'}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3 mt-2" disabled={loading}>
              {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-lms mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-royal-600 font-semibold hover:text-royal-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
