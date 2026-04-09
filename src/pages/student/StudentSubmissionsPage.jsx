import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { submissionApi, enrollmentApi, assignmentApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import SubmitAssignmentModal from '../../components/submissions/SubmitAssignmentModal'
import useModal from '../../hooks/useModal'
import { FileText, Plus, Star, Clock, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'

export default function StudentSubmissionsPage() {
  const qc = useQueryClient()
  const submitModal = useModal()
  const [expandedCourse, setExpandedCourse] = useState(null)

  const { data: submissions = [], isLoading: ls } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => submissionApi.mySubmissions().then(r => r.data),
  })

  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.myEnrollments().then(r => r.data),
  })

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments-for-course', expandedCourse],
    queryFn: () => assignmentApi.byCourse(expandedCourse).then(r => r.data),
    enabled: !!expandedCourse,
  })

  if (ls) return <PageSpinner />

  const approved = enrollments.filter(e => e.status === 'APPROVED')
  const submittedIds = new Set(submissions.map(s => s.assignment?.id))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left: courses + assignments to submit */}
      <div className="lg:col-span-2 space-y-3">
        <p className="text-xs font-semibold text-slate-lms uppercase tracking-wider">Available Assignments</p>
        {approved.map(e => (
          <div key={e.id}>
            <button
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${expandedCourse === e.course?.id ? 'border-royal-400 bg-royal-50' : 'border-royal-100 bg-white hover:border-royal-200'}`}
              onClick={() => setExpandedCourse(p => p === e.course?.id ? null : e.course?.id)}
            >
              <div className="w-8 h-8 rounded-lg bg-royal-gradient flex items-center justify-center flex-shrink-0">
                <FileText size={13} className="text-white" />
              </div>
              <span className="text-sm font-medium text-navy-800 flex-1 truncate">{e.course?.title}</span>
              {expandedCourse === e.course?.id ? <ChevronDown size={14} className="text-slate-lms" /> : <ChevronRight size={14} className="text-slate-lms" />}
            </button>

            {expandedCourse === e.course?.id && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-royal-100 pl-3">
                {assignments.length === 0 && <p className="text-xs text-slate-lms py-2">No assignments.</p>}
                {assignments.map(a => {
                  const submitted = submittedIds.has(a.id)
                  return (
                    <div key={a.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-royal-50">
                      <span className="text-xs text-navy-700 flex-1 truncate">{a.title}</span>
                      {submitted
                        ? <span className="text-xs text-emerald-500 font-semibold">✓</span>
                        : (
                          <button
                            className="btn-ghost text-xs text-royal-500 px-2 py-1"
                            onClick={() => submitModal.open(a)}
                          >
                            <Plus size={11} /> Submit
                          </button>
                        )
                      }
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
        {approved.length === 0 && <p className="text-xs text-slate-lms py-4">Enroll in courses to see assignments.</p>}
      </div>

      {/* Right: My submissions */}
      <div className="lg:col-span-3">
        <p className="text-xs font-semibold text-slate-lms uppercase tracking-wider mb-3">My Submissions ({submissions.length})</p>
        {submissions.length === 0 ? (
          <EmptyState icon={FileText} title="No submissions yet" description="Select an assignment from the left to submit your work." />
        ) : (
          <div className="space-y-3">
            {submissions.map(s => (
              <div key={s.id} className="card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-navy-800 text-sm">{s.assignment?.title || 'Assignment'}</p>
                    <p className="text-xs text-slate-lms mt-0.5">
                      Submitted: {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}
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

                {s.content && (
                  <p className="text-xs text-navy-600 bg-surface rounded-lg p-2.5 line-clamp-2">{s.content}</p>
                )}
                {s.fileUrl && (
                  <a href={s.fileUrl} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs text-royal-500 hover:underline">
                    <ExternalLink size={11} /> View submission
                  </a>
                )}
                {s.feedback && (
                  <div className="mt-2 text-xs bg-emerald-50 text-emerald-700 rounded-lg px-3 py-2">
                    <strong>Feedback:</strong> {s.feedback}
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
