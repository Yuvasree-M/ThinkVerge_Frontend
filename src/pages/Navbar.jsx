import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { T, css, UserIcon } from './theme'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how' },
  { label: 'Instructors', href: '#instructors' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

/* ✅ SCROLL WITH OFFSET */
function scrollToSection(href) {
  if (href === '#home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const el = document.querySelector(href)
  if (!el) return

  const yOffset = -80
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset

  window.scrollTo({ top: y, behavior: 'smooth' })
}

/* ---------------- USER DROPDOWN ---------------- */
function UserDropdown({ onClose }) {
  return (
    <div style={{
      position: 'absolute',
      top: 48,
      right: 0,
      background: T.white,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: 8,
      minWidth: 200,
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      zIndex: 200,
    }}>
      <Link to="/login" onClick={onClose} style={dropItem}>
        <UserIcon size={16} color={T.navy} />
        Login
      </Link>

      <Link to="/register" onClick={onClose} style={dropItem}>
        <div style={goldIcon}>+</div>
        Register
      </Link>
    </div>
  )
}

const dropItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  borderRadius: 10,
  textDecoration: 'none',
  color: '#0D1B2A',
  fontSize: 13,
  fontWeight: 500,
}

const goldIcon = {
  width: 22,
  height: 22,
  borderRadius: 6,
  background: 'linear-gradient(135deg,#B8963E,#E5C76B)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 700
}

/* ---------------- NAVBAR ---------------- */
export default function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [active, setActive] = useState('#home')

  const userRef = useRef(null)
  const navigate = useNavigate() // ✅ FIXED

  /* close dropdown */
  useEffect(() => {
    const h = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  /* scroll spy */
  useEffect(() => {
    const onScroll = () => {
      let current = '#home'
      NAV_LINKS.forEach(link => {
        const el = document.querySelector(link.href)
        if (el && el.getBoundingClientRect().top < 120) {
          current = link.href
        }
      })
      setActive(current)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkStyle = (href) => ({
    ...css.sans,
    fontSize: 13,
    fontWeight: 500,
    padding: '6px 10px',
    borderRadius: 8,
    textDecoration: 'none',
    transition: '0.2s',
    color: active === href
      ? T.gold
      : scrolled ? T.text : '#fff',
    borderBottom: active === href ? `2px solid ${T.gold}` : '2px solid transparent'
  })

  return (
    <>
      <style>{`
        .tv-link:hover { color:#B8963E!important }
        .tv-mobile-link:hover {
          background: rgba(184,150,62,0.08);
          color:#B8963E;
        }
        @media(max-width:900px){
          .tv-desk{display:none!important}
          .tv-mob{display:flex!important}
        }
      `}</style>

      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      }}>

        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          height: 70,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px'
        }}>

          {/* LOGO */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()

              if (window.location.pathname !== '/') {
                navigate('/')
                setTimeout(() => scrollToSection('#home'), 150)
              } else {
                scrollToSection('#home')
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginRight: 'auto',
              textDecoration: 'none'
            }}
          >
            <img
  src="/logo.png"
  alt="ThinkVerge"
  style={{
    width: 40,
    height: 40,
    objectFit: 'cover',
    borderRadius: '50%',
    border: `2px solid ${T.grey2}` // optional nice touch
  }}
/>

            <span style={{
              ...css.serif,
              fontSize: 20,
              fontWeight: 700,
              color: scrolled ? T.navy : '#fff'
            }}>
              ThinkVerge
            </span>
          </a>

          {/* DESKTOP LINKS */}
          <div className="tv-desk" style={{ display: 'flex', gap: 6 }}>
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="tv-link"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(l.href)
                }}
                style={linkStyle(l.href)}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* USER */}
          <div ref={userRef} style={{ marginLeft: 16, position: 'relative' }}>
            <button onClick={() => setUserOpen(v => !v)} style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: `1px solid rgba(184,150,62,0.35)`,
              background: 'rgba(255,255,255,0.9)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserIcon size={18} color={T.navy} />
            </button>

            {userOpen && <UserDropdown onClose={() => setUserOpen(false)} />}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="tv-mob" style={{ display: 'none', marginLeft: 10 }}>
            <button onClick={() => setMenuOpen(v => !v)} style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 4,
              alignItems: 'center'
            }}>
              <span style={{
                width: 18, height: 2, background: T.navy,
                transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : ''
              }} />
              <span style={{
                width: 18, height: 2, background: T.navy,
                opacity: menuOpen ? 0 : 1
              }} />
              <span style={{
                width: 18, height: 2, background: T.navy,
                transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : ''
              }} />
            </button>
          </div>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={{ background: '#fff', padding: 14 }}>
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(l.href)
                  setMenuOpen(false)
                }}
                className="tv-mobile-link"
                style={{
                  display: 'block',
                  padding: '12px 10px',
                  color: T.text,
                  textDecoration: 'none'
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

      </nav>
    </>
  )
}