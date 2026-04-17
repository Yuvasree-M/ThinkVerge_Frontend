import { useQuery } from '@tanstack/react-query'
import { enrollmentApi, progressApi, submissionApi, moduleApi, lessonApi } from '../../api/services'
import StatCard from '../../components/common/StatCard'
import ProgressBar from '../../components/common/ProgressBar'
import { PageSpinner } from '../../components/common/Spinner'
import { BookOpen, BarChart2, FileText, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function StudentDashboard() {
  const { user } = useAuth()

  const { data: enrollments = [], isLoading: le } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.myEnrollments().then(r => r.data),
  })
  const { data: progress = [], isLoading: lp } = useQuery({
    queryKey: ['my-progress'],
    queryFn: () => progressApi.myProgress().then(r => r.data),
  })
  const { data: submissions = [] } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => submissionApi.mySubmissions().then(r => r.data),
  })
function CourseProgress({ courseId, progressMap }) {
  const { data: modules = [] } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const res = await Promise.all(
        modules.map(m =>
          lessonApi.getByModule(m.id).then(r => r.data)
        )
      )
      return res.flat()
    },
    enabled: modules.length > 0,
  })

  let pct = 0

  if (lessons.length > 0) {
    const completed = lessons.filter(l => {
      const p = progressMap[l.id]
      return p?.completed || (p?.percentage ?? 0) >= 100
    }).length

    pct = Math.round((completed / lessons.length) * 100)
  }

  return (
    <div>
      {/* % TEXT */}
      <div className="flex justify-end mb-1">
        <span className="text-xs text-royal-600 font-semibold">
          {pct}%
        </span>
      </div>

      {/* BAR */}
      <ProgressBar value={pct} showPercent={false} />
    </div>
  )
}
const progressMap = {}
progress.forEach(p => {
  progressMap[p.lessonId] = p
})
  if (le || lp) return <PageSpinner />

  const approved   = enrollments.filter(e => e.status === 'APPROVED')
  const graded     = submissions.filter(s => s.grade != null)
  const avgGrade   = graded.length ? Math.round(graded.reduce((s, x) => s + x.grade, 0) / graded.length) : 0
const completedLessons = progress.filter(
  p => p.completed || (p.percentage ?? 0) >= 100
).length
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-royal-gradient p-6 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-gold-500/10 rounded-full translate-y-32" />
        <div className="relative z-10">
          <p className="text-royal-200 text-sm font-medium mb-1">Welcome back,</p>
          <h2 className="font-display font-bold text-2xl mb-1">{user?.name || user?.email?.split('@')[0]} 👋</h2>
          <p className="text-royal-200 text-sm">You have {approved.length} active course{approved.length !== 1 ? 's' : ''} in progress.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled"    value={approved.length}    icon={BookOpen}  color="blue" />
        <StatCard label="Lessons Done"value={completedLessons}    icon={BarChart2} color="green" />
        <StatCard label="Submissions" value={submissions.length} icon={FileText}  color="gold" />
        <StatCard label="Avg. Grade"  value={avgGrade ? `${avgGrade}%` : '—'} icon={Trophy} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active courses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-navy-900">My Courses</h2>
            <Link to="/student/enrollments" className="btn-ghost text-xs">View all →</Link>
          </div>
          <div className="space-y-4">
{approved.slice(0, 4).map(e => {
  const courseId = e.course?.id

  return (
    <div key={e.id}>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-medium text-navy-800 truncate flex-1 mr-2">
          {e.course?.title}
        </p>
      </div>

      <CourseProgress
        courseId={courseId}
        progressMap={progressMap}
      />
    </div>
  )
})}
            {approved.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-lms mb-3">No active courses yet.</p>
                <Link to="/student/courses" className="btn-primary text-xs">Browse Courses</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent submissions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-navy-900">Recent Submissions</h2>
            <Link to="/student/submissions" className="btn-ghost text-xs">View all →</Link>
          </div>
          <div className="space-y-3">
            {submissions.slice(0, 4).map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-royal-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-gold-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{s.assignment?.title || 'Assignment'}</p>
                  <p className="text-xs text-slate-lms">{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}</p>
                </div>
                {s.grade != null
                  ? <span className="badge-green text-xs">{s.grade} pts</span>
                  : <span className="badge-yellow text-xs">Pending</span>
                }
              </div>
            ))}
            {submissions.length === 0 && <p className="text-sm text-slate-lms text-center py-4">No submissions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
