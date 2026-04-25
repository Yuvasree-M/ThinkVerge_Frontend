import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../api/services'
import { T, css, SectionLabel, Avatar, Stars, GradeBadge } from './theme'

/* ─── Testimonials ───────────────────────────────────────────── */
function TestimonialCard({ t, onClick }) {
  const name = t.studentName || t.name || 'Student'
  const starCount = t.rating || (t.averageScore >= 90 ? 5 : 4)
  const displayText = t.message
    ? `"${t.message.length > 120 ? t.message.slice(0, 117) + '…' : t.message}"`
    : `"Completed ${t.courseTitle || 'this course'} — an incredible journey that truly prepared me for real-world challenges."`
  return (
    <div onClick={() => onClick(t)}
      style={{ flexShrink: 0, width: 296, background: T.white, border: `1.5px solid ${T.grey2}`, borderRadius: 18, padding: 22, cursor: 'pointer', transition: 'all 0.22s', marginRight: 18 }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderG; e.currentTarget.style.boxShadow = '0 10px 28px rgba(13,27,42,0.07)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.grey2; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
        <Avatar name={name} image={t.profileImage} size={42} />
        <div>
          <p style={{ ...css.sans, fontSize: 13, fontWeight: 600, color: T.navy, margin: 0 }}>{name}</p>
          <p style={{ ...css.sans, fontSize: 11, color: T.grey4, margin: '2px 0 0' }}>{t.courseTitle}</p>
        </div>
      </div>
      <Stars count={starCount} size={12} />
      <p style={{ ...css.sans, fontSize: 13, color: T.text2, lineHeight: 1.70, margin: '10px 0 13px', fontStyle: 'italic' }}>{displayText}</p>
      <GradeBadge label={t.gradeLabel || 'Student'} score={t.averageScore} />
    </div>
  )
}

function TestimonialModal({ t, onClose }) {
  if (!t) return null
  const name = t.studentName || t.name || 'Student'
  const starCount = t.rating || (t.averageScore >= 90 ? 5 : 4)
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(13,27,42,0.50)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 22, padding: 36, maxWidth: 440, width: '100%', position: 'relative', boxShadow: '0 24px 60px rgba(13,27,42,0.14)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: T.grey1, border: `1.5px solid ${T.border}`, borderRadius: 8, width: 30, height: 30, cursor: 'pointer', color: T.grey5, fontSize: 14 }}>✕</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <Avatar name={name} image={t.profileImage} size={60} />
          <div>
            <p style={{ ...css.serif, fontSize: 20, fontWeight: 700, color: T.navy, margin: 0 }}>{name}</p>
            <p style={{ ...css.sans, fontSize: 12, color: T.grey4, margin: '3px 0 6px' }}>{t.issuedAt || ''}</p>
            <GradeBadge label={t.gradeLabel || 'Student'} score={t.averageScore} />
          </div>
        </div>
        <div style={{ background: T.grey1, border: `1.5px solid ${T.grey2}`, borderRadius: 12, padding: '18px 20px', marginBottom: 18 }}>
          <Stars count={starCount} size={15} />
          <p style={{ ...css.sans, fontSize: 14, color: T.text2, lineHeight: 1.78, margin: '11px 0 0', fontStyle: 'italic' }}>
            {t.message ? `"${t.message}"` : `"Completing ${t.courseTitle} was a game-changer — structured modules, challenging quizzes, and expert feedback."`}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ ...css.sans, fontSize: 12, color: T.grey4, margin: 0 }}>Course</p>
            <p style={{ ...css.sans, fontSize: 14, fontWeight: 600, color: T.navy, margin: '2px 0 0' }}>{t.courseTitle || '—'}</p>
          </div>
          {t.averageScore && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ ...css.sans, fontSize: 12, color: T.grey4, margin: 0 }}>Avg Score</p>
              <p style={{ ...css.serif, fontSize: 22, fontWeight: 700, color: T.gold, margin: '2px 0 0' }}>{t.averageScore}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const FALLBACK_TESTIMONIALS = [
  { id: 'f1', name: 'Ananya Iyer',   courseTitle: 'Java Basics',         gradeLabel: 'Distinction', averageScore: 96, issuedAt: 'Mar 2026', rating: 5 },
  { id: 'f2', name: 'Raj Kumar',     courseTitle: 'Python Fundamentals', gradeLabel: 'Merit',       averageScore: 81, issuedAt: 'Feb 2026', rating: 4 },
  { id: 'f3', name: 'Leila Hassan',  courseTitle: 'React Masterclass',   gradeLabel: 'Distinction', averageScore: 94, issuedAt: 'Jan 2026', rating: 5 },
  { id: 'f4', name: 'Carlos Mendez', courseTitle: 'UI/UX Design',        gradeLabel: 'Merit',       averageScore: 78, issuedAt: 'Mar 2026', rating: 4 },
  { id: 'f5', name: 'Yuki Tanaka',   courseTitle: 'Data Science',        gradeLabel: 'Pass',        averageScore: 71, issuedAt: 'Apr 2026', rating: 3 },
]

export function Testimonials() {
  const [selected, setSelected] = useState(null)
  const { data: feedbacks = [] } = useQuery({
    queryKey: ['approved-feedback'],
    queryFn: () => publicApi.approvedFeedback().then(r => r.data).catch(() => []),
  })
  const items = feedbacks.length > 0 ? feedbacks : FALLBACK_TESTIMONIALS
  const doubled = [...items, ...items]

  useEffect(() => {
    const id = 'tv-scroll-style'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id
      s.textContent = `@keyframes tvScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.tv-track{animation:tvScroll ${Math.max(items.length * 5, 22)}s linear infinite;display:flex}.tv-track:hover{animation-play-state:paused}`
      document.head.appendChild(s)
    }
  }, [items.length])

  return (
    <section id="testimonials" style={{ padding: '100px 0', background: T.white, overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center', marginBottom: 52 }}>
        <SectionLabel>Student Stories</SectionLabel>
        <h2 style={{ ...css.serif, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>What Our Students Say</h2>
        <p style={{ ...css.sans, fontSize: 16, color: T.grey4, maxWidth: 440, margin: '0 auto' }}>Real feedback from students who completed our courses</p>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(90deg,${T.white},transparent)`, zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(-90deg,${T.white},transparent)`, zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ overflow: 'hidden', padding: '4px 0 8px' }}>
          <div className="tv-track" style={{ paddingLeft: 24 }}>
            {doubled.map((t, i) => <TestimonialCard key={`${t.id}-${i}`} t={t} onClick={setSelected} />)}
          </div>
        </div>
      </div>
      <TestimonialModal t={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

/* ─── FAQ ────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'Is ThinkVerge open to everyone?',                a: 'Yes — creating an account and browsing courses is open to all. Enrolment is subject to instructor approval.' },
  { q: 'How do I earn a certificate?',                   a: 'Complete all module lessons, pass each quiz, pass the final exam, and have assignments graded. Certificate is issued automatically.' },
  { q: 'Can I retake a quiz if I fail?',                 a: 'Absolutely. You can retake any module quiz or final exam as many times as needed. Your highest score is used.' },
  { q: 'How long does enrolment approval take?',         a: 'Instructors typically approve enrolment requests within 24–48 hours.' },
  { q: 'Are the certificates verifiable?',               a: 'Yes. Every certificate contains a unique QR code that links to a public verification page.' },
  { q: 'What types of content are included in courses?', a: 'Courses include video lessons, text, PDFs, image resources, quizzes, and graded assignments.' },
]

export function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" style={{ padding: '100px 24px', background: T.grey1 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{ ...css.serif, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: T.navy, margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((faq, i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)}
              style={{ background: T.white, border: `1.5px solid ${open === i ? T.borderG : T.border}`, borderRadius: 13, padding: '17px 20px', cursor: 'pointer', transition: 'all 0.22s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
                <p style={{ ...css.sans, fontSize: 15, fontWeight: 600, color: T.navy, margin: 0 }}>{faq.q}</p>
                <span style={{ color: T.gold, fontSize: 20, flexShrink: 0, transition: 'transform 0.25s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </div>
              {open === i && <p style={{ ...css.sans, fontSize: 14, color: T.text2, lineHeight: 1.76, margin: '13px 0 0' }}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const inputStyle = {
    width: '100%',
    background: T.grey1,
    border: `1.5px solid ${T.grey2}`,
    borderRadius: 10,
    padding: '12px 15px',
    ...css.sans,
    fontSize: 14,
    color: T.text,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all .2s'
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setSent(true)

    // ✅ auto return to form after success
    setTimeout(() => {
      setForm({ name: '', email: '', message: '' })
      setSent(false)
    }, 2000)
  }

  return (
    <section id="contact" style={{
      padding: '100px 24px',
      background: T.bg
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 style={{
            ...css.serif,
            fontSize: 'clamp(28px,4vw,42px)',
            fontWeight: 700,
            color: T.navy,
            margin: '0 0 10px'
          }}>
            Contact Us
          </h2>
          <p style={{ ...css.sans, fontSize: 15, color: T.grey4 }}>
            Have a question? We'd love to hear from you.
          </p>
        </div>

        {/* CARD */}
        <div style={{
          background: T.white,
          border: `1px solid ${T.grey2}`,
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(13,27,42,0.12)'
        }}>

          {sent ? (
            /* SUCCESS */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                margin: '0 auto 16px',
                background: 'rgba(27,107,74,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30
              }}>
                ✅
              </div>

              <h3 style={{
                ...css.serif,
                fontSize: 22,
                fontWeight: 700,
                color: T.navy,
                marginBottom: 8
              }}>
                Message Sent!
              </h3>

              <p style={{
                ...css.sans,
                fontSize: 14,
                color: T.grey4
              }}>
                We'll get back to you within 24 hours.
              </p>
            </div>

          ) : (
            /* FORM */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* NAME + EMAIL */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
                gap: 16
              }}>
                {[
                  { k: 'name', l: 'Your Name', t: 'text', p: 'Jane Doe' },
                  { k: 'email', l: 'Email Address', t: 'email', p: 'jane@example.com' }
                ].map(f => (
                  <div key={f.k}>
                    <label style={{
                      ...css.sans,
                      fontSize: 11,
                      fontWeight: 600,
                      color: T.grey4,
                      textTransform: 'uppercase',
                      marginBottom: 6,
                      display: 'block'
                    }}>
                      {f.l}
                    </label>

                    <input
                      type={f.t}
                      placeholder={f.p}
                      required
                      value={form[f.k]}
                      onChange={e => setForm(v => ({ ...v, [f.k]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = T.gold}
                      onBlur={e => e.target.style.borderColor = T.grey2}
                    />
                  </div>
                ))}
              </div>

              {/* MESSAGE */}
              <div>
                <label style={{
                  ...css.sans,
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.grey4,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  display: 'block'
                }}>
                  Message
                </label>

                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  required
                  value={form.message}
                  onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = T.gold}
                  onBlur={e => e.target.style.borderColor = T.grey2}
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                style={{
                  ...css.sans,
                  fontWeight: 600,
                  fontSize: 15,
                  color: T.white,
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px',
                  background: `linear-gradient(135deg,${T.navy},${T.navyMid})`,
                  cursor: 'pointer',
                  marginTop: 6,
                  transition: 'opacity .2s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Send Message →
              </button>

            </form>
          )}

        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────── */
export function Footer() {
  const scrollTo = href =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  const navItems = [
    ['Home', '#home'],
    ['About', '#about'],
    ['How It Works', '#how'],
    ['Instructors', '#instructors'],
    ['Testimonials', '#testimonials']
  ]

  return (
    <footer style={{
      background: T.navy,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '60px 24px 26px'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: 40,
          marginBottom: 48
        }}>

          {/* ✅ LOGO CHANGED TO IMAGE */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 14
            }}>
              <img
                src="/logo.png"
                alt="ThinkVerge"
                style={{
                  height: 32,
                  borderRadius: 10,
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            <p style={{
              ...css.sans,
              fontSize: 13,
              color: 'rgba(255,255,255,0.38)',
              lineHeight: 1.75
            }}>
              Premium online learning platform connecting passionate learners with expert instructors.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <p style={{
              ...css.sans,
              fontSize: 10,
              fontWeight: 700,
              color: T.gold,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              margin: '0 0 16px'
            }}>
              Platform
            </p>

            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={e => {
                  e.preventDefault()
                  scrollTo(href)
                }}
                style={{
                  ...css.sans,
                  display: 'block',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.42)',
                  textDecoration: 'none',
                  padding: '5px 0',
                  transition: 'color .2s'
                }}
                onMouseEnter={e => (e.target.style.color = T.goldL)}
                onMouseLeave={e =>
                  (e.target.style.color = 'rgba(255,255,255,0.42)')
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* SUPPORT */}
          <div>
            <p style={{
              ...css.sans,
              fontSize: 10,
              fontWeight: 700,
              color: T.gold,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              margin: '0 0 16px'
            }}>
              Support
            </p>

            {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(l => (
              <a
                key={l}
                href="#contact"
                onClick={e => {
                  e.preventDefault()
                  scrollTo('#contact')
                }}
                style={{
                  ...css.sans,
                  display: 'block',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.42)',
                  textDecoration: 'none',
                  padding: '5px 0',
                  transition: 'color .2s'
                }}
                onMouseEnter={e => (e.target.style.color = T.goldL)}
                onMouseLeave={e =>
                  (e.target.style.color = 'rgba(255,255,255,0.42)')
                }
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 22,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p style={{
            ...css.sans,
            fontSize: 12,
            color: 'rgba(255,255,255,0.25)',
            margin: 0
          }}>
            © 2026 ThinkVerge LMS. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/login" style={{
              ...css.sans,
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none'
            }}>
              Login
            </Link>

            <Link to="/register" style={{
              ...css.sans,
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none'
            }}>
              Register
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

/* ─── Scroll to Top ──────────────────────────────────────────── */
export function ScrollToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  if (!show) return null
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{ position: 'fixed', bottom: 26, right: 26, zIndex: 99, width: 42, height: 42, borderRadius: '50%', background: T.navy, border: `1.5px solid ${T.borderG}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px rgba(13,27,42,0.22)', color: T.goldL, fontWeight: 700, fontSize: 15 }}>
      ↑
    </button>
  )
}