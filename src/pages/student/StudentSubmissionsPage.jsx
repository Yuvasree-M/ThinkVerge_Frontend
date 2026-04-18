// pages/student/StudentSubmissionsPage.jsx
import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { submissionApi, enrollmentApi, assignmentApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import SubmitAssignmentModal from '../../components/submissions/SubmitAssignmentModal'
import useModal from '../../hooks/useModal'
import {
  FileText, Plus, Star, Clock,
  Download, Eye, ChevronDown, ChevronRight, CheckCircle2,
  Trash2, RefreshCw, AlertTriangle, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

// ✅ Google Docs viewer for inline PDF rendering
const pdfViewerUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('blob:')) return url
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

// ── Confirm Delete Dialog ─────────────────────────────────
function ConfirmDeleteDialog({ isOpen, onConfirm, onCancel, isPending }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-navy-800 text-sm">Delete Submission?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This will permanently remove your submission. You can resubmit afterwards.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="btn-ghost text-sm"
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="btn-primary bg-red-500 hover:bg-red-600 text-sm flex items-center gap-2"
          >
            {isPending
              ? <><Loader2 size={13} className="animate-spin" /> Deleting…</>
              : <><Trash2 size={13} /> Yes, Delete</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudentSubmissionsPage() {
  const qc = useQueryClient()
  const submitModal = useModal()
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)   // submission id to delete

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

  // ✅ Delete mutation
  const { mutate: deleteSubmission, isPending: isDeleting } = useMutation({
    mutationFn: (id) => submissionApi.delete(id),
    onSuccess: () => {
      toast.success('Submission deleted. You can resubmit now.')
      setDeleteTarget(null)
      qc.invalidateQueries({ queryKey: ['my-submissions'] })
    },
    onError: () => {
      toast.error('Failed to delete submission')
      setDeleteTarget(null)
    },
  })

  if (ls) return <PageSpinner />

  const approved     = enrollments.filter(e => e.status === 'APPROVED')
  // ✅ Map by assignmentId for quick lookup
  const submissionByAssignment = Object.fromEntries(
    submissions.map(s => [s.assignmentId, s])
  )

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
                  const existing   = submissionByAssignment[a.id]
                  const submitted  = !!existing
                  const isGraded   = existing?.grade != null
                  const isOverdue  = a.dueDate && new Date() > new Date(a.dueDate)

                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-royal-50"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-navy-700 block truncate">{a.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
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
                          {/* ✅ show graded badge on the left panel too */}
                          {isGraded && (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                              <Star size={9} /> {existing.grade}pts
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ✅ Action buttons based on state */}
                      {isGraded ? (
                        // Graded — locked, no actions
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      ) : submitted ? (
                        // Submitted but not graded — allow resubmit or delete
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            title="Resubmit"
                            className="btn-ghost text-xs text-royal-500 px-1.5 py-1 flex items-center gap-0.5"
                            onClick={() => submitModal.open(a)}
                          >
                            <RefreshCw size={11} /> Edit
                          </button>
                          <button
                            title="Delete submission"
                            className="btn-ghost text-xs text-red-400 px-1.5 py-1 flex items-center gap-0.5"
                            onClick={() => setDeleteTarget(existing.id)}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ) : (
                        // Not submitted yet
                        <button
                          className="btn-ghost text-xs text-royal-500 px-2 py-1 flex-shrink-0 flex items-center gap-0.5"
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
            {submissions.map(s => {
              const isGraded = s.grade != null
              return (
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

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isGraded ? (
                        <div className="flex items-center gap-1 badge-green">
                          <Star size={11} /> {s.grade} pts
                        </div>
                      ) : (
                        <>
                          <span className="badge-yellow flex items-center gap-1">
                            <Clock size={11} /> Pending
                          </span>
                          {/* ✅ Resubmit + Delete on card header (pending only) */}
                          <button
                            title="Resubmit"
                            onClick={() => {
                              // Find the assignment from submissions data and open modal
                              submitModal.open({ id: s.assignmentId, title: s.assignmentTitle })
                            }}
                            className="btn-ghost text-xs text-royal-500 flex items-center gap-1 px-2 py-1"
                          >
                            <RefreshCw size={11} /> Resubmit
                          </button>
                          <button
                            title="Delete submission"
                            onClick={() => setDeleteTarget(s.id)}
                            className="btn-ghost text-xs text-red-400 flex items-center gap-1 px-2 py-1"
                          >
                            <Trash2 size={11} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ✅ Graded lock notice */}
                  {isGraded && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 mb-2">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      This submission has been graded and can no longer be modified.
                    </div>
                  )}

                  {/* Written answer preview */}
                  {s.content && (
                    <p className="text-xs text-navy-600 bg-surface rounded-lg p-2.5 line-clamp-2 mb-2">
                      {s.content}
                    </p>
                  )}

                  {/* Submitted PDF — inline preview + view + download */}
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
              )
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <SubmitAssignmentModal
        isOpen={submitModal.isOpen}
        onClose={submitModal.close}
        assignment={submitModal.data}
        onSubmitted={() => qc.invalidateQueries({ queryKey: ['my-submissions'] })}
      />

      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        isPending={isDeleting}
        onConfirm={() => deleteSubmission(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}