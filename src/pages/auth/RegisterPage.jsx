import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Layers, Eye, EyeOff, ArrowRight } from 'lucide-react'

const ROLES = ['STUDENT', 'INSTRUCTOR']

export default function RegisterPage() {
  const { register: regFn, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await regFn(form)
      const role = (data.role || data.user?.role || form.role).toUpperCase()
      navigate(role === 'INSTRUCTOR' ? '/instructor' : '/student', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-royal-gradient flex items-center justify-center shadow-royal">
            <Layers size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-navy-900">ThinkVerge LMS</p>
            <p className="text-xs text-slate-lms">Learning Management System</p>
          </div>
        </div>

        <div className="card shadow-royal-lg">
          <h2 className="font-display font-bold text-navy-900 text-2xl mb-1">Create account</h2>
          <p className="text-sm text-slate-lms mb-6">Join ThinkVerge and start learning today</p>

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
