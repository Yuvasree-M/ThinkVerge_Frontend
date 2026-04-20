// // pages/CertificateViewPage.jsx  — public, shareable, printable
// import { useParams } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { certificateApi } from '../api/services'

// // ── QR Code via free API ──────────────────────────────────────
// function QRCode({ value, size = 100 }) {
//   const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&margin=4&color=1e3a5f`
//   return <img src={url} alt="Scan to verify" width={size} height={size} style={{ display: 'block' }} />
// }

// // ── SVG Signature ─────────────────────────────────────────────
// function Signature({ name }) {
//   return (
//     <svg width="180" height="52" viewBox="0 0 180 52" style={{ overflow: 'visible' }}>
//       <line x1="0" y1="46" x2="180" y2="46" stroke="#1e3a5f" strokeWidth="1" strokeOpacity="0.25" />
//       <text
//         x="90" y="40"
//         textAnchor="middle"
//         fill="#1e3a5f"
//         style={{
//           fontSize: '20px',
//           fontFamily: '"Brush Script MT","Segoe Script","Dancing Script",cursive',
//           fontStyle: 'italic',
//         }}
//       >
//         {name}
//       </text>
//     </svg>
//   )
// }

// export default function CertificateViewPage() {
//   const { id } = useParams()

//   const { data: cert, isLoading, isError } = useQuery({
//     queryKey: ['certificate', id],
//     queryFn: () => certificateApi.getById(id).then(r => r.data),
//     retry: false,
//   })

//   if (isLoading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
//     </div>
//   )

//   if (isError || !cert) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center">
//         <p className="text-2xl font-bold text-gray-400">Certificate not found</p>
//         <p className="text-sm text-gray-400 mt-2">This certificate may have been removed or the link is invalid.</p>
//       </div>
//     </div>
//   )

//   const issued = cert.issuedAt
//     ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
//     : '—'

//   const certId    = `TKV-${String(cert.id).padStart(6, '0')}`
//   const verifyUrl = window.location.href   // this page IS the verify URL

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center p-6 print:p-0 print:bg-white">

//       {/* Toolbar — hidden on print */}
//       <div className="mb-6 flex gap-3 print:hidden">
//         <button
//           onClick={() => window.print()}
//           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow transition-colors"
//         >
//           🖨️ Print / Save PDF
//         </button>
//         <button
//           onClick={() => {
//             navigator.clipboard?.writeText(verifyUrl)
//               .then(() => alert('Verification link copied!'))
//               .catch(() => {})
//           }}
//           className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm transition-colors"
//         >
//           🔗 Copy Link
//         </button>
//         <button
//           onClick={() => window.history.back()}
//           className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm transition-colors"
//         >
//           ← Back
//         </button>
//       </div>

//       {/* ── Certificate card ── */}
//       <div
//         className="bg-white w-full max-w-3xl shadow-2xl overflow-hidden print:shadow-none print:max-w-full"
//         style={{
//           fontFamily: 'Georgia, serif',
//           border: '12px solid #1e3a5f',
//           boxShadow: 'inset 0 0 0 4px #c9a84c, 0 20px 60px rgba(0,0,0,0.15)',
//           borderRadius: 16,
//         }}
//       >
//         {/* Top bar */}
//         <div style={{ height: 10, background: 'linear-gradient(90deg,#f59e0b,#d97706,#f59e0b)' }} />

//         <div style={{
//           padding: '40px 56px 28px',
//           background: 'linear-gradient(160deg,#fefce8 0%,#ffffff 40%,#f0f7ff 100%)',
//           position: 'relative',
//           textAlign: 'center',
//         }}>
//           {/* Corner ornaments */}
//           {[['8px','8px'],['8px','auto'],['auto','8px'],['auto','auto']].map(([t,r,b,l], i) => {
//             const pos = [
//               { top: 8, left: 8 }, { top: 8, right: 8 },
//               { bottom: 8, left: 8 }, { bottom: 8, right: 8 }
//             ][i]
//             return (
//               <div key={i} style={{ position: 'absolute', ...pos, fontSize: 32, opacity: 0.15, lineHeight: 1 }}>❋</div>
//             )
//           })}

//           {/* Seal */}
//           <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
//             <div style={{
//               width: 72, height: 72, borderRadius: '50%',
//               background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
//             }}>
//               <span style={{ fontSize: 32 }}>🎓</span>
//             </div>
//           </div>

//           <p style={{ fontSize: 11, letterSpacing: '0.3em', color: '#7c6b2e', textTransform: 'uppercase', marginBottom: 4 }}>
//             ThinkVerge LMS
//           </p>
//           <div style={{ width: 50, height: 2, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '8px auto' }} />

//           <h1 style={{ fontSize: 34, fontWeight: 'bold', color: '#1e3a5f', letterSpacing: '0.04em', margin: '10px 0 4px' }}>
//             Certificate of Completion
//           </h1>

//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '14px 0' }}>
//             <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
//             <span style={{ color: '#c9a84c', fontSize: 18 }}>✦</span>
//             <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
//           </div>

//           <p style={{ fontSize: 14, color: '#64748b', fontStyle: 'italic', marginBottom: 12 }}>This is to certify that</p>

//           <p style={{ fontSize: 44, color: '#c9a84c', fontStyle: 'italic', fontWeight: 'bold', margin: '0 0 8px', lineHeight: 1.1 }}>
//             {cert.studentName}
//           </p>
//           <div style={{ width: 220, height: 1, background: '#c9a84c', margin: '6px auto 14px' }} />

//           <p style={{ fontSize: 14, color: '#475569', fontStyle: 'italic', marginBottom: 6 }}>has successfully completed the course</p>

//           <div style={{
//             display: 'inline-block',
//             background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)',
//             border: '1px solid #c7d2fe',
//             borderRadius: 16, padding: '8px 28px', marginBottom: 14,
//           }}>
//             <p style={{ fontSize: 22, fontWeight: 'bold', color: '#4f46e5' }}>{cert.courseTitle}</p>
//           </div>

//           <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', maxWidth: 440, margin: '0 auto 16px' }}>
//             and has demonstrated the knowledge and skills required to earn this certification.
//           </p>

//           {/* Stars + grade */}
//           {cert.averageScore != null && (
//             <div style={{ marginBottom: 20 }}>
//               <div style={{ fontSize: 20, color: '#c9a84c', letterSpacing: '0.4em', marginBottom: 6 }}>
//                 {cert.averageScore >= 90 ? '★ ★ ★ ★ ★' :
//                  cert.averageScore >= 75 ? '★ ★ ★ ★ ☆' :
//                  cert.averageScore >= 60 ? '★ ★ ★ ☆ ☆' : '★ ★ ☆ ☆ ☆'}
//               </div>
//               <span style={{
//                 display: 'inline-block',
//                 background: cert.averageScore >= 90 ? '#059669' : cert.averageScore >= 75 ? '#2563eb' : '#7c3aed',
//                 color: 'white', fontSize: 11, fontWeight: 'bold',
//                 letterSpacing: '0.15em', textTransform: 'uppercase',
//                 padding: '3px 16px', borderRadius: 20,
//               }}>
//                 {cert.gradeLabel ?? 'Pass'} · {cert.averageScore}% avg
//               </span>
//             </div>
//           )}

//           {/* ── FOOTER: Signature | Seal | QR ── */}
//           <div style={{
//             display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
//             width: '100%', paddingTop: 16,
//             borderTop: '1px solid #e2e8f0', marginTop: 8,
//           }}>

//             {/* Instructor signature */}
//             <div style={{ textAlign: 'center' }}>
//               <Signature name={cert.instructorName ?? 'Instructor'} />
//               <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
//                 Course Instructor
//               </p>
//               <p style={{ fontSize: 11, color: '#1e3a5f', fontWeight: 'bold' }}>
//                 {cert.instructorName ?? '—'}
//               </p>
//             </div>

//             {/* Centre seal + date + ID */}
//             <div style={{ textAlign: 'center', flex: 1 }}>
//               <div style={{
//                 width: 56, height: 56, borderRadius: '50%',
//                 background: 'linear-gradient(135deg,#f59e0b,#d97706)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 margin: '0 auto 6px', boxShadow: '0 2px 10px rgba(217,119,6,0.4)',
//               }}>
//                 <span style={{ color: 'white', fontSize: 26 }}>⭐</span>
//               </div>
//               <p style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Issued on</p>
//               <p style={{ fontSize: 11, color: '#1e3a5f', fontWeight: 'bold', marginTop: 1 }}>{issued}</p>
//               <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 3, fontFamily: 'monospace' }}>{certId}</p>
//             </div>

//             {/* QR code */}
//             <div style={{ textAlign: 'center' }}>
//               <div style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: 5, display: 'inline-block', background: 'white' }}>
//                 <QRCode value={verifyUrl} size={88} />
//               </div>
//               <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
//                 Scan to verify
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Bottom bar */}
//         <div style={{ height: 10, background: 'linear-gradient(90deg,#f59e0b,#d97706,#f59e0b)' }} />
//       </div>

//       <p className="mt-4 text-xs text-gray-400 print:hidden">
//         {certId} · Issued by ThinkVerge LMS · Scan the QR code to verify authenticity
//       </p>
//     </div>
//   )
// }

// pages/CertificateViewPage.jsx  — public, shareable, printable
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { certificateApi } from '../api/services'

// ── QR Code via free API ──────────────────────────────────────
function QRCode({ value, size = 100 }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&margin=4&color=1e3a5f`
  return <img src={url} alt="Scan to verify" width={size} height={size} style={{ display: 'block' }} />
}

// ── SVG Signature ─────────────────────────────────────────────
function Signature({ name }) {
  return (
    <svg width="180" height="52" viewBox="0 0 180 52" style={{ overflow: 'visible' }}>
      <line x1="0" y1="46" x2="180" y2="46" stroke="#1e3a5f" strokeWidth="1" strokeOpacity="0.25" />
      <text
        x="90" y="40"
        textAnchor="middle"
        fill="#1e3a5f"
        style={{
          fontSize: '20px',
          fontFamily: '"Brush Script MT","Segoe Script","Dancing Script",cursive',
          fontStyle: 'italic',
        }}
      >
        {name}
      </text>
    </svg>
  )
}

export default function CertificateViewPage() {
  const { id } = useParams()

  const { data: cert, isLoading, isError } = useQuery({
    queryKey: ['certificate', id],
    queryFn: () => certificateApi.getById(id).then(r => r.data),
    retry: false,
  })

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  )

  if (isError || !cert) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-400">Certificate not found</p>
        <p className="text-sm text-gray-400 mt-2">This certificate may have been removed or the link is invalid.</p>
      </div>
    </div>
  )

  const issued = cert.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  const certId    = `TKV-${String(cert.id).padStart(6, '0')}`
  const verifyUrl = window.location.href   // this page IS the verify URL

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center p-6 print:p-0 print:bg-white">

      {/* Toolbar — hidden on print */}
      <div className="mb-6 flex gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow transition-colors"
        >
          🖨️ Print / Save PDF
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(verifyUrl)
              .then(() => alert('Verification link copied!'))
              .catch(() => {})
          }}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm transition-colors"
        >
          🔗 Copy Link
        </button>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* ── Certificate card ── */}
      <div
        className="bg-white w-full max-w-3xl shadow-2xl overflow-hidden print:shadow-none print:max-w-full"
        style={{
          fontFamily: 'Georgia, serif',
          border: '12px solid #1e3a5f',
          boxShadow: 'inset 0 0 0 4px #c9a84c, 0 20px 60px rgba(0,0,0,0.15)',
          borderRadius: 16,
        }}
      >
        {/* Top bar */}
        <div style={{ height: 10, background: 'linear-gradient(90deg,#f59e0b,#d97706,#f59e0b)' }} />

        <div style={{
          padding: '40px 56px 28px',
          background: 'linear-gradient(160deg,#fefce8 0%,#ffffff 40%,#f0f7ff 100%)',
          position: 'relative',
          textAlign: 'center',
        }}>
          {/* Corner ornaments */}
          {[['8px','8px'],['8px','auto'],['auto','8px'],['auto','auto']].map(([t,r,b,l], i) => {
            const pos = [
              { top: 8, left: 8 }, { top: 8, right: 8 },
              { bottom: 8, left: 8 }, { bottom: 8, right: 8 }
            ][i]
            return (
              <div key={i} style={{ position: 'absolute', ...pos, fontSize: 32, opacity: 0.15, lineHeight: 1 }}>❋</div>
            )
          })}

          {/* Seal */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
            }}>
              <span style={{ fontSize: 32 }}>🎓</span>
            </div>
          </div>

          <p style={{ fontSize: 11, letterSpacing: '0.3em', color: '#7c6b2e', textTransform: 'uppercase', marginBottom: 4 }}>
            ThinkVerge LMS
          </p>
          <div style={{ width: 50, height: 2, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '8px auto' }} />

          <h1 style={{ fontSize: 34, fontWeight: 'bold', color: '#1e3a5f', letterSpacing: '0.04em', margin: '10px 0 4px' }}>
            Certificate of Completion
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '14px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <span style={{ color: '#c9a84c', fontSize: 18 }}>✦</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>

          <p style={{ fontSize: 14, color: '#64748b', fontStyle: 'italic', marginBottom: 12 }}>This is to certify that</p>

          <p style={{ fontSize: 44, color: '#c9a84c', fontStyle: 'italic', fontWeight: 'bold', margin: '0 0 8px', lineHeight: 1.1 }}>
            {cert.studentName}
          </p>
          <div style={{ width: 220, height: 1, background: '#c9a84c', margin: '6px auto 14px' }} />

          <p style={{ fontSize: 14, color: '#475569', fontStyle: 'italic', marginBottom: 6 }}>has successfully completed the course</p>

          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)',
            border: '1px solid #c7d2fe',
            borderRadius: 16, padding: '8px 28px', marginBottom: 14,
          }}>
            <p style={{ fontSize: 22, fontWeight: 'bold', color: '#4f46e5' }}>{cert.courseTitle}</p>
          </div>

          <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', maxWidth: 440, margin: '0 auto 16px' }}>
            and has demonstrated the knowledge and skills required to earn this certification.
          </p>

          {/* Stars + grade */}
          {cert.averageScore != null && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 20, color: '#c9a84c', letterSpacing: '0.4em', marginBottom: 6 }}>
                {cert.averageScore >= 90 ? '★ ★ ★ ★ ★' :
                 cert.averageScore >= 75 ? '★ ★ ★ ★ ☆' :
                 cert.averageScore >= 60 ? '★ ★ ★ ☆ ☆' : '★ ★ ☆ ☆ ☆'}
              </div>
              <span style={{
                display: 'inline-block',
                background: cert.averageScore >= 90 ? '#059669' : cert.averageScore >= 75 ? '#2563eb' : '#7c3aed',
                color: 'white', fontSize: 11, fontWeight: 'bold',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '3px 16px', borderRadius: 20,
              }}>
                {cert.gradeLabel ?? 'Pass'} · {cert.averageScore}% avg
              </span>
            </div>
          )}

          {/* ── FOOTER: Signature | Seal | QR ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            width: '100%', paddingTop: 16,
            borderTop: '1px solid #e2e8f0', marginTop: 8,
          }}>

            {/* Instructor signature */}
            <div style={{ textAlign: 'center' }}>
              <Signature name={cert.instructorName ?? 'Instructor'} />
              <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Course Instructor
              </p>
              <p style={{ fontSize: 11, color: '#1e3a5f', fontWeight: 'bold' }}>
                {cert.instructorName ?? '—'}
              </p>
            </div>

            {/* Centre seal + date + ID */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 6px', boxShadow: '0 2px 10px rgba(217,119,6,0.4)',
              }}>
                <span style={{ color: 'white', fontSize: 26 }}>⭐</span>
              </div>
              <p style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Issued on</p>
              <p style={{ fontSize: 11, color: '#1e3a5f', fontWeight: 'bold', marginTop: 1 }}>{issued}</p>
              <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 3, fontFamily: 'monospace' }}>{certId}</p>
            </div>

            {/* QR code */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: 5, display: 'inline-block', background: 'white' }}>
                <QRCode value={verifyUrl} size={88} />
              </div>
              <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Scan to verify
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ height: 10, background: 'linear-gradient(90deg,#f59e0b,#d97706,#f59e0b)' }} />
      </div>

      <p className="mt-4 text-xs text-gray-400 print:hidden">
        {certId} · Issued by ThinkVerge LMS · Scan the QR code to verify authenticity
      </p>
    </div>
  )
}
