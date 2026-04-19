// pages/CertificateViewPage.jsx
// Public page — renders a printable certificate for any certificate ID
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { certificateApi } from '../api/services'

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

  const issuedDate = cert.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : '—'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center p-6 print:p-0 print:bg-white">

      {/* Print button — hidden when printing */}
      <div className="mb-6 flex gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow transition-colors"
        >
          🖨️ Print Certificate
        </button>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Certificate card */}
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-full"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Top gold bar */}
        <div className="h-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />

        {/* Body */}
        <div className="px-12 py-14 print:px-16 print:py-12 text-center relative">

          {/* Corner ornaments */}
          <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-amber-300 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-amber-300 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-amber-300 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-amber-300 rounded-br-lg" />

          {/* Logo / seal */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
              <span className="text-4xl">🎓</span>
            </div>
          </div>

          {/* ThinkVerge */}
          <p className="text-indigo-700 font-bold tracking-[0.3em] text-sm uppercase mb-1">
            ThinkVerge LMS
          </p>

          {/* Certificate of Completion */}
          <h1
            className="text-4xl font-bold text-gray-800 mt-2 mb-1"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Certificate of Completion
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-5">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-amber-500 text-xl">✦</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          {/* This is to certify */}
          <p className="text-gray-500 text-base mb-4" style={{ fontStyle: 'italic' }}>
            This is to certify that
          </p>

          {/* Student name */}
          <p
            className="text-5xl font-bold text-indigo-800 mb-5"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.02em' }}
          >
            {cert.studentName}
          </p>

          {/* Has successfully completed */}
          <p className="text-gray-500 text-base mb-3" style={{ fontStyle: 'italic' }}>
            has successfully completed the course
          </p>

          {/* Course title */}
          <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl px-8 py-3 mb-6">
            <p className="text-2xl font-bold text-indigo-700">
              {cert.courseTitle}
            </p>
          </div>

          {/* Description line */}
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-8" style={{ fontStyle: 'italic' }}>
            and has demonstrated the knowledge and skills required to earn this certification.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-32 bg-gradient-to-r from-transparent to-gray-200" />
            <span className="text-gray-300 text-lg">◆</span>
            <div className="h-px w-32 bg-gradient-to-l from-transparent to-gray-200" />
          </div>

          {/* Footer row — date + cert ID */}
          <div className="flex items-end justify-between px-8">
            <div className="text-left">
              <div className="h-px w-36 bg-gray-300 mb-1" />
              <p className="text-xs text-gray-500 uppercase tracking-wider">Date of Issue</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{issuedDate}</p>
            </div>

            {/* Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center bg-amber-50 shadow">
                <span className="text-2xl">⭐</span>
              </div>
              <p className="text-xs text-amber-600 font-bold mt-1 uppercase tracking-wider">Certified</p>
            </div>

            <div className="text-right">
              <div className="h-px w-36 bg-gray-300 mb-1" />
              <p className="text-xs text-gray-500 uppercase tracking-wider">Certificate ID</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5 font-mono">TKV-{String(cert.id).padStart(6, '0')}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />
      </div>

      <p className="mt-4 text-xs text-gray-400 print:hidden">
        Certificate ID: TKV-{String(cert.id).padStart(6, '0')} · Issued by ThinkVerge LMS
      </p>
    </div>
  )
}
