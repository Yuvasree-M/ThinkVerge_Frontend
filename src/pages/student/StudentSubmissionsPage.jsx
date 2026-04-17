// pages/student/StudentSubmissionsPage.jsx
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { submissionApi, enrollmentApi, assignmentApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import SubmitAssignmentModal from '../../components/submissions/SubmitAssignmentModal'
import useModal from '../../hooks/useModal'
import {
  FileText, Plus, Star, Clock,
  Download, Eye, ChevronDown, ChevronRight, CheckCircle2
} from 'lucide-react'

// ✅ Google Docs viewer for inline PDF rendering
const pdfViewerUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('blob:')) return url
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

export default function StudentSubmissionsPage() {
  const qc = useQueryClient()
  const submitModal = useModal()
  const [expandedCourse, setExpandedCourse] = useState(null)

  const { data: submissions = [], isLoading: ls } = useQuery({
    queryKey: ['my-submissions'],
    queryFn:  () => submissionApi.mySubmissions().then(r => r.data),
  })

  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn:  () => enrollmentApi.myEnrollments().then(r => r.data),
  })

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments-for-course', expandedCourse],
    queryFn:  () => assignmentApi.byCourse(expandedCourse).then(r => r.data),
    enabled:  !!expandedCourse,
  })

  if (ls) return <PageSpinner />

  const approved     = enrollments.filter(e => e.status === 'APPROVED')
  const submittedIds = new Set(submissions.map(s => s.assignmentId))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* ── Left: courses + assignments ── */}
      <div className="lg:col-span-2 space-y-3">
        <p className="text-xs font-semibold text-slate-lms uppercase tracking-wider">
          Available Assignments
        </p>

        {approved.map(e => (
          <div key={e.id}>
            <button
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                expandedCourse === e.course?.id
                  ? 'border-royal-400 bg-royal-50'
                  : 'border-royal-100 bg-white hover:border-royal-200'
              }`}
              onClick={() => setExpandedCourse(p => p === e.course?.id ? null : e.course?.id)}
            >
              <div className="w-8 h-8 rounded-lg bg-royal-gradient flex items-center justify-center flex-shrink-0">
                <FileText size={13} className="text-white" />
              </div>
              <span className="text-sm font-medium text-navy-800 flex-1 truncate">
                {e.course?.title}
              </span>
              {expandedCourse === e.course?.id
                ? <ChevronDown  size={14} className="text-slate-lms" />
                : <ChevronRight size={14} className="text-slate-lms" />
              }
            </button>

            {expandedCourse === e.course?.id && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-royal-100 pl-3">
                {assignments.length === 0 && (
                  <p className="text-xs text-slate-lms py-2">No assignments.</p>
                )}
                {assignments.map(a => {
                  const submitted = submittedIds.has(a.id)
                  const isOverdue = a.dueDate && new Date() > new Date(a.dueDate)

                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-royal-50"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-navy-700 block truncate">{a.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {/* ✅ View assignment PDF link */}
                          {a.pdfUrl && (
                            <a
                              href={a.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-royal-500 hover:underline flex items-center gap-0.5"
                            >
                              <Eye size={9} /> View PDF
                            </a>
                          )}
                          {isOverdue && !submitted && (
                            <span className="text-xs text-red-400">Overdue</span>
                          )}
                        </div>
                      </div>

                      {submitted ? (
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <button
                          className="btn-ghost text-xs text-royal-500 px-2 py-1 flex-shrink-0"
                          onClick={() => submitModal.open(a)}
                        >
                          <Plus size={11} /> Submit
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {approved.length === 0 && (
          <p className="text-xs text-slate-lms py-4">Enroll in courses to see assignments.</p>
        )}
      </div>

      {/* ── Right: My submissions ── */}
      <div className="lg:col-span-3">
        <p className="text-xs font-semibold text-slate-lms uppercase tracking-wider mb-3">
          My Submissions ({submissions.length})
        </p>

        {submissions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No submissions yet"
            description="Select an assignment from the left to submit your work."
          />
        ) : (
          <div className="space-y-3">
            {submissions.map(s => (
              <div key={s.id} className="card">

                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-navy-800 text-sm">
                      {s.assignmentTitle || 'Assignment'}
                    </p>
                    <p className="text-xs text-slate-lms mt-0.5 flex items-center gap-1">
                      <Clock size={10} />
                      {s.submittedAt
                        ? `Submitted: ${new Date(s.submittedAt).toLocaleDateString()}`
                        : '—'
                      }
                    </p>
                  </div>
                  {s.grade != null ? (
                    <div className="flex items-center gap-1 badge-green">
                      <Star size={11} /> {s.grade} pts
                    </div>
                  ) : (
                    <span className="badge-yellow flex items-center gap-1">
                      <Clock size={11} /> Pending
                    </span>
                  )}
                </div>

                {/* Written answer preview */}
                {s.content && (
                  <p className="text-xs text-navy-600 bg-surface rounded-lg p-2.5 line-clamp-2 mb-2">
                    {s.content}
                  </p>
                )}

                {/* ✅ Submitted PDF — inline preview + view + download */}
                {s.fileUrl && (
                  <div className="border border-royal-100 rounded-xl overflow-hidden mb-2">
                    <div className="flex items-center justify-between px-3 py-2 bg-royal-50 border-b border-royal-100">
                      <div className="flex items-center gap-1.5">
                        <FileText size={12} className="text-royal-500" />
                        <span className="text-xs font-medium text-navy-700">Your submission</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <a
                          href={s.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost text-xs text-royal-500 flex items-center gap-1 px-2 py-1"
                        >
                          <Eye size={10} /> View
                        </a>
                        {/* ✅ explicit filename forces browser to save as .pdf */}
                        <a
                          href={s.fileUrl}
                          download="my_submission.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost text-xs text-emerald-600 flex items-center gap-1 px-2 py-1"
                        >
                          <Download size={10} /> Download
                        </a>
                      </div>
                    </div>
                    {/* ✅ Google Docs viewer for inline display */}
                    <iframe
                      src={pdfViewerUrl(s.fileUrl)}
                      title="My submission"
                      className="w-full"
                      style={{ height: 180 }}
                    />
                  </div>
                )}

                {/* Instructor feedback */}
                {s.feedback && (
                  <div className="text-xs bg-emerald-50 text-emerald-700 rounded-lg px-3 py-2">
                    <strong>Instructor Feedback:</strong> {s.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <SubmitAssignmentModal
        isOpen={submitModal.isOpen}
        onClose={submitModal.close}
        assignment={submitModal.data}
        onSubmitted={() => qc.invalidateQueries({ queryKey: ['my-submissions'] })}
      />
    </div>
  )
}