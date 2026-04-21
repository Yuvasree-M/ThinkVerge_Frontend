import { useQuery } from '@tanstack/react-query'
import { courseApi, userApi, publicApi } from '../../api/services'
import StatCard from '../../components/common/StatCard'
import { PageSpinner } from '../../components/common/Spinner'
import { BookOpen, Users, GraduationCap, CheckCircle2, MessageSquare, Star, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

function PendingRow({ course }) {
  return (
    <tr>
      <td className="font-medium">{course.title}</td>
      <td className="text-slate-lms">{course.instructorName || '—'}</td>
      <td><span className="badge-blue">{course.category}</span></td>
      <td>{course.durationHours}h</td>
      <td><Link to="/admin/courses" className="text-xs text-royal-600 hover:underline">Review →</Link></td>
    </tr>
  )
}

function InstructorRow({ user }) {
  const initials = (user.name || user.email || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-royal-100 bg-white hover:border-royal-300 hover:shadow-royal transition-all">
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-xl bg-royal-gradient flex items-center justify-center text-white text-xs font-bold">{initials}</div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy-900 truncate">{user.name || '—'}</p>
        <p className="text-xs text-slate-lms truncate">{user.email}</p>
      </div>
      {user.courseCount != null && (
        <span className="shrink-0 text-xs font-medium text-royal-700 bg-royal-50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <BookOpen size={11} />{user.courseCount}
        </span>
      )}
    </div>
  )
}

function StarRating({ value = 0 }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
      ))}
    </span>
  )
}

function SentimentBadge({ rating }) {
  if (rating >= 4) return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Positive</span>
  if (rating >= 3) return <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Neutral</span>
  return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Negative</span>
}

/**
 * PendingFeedbackPanel
 * Requires feedbackApi.getPending() → [{ id, courseTitle, studentName, rating, comment }]
 */
function PendingFeedbackPanel() {
  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ['pending-feedback'],
    queryFn: () => feedbackApi.getPending().then(r => r.data),
  })

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-semibold text-navy-900 text-lg flex items-center gap-2">
            <MessageSquare size={18} className="text-royal-500" />
            Pending Feedback
          </h2>
          <p className="text-xs text-slate-lms mt-0.5">
            {feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''} awaiting moderation
          </p>
        </div>
        <Link to="/admin/feedback" className="btn-ghost text-xs flex items-center gap-1">
          View all <ChevronRight size={13} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-slate-lms text-sm gap-2">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-royal-300 border-t-royal-600 rounded-full" />
          Loading…
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-lms">
          <CheckCircle2 size={28} className="text-emerald-400" />
          <p className="text-sm">No pending feedback — all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.slice(0, 5).map(fb => (
            <div key={fb.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-royal-50 hover:border-royal-200 transition-colors">
              <div className="w-8 h-8 rounded-full bg-royal-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(fb.studentName || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-navy-900 truncate">{fb.studentName || 'Anonymous'}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <StarRating value={fb.rating} />
                    <SentimentBadge rating={fb.rating} />
                  </div>
                </div>
                <p className="text-xs text-slate-lms mt-0.5 truncate">
                  on <span className="text-navy-700 font-medium">{fb.courseTitle}</span>
                </p>
                {fb.comment && (
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">"{fb.comment}"</p>
                )}
              </div>
              <Link to={`/admin/feedback/${fb.id}`} className="shrink-0 text-xs text-royal-600 hover:underline whitespace-nowrap">
                Review →
              </Link>
            </div>
          ))}
          {feedbacks.length > 5 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <AlertCircle size={13} />
              {feedbacks.length - 5} more pending —{' '}
              <Link to="/admin/feedback" className="underline font-medium ml-1">view all</Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => courseApi.getAllAdmin().then(r => r.data),
  })
  const { data: instructors = [] } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => userApi.instructors().then(r => r.data),
  })
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => userApi.students().then(r => r.data),
  })

  if (loadingCourses) return <PageSpinner />

  const pending  = courses.filter(c => c.status === 'PENDING')
  const approved = courses.filter(c => c.status === 'APPROVED')

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Courses"  value={courses.length}     icon={BookOpen}      color="blue"   />
        <StatCard label="Approved"       value={approved.length}    icon={CheckCircle2}  color="green"  />
        <StatCard label="Instructors"    value={instructors.length} icon={GraduationCap} color="gold"   />
        <StatCard label="Students"       value={students.length}    icon={Users}         color="purple" />
      </div>

      {/* Pending course approvals */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-semibold text-navy-900 text-lg">Pending Approvals</h2>
            <p className="text-xs text-slate-lms mt-0.5">{pending.length} courses awaiting review</p>
          </div>
          <Link to="/admin/courses" className="btn-ghost text-xs">View all</Link>
        </div>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-lms text-center py-8">All courses reviewed! ✅</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Course</th><th>Instructor</th><th>Category</th><th>Duration</th><th>Actions</th></tr></thead>
              <tbody>{pending.slice(0, 5).map(c => <PendingRow key={c.id} course={c} />)}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── NEW: Pending Feedback ── */}
      <PendingFeedbackPanel />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-navy-800">Recent Instructors</h3>
            <Link to="/admin/instructors" className="btn-ghost text-xs">View all</Link>
          </div>
          <div className="space-y-2">
            {instructors.slice(0, 5).map(u => <InstructorRow key={u.id} user={u} />)}
            {instructors.length === 0 && <p className="text-sm text-slate-lms py-4 text-center">No instructors yet.</p>}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-navy-800">Approved Courses</h3>
            <Link to="/admin/courses" className="btn-ghost text-xs">View all</Link>
          </div>
          <div className="space-y-3">
            {approved.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-lms">{c.category}</p>
                </div>
              </div>
            ))}
            {approved.length === 0 && <p className="text-sm text-slate-lms py-4 text-center">No approved courses yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}