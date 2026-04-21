import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { T, css, PageHeroBg, Brand, injectFonts } from '../theme'
import { useEffect } from 'react'

/* ─── Shared auth form card wrapper ─────────────────────────── */
function AuthCard({ children }) {
  return (
    <div style={{
      background: T.white,
      border: `1px solid ${T.grey2}`,
      borderRadius: 22,
      padding: '38px 36px',
      boxShadow: '0 24px 60px rgba(13,27,42,0.18)',
      width: '100%',
      maxWidth: 420,
    }}>
      {children}
    </div>
  )
}

/* ─── Stats shown on the left side ──────────────────────────── */
function HeroStats() {
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 48 }}>
      {[['1.2K+', 'Students'], ['340+', 'Courses'], ['85+', 'Instructors']].map(([n, l]) => (
        <div key={l}>
          <p style={{ ...css.serif, fontSize: 26, fontWeight: 700, color: T.goldL, margin: 0 }}>{n}</p>
          <p style={{ ...css.sans, fontSize: 10, color: 'rgba(255,255,255,0.40)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</p>
        </div>
      ))}
    </div>
  )
}

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { injectFonts() }, [])

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
      setError(
        msg.toLowerCase().includes('pending') || msg.toLowerCase().includes('approv')
          ? 'Your account is pending admin approval. Please wait for an administrator to approve your registration.'
          : msg || 'Invalid email or password'
      )
    }
  }

  const isApprovalErr = error.includes('pending') || error.includes('approval')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', ...css.sans }}>
      {/* Left panel — dark hero */}
      <PageHeroBg style={{
        display: 'none',
        ...(typeof window !== 'undefined' && window.innerWidth >= 1024 ? { display: 'flex' } : {}),
        flex: '0 0 48%', flexDirection: 'column', justifyContent: 'space-between',
        padding: '44px 52px',
      }}>
        <style>{`.tv-left-panel{display:flex!important}@media(max-width:1023px){.tv-left-panel{display:none!important}}`}</style>
        <div className="tv-left-panel" style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Brand light />
            <Link to="/" style={{ ...css.sans, fontSize: 12, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>← Home</Link>
          </div>

          <div>
            <h1 style={{ ...css.serif, fontSize: 'clamp(36px,4vw,58px)', fontWeight: 700, color: T.white, lineHeight: 1.10, letterSpacing: '-0.02em', margin: '0 0 18px' }}>
              Empowering<br />Learning at<br />
              <em style={{ fontStyle: 'italic', color: T.goldL }}>Every Level</em>
            </h1>
            <p style={{ ...css.sans, fontSize: 15, color: 'rgba(255,255,255,0.52)', lineHeight: 1.78, maxWidth: 360 }}>
              A unified platform for students, instructors, and administrators to manage the full learning lifecycle.
            </p>
            <HeroStats />
          </div>

          <p style={{ ...css.sans, fontSize: 11, color: 'rgba(255,255,255,0.22)', margin: 0 }}>
            © 2026 ThinkVerge LMS
          </p>
        </div>
      </PageHeroBg>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: T.bg }}>
        <AuthCard>
          {/* Mobile brand */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <Brand />
            <Link to="/" style={{ ...css.sans, fontSize: 12, color: T.grey4, textDecoration: 'none' }}>← Home</Link>
          </div>

          <h2 style={{ ...css.serif, fontSize: 28, fontWeight: 700, color: T.navy, margin: '0 0 4px' }}>Welcome back</h2>
          <p style={{ ...css.sans, fontSize: 13, color: T.grey4, marginBottom: 24 }}>Sign in to continue to your dashboard</p>

          {error && (
            <div style={{
              marginBottom: 16, padding: '12px 14px', borderRadius: 12, fontSize: 13,
              background: isApprovalErr ? 'rgba(184,150,62,0.08)' : 'rgba(220,38,38,0.06)',
              border: `1px solid ${isApprovalErr ? T.borderG : 'rgba(220,38,38,0.20)'}`,
              color: isApprovalErr ? T.gold : '#dc2626',
              ...css.sans,
            }}>
              {isApprovalErr ? '⏳ ' : '⚠ '}{error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ ...css.sans, fontSize: 11, fontWeight: 600, color: T.grey5, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input type="email" required placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.grey2}`, background: T.grey1, ...css.sans, fontSize: 14, color: T.text, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.grey2} />
            </div>
            <div>
              <label style={{ ...css.sans, fontSize: 11, fontWeight: 600, color: T.grey5, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} required placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 10, border: `1.5px solid ${T.grey2}`, background: T.grey1, ...css.sans, fontSize: 14, color: T.text, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.grey2} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.grey4, fontSize: 15, padding: 0 }}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ marginTop: 6, width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, color: T.white, ...css.sans, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'opacity .2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.grey2}`, textAlign: 'center' }}>
            <p style={{ ...css.sans, fontSize: 13, color: T.grey4, margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: T.gold, fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  )
}