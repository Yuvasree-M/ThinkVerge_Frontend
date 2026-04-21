import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { T, css, injectFonts } from '../theme'

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

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    injectFonts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await login(form)
      const role = (data.role || data.user?.role || '').toString().toUpperCase()

      const dest =
        from ||
        (role === 'ADMIN'
          ? '/admin'
          : role === 'INSTRUCTOR'
          ? '/instructor'
          : '/student')

      navigate(dest, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || ''
      setError(msg || 'Invalid email or password')
    }
  }

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

     {/* LOGO + BRAND */}
<div style={{
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 28
}}>
  <Link to="/" style={{ textDecoration: 'none' }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer'
    }}>
      <img
        src="/logo.png"
        alt="ThinkVerge"
        style={{
          height: 40,
          objectFit: 'contain'
        }}
      />

      <span style={{
        ...css.serif,
        fontSize: 20,
        fontWeight: 700,
        color: T.navy,
        letterSpacing: '0.03em'
      }}>
        ThinkVerge
      </span>
    </div>
  </Link>
</div>

        {/* TITLE */}
        <h2 style={{
          ...css.serif,
          fontSize: 28,
          fontWeight: 700,
          color: T.navy,
          margin: '0 0 4px',
          textAlign: 'center'
        }}>
          Welcome back
        </h2>

        <p style={{
          ...css.sans,
          fontSize: 13,
          color: T.grey4,
          marginBottom: 24,
          textAlign: 'center'
        }}>
          Sign in to continue to your dashboard
        </p>

        {/* ERROR */}
        {error && (
          <div style={{
            marginBottom: 16,
            padding: '12px 14px',
            borderRadius: 12,
            fontSize: 13,
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.20)',
            color: '#dc2626',
            ...css.sans,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* EMAIL */}
          <div>
            <label style={{
              ...css.sans,
              fontSize: 11,
              fontWeight: 600,
              color: T.grey5,
              textTransform: 'uppercase'
            }}>
              Email Address
            </label>

            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: `1.5px solid ${T.grey2}`,
                background: T.grey1,
                ...css.sans,
                fontSize: 14,
                color: T.text,
                outline: 'none'
              }}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label style={{
              ...css.sans,
              fontSize: 11,
              fontWeight: 600,
              color: T.grey5,
              textTransform: 'uppercase'
            }}>
              Password
            </label>

            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: `1.5px solid ${T.grey2}`,
                background: T.grey1,
                ...css.sans,
                fontSize: 14,
                color: T.text,
                outline: 'none'
              }}
            />
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
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>

        </form>

        {/* REGISTER */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ ...css.sans, fontSize: 13, color: T.grey4 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: T.gold, fontWeight: 700, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>

      </AuthCard>
    </div>
  )
}