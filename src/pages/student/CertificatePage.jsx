import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { certificateApi } from '../../api/services.js'
import { PageSpinner } from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Award, Download, Eye, Calendar, X, Printer } from 'lucide-react'

// ── Certificate Visual ────────────────────────────────────────
function CertificateVisual({ cert }) {
  const issued = cert.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—'

  return (
    <div
      id={`cert-${cert.id}`}
      className="relative bg-white overflow-hidden"
      style={{
        width: '100%',
        aspectRatio: '1.414 / 1', // A4 landscape ratio
        fontFamily: "'Georgia', serif",
        border: '12px solid #1e3a5f',
        boxShadow: 'inset 0 0 0 4px #c9a84c',
        padding: '40px 56px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'linear-gradient(160deg, #fefce8 0%, #ffffff 40%, #f0f7ff 100%)',
      }}
    >
      {/* Corner ornaments */}
      {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-10 h-10 opacity-30`}
          style={{ fontSize: 32, lineHeight: 1 }}>❋</div>
      ))}

      {/* Header */}
      <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#7c6b2e', textTransform: 'uppercase', marginBottom: 6 }}>
        ThinkVerge · LMS Platform
      </p>

      <div style={{ width: 50, height: 2, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '8px auto' }} />

      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', letterSpacing: '0.05em', margin: '10px 0 4px' }}>
        Certificate of Completion
      </h1>

      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: 20 }}>
        This is to certify that
      </p>

      <p style={{ fontSize: '36px', color: '#c9a84c', fontStyle: 'italic', fontWeight: 'bold', margin: '0 0 8px' }}>
        {cert.studentName}
      </p>

      <div style={{ width: 200, height: 1, background: '#c9a84c', margin: '4px auto 16px' }} />

      <p style={{ fontSize: '14px', color: '#475569', marginBottom: 6 }}>
        has successfully completed the course
      </p>

      <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a5f', margin: '6px 0 20px' }}>
        {cert.courseTitle}
      </p>

      {/* Stars */}
      <div style={{ fontSize: 18, color: '#c9a84c', letterSpacing: 8, marginBottom: 20 }}>★ ★ ★</div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: 2 }}>ISSUED ON</p>
          <p style={{ fontSize: '12px', color: '#1e3a5f', fontWeight: 'bold' }}>{issued}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
            <span style={{ color: 'white', fontSize: 22 }}>🎓</span>
          </div>
          <p style={{ fontSize: '10px', color: '#94a3b8' }}>VERIFIED</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: 2 }}>CERTIFICATE ID</p>
          <p style={{ fontSize: '12px', color: '#1e3a5f', fontWeight: 'bold' }}>#{String(cert.id).padStart(6, '0')}</p>
        </div>
      </div>
    </div>
  )
}

// ── Certificate Modal ─────────────────────────────────────────
function CertificateModal({ cert, onClose }) {
  const printRef = useRef()

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate – ${cert.courseTitle}</title>
          <style>
            @page { size: A4 landscape; margin: 0; }
            body { margin: 0; padding: 20px; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <span className="font-semibold text-gray-800">Certificate of Completion</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Printer size={13} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Certificate preview */}
        <div className="p-5" ref={printRef}>
          <CertificateVisual cert={cert} />
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Use <strong>Print / Save PDF</strong> → "Save as PDF" in your browser's print dialog to download
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
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Complete all module quizzes, the final exam, and have your assignments graded to earn a certificate."
        />
      ) : (
        <div className="grid gap-4">
          {certificates.map(cert => (
            <div key={cert.id} className="card flex items-center gap-5">

              {/* Trophy icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <Award size={24} className="text-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-800">{cert.courseTitle}</p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Calendar size={10} />
                  Issued {cert.issuedAt
                    ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })
                    : '—'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Awarded to <strong>{cert.studentName}</strong>
                </p>
              </div>

              {/* Actions */}
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
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How to earn */}
      {certificates.length === 0 && (
        <div className="bg-royal-50 border border-royal-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-navy-800 mb-3">How to earn a certificate</p>
          <div className="space-y-2">
            {[
              { step: '1', text: 'Complete all lessons in every module' },
              { step: '2', text: 'Pass the quiz at the end of each module (score ≥ passing mark)' },
              { step: '3', text: 'Pass the final course exam' },
              { step: '4', text: 'Submit all course assignments' },
              { step: '5', text: 'Wait for your instructor to grade all submissions' },
              { step: '6', text: 'Your certificate will be issued automatically 🎉' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-royal-gradient text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </span>
                <p className="text-sm text-navy-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate modal */}
      {viewing && (
        <CertificateModal cert={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  )
}
