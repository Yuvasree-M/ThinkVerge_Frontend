import { Link } from 'react-router-dom'
import { T, css, SectionLabel, PageHeroBg } from './theme'

/* ─── Dashboard illustration panel ──────────────────────────── */
function HeroIllustration() {
  const modules = [
    { label: 'Hooks & State',  done: true },
    { label: 'Context API',    done: true },
    { label: 'React Router',   done: true },
    { label: 'Performance',    done: false, active: true },
    { label: 'Testing',        done: false },
    { label: 'Deployment',     done: false },
  ]
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 460 }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%',
        borderRadius: '40%', background: 'radial-gradient(ellipse, rgba(184,150,62,0.18), transparent 70%)',
        filter: 'blur(24px)', pointerEvents: 'none',
      }} />

      {/* Main card */}
      <div style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 24, padding: '26px 24px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.30)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ ...css.sans, fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Course</p>
            <p style={{ ...css.serif, fontSize: 17, fontWeight: 600, color: '#fff', margin: 0 }}>React Masterclass</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${T.gold},${T.goldL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚛️</div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ ...css.sans, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Module 4 of 6</span>
            <span style={{ ...css.sans, fontSize: 12, fontWeight: 600, color: T.goldL }}>68%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.10)', borderRadius: 99 }}>
            <div style={{ width: '68%', height: '100%', background: `linear-gradient(90deg,${T.gold},${T.goldL})`, borderRadius: 99 }} />
          </div>
        </div>

        {/* Module list */}
        {modules.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0',
            borderBottom: i < modules.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: m.done ? `linear-gradient(135deg,${T.gold},${T.goldL})` : m.active ? 'rgba(184,150,62,0.20)' : 'rgba(255,255,255,0.08)',
              border: m.active ? `1.5px solid ${T.goldL}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff',
            }}>
              {m.done ? '✓' : m.active ? '▶' : ''}
            </div>
            <span style={{
              ...css.sans, fontSize: 13,
              color: m.done ? 'rgba(255,255,255,0.70)' : m.active ? '#fff' : 'rgba(255,255,255,0.35)',
              fontWeight: m.active ? 600 : 400,
            }}>{m.label}</span>
            {m.active && (
              <span style={{
                marginLeft: 'auto', ...css.sans, fontSize: 9, fontWeight: 700,
                color: T.gold, textTransform: 'uppercase', letterSpacing: '0.1em',
                background: 'rgba(184,150,62,0.15)', padding: '2px 8px', borderRadius: 20,
              }}>In Progress</span>
            )}
          </div>
        ))}

        {/* Score badge */}
        <div style={{
          marginTop: 18, background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14,
          padding: '12px 15px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(27,107,74,0.30)', border: '1px solid rgba(34,197,94,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏆</div>
          <div>
            <p style={{ ...css.sans, fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Last Quiz Score</p>
            <p style={{ ...css.sans, fontSize: 16, fontWeight: 700, color: '#4ade80', margin: '1px 0 0' }}>92 / 100</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ ...css.sans, fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Grade</p>
            <p style={{ ...css.sans, fontSize: 13, fontWeight: 700, color: T.goldL, margin: '1px 0 0' }}>Distinction</p>
          </div>
        </div>
      </div>

      {/* Floating cert badge */}
      <div style={{
        position: 'absolute', bottom: -18, left: -18,
        background: T.white, border: `1.5px solid ${T.borderG}`,
        borderRadius: 16, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 10px 32px rgba(13,27,42,0.20)',
      }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${T.gold},${T.goldL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎓</div>
        <div>
          <p style={{ ...css.sans, fontSize: 11, fontWeight: 700, color: T.navy, margin: 0 }}>Certificate Ready</p>
          <p style={{ ...css.sans, fontSize: 10, color: T.grey4, margin: '1px 0 0' }}>QR-verified · Shareable</p>
        </div>
      </div>

      {/* Floating learner count */}
      <div style={{
        position: 'absolute', top: -16, right: -16,
        background: T.white, border: `1.5px solid ${T.border}`,
        borderRadius: 14, padding: '8px 13px',
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 8px 24px rgba(13,27,42,0.16)',
      }}>
        <div style={{ display: 'flex' }}>
          {['#0D1B2A', '#2B4260', '#3A5F82'].map((c, i) => (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: '50%', background: c,
              border: `2px solid ${T.white}`, marginLeft: i ? -7 : 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...css.sans, fontSize: 8, fontWeight: 700, color: '#fff',
            }}>
              {['A', 'B', 'C'][i]}
            </div>
          ))}
        </div>
        <div>
          <p style={{ ...css.sans, fontSize: 11, fontWeight: 700, color: T.navy, margin: 0 }}>10K+ Learners</p>
          <p style={{ ...css.sans, fontSize: 10, color: T.grey4, margin: '1px 0 0' }}>Actively enrolled</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Hero ───────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <PageHeroBg style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 80px' }}>
      {/* Bounce scroll hint */}
      <style>{`@keyframes tvBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}.tv-fadein{animation:tvFadeUp .6s ease both}@keyframes tvFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}`}</style>

      <div style={{ maxWidth: 1160, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, alignItems: 'center' }}>

          {/* Left: copy */}
          <div className="tv-fadein" style={{ maxWidth: 560 }}>
            <SectionLabel>World-Class Online Learning</SectionLabel>

            <h1 style={{
              ...css.serif, fontSize: 'clamp(40px,6vw,72px)', fontWeight: 700,
              color: T.white, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 22px',
            }}>
              Master Skills That<br />
              <em style={{ fontStyle: 'italic', color: T.goldL }}>Shape Careers</em>
            </h1>

            <p style={{ ...css.sans, fontSize: 'clamp(14px,1.8vw,17px)', color: 'rgba(255,255,255,0.58)', lineHeight: 1.78, maxWidth: 480, margin: '0 0 36px' }}>
              Join thousands of learners on ThinkVerge — structured courses, expert instructors,
              and a certificate that proves you've truly mastered your craft.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" style={{ ...css.sans, fontWeight: 600, fontSize: 14, color: T.white, textDecoration: 'none', padding: '13px 28px', borderRadius: 10, background: `linear-gradient(135deg,${T.gold},${T.goldL})`, boxShadow: '0 6px 22px rgba(184,150,62,0.32)' }}>
                Enrol Now →
              </Link>
              <a href="#how" onClick={e => { e.preventDefault(); document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={{ ...css.sans, fontWeight: 600, fontSize: 14, color: T.white, textDecoration: 'none', padding: '13px 28px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.20)' }}>
                How It Works
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, marginTop: 50, flexWrap: 'wrap' }}>
              {[['10K+', 'Students'], ['50+', 'Courses'], ['98%', 'Completion'], ['4.9★', 'Rating']].map(([n, l]) => (
                <div key={l}>
                  <p style={{ ...css.serif, fontSize: 26, fontWeight: 700, color: T.goldL, margin: 0 }}>{n}</p>
                  <p style={{ ...css.sans, fontSize: 10, color: 'rgba(255,255,255,0.38)', margin: '4px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 20px' }}>
            <HeroIllustration />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 30, left: '50%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        opacity: 0.32, animation: 'tvBounce 2.2s infinite',
      }}>
        <span style={{ ...css.sans, fontSize: 10, color: T.white, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: 1, height: 28, background: `linear-gradient(${T.white}, transparent)` }} />
      </div>
    </PageHeroBg>
  )
}