import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { courseApi, assignmentApi, submissionApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import GradeModal from '../../components/submissions/GradeModal'
import useModal from '../../hooks/useModal'
import { FileText, Star, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'

export default function InstructorSubmissionsPage() {
  const qc = useQueryClient()
  const gradeModal = useModal()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const { data: courses = [], isLoading: lc } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseApi.myCourses().then(r => r.data),
  })

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments', selectedCourse],
    queryFn: () => assignmentApi.byCourse(selectedCourse).then(r => r.data),
    enabled: !!selectedCourse,
  })

  const { data: submissions = [], isLoading: ls } = useQuery({
    queryKey: ['submissions', selectedAssignment],
    queryFn: () => submissionApi.byAssignment(selectedAssignment).then(r => r.data),
    enabled: !!selectedAssignment,
  })

  if (lc) return <PageSpinner />

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Course + Assignment selector */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-lms uppercase tracking-wider">Select Course</p>
        {courses.map(c => (
          <div key={c.id}>
            <button
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedCourse === c.id ? 'border-royal-400 bg-royal-50' : 'border-royal-100 bg-white hover:border-royal-200'}`}
              onClick={() => { setSelectedCourse(c.id === selectedCourse ? null : c.id); setSelectedAssignment(null) }}
            >
              <div className="w-8 h-8 rounded-lg bg-royal-gradient flex items-center justify-center flex-shrink-0">
                <FileText size={13} className="text-white" />
              </div>
              <span className="text-sm font-medium text-navy-800 flex-1 truncate">{c.title}</span>
              {selectedCourse === c.id ? <ChevronDown size={14} className="text-slate-lms" /> : <ChevronRight size={14} className="text-slate-lms" />}
            </button>

            {selectedCourse === c.id && assignments.length > 0 && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-royal-100 pl-3">
                {assignments.map(a => (
                  <button
                    key={a.id}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${selectedAssignment === a.id ? 'bg-royal-500 text-white' : 'text-navy-600 hover:bg-royal-50'}`}
                    onClick={() => setSelectedAssignment(a.id)}
                  >
                    {a.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right: Submissions */}
      <div className="lg:col-span-2">
        {!selectedAssignment ? (
          <EmptyState icon={FileText} title="Select an assignment" description="Choose a course and assignment from the left to view submissions." />
        ) : ls ? (
          <PageSpinner />
        ) : submissions.length === 0 ? (
          <EmptyState icon={FileText} title="No submissions yet" description="Students haven't submitted anything for this assignment." />
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-navy-700">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
            {submissions.map(sub => (
              <div key={sub.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-royal-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(sub.student?.name || sub.student?.email || 'S')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-navy-800 text-sm">{sub.student?.name || '—'}</p>
                      <p className="text-xs text-slate-lms">{sub.student?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {sub.grade != null ? (
                      <span className="badge-green flex items-center gap-1">
                        <Star size={11} /> {sub.grade} pts
                      </span>
                    ) : (
                      <span className="badge-yellow">Ungraded</span>
                    )}
                    <button className="btn-primary text-xs py-1.5 px-3" onClick={() => gradeModal.open(sub)}>
                      {sub.grade != null ? 'Re-grade' : 'Grade'}
                    </button>
                  </div>
                </div>

                {sub.content && (
                  <p className="mt-3 text-sm text-navy-600 bg-surface rounded-lg p-3 line-clamp-3">{sub.content}</p>
                )}
                {sub.fileUrl && (
                  <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-royal-500 hover:underline">
                    <ExternalLink size={12} /> View submitted file
                  </a>
                )}
                {sub.feedback && (
                  <p className="mt-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                    <strong>Feedback:</strong> {sub.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <GradeModal
        isOpen={gradeModal.isOpen}
        onClose={gradeModal.close}
        submission={gradeModal.data}
        onGraded={() => qc.invalidateQueries({ queryKey: ['submissions', selectedAssignment] })}
      />
    </div>
  )
}
