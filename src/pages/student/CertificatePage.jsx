import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { certificateApi } from '../../api/services.js'
import { PageSpinner } from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Award, Eye, Download, Calendar, X, Printer } from 'lucide-react'

function QRCode({ value, size = 80 }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&margin=3&color=1e3a5f`
  return <img src={src} alt="Scan to verify" width={size} height={size} style={{ display: 'block' }} />
}

function Signature({ name }) {
  return (
    <svg width="160" height="50" viewBox="0 0 160 50" style={{ display: 'block', overflow: 'visible' }}>
      <line x1="0" y1="44" x2="160" y2="44" stroke="#1e3a5f" strokeWidth="0.8" strokeOpacity="0.3" />
      <text
        x="80" y="40"
        textAnchor="middle"
        fill="#1e3a5f"
        style={{
          fontSize: '19px',
          fontFamily: '"Brush Script MT","Segoe Script","Dancing Script",cursive',
          fontStyle: 'italic',
        }}
      >
        {name}
      </text>
    </svg>
  )
}

function Stars({ score }) {
  const filled = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : 2
  return (
    <span style={{ fontSize: 16, letterSpacing: 4, color: '#c9a84c' }}>
      {Array.from({ length: 5 }, (_, i) => i < filled ? '★' : '☆').join(' ')}
    </span>
  )
}

// Course description lines based on course title
function getCourseDescription(courseTitle) {
  const title = (courseTitle || '').toLowerCase()
  if (title.includes('java'))
    return [
      'Mastered core Java programming concepts including OOP, data structures, and algorithms.',
      'Gained hands-on experience building robust backend applications and APIs.',
      'Demonstrated proficiency in exception handling, collections, and multithreading.',
    ]
  if (title.includes('python'))
    return [
      'Acquired strong foundations in Python scripting, data manipulation, and automation.',
      'Built real-world projects covering web scraping, file I/O, and API integration.',
      'Showcased skills in Pythonic coding patterns and library-driven development.',
    ]
  if (title.includes('react') || title.includes('frontend'))
    return [
      'Developed dynamic, responsive UIs using React, hooks, and component architecture.',
      'Integrated REST APIs and managed state with Context API and third-party libraries.',
      'Delivered polished, accessible web applications following modern best practices.',
    ]
  if (title.includes('sql') || title.includes('database'))
    return [
      'Demonstrated expertise in relational database design, querying, and optimization.',
      'Worked with complex joins, stored procedures, and transaction management.',
      'Applied database best practices for data integrity and performance tuning.',
    ]
  return [
    `Completed all required modules and assessments for ${courseTitle}.`,
    'Demonstrated consistent dedication, analytical thinking, and practical skill-building.',
    'Earned this certificate through outstanding academic performance and commitment.',
  ]
}

function CertificateVisual({ cert }) {
  const issued = cert.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—'
  const certId    = `TKV-${String(cert.id).padStart(6, '0')}`
  const verifyUrl = `${window.location.origin}/certificate/${cert.id}`
  const descLines = getCourseDescription(cert.courseTitle)

  return (
    <div style={{
      position: 'relative',
  width: '297mm',
height: '210mm',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: 'linear-gradient(150deg, #fefce8 0%, #ffffff 40%, #f0f7ff 100%)',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>

      {/* ── Outer border frame ── */}
      <div style={{
        position: 'absolute', inset: 8,
        border: '3px solid #1e3a5f',
        borderRadius: 2,
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', inset: 13,
        border: '1.5px solid #c9a84c',
        borderRadius: 1,
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      {/* Outermost thick border */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '8px solid #1e3a5f',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* ── Watermark logo (centred, very faint) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', zIndex: 0,
      }}>
        <img
          src="/logo.png"
          alt=""
          style={{
            width: '20%',
            opacity: 0.04,
            filter: 'grayscale(1)',
            userSelect: 'none',
          }}
        />
      </div>

      {/* ── Decorative corner ornaments ── */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', ...pos,
          width: 36, height: 36,
          pointerEvents: 'none', zIndex: 2,
        }}>
          <svg viewBox="0 0 36 36" width="36" height="36">
            <path
              d="M2 2 L14 2 L2 14 Z"
              fill="none" stroke="#c9a84c" strokeWidth="1.5"
              transform={i === 1 || i === 3 ? 'scale(-1,1) translate(-36,0)' : ''}
            />
            <path
              d="M2 2 L14 2 L2 14 Z"
              fill="none" stroke="#c9a84c" strokeWidth="1.5"
              transform={
                i === 0 ? '' :
                i === 1 ? 'scale(-1,1) translate(-36,0)' :
                i === 2 ? 'scale(1,-1) translate(0,-36)' :
                'scale(-1,-1) translate(-36,-36)'
              }
            />
            <circle cx="18" cy="18" r="3" fill="#c9a84c" opacity="0.5" />
          </svg>
        </div>
      ))}

      {/* ── Top decorative band ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 6,
        background: 'linear-gradient(90deg, #1e3a5f 0%, #c9a84c 50%, #1e3a5f 100%)',
        zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 6,
        background: 'linear-gradient(90deg, #1e3a5f 0%, #c9a84c 50%, #1e3a5f 100%)',
        zIndex: 2,
      }} />

      {/* ── Side accent lines ── */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 6, background: 'linear-gradient(180deg, #1e3a5f 0%, #c9a84c 50%, #1e3a5f 100%)', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 6, background: 'linear-gradient(180deg, #1e3a5f 0%, #c9a84c 50%, #1e3a5f 100%)', zIndex: 2 }} />

      {/* ── Main content ── */}
      <div style={{
  position: 'relative',
  zIndex: 3,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',   // ✅ pushes footer down
  alignItems: 'center',
  padding: '30px 60px',
  boxSizing: 'border-box',
  textAlign: 'center',
}}>
  <div style={{
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',   // ✅ vertical center
  alignItems: 'center'
}}>
        {/* Logo — bigger */}
        <div style={{ marginBottom: 2 }}>
          <img
            src="/logo.png"
            alt="ThinkVerge"
            style={{ height: 70, width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Brand name */}
        <p style={{
          fontSize: 10, letterSpacing: '0.3em', color: '#7c6b2e',
          textTransform: 'uppercase', margin: '2px 0 0',
        }}>
          ThinkVerge · LMS Platform
        </p>

        {/* Gold divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '7px 0' }}>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
          <span style={{ color: '#c9a84c', fontSize: 12 }}>✦</span>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 26, fontWeight: 'bold', color: '#1e3a5f',
          letterSpacing: '0.06em', margin: '0 0 6px',
          textShadow: '0 1px 2px rgba(30,58,95,0.08)',
        }}>
          Certificate of Completion
        </h1>

        <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: '0 0 8px' }}>
          This is to certify that
        </p>

        {/* Student name */}
        <p style={{
          fontSize: 32, color: '#c9a84c', fontStyle: 'italic',
          fontWeight: 'bold', margin: '0 0 2px', lineHeight: 1.2,
          textShadow: '0 1px 4px rgba(201,168,76,0.2)',
        }}>
          {cert.studentName}
        </p>
        <div style={{
          width: 200, height: 1.5,
          background: 'linear-gradient(90deg, transparent, #c9a84c 30%, #c9a84c 70%, transparent)',
          margin: '4px auto 8px',
        }} />

        <p style={{ fontSize: 12, color: '#475569', fontStyle: 'italic', margin: '0 0 3px' }}>
          has successfully completed the course
        </p>
        <p style={{
          fontSize: 20, fontWeight: 'bold', color: '#1e3a5f',
          margin: '0 0 8px', letterSpacing: '0.02em',
        }}>
          {cert.courseTitle}
        </p>

        {/* ── Course description lines ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30,58,95,0.04), rgba(201,168,76,0.06))',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 6, padding: '5px 20px',
          maxWidth: '82%', margin: '0 auto 5px',
        }}>
          {descLines.map((line, i) => (
            <p key={i} style={{
              fontSize: 10.5, color: '#475569', fontStyle: 'italic',
              margin: i === 0 ? 0 : '3px 0 0', lineHeight: 1,
            }}>
             {line}
            </p>
          ))}
        </div>

        {/* Stars + grade */}
        {cert.averageScore != null && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <Stars score={cert.averageScore} />
            <span style={{
              background: cert.averageScore >= 90 ? '#059669' : cert.averageScore >= 75 ? '#2563eb' : '#7c3aed',
              color: 'white', fontSize: 9, fontWeight: 'bold',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '2px 12px', borderRadius: 20,
            }}>
              {cert.gradeLabel ?? 'Pass'} · {cert.averageScore}%
            </span>
          </div>
        )}
</div>
        {/* ── Footer ── */}
      <div style={{
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  borderTop: '1px solid rgba(201,168,76,0.4)',
  paddingTop: 14,
}}>

          {/* Signature */}
          <div style={{ textAlign: 'center', width: 160, flexShrink: 0 }}>
            <Signature name={cert.instructorName || 'Instructor'} />
            <p style={{
              fontSize: 8, color: '#94a3b8', margin: '3px 0 1px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              Course Instructor
            </p>
            <p style={{ fontSize: 10, color: '#1e3a5f', fontWeight: 'bold', margin: 0 }}>
              {cert.instructorName || '—'}
            </p>
          </div>

          {/* Central seal */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg,#0b2358,#1e3a8a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 4px',
              boxShadow: '0 2px 10px rgba(5, 18, 77, 0.81), 0 0 0 3pxrgba(8, 7, 109, 0.25))',
              padding: 8,
            }}>
              <img
                src="/logo.png"
                alt="ThinkVerge seal"
                style={{ width: '90%', height: '90%', borderRadius: '50%', objectFit: 'contain' }}
              />
            </div>
            <p style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              Issued on
            </p>
            <p style={{ fontSize: 10, color: '#1e3a5f', fontWeight: 'bold', margin: '1px 0' }}>{issued}</p>
            <p style={{ fontSize: 8, color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>{certId}</p>
          </div>

          {/* QR */}
          <div style={{ textAlign: 'center', width: 100, flexShrink: 0 }}>
            <div style={{
              border: '1.5px solid #e2e8f0', borderRadius: 8,
              padding: 4, display: 'inline-block', background: 'white',
            }}>
              <QRCode value={verifyUrl} size={72} />
            </div>
            <p style={{ fontSize: 8, color: '#94a3b8', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Scan to verify
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────
function CertificateModal({ cert, onClose }) {
  const printRef = useRef()
const handlePrint = () => {
  const content = printRef.current.innerHTML
  const logoUrl = `${window.location.origin}/logo.png`

  fetch(logoUrl)
    .then(r => r.blob())
    .then(blob => new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    }))
    .then(base64 => {
      const printContent = content.replaceAll(logoUrl, base64)

      const win = window.open('', '_blank')

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate – ${cert.courseTitle}</title>

    <style>
  @page {
    size: A4 landscape;
    margin: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 297mm;
    height: 210mm;
    background: white;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body * {
    visibility: hidden;
  }

  #cert, #cert * {
    visibility: visible;
  }

  #cert {
    width: 297mm;
    height: 210mm;
  }
</style>
        </head>

        <body>
          <div id="cert">
            ${printContent}
          </div>
        </body>
        </html>
      `)

      win.document.close()
      win.focus()

      setTimeout(() => {
        win.print()
        win.close()
      }, 700)
    })
}

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: 'white', borderRadius: 16,
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        width: '100%', maxWidth: 820, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 40px', borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={18} color="#f59e0b" />
            <span style={{ fontWeight: 600, color: '#1e293b' }}>Certificate of Completion</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={handlePrint} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600,
              background: '#4f46e5', color: 'white',
              border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
            }}>
              <Printer size={13} /> Print / Save PDF
            </button>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 8, color: '#94a3b8',
            }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: 20 }} ref={printRef}>
          <CertificateVisual cert={cert} />
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', paddingBottom: 14 }}>
          Use <strong>Print / Save PDF</strong> → "Save as PDF" in the print dialog.
          The QR code lets anyone verify this certificate is authentic.
        </p>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function CertificatePage() {
  const [viewing, setViewing] = useState(null)

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: () => certificateApi.myCertificates().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800">My Certificates</h1>
        <p className="text-sm text-slate-400 mt-1">
          Earned by completing all module quizzes, final exam, and graded assignments
        </p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState icon={Award} title="No certificates yet"
          description="Complete all module quizzes, the final exam, and have your assignments graded." />
      ) : (
        <div className="grid gap-4">
          {certificates.map(cert => (
            <div key={cert.id} className="card flex items-center gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 p-2"
                style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)' }}
              >
                <img
                  src="/logo.png" alt="ThinkVerge"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-800">{cert.courseTitle}</p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Calendar size={10} />
                  Issued {cert.issuedAt
                    ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Awarded to <strong>{cert.studentName}</strong>
                  {cert.gradeLabel && (
                    <span style={{
                      marginLeft: 8, padding: '1px 8px', borderRadius: 12,
                      fontSize: 11, fontWeight: 700,
                      background: cert.averageScore >= 90 ? '#059669' : cert.averageScore >= 75 ? '#2563eb' : '#7c3aed',
                      color: 'white',
                    }}>
                      {cert.gradeLabel}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setViewing(cert)}
                  className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Eye size={12} /> View
                </button>
                <button
                  onClick={() => setViewing(cert)}
                  className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-lg transition-colors"
                >
                  <Download size={12} /> Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {certificates.length === 0 && (
        <div className="bg-royal-50 border border-royal-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-navy-800 mb-3">How to earn a certificate</p>
          <div className="space-y-2">
            {[
              'Complete all lessons in every module',
              'Pass the quiz at the end of each module',
              'Pass the final course exam',
              'Submit all course assignments',
              'Wait for your instructor to grade all submissions',
              'Your certificate will be issued automatically 🎉',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-royal-gradient text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-navy-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewing && <CertificateModal cert={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}