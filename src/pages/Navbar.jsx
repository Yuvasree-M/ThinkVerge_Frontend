import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { T, css, UserIcon } from './theme'

const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'How It Works', href: '#how' },
  { label: 'Instructors',  href: '#instructors' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Contact',      href: '#contact' },
]

function scrollTo(href) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

function UserDropdown({ onClose }) {
  const dropPanel = {
    position: 'absolute', top: 48, right: 0,
    background: T.white, border: `1.5px solid ${T.border}`,
    borderRadius: 16, padding: 8, minWidth: 188,
    boxShadow: '0 12px 40px rgba(13,27,42,0.14)', zIndex: 200,
  }
  const itemStyle = {
    ...css.sans, display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 14, fontWeight: 500, color: T.text,
    textDecoration: 'none', padding: '10px 14px', borderRadius: 10,
    transition: 'background .15s',
  }
  return (
    <div className="tv-dropin" style={dropPanel}>
      <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${T.grey2}`, marginBottom: 6 }}>
        <p style={{ ...css.sans, fontSize: 11, fontWeight: 700, color: T.grey4, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Account</p>
      </div>
      <Link to="/login" onClick={onClose} className="tv-drop-item" style={itemStyle}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: T.grey1, border: `1px solid ${T.grey2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <UserIcon color={T.navy} size={14} />
        </span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.navy }}>Login</p>
          <p style={{ margin: 0, fontSize: 11, color: T.grey4 }}>Access your account</p>
        </div>
      </Link>
      <div style={{ height: 1, background: T.grey2, margin: '4px 8px' }} />
      <Link to="/register" onClick={onClose} className="tv-drop-item" style={itemStyle}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${T.gold},${T.goldL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.navy }}>Get Started</p>
          <p style={{ margin: 0, fontSize: 11, color: T.grey4 }}>Create a new account</p>
        </div>
      </Link>
    </div>
  )
}

export default function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deskUserOpen, setDeskUserOpen] = useState(false)
  const [mobUserOpen, setMobUserOpen] = useState(false)
  const deskRef = useRef(null)
  const mobRef = useRef(null)

  useEffect(() => {
    const h = e => {
      if (deskRef.current && !deskRef.current.contains(e.target)) setDeskUserOpen(false)
      if (mobRef.current && !mobRef.current.contains(e.target)) setMobUserOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const navBg      = scrolled ? 'rgba(244,246,248,0.97)' : 'transparent'
  const navBorder  = scrolled ? `1px solid ${T.border}` : 'none'
  const navShadow  = scrolled ? '0 2px 20px rgba(13,27,42,0.08)' : 'none'
  const logoColor  = scrolled ? T.navy : T.white
  const linkColor  = scrolled ? T.text2 : 'rgba(255,255,255,0.80)'
  const iconStroke = scrolled ? T.navy : '#fff'
  const iconBg     = scrolled ? T.grey2 : 'rgba(255,255,255,0.15)'
  const iconBorder = scrolled ? T.border : 'rgba(255,255,255,0.25)'

  const iconBtn = (active, onClick, ref, size = 38) => ({
    ref, onClick,
    style: {
      width: size, height: size, borderRadius: '50%',
      background: active ? (scrolled ? 'rgba(184,150,62,0.12)' : 'rgba(255,255,255,0.22)') : iconBg,
      border: `1.5px solid ${active ? T.gold : iconBorder}`,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all .2s', padding: 0, outline: 'none',
    },
  })

  return (
    <>
      <style>{`
        @media(max-width:900px){.tv-desk{display:none!important}.tv-mob{display:flex!important}}
        .tv-navlink:hover{color:${T.gold}!important}
        .tv-user-btn:hover{background:rgba(184,150,62,0.10)!important}
        .tv-drop-item:hover{background:${T.grey1}!important}
        @keyframes tvBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
        @keyframes menuSlide{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
        .tv-mob-open{animation:menuSlide .22s ease both}
        .tv-ham-line{display:block;width:20px;height:1.5px;border-radius:2px;transition:all .3s}
        @keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
        .tv-dropin{animation:dropIn .18s ease both}
        @keyframes tvFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        .tv-fadein{animation:tvFadeUp .6s ease both}
      `}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.3s ease', background: navBg,
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: navBorder, boxShadow: navShadow,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 66, padding: '0 24px', gap: 8 }}>
          {/* Logo */}
          <a href="#home" onClick={e => { e.preventDefault(); scrollTo('#home') }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 'auto' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${T.gold},${T.goldL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎓</div>
            <span style={{ ...css.serif, fontWeight: 700, fontSize: 20, color: logoColor, letterSpacing: '0.02em', transition: 'color .3s' }}>ThinkVerge</span>
          </a>

          {/* Desktop links */}
          <div className="tv-desk" style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="tv-navlink"
                onClick={e => { e.preventDefault(); scrollTo(l.href) }}
                style={{ ...css.sans, fontSize: 13, fontWeight: 500, color: linkColor, textDecoration: 'none', padding: '6px 11px', borderRadius: 7, transition: 'color 0.2s' }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop user icon */}
          <div className="tv-desk" ref={deskRef} style={{ position: 'relative', marginLeft: 14 }}>
            <button className="tv-user-btn" onClick={() => setDeskUserOpen(v => !v)} aria-label="Account"
              style={{ width: 38, height: 38, borderRadius: '50%', background: deskUserOpen ? 'rgba(184,150,62,0.12)' : iconBg, border: `1.5px solid ${deskUserOpen ? T.gold : iconBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', padding: 0, outline: 'none' }}>
              <UserIcon color={iconStroke} size={17} />
            </button>
            {deskUserOpen && <UserDropdown onClose={() => setDeskUserOpen(false)} />}
          </div>

          {/* Mobile controls */}
          <div className="tv-mob" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
            <div ref={mobRef} style={{ position: 'relative' }}>
              <button className="tv-user-btn" onClick={() => setMobUserOpen(v => !v)} aria-label="Account"
                style={{ width: 36, height: 36, borderRadius: '50%', background: mobUserOpen ? 'rgba(184,150,62,0.12)' : iconBg, border: `1.5px solid ${mobUserOpen ? T.gold : iconBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', padding: 0 }}>
                <UserIcon color={iconStroke} size={16} />
              </button>
              {mobUserOpen && <UserDropdown onClose={() => setMobUserOpen(false)} />}
            </div>
            <button onClick={() => setMenuOpen(v => !v)} aria-label="Menu"
              style={{ width: 36, height: 36, borderRadius: 9, background: iconBg, border: `1.5px solid ${iconBorder}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 0, transition: 'all .2s' }}>
              <span className="tv-ham-line" style={{ background: iconStroke, transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
              <span className="tv-ham-line" style={{ background: iconStroke, opacity: menuOpen ? 0 : 1 }} />
              <span className="tv-ham-line" style={{ background: iconStroke, transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="tv-mob-open" style={{ background: 'rgba(244,246,248,0.98)', backdropFilter: 'blur(14px)', borderTop: `1px solid ${T.border}`, padding: '14px 24px 22px' }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href}
                onClick={e => { e.preventDefault(); scrollTo(l.href); setMenuOpen(false) }}
                style={{ ...css.sans, display: 'block', fontSize: 15, fontWeight: 500, color: T.text2, textDecoration: 'none', padding: '11px 0', borderBottom: `1px solid ${T.border}` }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}