import { T, css, SectionLabel } from './theme'

/* ─── About ─────────────────────────────────────────────────── */
export function About() {
  const features = [
    { icon: '🎯', title: 'Structured Learning', desc: 'Step-by-step modules with quizzes to reinforce every concept.' },
    { icon: '🏆', title: 'Certified Outcomes', desc: 'Earn verifiable certificates with QR codes after completing courses.' },
    { icon: '👨‍🏫', title: 'Expert Instructors', desc: 'Learn directly from industry practitioners and certified educators.' },
    { icon: '📊', title: 'Track Progress', desc: 'Real-time dashboards show exactly where you are on your journey.' },
  ]
  return (
    <section id="about" style={{ padding: '100px 24px', background: T.white }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <SectionLabel>About ThinkVerge</SectionLabel>
            <h2 style={{ ...css.serif, fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, color: T.navy, lineHeight: 1.18, margin: '0 0 22px' }}>
              Learning Redefined for the Modern Age
            </h2>
            <p style={{ ...css.sans, fontSize: 16, color: T.text2, lineHeight: 1.82, marginBottom: 18 }}>
              ThinkVerge is a premium learning management platform built for serious learners and passionate educators.
              We believe that structured, certified learning creates real career impact.
            </p>
            <p style={{ ...css.sans, fontSize: 16, color: T.text2, lineHeight: 1.82 }}>
              Our platform connects students with expert instructors through a rigorous course system — with module quizzes,
              final exams, assignments, and verifiable certificates.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {features.map(f => (
              <div key={f.title}
                style={{ background: T.grey1, border: `1.5px solid ${T.grey2}`, borderRadius: 16, padding: '22px 20px', transition: 'all 0.22s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderG; e.currentTarget.style.boxShadow = '0 6px 22px rgba(13,27,42,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.grey2; e.currentTarget.style.boxShadow = 'none' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 12 }}>{f.icon}</span>
                <p style={{ ...css.sans, fontSize: 14, fontWeight: 600, color: T.navy, margin: '0 0 6px' }}>{f.title}</p>
                <p style={{ ...css.sans, fontSize: 13, color: T.grey5, margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Mission & Vision ───────────────────────────────────────── */
export function MissionVision() {
  return (
    <section style={{ padding: '80px 24px', background: T.grey1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <SectionLabel>Our Purpose</SectionLabel>
          <h2 style={{ ...css.serif, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: T.navy, margin: 0 }}>
            Mission &amp; Vision
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22 }}>
          {[
            { icon: '🚀', label: 'Our Mission', accent: T.gold, text: 'To democratise access to world-class education by connecting passionate learners with expert instructors — delivering structured, certified, and career-transforming learning experiences that are accessible anywhere.' },
            { icon: '🌍', label: 'Our Vision',  accent: T.blue, text: 'A world where every motivated learner, regardless of geography or background, can master in-demand skills, earn recognised credentials, and unlock opportunities through knowledge.' },
          ].map(card => (
            <div key={card.label} style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: 36, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -16, right: -16, fontSize: 80, opacity: 0.05 }}>{card.icon}</div>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: `${card.accent}14`, border: `1.5px solid ${card.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 18 }}>
                {card.icon}
              </div>
              <p style={{ ...css.sans, fontSize: 10, fontWeight: 700, color: card.accent, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>{card.label}</p>
              <p style={{ ...css.sans, fontSize: 15, color: T.text2, lineHeight: 1.80, margin: 0 }}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ───────────────────────────────────────────── */
export function HowItWorks() {
  const steps = [
    { n: '01', icon: '🔍', title: 'Browse Courses',         desc: 'Explore our catalogue of expert-designed courses across technology, business, design and more.' },
    { n: '02', icon: '📝', title: 'Enrol & Get Approved',   desc: 'Request enrolment — your instructor reviews and approves you into the course within 24 hours.' },
    { n: '03', icon: '📖', title: 'Learn Module by Module', desc: 'Work through structured lessons (video, PDF, text). Each module unlocks when you pass its quiz.' },
    { n: '04', icon: '✅', title: 'Pass the Final Exam',    desc: 'After all modules, take the cumulative final exam to demonstrate your mastery.' },
    { n: '05', icon: '📋', title: 'Submit Assignments',     desc: 'Complete practical assignments graded personally by your instructor for real feedback.' },
    { n: '06', icon: '🎓', title: 'Earn Your Certificate',  desc: 'Pass everything and your verifiable, QR-coded certificate is issued automatically.' },
  ]
  return (
    <section id="how" style={{ padding: '100px 24px', background: T.white }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <SectionLabel>The Journey</SectionLabel>
          <h2 style={{ ...css.serif, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>
            How ThinkVerge Works
          </h2>
          <p style={{ ...css.sans, fontSize: 16, color: T.grey4, maxWidth: 460, margin: '0 auto' }}>
            Six clear steps from curious beginner to certified expert
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18 }}>
          {steps.map(s => (
            <div key={s.n}
              style={{ position: 'relative', background: T.grey1, border: `1.5px solid ${T.grey2}`, borderRadius: 18, padding: '26px 22px', overflow: 'hidden', transition: 'all 0.22s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderG; e.currentTarget.style.background = T.white; e.currentTarget.style.boxShadow = '0 8px 26px rgba(13,27,42,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.grey2; e.currentTarget.style.background = T.grey1; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ position: 'absolute', top: 10, right: 14, ...css.serif, fontSize: 52, fontWeight: 700, color: 'rgba(13,27,42,0.04)', lineHeight: 1 }}>{s.n}</div>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 14 }}>{s.icon}</span>
              <p style={{ ...css.sans, fontSize: 14, fontWeight: 600, color: T.navy, margin: '0 0 8px' }}>{s.title}</p>
              <p style={{ ...css.sans, fontSize: 13, color: T.grey5, margin: 0, lineHeight: 1.70 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}