import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../api/services'
import { T, css, SectionLabel, Avatar } from './theme'

/* ─── Instructor Card ────────────────────────────────────────── */
function InstructorCard({ instructor, onClick }) {
  return (
    <div
      onClick={() => onClick(instructor)}
      style={{
        background: T.white,
        border: `1.5px solid ${T.border}`,
        borderRadius: 22, padding: '28px 22px',
        cursor: 'pointer', textAlign: 'center',
        transition: 'all 0.25s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.borderColor = T.borderG
        e.currentTarget.style.boxShadow = `0 20px 48px rgba(13,27,42,0.11)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = T.border
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Avatar + online dot */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <div style={{
          padding: 4, borderRadius: '50%',
          background: `linear-gradient(135deg,${T.gold}44,${T.goldL}33)`,
          border: `1.5px solid ${T.borderG}`,
        }}>
          <Avatar name={instructor.name} image={instructor.profileImage} size={72} />
        </div>
        <div style={{
          position: 'absolute', bottom: 4, right: 4,
          width: 14, height: 14, borderRadius: '50%',
          background: '#22c55e', border: `2.5px solid ${T.white}`,
        }} />
      </div>

      {/* Name */}
      <p style={{ ...css.serif, fontSize: 19, fontWeight: 700, color: T.navy, margin: '0 0 4px' }}>
        {instructor.name}
      </p>

      {/* Specialty pill */}
      <span style={{
        ...css.sans, fontSize: 10, fontWeight: 700, color: T.gold,
        background: T.goldBg, border: `1px solid ${T.borderG}`,
        padding: '4px 13px', borderRadius: 20, letterSpacing: '0.08em',
        textTransform: 'uppercase', marginBottom: 20,
      }}>
        {instructor.specialty || 'Instructor'}
      </span>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: 0, width: '100%',
        background: T.grey1, borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${T.grey2}`,
      }}>
        {[
          { val: instructor.courseCount ?? '—', label: 'Courses' },
          { val: instructor.studentCount ?? '—', label: 'Students' },
          { val: instructor.rating ? instructor.rating.toFixed(1) + '★' : '4.9★', label: 'Rating' },
        ].map((s, i, arr) => (
          <div key={s.label} style={{
            flex: 1, padding: '12px 8px', textAlign: 'center',
            borderRight: i < arr.length - 1 ? `1px solid ${T.grey2}` : 'none',
          }}>
            <p style={{ ...css.sans, fontSize: 16, fontWeight: 700, color: T.navy, margin: 0 }}>{s.val}</p>
            <p style={{ ...css.sans, fontSize: 10, color: T.grey4, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* View profile hint */}
      <p style={{ ...css.sans, fontSize: 12, color: T.gold, margin: '14px 0 0', fontWeight: 600 }}>
        View Profile →
      </p>
    </div>
  )
}

/* ─── Instructor Modal ───────────────────────────────────────── */
function InstructorModal({ instructor, onClose }) {
  if (!instructor) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(13,27,42,0.50)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.white, border: `1.5px solid ${T.border}`,
        borderRadius: 24, padding: 40, maxWidth: 440, width: '100%',
        position: 'relative', boxShadow: '0 24px 60px rgba(13,27,42,0.16)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          background: T.grey1, border: `1.5px solid ${T.border}`,
          borderRadius: 8, width: 30, height: 30,
          cursor: 'pointer', color: T.grey5, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ display: 'inline-block', padding: 5, borderRadius: '50%', background: T.goldBg, border: `1.5px solid ${T.borderG}` }}>
            <Avatar name={instructor.name} image={instructor.profileImage} size={80} />
          </div>
        </div>

        <h3 style={{ ...css.serif, fontSize: 24, fontWeight: 700, color: T.navy, textAlign: 'center', margin: '0 0 5px' }}>{instructor.name}</h3>
        <p style={{ ...css.sans, fontSize: 11, color: T.gold, textAlign: 'center', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 22px' }}>{instructor.specialty}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
          {[['📚', instructor.courseCount, 'Courses'], ['👥', instructor.studentCount, 'Students'], ['⭐', '4.9', 'Rating']].map(([icon, val, label]) => (
            <div key={label} style={{ background: T.grey1, borderRadius: 12, padding: '14px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: 18, display: 'block', marginBottom: 5 }}>{icon}</span>
              <p style={{ ...css.sans, fontSize: 18, fontWeight: 700, color: T.navy, margin: 0 }}>{val}</p>
              <p style={{ ...css.sans, fontSize: 10, color: T.grey4, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            </div>
          ))}
        </div>

        <p style={{ ...css.sans, fontSize: 14, color: T.text2, lineHeight: 1.78, textAlign: 'center', margin: '0 0 22px' }}>
          {instructor.name} is a passionate educator specialising in{' '}
          <strong style={{ color: T.gold }}>{instructor.specialty}</strong>. With{' '}
          {instructor.courseCount} course{instructor.courseCount !== 1 ? 's' : ''} on ThinkVerge,
          they have helped {instructor.studentCount} students advance their careers.
        </p>

        <Link to="/register" style={{
          display: 'block', ...css.sans, fontSize: 14, fontWeight: 600,
          color: T.white, textDecoration: 'none', padding: '13px',
          borderRadius: 10, background: `linear-gradient(135deg,${T.gold},${T.goldL})`,
          textAlign: 'center',
        }}>
          Enrol in Their Course
        </Link>
      </div>
    </div>
  )
}

/* ─── Instructors Section ────────────────────────────────────── */
const FALLBACK = [
  { id: 1, name: 'Alex Carter',  specialty: 'Web Development', courseCount: 4, studentCount: 128 },
  { id: 2, name: 'Priya Sharma', specialty: 'Data Science',    courseCount: 3, studentCount: 95 },
  { id: 3, name: 'Marcus Reid',  specialty: 'Product Design',  courseCount: 2, studentCount: 67 },
  { id: 4, name: 'Sara Chen',    specialty: 'UX Research',     courseCount: 3, studentCount: 84 },
]

export default function Instructors() {
  const [selected, setSelected] = useState(null)

  const { data: instructors = [] } = useQuery({
    queryKey: ['public-instructors'],
    queryFn: () => publicApi.instructors().then(r => r.data),
  })

  const display = instructors.length > 0 ? instructors : FALLBACK

  return (
    <section id="instructors" style={{ padding: '100px 24px', background: T.grey1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <SectionLabel>Meet the Team</SectionLabel>
          <h2 style={{ ...css.serif, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>
            Our Expert Instructors
          </h2>
          <p style={{ ...css.sans, fontSize: 16, color: T.grey4, maxWidth: 440, margin: '0 auto' }}>
            Learn from practitioners who've built real products and led real teams
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
          {display.map(inst => (
            <InstructorCard key={inst.id} instructor={inst} onClick={setSelected} />
          ))}
        </div>
      </div>
      <InstructorModal instructor={selected} onClose={() => setSelected(null)} />
    </section>
  )
}