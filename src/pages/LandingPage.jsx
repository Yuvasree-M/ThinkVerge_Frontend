// // src/pages/LandingPage.jsx
// import { Link } from "react-router-dom";

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4">
//       <h1 className="text-5xl font-bold mb-4 text-center">Welcome to ThinkVerge LMS</h1>
//       <p className="mb-8 text-lg max-w-xl text-center">
//         Learn, teach, and manage courses easily. Access your dashboard, track progress, and enroll in courses all in one place.
//       </p>
//       <div className="flex flex-wrap gap-4 justify-center">
//         <Link
//           to="/login"
//           className="px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-200 transition"
//         >
//           Login
//         </Link>
//         <Link
//           to="/register"
//           className="px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-200 transition"
//         >
//           Register
//         </Link>
//       </div>
//     </div>
//   );
// }

// src/pages/LandingPage.jsx
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../api/services'

// ─────────────────────────────────────────────────────────────
// DESIGN SYSTEM — navy/gold luxury academic theme
// Fonts: Playfair Display (display) + DM Sans (body)
// ─────────────────────────────────────────────────────────────

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:wght@300;400;500;600&display=swap'

// ── Avatar placeholder ────────────────────────────────────────
function Avatar({ name, image, size = 48, className = '' }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#1e3a5f','#7c3aed','#059669','#d97706','#dc2626','#0891b2']
  const bg = colors[(name || '').charCodeAt(0) % colors.length]
  if (image) return <img src={image} alt={name} width={size} height={size} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} className={className} />
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, color: 'white', fontSize: size * 0.38, flexShrink: 0 }} className={className}>
      {initials}
    </div>
  )
}

// ── Stars display ─────────────────────────────────────────────
function Stars({ score = 100, size = 14 }) {
  const filled = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : 2
  return (
    <span style={{ fontSize: size, color: '#f59e0b', letterSpacing: 2 }}>
      {'★'.repeat(filled)}{'☆'.repeat(5 - filled)}
    </span>
  )
}

// ── Grade badge ───────────────────────────────────────────────
function GradeBadge({ label, score }) {
  const bg = !score || score >= 90 ? '#059669' : score >= 75 ? '#2563eb' : '#7c3aed'
  return (
    <span style={{ background: bg, color: 'white', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 10px', borderRadius: 20 }}>
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: 'Home',       href: '#home' },
    { label: 'About',      href: '#about' },
    { label: 'How It Works', href: '#how' },
    { label: 'Instructors', href: '#instructors' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ',         href: '#faq' },
    { label: 'Contact',     href: '#contact' },
  ]

  const scrollTo = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10,18,40,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.2)' : 'none',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 68, gap: 8 }}>
        {/* Logo */}
        <a href="#home" onClick={e => scrollTo(e, '#home')} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 'auto' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#c9a84c,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 20, color: 'white', letterSpacing: '0.02em' }}>ThinkVerge</span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="nav-desktop">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#c9a84c'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
            >{l.label}</a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 8, marginLeft: 12 }} className="nav-desktop">
          <Link to="/login" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none', padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(201,168,76,0.5)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.background = 'rgba(201,168,76,0.15)'; e.target.style.borderColor = '#c9a84c' }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(201,168,76,0.5)' }}
          >Login</Link>
          <Link to="/register" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#0a1228', textDecoration: 'none', padding: '8px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#c9a84c,#f59e0b)', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.target.style.opacity = '0.88'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >Get Started</Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(v => !v)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'white' }} className="nav-mobile">
          <div style={{ width: 22, height: 2, background: 'currentColor', marginBottom: 5, borderRadius: 2, transition: 'transform 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <div style={{ width: 22, height: 2, background: 'currentColor', marginBottom: 5, borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <div style={{ width: 22, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(10,18,40,0.98)', borderTop: '1px solid rgba(201,168,76,0.2)', padding: '16px 24px 20px' }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)} style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{l.label}</a>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'white', textDecoration: 'none', padding: '10px', borderRadius: 8, border: '1px solid rgba(201,168,76,0.5)' }}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#0a1228', textDecoration: 'none', padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#c9a84c,#f59e0b)' }}>Register</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0a1228 0%,#0f1f45 50%,#1a1040 100%)', padding: '100px 24px 60px' }}>
      {/* Decorative circles */}
      {[{w:600,h:600,top:-200,right:-200,o:0.06},{w:400,h:400,bottom:-100,left:-100,o:0.05},{w:200,h:200,top:'40%',left:'10%',o:0.04}].map((c,i) => (
        <div key={i} style={{ position:'absolute', width:c.w, height:c.h, top:c.top, right:c.right, bottom:c.bottom, left:c.left, borderRadius:'50%', background:'radial-gradient(circle,#c9a84c,transparent)', opacity:c.o, pointerEvents:'none' }} />
      ))}
      {/* Grid lines */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:820, textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:40, padding:'6px 18px', marginBottom:28 }}>
          <span style={{ fontSize:12 }}>✦</span>
          <span style={{ fontFamily:'DM Sans, sans-serif', fontSize:13, fontWeight:500, color:'#c9a84c', letterSpacing:'0.06em' }}>WORLD-CLASS ONLINE LEARNING</span>
        </div>

        <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(40px, 7vw, 76px)', fontWeight:800, color:'white', lineHeight:1.1, margin:'0 0 24px', letterSpacing:'-0.02em' }}>
          Master Skills That<br />
          <span style={{ fontStyle:'italic', background:'linear-gradient(135deg,#c9a84c,#f59e0b)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Shape Careers</span>
        </h1>

        <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:'clamp(15px,2vw,18px)', color:'rgba(255,255,255,0.65)', lineHeight:1.7, marginBottom:40, maxWidth:560, margin:'0 auto 40px' }}>
          Join thousands of learners on ThinkVerge — structured courses, expert instructors, and a certificate that proves you've truly mastered your craft.
        </p>

        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/register" style={{ fontFamily:'DM Sans, sans-serif', fontWeight:700, fontSize:15, color:'#0a1228', textDecoration:'none', padding:'14px 32px', borderRadius:12, background:'linear-gradient(135deg,#c9a84c,#f59e0b)', boxShadow:'0 8px 24px rgba(201,168,76,0.35)', display:'flex', alignItems:'center', gap:8 }}>
            Start Learning Free →
          </Link>
          <a href="#how" onClick={e => { e.preventDefault(); document.querySelector('#how')?.scrollIntoView({ behavior:'smooth' }) }} style={{ fontFamily:'DM Sans, sans-serif', fontWeight:600, fontSize:15, color:'white', textDecoration:'none', padding:'14px 32px', borderRadius:12, border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', gap:8 }}>
            How It Works
          </a>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:40, justifyContent:'center', marginTop:64, flexWrap:'wrap' }}>
          {[['10K+','Students Enrolled'],['50+','Expert Courses'],['98%','Completion Rate'],['4.9★','Average Rating']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <p style={{ fontFamily:'Playfair Display, serif', fontSize:28, fontWeight:700, color:'#c9a84c', margin:0 }}>{n}</p>
              <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(255,255,255,0.5)', margin:'4px 0 0', letterSpacing:'0.06em', textTransform:'uppercase' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:0.5, animation:'bounce 2s infinite' }}>
        <span style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, color:'white', letterSpacing:'0.1em', textTransform:'uppercase' }}>Scroll</span>
        <div style={{ width:1, height:32, background:'linear-gradient(white,transparent)' }} />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding:'100px 24px', background:'#0a1228' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:60, alignItems:'center' }}>
          <div>
            <Label>About ThinkVerge</Label>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(28px,4vw,44px)', fontWeight:700, color:'white', lineHeight:1.2, margin:'16px 0 24px' }}>
              Learning Redefined for the Modern Age
            </h2>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.8, marginBottom:20 }}>
              ThinkVerge is a premium learning management platform built for serious learners and passionate educators. We believe that structured, certified learning creates real career impact.
            </p>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:16, color:'rgba(255,255,255,0.6)', lineHeight:1.8 }}>
              Our platform connects students with expert instructors through a rigorous course system — with module quizzes, final exams, assignments, and verifiable certificates.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { icon:'🎯', title:'Structured Learning', desc:'Step-by-step modules with quizzes to reinforce every concept.' },
              { icon:'🏆', title:'Certified Outcomes', desc:'Earn verifiable certificates with QR codes after completing courses.' },
              { icon:'👨‍🏫', title:'Expert Instructors', desc:'Learn directly from industry practitioners and certified educators.' },
              { icon:'📊', title:'Track Progress', desc:'Real-time dashboards show exactly where you are on your journey.' },
            ].map(card => (
              <div key={card.title} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:16, padding:24 }}>
                <span style={{ fontSize:28, display:'block', marginBottom:12 }}>{card.icon}</span>
                <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:14, fontWeight:600, color:'white', margin:'0 0 6px' }}>{card.title}</p>
                <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:13, color:'rgba(255,255,255,0.5)', margin:0, lineHeight:1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// MISSION & VISION
// ─────────────────────────────────────────────────────────────
function MissionVision() {
  return (
    <section style={{ padding:'80px 24px', background:'linear-gradient(135deg,#0f1f45,#1a1040)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <Label>Our Purpose</Label>
          <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:700, color:'white', margin:'16px 0 0' }}>Mission &amp; Vision</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
          {[
            {
              icon:'🚀', label:'Our Mission', color:'#c9a84c',
              text:'To democratise access to world-class education by connecting passionate learners with expert instructors — delivering structured, certified, and career-transforming learning experiences that are accessible anywhere.',
            },
            {
              icon:'🌍', label:'Our Vision', color:'#818cf8',
              text:'A world where every motivated learner, regardless of geography or background, can master in-demand skills, earn recognised credentials, and unlock opportunities through knowledge.',
            },
          ].map(card => (
            <div key={card.label} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${card.color}33`, borderRadius:20, padding:36, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-20, right:-20, fontSize:80, opacity:0.07 }}>{card.icon}</div>
              <div style={{ width:48, height:48, borderRadius:14, background:`${card.color}22`, border:`1px solid ${card.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:20 }}>{card.icon}</div>
              <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, fontWeight:700, color:card.color, letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 12px' }}>{card.label}</p>
              <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.8, margin:0 }}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n:'01', icon:'🔍', title:'Browse Courses', desc:'Explore our catalogue of expert-designed courses across technology, business, design and more.' },
    { n:'02', icon:'📝', title:'Enrol & Get Approved', desc:'Request enrolment — your instructor reviews and approves you into the course within 24 hours.' },
    { n:'03', icon:'📖', title:'Learn Module by Module', desc:'Work through structured lessons (video, PDF, text). Each module unlocks when you pass its quiz.' },
    { n:'04', icon:'✅', title:'Pass the Final Exam', desc:'After all modules, take the cumulative final exam to demonstrate your mastery.' },
    { n:'05', icon:'📋', title:'Submit Assignments', desc:'Complete practical assignments graded personally by your instructor for real feedback.' },
    { n:'06', icon:'🎓', title:'Earn Your Certificate', desc:'Pass everything and your verifiable, QR-coded certificate is issued automatically.' },
  ]

  return (
    <section id="how" style={{ padding:'100px 24px', background:'#0a1228' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <Label>The Journey</Label>
          <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:700, color:'white', margin:'16px 0 12px' }}>How ThinkVerge Works</h2>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:16, color:'rgba(255,255,255,0.5)', maxWidth:480, margin:'0 auto' }}>Six clear steps from curious beginner to certified expert</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ position:'relative', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:20, padding:'28px 24px', transition:'border-color 0.2s', overflow:'hidden' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'}
            >
              <div style={{ position:'absolute', top:12, right:16, fontFamily:'Playfair Display, serif', fontSize:48, fontWeight:800, color:'rgba(201,168,76,0.08)', lineHeight:1 }}>{s.n}</div>
              <span style={{ fontSize:30, display:'block', marginBottom:14 }}>{s.icon}</span>
              <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:15, fontWeight:700, color:'white', margin:'0 0 8px' }}>{s.title}</p>
              <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:13, color:'rgba(255,255,255,0.5)', margin:0, lineHeight:1.7 }}>{s.desc}</p>
              {i < steps.length - 1 && (
                <div style={{ position:'absolute', bottom:-1, right:24, width:20, height:20, background:'#c9a84c', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#0a1228', fontWeight:700 }}>↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// INSTRUCTORS
// ─────────────────────────────────────────────────────────────
function InstructorCard({ instructor, onClick }) {
  return (
    <div onClick={() => onClick(instructor)} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:20, padding:28, cursor:'pointer', transition:'all 0.25s', textAlign:'center' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
        <div style={{ position:'relative' }}>
          <Avatar name={instructor.name} image={instructor.profileImage} size={72} />
          <div style={{ position:'absolute', bottom:2, right:2, width:14, height:14, borderRadius:'50%', background:'#22c55e', border:'2px solid #0a1228' }} />
        </div>
      </div>
      <p style={{ fontFamily:'Playfair Display, serif', fontSize:17, fontWeight:700, color:'white', margin:'0 0 4px' }}>{instructor.name}</p>
      <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'#c9a84c', margin:'0 0 14px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{instructor.specialty}</p>
      <div style={{ display:'flex', justifyContent:'center', gap:20 }}>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:18, fontWeight:700, color:'white', margin:0 }}>{instructor.courseCount}</p>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, color:'rgba(255,255,255,0.45)', margin:'2px 0 0', textTransform:'uppercase', letterSpacing:'0.08em' }}>Courses</p>
        </div>
        <div style={{ width:1, background:'rgba(255,255,255,0.1)' }} />
        <div style={{ textAlign:'center' }}>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:18, fontWeight:700, color:'white', margin:0 }}>{instructor.studentCount}</p>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, color:'rgba(255,255,255,0.45)', margin:'2px 0 0', textTransform:'uppercase', letterSpacing:'0.08em' }}>Students</p>
        </div>
      </div>
    </div>
  )
}

function InstructorModal({ instructor, onClose }) {
  if (!instructor) return null
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'linear-gradient(135deg,#0f1f45,#1a1040)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:24, padding:40, maxWidth:460, width:'100%', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.08)', border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', color:'white', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <Avatar name={instructor.name} image={instructor.profileImage} size={88} />
        </div>
        <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:24, fontWeight:700, color:'white', textAlign:'center', margin:'0 0 6px' }}>{instructor.name}</h3>
        <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:13, color:'#c9a84c', textAlign:'center', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', margin:'0 0 24px' }}>{instructor.specialty}</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24 }}>
          {[['📚', instructor.courseCount, 'Courses'], ['👥', instructor.studentCount, 'Students'], ['⭐', '4.9', 'Rating']].map(([icon, val, label]) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.05)', borderRadius:12, padding:'16px 10px', textAlign:'center' }}>
              <span style={{ fontSize:20, display:'block', marginBottom:6 }}>{icon}</span>
              <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:20, fontWeight:700, color:'white', margin:0 }}>{val}</p>
              <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, color:'rgba(255,255,255,0.45)', margin:'3px 0 0', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.75, textAlign:'center', margin:0 }}>
          {instructor.name} is a passionate educator specialising in <strong style={{ color:'#c9a84c' }}>{instructor.specialty}</strong>. With {instructor.courseCount} course{instructor.courseCount !== 1 ? 's' : ''} on ThinkVerge, they have helped {instructor.studentCount} students advance their careers.
        </p>
        <Link to="/register" style={{ display:'block', marginTop:24, fontFamily:'DM Sans, sans-serif', fontSize:14, fontWeight:700, color:'#0a1228', textDecoration:'none', padding:'12px', borderRadius:12, background:'linear-gradient(135deg,#c9a84c,#f59e0b)', textAlign:'center' }}>
          Enrol in Their Course
        </Link>
      </div>
    </div>
  )
}

function Instructors() {
  const [selected, setSelected] = useState(null)
  const { data: instructors = [] } = useQuery({
    queryKey: ['public-instructors'],
    queryFn: () => publicApi.instructors().then(r => r.data),
  })

  const display = instructors.length > 0 ? instructors : [
    { id:1, name:'Alex Carter', specialty:'Web Development', courseCount:4, studentCount:128, profileImage:null },
    { id:2, name:'Priya Sharma', specialty:'Data Science', courseCount:3, studentCount:95, profileImage:null },
    { id:3, name:'Marcus Reid', specialty:'Product Design', courseCount:2, studentCount:67, profileImage:null },
  ]

  return (
    <section id="instructors" style={{ padding:'100px 24px', background:'linear-gradient(135deg,#0f1f45,#1a1040)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <Label>Meet the Team</Label>
          <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:700, color:'white', margin:'16px 0 12px' }}>Our Expert Instructors</h2>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:16, color:'rgba(255,255,255,0.5)', maxWidth:460, margin:'0 auto' }}>Learn from practitioners who've built real products and led real teams</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
          {display.map(inst => <InstructorCard key={inst.id} instructor={inst} onClick={setSelected} />)}
        </div>
      </div>
      <InstructorModal instructor={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS — infinite horizontal scroll
// ─────────────────────────────────────────────────────────────
function TestimonialCard({ t, onClick }) {
  return (
    <div onClick={() => onClick(t)} style={{ flexShrink:0, width:300, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.18)', borderRadius:20, padding:24, cursor:'pointer', transition:'all 0.25s', marginRight:20 }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
        <Avatar name={t.studentName} image={t.profileImage} size={44} />
        <div>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:14, fontWeight:700, color:'white', margin:0 }}>{t.studentName}</p>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, color:'rgba(255,255,255,0.45)', margin:'2px 0 0' }}>{t.issuedAt}</p>
        </div>
      </div>
      <Stars score={t.averageScore || 100} size={13} />
      <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.7, margin:'10px 0 14px', fontStyle:'italic' }}>
        "Completed <strong style={{ color:'white', fontStyle:'normal' }}>{t.courseTitle}</strong> — an incredible learning journey that truly prepared me for real-world challenges."
      </p>
      <GradeBadge label={t.gradeLabel || 'Completed'} score={t.averageScore} />
    </div>
  )
}

function TestimonialModal({ t, onClose }) {
  if (!t) return null
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'linear-gradient(135deg,#0f1f45,#1a1040)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:24, padding:40, maxWidth:460, width:'100%', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.08)', border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', color:'white', fontSize:16 }}>✕</button>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <Avatar name={t.studentName} image={t.profileImage} size={64} />
          <div>
            <p style={{ fontFamily:'Playfair Display, serif', fontSize:20, fontWeight:700, color:'white', margin:0 }}>{t.studentName}</p>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(255,255,255,0.45)', margin:'4px 0 6px' }}>Completed · {t.issuedAt}</p>
            <GradeBadge label={t.gradeLabel || 'Completed'} score={t.averageScore} />
          </div>
        </div>
        <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:14, padding:'20px 22px', marginBottom:20 }}>
          <Stars score={t.averageScore || 100} size={16} />
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:15, color:'rgba(255,255,255,0.8)', lineHeight:1.8, margin:'12px 0 0', fontStyle:'italic' }}>
            "Completing <strong style={{ color:'#c9a84c', fontStyle:'normal' }}>{t.courseTitle}</strong> was a game-changer. The structured modules, challenging quizzes, and expert feedback from the instructor took my skills to a completely new level. I highly recommend ThinkVerge to anyone serious about learning."
          </p>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(255,255,255,0.4)', margin:0 }}>Course Completed</p>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:14, fontWeight:600, color:'white', margin:'2px 0 0' }}>{t.courseTitle}</p>
          </div>
          {t.averageScore && (
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(255,255,255,0.4)', margin:0 }}>Avg Score</p>
              <p style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700, color:'#c9a84c', margin:'2px 0 0' }}>{t.averageScore}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Testimonials() {
  const [selected, setSelected] = useState(null)
  const trackRef = useRef(null)

  const { data: real = [] } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: () => publicApi.testimonials().then(r => r.data),
  })

  const fallback = [
    { id:1, studentName:'Ananya Iyer', courseTitle:'Java Basics', gradeLabel:'Distinction', averageScore:96, issuedAt:'Mar 2026' },
    { id:2, studentName:'Raj Kumar', courseTitle:'Python Fundamentals', gradeLabel:'Merit', averageScore:81, issuedAt:'Feb 2026' },
    { id:3, studentName:'Leila Hassan', courseTitle:'React Masterclass', gradeLabel:'Distinction', averageScore:94, issuedAt:'Jan 2026' },
    { id:4, studentName:'Carlos Mendez', courseTitle:'UI/UX Design', gradeLabel:'Merit', averageScore:78, issuedAt:'Mar 2026' },
    { id:5, studentName:'Yuki Tanaka', courseTitle:'Data Science', gradeLabel:'Pass', averageScore:71, issuedAt:'Apr 2026' },
  ]

  const items = real.length > 0 ? real : fallback
  // Duplicate for infinite loop
  const doubled = [...items, ...items]

  // CSS animation — inject via style tag
  useEffect(() => {
    const id = 'tv-scroll-style'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = `
        @keyframes tvScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .tv-track { animation: tvScroll ${Math.max(items.length * 5, 20)}s linear infinite; display:flex; }
        .tv-track:hover { animation-play-state: paused; }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @media(max-width:768px) { .nav-desktop{display:none!important} .nav-mobile{display:flex!important} }
      `
      document.head.appendChild(style)
    }
  }, [items.length])

  return (
    <section id="testimonials" style={{ padding:'100px 0', background:'#0a1228', overflow:'hidden' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', textAlign:'center', marginBottom:56 }}>
        <Label>Student Stories</Label>
        <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:700, color:'white', margin:'16px 0 12px' }}>What Our Graduates Say</h2>
        <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:16, color:'rgba(255,255,255,0.5)', maxWidth:460, margin:'0 auto' }}>Real results from real students who completed certified courses</p>
      </div>

      {/* Fade edges */}
      <div style={{ position:'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:100, background:'linear-gradient(90deg,#0a1228,transparent)', zIndex:2, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:100, background:'linear-gradient(-90deg,#0a1228,transparent)', zIndex:2, pointerEvents:'none' }} />
        <div style={{ overflow:'hidden', padding:'4px 0 8px' }}>
          <div className="tv-track" ref={trackRef} style={{ paddingLeft:24 }}>
            {doubled.map((t, i) => <TestimonialCard key={`${t.id}-${i}`} t={t} onClick={setSelected} />)}
          </div>
        </div>
      </div>

      <TestimonialModal t={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────
const FAQS = [
  { q:'Is ThinkVerge free to join?', a:'Yes — creating an account and browsing courses is completely free. Enrolment is subject to instructor approval.' },
  { q:'How do I earn a certificate?', a:'Complete all module lessons, pass each module quiz, pass the final course exam, and have your assignments graded by the instructor. Your certificate is then issued automatically with a QR code.' },
  { q:'Can I retake a quiz if I fail?', a:'Absolutely. You can retake any module quiz or the final exam as many times as you need. Your highest score is used for certificate grading.' },
  { q:'How long does course enrolment approval take?', a:'Instructors typically approve or respond to enrolment requests within 24–48 hours.' },
  { q:'Are the certificates verifiable?', a:'Yes. Every certificate contains a unique QR code that links to a public verification page, so employers or institutions can instantly confirm its authenticity.' },
  { q:'What types of content are in the courses?', a:'Courses include video lessons, text/reading lessons, PDFs, image resources, quizzes, and graded assignments — all designed for comprehensive learning.' },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" style={{ padding:'100px 24px', background:'linear-gradient(135deg,#0f1f45,#1a1040)' }}>
      <div style={{ maxWidth:740, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <Label>FAQ</Label>
          <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:700, color:'white', margin:'16px 0 12px' }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {FAQS.map((faq, i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${open===i ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`, borderRadius:14, padding:'18px 22px', cursor:'pointer', transition:'all 0.25s' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
                <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:15, fontWeight:600, color:'white', margin:0 }}>{faq.q}</p>
                <span style={{ color:'#c9a84c', fontSize:18, flexShrink:0, transition:'transform 0.25s', transform:open===i ? 'rotate(45deg)' : 'none', fontWeight:300 }}>+</span>
              </div>
              {open === i && (
                <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.75, margin:'14px 0 0' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)

  const handleSubmit = e => { e.preventDefault(); setSent(true) }

  return (
    <section id="contact" style={{ padding:'100px 24px', background:'#0a1228' }}>
      <div style={{ maxWidth:640, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <Label>Get In Touch</Label>
          <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(26px,4vw,40px)', fontWeight:700, color:'white', margin:'16px 0 12px' }}>Contact Us</h2>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:16, color:'rgba(255,255,255,0.5)' }}>Have a question? We'd love to hear from you.</p>
        </div>
        {sent ? (
          <div style={{ textAlign:'center', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:16, padding:40 }}>
            <span style={{ fontSize:48 }}>✅</span>
            <p style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700, color:'white', margin:'16px 0 8px' }}>Message Sent!</p>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:15, color:'rgba(255,255,255,0.6)' }}>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
              {[{k:'name',l:'Your Name',t:'text',p:'John Doe'},{k:'email',l:'Email Address',t:'email',p:'john@example.com'}].map(f => (
                <div key={f.k}>
                  <label style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:8 }}>{f.l}</label>
                  <input type={f.t} placeholder={f.p} required value={form[f.k]} onChange={e => setForm(v => ({...v,[f.k]:e.target.value}))}
                    style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'12px 16px', fontFamily:'DM Sans, sans-serif', fontSize:14, color:'white', outline:'none', boxSizing:'border-box' }} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:8 }}>Message</label>
              <textarea rows={5} placeholder="Tell us how we can help..." required value={form.message} onChange={e => setForm(v => ({...v,message:e.target.value}))}
                style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'12px 16px', fontFamily:'DM Sans, sans-serif', fontSize:14, color:'white', outline:'none', resize:'vertical', boxSizing:'border-box' }} />
            </div>
            <button type="submit" style={{ fontFamily:'DM Sans, sans-serif', fontWeight:700, fontSize:15, color:'#0a1228', border:'none', borderRadius:12, padding:'14px', background:'linear-gradient(135deg,#c9a84c,#f59e0b)', cursor:'pointer', marginTop:4 }}>
              Send Message →
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior:'smooth' })
  return (
    <footer style={{ background:'#060e20', borderTop:'1px solid rgba(201,168,76,0.15)', padding:'60px 24px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:40, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#c9a84c,#f59e0b)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎓</div>
              <span style={{ fontFamily:'Playfair Display, serif', fontWeight:700, fontSize:18, color:'white' }}>ThinkVerge</span>
            </div>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.75, margin:'0 0 16px' }}>
              Premium online learning platform connecting passionate learners with expert instructors.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              {['𝕏','in','f','📧'].map((icon, i) => (
                <div key={i} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13, color:'rgba(255,255,255,0.6)' }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, fontWeight:700, color:'#c9a84c', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 16px' }}>Platform</p>
            {['#home','#about','#how','#instructors','#testimonials'].map((href, i) => (
              <a key={href} onClick={() => scrollTo(href)} href={href} style={{ display:'block', fontFamily:'DM Sans, sans-serif', fontSize:13, color:'rgba(255,255,255,0.5)', textDecoration:'none', padding:'5px 0', transition:'color 0.2s', cursor:'pointer' }}
                onMouseEnter={e => e.target.style.color = '#c9a84c'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
              >{['Home','About','How It Works','Instructors','Testimonials'][i]}</a>
            ))}
          </div>

          {/* Support */}
          <div>
            <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, fontWeight:700, color:'#c9a84c', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 16px' }}>Support</p>
            {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Help Center'].map(l => (
              <a key={l} href="#contact" onClick={e => { e.preventDefault(); scrollTo('#contact') }} style={{ display:'block', fontFamily:'DM Sans, sans-serif', fontSize:13, color:'rgba(255,255,255,0.5)', textDecoration:'none', padding:'5px 0', transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#c9a84c'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
              >{l}</a>
            ))}
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:24, display:'flex', flexWrap:'wrap', gap:12, justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(255,255,255,0.3)', margin:0 }}>© 2026 ThinkVerge LMS. All rights reserved.</p>
          <div style={{ display:'flex', gap:16 }}>
            <Link to="/login" style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(255,255,255,0.4)', textDecoration:'none' }}
              onMouseEnter={e => e.target.style.color = '#c9a84c'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
            >Login</Link>
            <Link to="/register" style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(255,255,255,0.4)', textDecoration:'none' }}
              onMouseEnter={e => e.target.style.color = '#c9a84c'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
            >Register</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────
// SCROLL TO TOP
// ─────────────────────────────────────────────────────────────
function ScrollToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  if (!show) return null
  return (
    <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
      style={{ position:'fixed', bottom:28, right:28, zIndex:99, width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#c9a84c,#f59e0b)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(201,168,76,0.5)', transition:'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      <span style={{ color:'#0a1228', fontWeight:700, fontSize:16 }}>↑</span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// LABEL helper
// ─────────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:40, padding:'5px 16px' }}>
      <span style={{ fontFamily:'DM Sans, sans-serif', fontSize:11, fontWeight:700, color:'#c9a84c', letterSpacing:'0.1em', textTransform:'uppercase' }}>{children}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Inject Google Fonts
    if (!document.getElementById('tv-fonts')) {
      const link = document.createElement('link')
      link.id = 'tv-fonts'
      link.rel = 'stylesheet'
      link.href = FONT_LINK
      document.head.appendChild(link)
    }
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div style={{ background:'#0a1228', minHeight:'100vh' }}>
      <Navbar scrolled={scrolled} />
      <Hero />
      <About />
      <MissionVision />
      <HowItWorks />
      <Instructors />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
