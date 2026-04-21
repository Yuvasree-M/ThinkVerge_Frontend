import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { T, css, PageHeroBg, Brand, injectFonts } from '../theme'

const ROLES = ['STUDENT', 'INSTRUCTOR']

function SuccessCard() {
  return (
    <div style={{ background: T.white, border: `1px solid ${T.grey2}`, borderRadius: 22, padding: '44px 36px', boxShadow: '0 24px 60px rgba(13,27,42,0.18)', width: '100%', maxWidth: 420, textAlign: 'center' }}>
      <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(34,197,94,0.10)', border: '1.5px solid rgba(34,197,94,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 22px' }}>✅</div>
      <h2 style={{ ...css.serif, fontSize: 26, fontWeight: 700, color: T.navy, margin: '0 0 10px' }}>Registration Submitted!</h2>
      <p style={{ ...css.sans, fontSize: 14, color: T.grey5, lineHeight: 1.75, margin: '0 0 28px' }}>
        Your account has been created and is <strong style={{ color: T.navy }}>pending admin approval</strong>. You'll be able to log in once an administrator approves it.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link to="/login" style={{ display: 'block', padding: '13px', borderRadius: 10, background: `linear-gradient(135deg,${T.gold},${T.goldL})`, color: T.white, textDecoration: 'none', ...css.sans, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>Go to Login →</Link>
        <Link to="/" style={{ display: 'block', padding: '12px', borderRadius: 10, border: `1.5px solid ${T.grey2}`, color: T.grey5, textDecoration: 'none', ...css.sans, fontSize: 14, fontWeight: 500, textAlign: 'center', background: T.grey1 }}>← Back to Home</Link>
      </div>
    </div>
  )
}

function LeftPanel() {
  const features = [
    { icon: '🎓', text: 'Earn verifiable certificates' },
    { icon: '📖', text: 'Structured module-by-module courses' },
    { icon: '🏆', text: 'Expert instructors from the industry' },
    { icon: '📊', text: 'Track your progress in real time' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 52 }}>
          <Brand light />
          <Link to="/" style={{ ...css.sans, fontSize: 12, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>← Home</Link>
        </div>
        <p style={{ ...css.sans, fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 14px' }}>Why ThinkVerge?</p>
        <h2 style={{ ...css.serif, fontSize: 'clamp(32px,3.5vw,50px)', fontWeight: 700, color: T.white, lineHeight: 1.12, margin: '0 0 32px' }}>
          Start Your<br />Learning<br /><em style={{ fontStyle: 'italic', color: T.goldL }}>Journey Today</em>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {features.map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{f.icon}</div>
              <span style={{ ...css.sans, fontSize: 14, color: 'rgba(255,255,255,0.72)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ ...css.sans, fontSize: 11, color: 'rgba(255,255,255,0.22)', margin: 0 }}>© 2026 ThinkVerge LMS</p>
    </div>
  )
}

export default function RegisterPage() {
  const { register: regFn, loading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  useEffect(() => { injectFonts() }, [])

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

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1.5px solid ${T.grey2}`, background: T.grey1,
    ...css.sans, fontSize: 14, color: T.text, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', ...css.sans }}>
      <style>{`@media(max-width:1023px){.tv-reg-left{display:none!important}}`}</style>

      {/* Left */}
      <PageHeroBg style={{ flex: '0 0 46%', padding: '44px 52px' }}>
        <div className="tv-reg-left" style={{ height: '100%' }}>
          <LeftPanel />
        </div>
      </PageHeroBg>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: T.bg, overflowY: 'auto' }}>
        {registered ? <SuccessCard /> : (
          <div style={{ background: T.white, border: `1px solid ${T.grey2}`, borderRadius: 22, padding: '36px 34px', boxShadow: '0 24px 60px rgba(13,27,42,0.18)', width: '100%', maxWidth: 420 }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
              <Brand />
              <Link to="/" style={{ ...css.sans, fontSize: 12, color: T.grey4, textDecoration: 'none' }}>← Home</Link>
            </div>

            <h2 style={{ ...css.serif, fontSize: 26, fontWeight: 700, color: T.navy, margin: '0 0 4px' }}>Create account</h2>
            <p style={{ ...css.sans, fontSize: 13, color: T.grey4, marginBottom: 18 }}>Join ThinkVerge — admin approval required</p>

            <div style={{ marginBottom: 20, padding: '10px 14px', borderRadius: 10, background: 'rgba(184,150,62,0.07)', border: `1px solid ${T.borderG}`, ...css.sans, fontSize: 12, color: T.gold }}>
              ⏳ After registering, an admin will approve your account before you can log in.
            </div>

            {error && (
              <div style={{ marginBottom: 14, padding: '11px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.20)', ...css.sans, fontSize: 13, color: '#dc2626' }}>⚠ {error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { k: 'name',  l: 'Full Name',      t: 'text',  p: 'John Doe' },
                { k: 'email', l: 'Email Address',  t: 'email', p: 'you@example.com' },
              ].map(f => (
                <div key={f.k}>
                  <label style={{ ...css.sans, fontSize: 11, fontWeight: 600, color: T.grey5, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>{f.l}</label>
                  <input type={f.t} placeholder={f.p} required value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                    style={inputStyle} onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.grey2} />
                </div>
              ))}

              <div>
                <label style={{ ...css.sans, fontSize: 11, fontWeight: 600, color: T.grey5, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} placeholder="Minimum 8 characters" minLength={8} required value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    style={{ ...inputStyle, paddingRight: 40 }} onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.grey2} />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.grey4, fontSize: 15, padding: 0 }}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ ...css.sans, fontSize: 11, fontWeight: 600, color: T.grey5, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 8 }}>I am joining as</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {ROLES.map(r => (
                    <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                      style={{ padding: '12px', borderRadius: 12, cursor: 'pointer', transition: 'all .2s', border: `2px solid ${form.role === r ? T.gold : T.grey2}`, background: form.role === r ? 'rgba(184,150,62,0.08)' : T.grey1, ...css.sans, fontSize: 13, fontWeight: 600, color: form.role === r ? T.gold : T.grey5 }}>
                      {r === 'STUDENT' ? '🎓 Student' : '👨‍🏫 Instructor'}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ marginTop: 4, width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${T.navy},${T.navyMid})`, color: T.white, ...css.sans, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'opacity .2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                {loading ? 'Creating account…' : 'Create Account →'}
              </button>
            </form>

            <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.grey2}`, textAlign: 'center' }}>
              <p style={{ ...css.sans, fontSize: 13, color: T.grey4, margin: 0 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: T.gold, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}