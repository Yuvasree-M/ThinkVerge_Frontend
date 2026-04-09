import { useQuery } from '@tanstack/react-query'
import { progressApi, enrollmentApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import ProgressBar from '../../components/common/ProgressBar'
import { BarChart2, PlayCircle, FileText, CheckCircle2 } from 'lucide-react'

export default function StudentProgressPage() {
  const { data: progressList = [], isLoading: lp } = useQuery({
    queryKey: ['my-progress'],
    queryFn: () => progressApi.myProgress().then(r => r.data),
  })

  const { data: enrollments = [], isLoading: le } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.myEnrollments().then(r => r.data),
  })

  if (lp || le) return <PageSpinner />

  const approved = enrollments.filter(e => e.status === 'APPROVED')

  // Group progress by course
  const byCourse = {}
  progressList.forEach(p => {
    const cid = p.courseId || p.lesson?.module?.courseId
    if (!cid) return
    if (!byCourse[cid]) byCourse[cid] = []
    byCourse[cid].push(p)
  })

  const totalCompleted = progressList.filter(p => p.completed || p.percentage >= 100).length

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-display font-bold text-royal-600">{approved.length}</p>
          <p className="text-xs text-slate-lms mt-1">Active Courses</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-display font-bold text-emerald-500">{totalCompleted}</p>
          <p className="text-xs text-slate-lms mt-1">Lessons Completed</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-display font-bold text-gold-600">{progressList.length}</p>
          <p className="text-xs text-slate-lms mt-1">Total Interactions</p>
        </div>
      </div>

      {approved.length === 0 ? (
        <EmptyState icon={BarChart2} title="No progress yet" description="Enroll in courses and start completing lessons to track your progress." />
      ) : (
        <div className="space-y-4">
          {approved.map(e => {
            const cid = e.course?.id
            const courseProgress = byCourse[cid] || []
            const completed = courseProgress.filter(p => p.completed || p.percentage >= 100).length
            const total = courseProgress.length || 0
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0

            return (
              <div key={e.id} className="card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-navy-800">{e.course?.title}</h3>
                    <p className="text-xs text-slate-lms mt-0.5">{e.course?.category}</p>
                  </div>
                  {pct === 100 && (
                    <span className="badge-green flex-shrink-0">
                      <CheckCircle2 size={12} /> Completed
                    </span>
                  )}
                </div>

                <ProgressBar value={pct} label={`${completed} of ${total} lessons done`} />

                {courseProgress.length > 0 && (
                  <div className="mt-4 space-y-1.5">
                    {courseProgress.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-navy-600">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${(p.completed || p.percentage >= 100) ? 'bg-emerald-100' : 'bg-royal-50'}`}>
                          {p.lessonType === 'VIDEO'
                            ? <PlayCircle size={11} className={(p.completed || p.percentage >= 100) ? 'text-emerald-500' : 'text-royal-400'} />
                            : <FileText size={11} className={(p.completed || p.percentage >= 100) ? 'text-emerald-500' : 'text-royal-400'} />
                          }
                        </div>
                        <span className="flex-1 truncate">{p.lesson?.title || `Lesson ${i + 1}`}</span>
                        {p.percentage != null && p.percentage < 100 && (
                          <span className="text-royal-500 font-medium">{p.percentage}%</span>
                        )}
                        {(p.completed || p.percentage >= 100) && (
                          <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                    {courseProgress.length > 5 && (
                      <p className="text-xs text-slate-lms pl-7">+{courseProgress.length - 5} more lessons</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
