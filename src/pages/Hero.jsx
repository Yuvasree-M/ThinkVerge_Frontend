import { Link } from 'react-router-dom'
import { T, css, SectionLabel, PageHeroBg } from './theme'

export default function Hero() {
  return (
    <PageHeroBg
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px',
        position: 'relative',

        /* 👇 your background image */
        backgroundImage: "url('/hero.jpg')", // change path here
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(13,27,42,0.65)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          maxWidth: 900,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <SectionLabel>World-Class Online Learning</SectionLabel>

        <h1
          style={{
            ...css.serif,
            fontSize: 'clamp(38px, 5vw, 64px)',
            fontWeight: 700,
            color: T.white,
            lineHeight: 1.1,
            margin: '14px 0 18px',
            letterSpacing: '-0.02em',
          }}
        >
          Learn Skills That
          <br />
          <em style={{ fontStyle: 'italic', color: T.goldL }}>
            Shape Your Future
          </em>
        </h1>

        <p
          style={{
            ...css.sans,
            fontSize: 'clamp(15px, 1.6vw, 17px)',
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.8,
            maxWidth: 620,
            margin: '0 auto 32px',
          }}
        >
          Structured courses, expert instructors, and verified certificates —
          everything you need to grow your career in one platform.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/register"
            style={{
              ...css.sans,
              fontWeight: 600,
              fontSize: 14,
              color: T.white,
              textDecoration: 'none',
              padding: '13px 28px',
              borderRadius: 10,
              background: `linear-gradient(135deg,${T.gold},${T.goldL})`,
              boxShadow: '0 10px 30px rgba(184,150,62,0.25)',
            }}
          >
            Get Started →
          </Link>

          <a
            href="#how"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              ...css.sans,
              fontWeight: 600,
              fontSize: 14,
              color: T.white,
              textDecoration: 'none',
              padding: '13px 28px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.30)',
            }}
          >
            How It Works
          </a>
        </div>
      </div>
    </PageHeroBg>
  )
}