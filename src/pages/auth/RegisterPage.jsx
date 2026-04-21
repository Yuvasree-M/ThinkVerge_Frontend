import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { T, css, injectFonts, Brand } from '../theme'

const ROLES = [
  { key: 'STUDENT', label: '🎓 Student' },
  { key: 'INSTRUCTOR', label: '👨‍🏫 Instructor' }
]

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

export default function RegisterPage() {
  const { register: regFn, loading } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  })

  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    injectFonts()
  }, [])

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
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: `1.5px solid ${T.grey2}`,
    background: T.grey1,
    ...css.sans,
    fontSize: 14,
    color: T.text,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const tabStyle = (active) => ({
    flex: 1,
    padding: '12px',
    borderRadius: 12,
    cursor: 'pointer',
    border: `2px solid ${active ? T.gold : T.grey2}`,
    background: active ? 'rgba(184,150,62,0.08)' : T.grey1,
    color: active ? T.gold : T.grey5,
    fontWeight: 600,
    fontSize: 13,
    textAlign: 'center',
    transition: 'all .2s',
  })

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: T.bg,
      padding: '24px'
    }}>
      <AuthCard>

        {/* LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ cursor: 'pointer' }}>
              <Brand />
            </div>
          </Link>
        </div>

        {/* TITLE */}
        <h2 style={{
          ...css.serif,
          fontSize: 26,
          fontWeight: 700,
          color: T.navy,
          margin: '0 0 4px',
          textAlign: 'center'
        }}>
          Create account
        </h2>

        <p style={{
          ...css.sans,
          fontSize: 13,
          color: T.grey4,
          marginBottom: 18,
          textAlign: 'center'
        }}>
          Join ThinkVerge — admin approval required
        </p>

        {/* ERROR */}
        {error && (
          <div style={{
            marginBottom: 14,
            padding: '11px 14px',
            borderRadius: 10,
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.20)',
            ...css.sans,
            fontSize: 13,
            color: '#dc2626'
          }}>
            ⚠ {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* NAME */}
          <input
            placeholder="Full Name"
            required
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            style={inputStyle}
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            style={inputStyle}
          />

          {/* PASSWORD */}
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              minLength={8}
              required
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              style={{ ...inputStyle, paddingRight: 40 }}
            />

            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              {showPw ? '🙈' : '👁'}
            </button>
          </div>

          {/* ROLE TABS */}
          <div>
            <label style={{
              ...css.sans,
              fontSize: 11,
              fontWeight: 600,
              color: T.grey5,
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              display: 'block',
              marginBottom: 8
            }}>
              I am joining as
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              {ROLES.map(r => (
                <div
                  key={r.key}
                  onClick={() => setForm(p => ({ ...p, role: r.key }))}
                  style={tabStyle(form.role === r.key)}
                >
                  {r.label}
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              width: '100%',
              padding: '13px',
              borderRadius: 10,
              border: 'none',
              background: `linear-gradient(135deg,${T.navy},${T.navyMid})`,
              color: T.white,
              ...css.sans,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>

        </form>

        {/* LOGIN LINK */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ ...css.sans, fontSize: 13, color: T.grey4 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: T.gold, fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

      </AuthCard>
    </div>
  )
}