// import { useState, useRef } from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { certificateApi } from '../../api/services.js'
// import { PageSpinner } from '../../components/common/Spinner.jsx'
// import EmptyState from '../../components/common/EmptyState.jsx'
// import { Award, Eye, Download, Calendar, X, Printer } from 'lucide-react'

// // ── QR Code image via free API (no npm needed) ────────────────
// function QRCode({ value, size = 90 }) {
//   const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&margin=4&color=1e3a5f`
//   return (
//     <img
//       src={url}
//       alt="Verify certificate"
//       width={size}
//       height={size}
//       style={{ display: 'block', imageRendering: 'crisp-edges' }}
//     />
//   )
// }

// // ── Cursive-style signature using SVG text ────────────────────
// function Signature({ name }) {
//   return (
//     <svg width="160" height="48" viewBox="0 0 160 48" style={{ overflow: 'visible' }}>
//       {/* Underline */}
//       <line x1="0" y1="44" x2="160" y2="44" stroke="#1e3a5f" strokeWidth="1" strokeOpacity="0.3" />
//       {/* Name in a cursive-looking font stack */}
//       <text
//         x="80" y="38"
//         textAnchor="middle"
//         fill="#1e3a5f"
//         style={{
//           fontSize: '18px',
//           fontFamily: '"Brush Script MT", "Segoe Script", "Dancing Script", cursive',
//           fontStyle: 'italic',
//         }}
//       >
//         {name}
//       </text>
//     </svg>
//   )
// }

// // ── Certificate Visual ────────────────────────────────────────
// function CertificateVisual({ cert }) {
//   const issued = cert.issuedAt
//     ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'long', day: 'numeric',
//       })
//     : '—'

//   const certId = `TKV-${String(cert.id).padStart(6, '0')}`
//   const verifyUrl = `${window.location.origin}/certificate/${cert.id}`

//   return (
//     <div
//       id={`cert-${cert.id}`}
//       style={{
//         width: '100%',
//         aspectRatio: '1.414 / 1',
//         fontFamily: "'Georgia', serif",
//         border: '12px solid #1e3a5f',
//         boxShadow: 'inset 0 0 0 4px #c9a84c',
//         padding: '32px 48px 24px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         textAlign: 'center',
//         background: 'linear-gradient(160deg, #fefce8 0%, #ffffff 40%, #f0f7ff 100%)',
//         position: 'relative',
//         boxSizing: 'border-box',
//       }}
//     >
//       {/* Corner ornaments */}
//       {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
//         <div key={i} className={`absolute ${pos} w-10 h-10 opacity-20`}
//           style={{ fontSize: 32, lineHeight: 1 }}>❋</div>
//       ))}

//       {/* ── BODY ── */}
//       <div style={{ width: '100%' }}>
//         {/* Header */}
//         <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#7c6b2e', textTransform: 'uppercase', marginBottom: 4 }}>
//           ThinkVerge · LMS Platform
//         </p>
//         <div style={{ width: 50, height: 2, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '6px auto' }} />
//         <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e3a5f', letterSpacing: '0.05em', margin: '8px 0 4px' }}>
//           Certificate of Completion
//         </h1>
//         <p style={{ fontSize: '12px', color: '#64748b', marginBottom: 14 }}>
//           This is to certify that
//         </p>
//         <p style={{ fontSize: '32px', color: '#c9a84c', fontStyle: 'italic', fontWeight: 'bold', margin: '0 0 6px' }}>
//           {cert.studentName}
//         </p>
//         <div style={{ width: 200, height: 1, background: '#c9a84c', margin: '4px auto 12px' }} />
//         <p style={{ fontSize: '13px', color: '#475569', marginBottom: 5 }}>
//           has successfully completed the course
//         </p>
//         <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f', margin: '4px 0 12px' }}>
//           {cert.courseTitle}
//         </p>

//         {/* Stars + grade */}
//         {cert.averageScore != null ? (
//           <div style={{ marginBottom: 10 }}>
//             <div style={{ fontSize: 16, color: '#c9a84c', letterSpacing: 6, marginBottom: 5 }}>
//               {cert.averageScore >= 90 ? '★ ★ ★ ★ ★' :
//                cert.averageScore >= 75 ? '★ ★ ★ ★ ☆' :
//                cert.averageScore >= 60 ? '★ ★ ★ ☆ ☆' : '★ ★ ☆ ☆ ☆'}
//             </div>
//             <span style={{
//               display: 'inline-block',
//               background: cert.averageScore >= 90 ? '#059669' : cert.averageScore >= 75 ? '#2563eb' : '#7c3aed',
//               color: 'white', fontSize: '10px', fontWeight: 'bold',
//               letterSpacing: '0.15em', textTransform: 'uppercase',
//               padding: '2px 12px', borderRadius: 20,
//             }}>
//               {cert.gradeLabel ?? 'Pass'} · {cert.averageScore}% avg
//             </span>
//           </div>
//         ) : (
//           <div style={{ fontSize: 16, color: '#c9a84c', letterSpacing: 6, marginBottom: 10 }}>★ ★ ★</div>
//         )}
//       </div>

//       {/* ── FOOTER: Signature | Seal | QR ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
//         width: '100%', paddingTop: 10, borderTop: '1px solid #e2e8f0',
//         marginTop: 8,
//       }}>

//         {/* Left — instructor signature */}
//         <div style={{ textAlign: 'center', minWidth: 160 }}>
//           <Signature name={cert.instructorName ?? 'Instructor'} />
//           <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
//             Course Instructor
//           </p>
//           <p style={{ fontSize: '10px', color: '#1e3a5f', fontWeight: 'bold' }}>
//             {cert.instructorName ?? '—'}
//           </p>
//         </div>

//         {/* Centre — seal + date */}
//         <div style={{ textAlign: 'center', flex: 1 }}>
//           <div style={{
//             width: 52, height: 52, borderRadius: '50%',
//             background: 'linear-gradient(135deg,#f59e0b,#d97706)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             margin: '0 auto 4px', boxShadow: '0 2px 8px rgba(217,119,6,0.4)',
//           }}>
//             <span style={{ color: 'white', fontSize: 24 }}>🎓</span>
//           </div>
//           <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
//             Issued on
//           </p>
//           <p style={{ fontSize: '10px', color: '#1e3a5f', fontWeight: 'bold' }}>{issued}</p>
//           <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: 2 }}>{certId}</p>
//         </div>

//         {/* Right — QR code */}
//         <div style={{ textAlign: 'center', minWidth: 100 }}>
//           <div style={{ border: '2px solid #e2e8f0', borderRadius: 8, padding: 4, display: 'inline-block', background: 'white' }}>
//             <QRCode value={verifyUrl} size={72} />
//           </div>
//           <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
//             Scan to verify
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ── Certificate Modal ─────────────────────────────────────────
// function CertificateModal({ cert, onClose }) {
//   const printRef = useRef()

//   const handlePrint = () => {
//     const content = printRef.current.innerHTML
//     const win = window.open('', '_blank')
//     win.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Certificate – ${cert.courseTitle}</title>
//           <style>
//             @page { size: A4 landscape; margin: 0; }
//             body { margin: 0; padding: 20px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
//             * { box-sizing: border-box; }
//             img { display: block; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `)
//     win.document.close()
//     win.focus()
//     setTimeout(() => { win.print(); win.close() }, 600)
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <Award size={18} className="text-amber-500" />
//             <span className="font-semibold text-gray-800">Certificate of Completion</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
//             >
//               <Printer size={13} /> Print / Save PDF
//             </button>
//             <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
//               <X size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Certificate */}
//         <div className="p-5" ref={printRef}>
//           <CertificateVisual cert={cert} />
//         </div>

//         <p className="text-center text-xs text-gray-400 pb-4">
//           Use <strong>Print / Save PDF</strong> → "Save as PDF" in your browser's print dialog to download.
//           The QR code lets anyone verify this certificate is authentic.
//         </p>
//       </div>
//     </div>
//   )
// }

// // ── Main Page ─────────────────────────────────────────────────
// export default function CertificatePage() {
//   const [viewing, setViewing] = useState(null)

//   const { data: certificates = [], isLoading } = useQuery({
//     queryKey: ['my-certificates'],
//     queryFn: () => certificateApi.myCertificates().then(r => r.data),
//   })

//   if (isLoading) return <PageSpinner />

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-xl font-bold text-navy-800">My Certificates</h1>
//         <p className="text-sm text-slate-400 mt-1">
//           Earned by completing all module quizzes, final exam, and graded assignments
//         </p>
//       </div>

//       {certificates.length === 0 ? (
//         <EmptyState
//           icon={Award}
//           title="No certificates yet"
//           description="Complete all module quizzes, the final exam, and have your assignments graded to earn a certificate."
//         />
//       ) : (
//         <div className="grid gap-4">
//           {certificates.map(cert => (
//             <div key={cert.id} className="card flex items-center gap-5">

//               <div
//                 className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
//                 style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
//               >
//                 <Award size={24} className="text-white" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-navy-800">{cert.courseTitle}</p>
//                 <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
//                   <Calendar size={10} />
//                   Issued {cert.issuedAt
//                     ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
//                         year: 'numeric', month: 'long', day: 'numeric',
//                       })
//                     : '—'}
//                 </p>
//                 <p className="text-xs text-slate-500 mt-0.5">
//                   Awarded to <strong>{cert.studentName}</strong>
//                   {cert.gradeLabel && (
//                     <span className={`ml-2 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
//                       cert.averageScore >= 90 ? 'bg-emerald-500' :
//                       cert.averageScore >= 75 ? 'bg-blue-500' : 'bg-violet-500'
//                     }`}>
//                       {cert.gradeLabel}
//                     </span>
//                   )}
//                 </p>
//               </div>

//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <button
//                   onClick={() => setViewing(cert)}
//                   className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
//                 >
//                   <Eye size={12} /> View
//                 </button>
//                 <button
//                   onClick={() => setViewing(cert)}
//                   className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-lg transition-colors"
//                 >
//                   <Download size={12} /> Print
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {certificates.length === 0 && (
//         <div className="bg-royal-50 border border-royal-100 rounded-2xl p-5">
//           <p className="text-sm font-semibold text-navy-800 mb-3">How to earn a certificate</p>
//           <div className="space-y-2">
//             {[
//               { step: '1', text: 'Complete all lessons in every module' },
//               { step: '2', text: 'Pass the quiz at the end of each module' },
//               { step: '3', text: 'Pass the final course exam' },
//               { step: '4', text: 'Submit all course assignments' },
//               { step: '5', text: 'Wait for your instructor to grade all submissions' },
//               { step: '6', text: 'Your certificate will be issued automatically 🎉' },
//             ].map(({ step, text }) => (
//               <div key={step} className="flex items-start gap-3">
//                 <span className="w-5 h-5 rounded-full bg-royal-gradient text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
//                   {step}
//                 </span>
//                 <p className="text-sm text-navy-700">{text}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {viewing && (
//         <CertificateModal cert={viewing} onClose={() => setViewing(null)} />
//       )}
//     </div>
//   )
// }


import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { certificateApi } from '../../api/services.js'
import { PageSpinner } from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Award, Eye, Download, Calendar, X, Printer } from 'lucide-react'

// ── QR Code via free public API ───────────────────────────────
function QRCode({ value, size = 80 }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&margin=3&color=1e3a5f`
  return <img src={src} alt="Scan to verify" width={size} height={size} style={{ display: 'block' }} />
}

// ── SVG cursive signature ─────────────────────────────────────
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

// ── Stars row ─────────────────────────────────────────────────
function Stars({ score }) {
  const filled = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : 2
  return (
    <span style={{ fontSize: 16, letterSpacing: 4, color: '#c9a84c' }}>
      {Array.from({ length: 5 }, (_, i) => i < filled ? '★' : '☆').join(' ')}
    </span>
  )
}

// ── The certificate itself ────────────────────────────────────
function CertificateVisual({ cert }) {
  const issued = cert.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—'
  const certId    = `TKV-${String(cert.id).padStart(6, '0')}`
  const verifyUrl = `${window.location.origin}/certificate/${cert.id}`

  // All inline — no Tailwind classes inside the certificate visual
  const s = {
    wrap: {
      position: 'relative',
      width: '100%',
      aspectRatio: '1.414 / 1',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      border: '10px solid #1e3a5f',
      boxShadow: 'inset 0 0 0 3px #c9a84c',
      background: 'linear-gradient(160deg,#fefce8 0%,#ffffff 45%,#f0f7ff 100%)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '28px 48px 20px',
      textAlign: 'center',
      overflow: 'hidden',
    },
    // Corner ornament — positioned absolutely
    corner: (top, right, bottom, left) => ({
      position: 'absolute',
      top, right, bottom, left,
      fontSize: 28,
      color: '#c9a84c',
      opacity: 0.25,
      lineHeight: 1,
      userSelect: 'none',
    }),
  }

  return (
    <div style={s.wrap}>
      {/* Corners — pure inline, no Tailwind */}
      <span style={s.corner(6,  undefined, undefined, 6 )}>❋</span>
      <span style={s.corner(6,  6, undefined, undefined)}>❋</span>
      <span style={s.corner(undefined, undefined, 6, 6 )}>❋</span>
      <span style={s.corner(undefined, 6, 6, undefined  )}>❋</span>

      {/* ── Main body ── */}
      <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* Brand */}
        <p style={{ fontSize: 10, letterSpacing: '0.28em', color: '#7c6b2e', textTransform: 'uppercase', margin: 0 }}>
          ThinkVerge · LMS Platform
        </p>
        <div style={{ width: 44, height: 1.5, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '6px auto' }} />

        {/* Title */}
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1e3a5f', letterSpacing: '0.04em', margin: '4px 0' }}>
          Certificate of Completion
        </h1>

        <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: '6px 0 10px' }}>
          This is to certify that
        </p>

        {/* Student name */}
        <p style={{ fontSize: 30, color: '#c9a84c', fontStyle: 'italic', fontWeight: 'bold', margin: '0 0 4px', lineHeight: 1.2 }}>
          {cert.studentName}
        </p>
        <div style={{ width: 180, height: 1, background: '#c9a84c', margin: '4px auto 10px' }} />

        <p style={{ fontSize: 12, color: '#475569', fontStyle: 'italic', margin: '0 0 4px' }}>
          has successfully completed the course
        </p>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: '#1e3a5f', margin: '2px 0 10px' }}>
          {cert.courseTitle}
        </p>

        {/* Stars + grade */}
        {cert.averageScore != null && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <Stars score={cert.averageScore} />
            <span style={{
              background: cert.averageScore >= 90 ? '#059669' : cert.averageScore >= 75 ? '#2563eb' : '#7c3aed',
              color: 'white', fontSize: 9, fontWeight: 'bold',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '2px 10px', borderRadius: 20,
            }}>
              {cert.gradeLabel ?? 'Pass'} · {cert.averageScore}% avg
            </span>
          </div>
        )}
      </div>

      {/* ── Footer: Signature | Seal+Date | QR ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 10,
        flexShrink: 0,
      }}>

        {/* Signature block */}
        <div style={{ textAlign: 'center', width: 160, flexShrink: 0 }}>
          <Signature name={cert.instructorName || 'Instructor'} />
          <p style={{ fontSize: 8, color: '#94a3b8', margin: '3px 0 1px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Course Instructor
          </p>
          <p style={{ fontSize: 10, color: '#1e3a5f', fontWeight: 'bold', margin: 0 }}>
            {cert.instructorName || '—'}
          </p>
        </div>

        {/* Centre: seal + date + ID */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 4px', boxShadow: '0 2px 8px rgba(217,119,6,0.35)',
          }}>
            <span style={{ fontSize: 20 }}>🎓</span>
          </div>
          <p style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Issued on</p>
          <p style={{ fontSize: 10, color: '#1e3a5f', fontWeight: 'bold', margin: '1px 0' }}>{issued}</p>
          <p style={{ fontSize: 8, color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>{certId}</p>
        </div>

        {/* QR code */}
        <div style={{ textAlign: 'center', width: 100, flexShrink: 0 }}>
          <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 8, padding: 4, display: 'inline-block', background: 'white' }}>
            <QRCode value={verifyUrl} size={72} />
          </div>
          <p style={{ fontSize: 8, color: '#94a3b8', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            Scan to verify
          </p>
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
    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Certificate – ${cert.courseTitle}</title>
      <style>
        @page { size: A4 landscape; margin: 0; }
        body { margin: 0; padding: 16px; display: flex; align-items: center;
               justify-content: center; min-height: 100vh; box-sizing: border-box; }
        * { box-sizing: border-box; }
        img { display: block; }
      </style>
    </head><body>${content}</body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 700)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 25px 60px rgba(0,0,0,0.25)', width: '100%', maxWidth: 800, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={18} color="#f59e0b" />
            <span style={{ fontWeight: 600, color: '#1e293b' }}>Certificate of Completion</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
              <Printer size={13} /> Print / Save PDF
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#94a3b8' }}>
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
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                <Award size={24} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-800">{cert.courseTitle}</p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Calendar size={10} />
                  Issued {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Awarded to <strong>{cert.studentName}</strong>
                  {cert.gradeLabel && (
                    <span style={{
                      marginLeft: 8, padding: '1px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                      background: cert.averageScore >= 90 ? '#059669' : cert.averageScore >= 75 ? '#2563eb' : '#7c3aed',
                      color: 'white',
                    }}>{cert.gradeLabel}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setViewing(cert)} className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors">
                  <Eye size={12} /> View
                </button>
                <button onClick={() => setViewing(cert)} className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-lg transition-colors">
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
                <span className="w-5 h-5 rounded-full bg-royal-gradient text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
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
