/* ─── ThinkVerge Design System ─────────────────────────────── */

export const T = {
  navy:    '#063c75',
  navy2:   '#22416b',
  navy3:   '#0a0466',
  navyMid: '#163358',
  blue:    '#3A5F82',
  blueL:   '#3a75a1',
  grey1:   '#F4F6F8',
  grey2:   '#E8ECF0',
  grey3:   '#D0D7DF',
  grey4:   '#9BAAB8',
  grey5:   '#6B7D8F',
  grey6:   '#4A5A6B',
  gold:    '#B8963E',
  goldL:   '#D4AF5A',
  goldBg:  'rgba(184,150,62,0.08)',
  white:   '#FFFFFF',
  bg:      '#F4F6F8',
  text:    '#0D1B2A',
  text2:   '#4A5A6B',
  text3:   '#7A8A9A',
  border:  'rgba(13,27,42,0.10)',
  borderG: 'rgba(184,150,62,0.30)',
}

export const css = {
  serif: { fontFamily: "'Cormorant Garamond', serif" },
  sans:  { fontFamily: "'DM Sans', sans-serif" },
}

export const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap'

/** Inject Google Fonts once */
export function injectFonts() {
  if (!document.getElementById('tv-fonts')) {
    const link = document.createElement('link')
    link.id = 'tv-fonts'
    link.rel = 'stylesheet'
    link.href = FONT_LINK
    document.head.appendChild(link)
  }
}

/* ─── Shared primitives ──────────────────────────────────────── */

/** Pill section label */
export function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      border: `1px solid ${T.borderG}`, borderRadius: 40,
      padding: '5px 16px', marginBottom: 16,
      background: T.goldBg,
    }}>
      <span style={{
        ...css.sans, fontSize: 10, fontWeight: 700, color: T.gold,
        letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>
        {children}
      </span>
    </div>
  )
}

/** Avatar with initials fallback */
export function Avatar({ name, image, size = 48 }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const palette = ['#0D1B2A', '#162233', '#1E2F42', '#2B4260', '#3A5F82']
  const bg = palette[(name || '').charCodeAt(0) % palette.length]
  if (image) return (
    <img src={image} alt={name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  )
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 600, fontSize: size * 0.36, flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {initials}
    </div>
  )
}

/** Star row */
export function Stars({ count = 5, size = 13 }) {
  const n = Math.max(1, Math.min(5, count))
  return (
    <span style={{ fontSize: size, color: T.gold, letterSpacing: 1 }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

/** Grade badge */
export function GradeBadge({ label, score }) {
  const bg = !score || score >= 90 ? '#1B6B4A' : score >= 75 ? T.navyMid : T.blue
  return (
    <span style={{
      background: bg, color: '#fff', fontSize: 9, fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: '3px 10px', borderRadius: 20, fontFamily: "'DM Sans', sans-serif",
    }}>
      {label}
    </span>
  )
}

/** User icon SVG */
export function UserIcon({ color = '#fff', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

/** Shared dark hero background used across Hero, Login, Register */
export function PageHeroBg({ children, style = {} }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: `linear-gradient(150deg, ${T.navy} 0%, ${T.navy2} 45%, ${T.navy3} 100%)`,
      ...style,
    }}>
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(184,150,62,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(184,150,62,0.05) 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
      }} />
      {/* Radial glow top-right */}
      <div style={{
        position: 'absolute', top: -160, right: -80,
        width: 560, height: 560, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(184,150,62,0.10), transparent 70%)`,
        pointerEvents: 'none',
      }} />
      {/* Radial glow bottom-left */}
      <div style={{
        position: 'absolute', bottom: -80, left: -100,
        width: 380, height: 380, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(58,95,130,0.18), transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

/** ThinkVerge logo mark + wordmark */
export function Brand({ light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: `linear-gradient(135deg,${T.gold},${T.goldL})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
      }}>🎓</div>
      <div>
        <p style={{
          ...css.serif, fontWeight: 700, fontSize: 17, margin: 0,
          color: light ? T.white : T.navy,
        }}>ThinkVerge</p>
        <p style={{
          ...css.sans, fontSize: 10, margin: 0,
          color: light ? 'rgba(255,255,255,0.45)' : T.grey4,
        }}>Learning Management System</p>
      </div>
    </div>
  )
}