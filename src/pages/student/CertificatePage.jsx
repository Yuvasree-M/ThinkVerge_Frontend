// pages/student/CertificatePage.jsx
import { useQuery } from '@tanstack/react-query'
import { certificateApi } from '../../api/services.js'
import { PageSpinner } from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Award, Download, ExternalLink, Calendar } from 'lucide-react'

export default function CertificatePage() {
  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['my-certificates'],
    queryFn:  () => certificateApi.myCertificates().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800">My Certificates</h1>
        <p className="text-sm text-slate-400 mt-1">
          Earned by completing all module quizzes and graded assignments
        </p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Complete all module quizzes and have your assignments graded to earn a certificate."
        />
      ) : (
        <div className="grid gap-4">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="card flex items-center gap-5"
            >
              {/* Trophy icon */}
              <div className="w-14 h-14 rounded-2xl bg-amber-gradient flex items-center justify-center flex-shrink-0"
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
                        year: 'numeric', month: 'long', day: 'numeric'
                      })
                    : '—'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Awarded to <strong>{cert.studentName}</strong>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {cert.certificateUrl ? (
                  <>
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost text-xs text-royal-500 flex items-center gap-1.5"
                    >
                      <ExternalLink size={12} /> View
                    </a>
                    <a
                      href={cert.certificateUrl}
                      download={`${cert.courseTitle}_certificate.pdf`}
                      className="btn-primary text-xs flex items-center gap-1.5"
                    >
                      <Download size={12} /> Download
                    </a>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Certificate being generated…
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How to earn section */}
      {certificates.length === 0 && (
        <div className="bg-royal-50 border border-royal-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-navy-800 mb-3">
            How to earn a certificate
          </p>
          <div className="space-y-2">
            {[
              { step: '1', text: 'Complete all lessons in every module' },
              { step: '2', text: 'Pass the quiz at the end of each module (score ≥ passing mark)' },
              { step: '3', text: 'Submit all course assignments' },
              { step: '4', text: 'Wait for your instructor to grade all submissions' },
              { step: '5', text: 'Your certificate will be issued automatically 🎉' },
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
    </div>
  )
}
