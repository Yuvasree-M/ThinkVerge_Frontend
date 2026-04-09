import { useQuery } from '@tanstack/react-query'
import { courseApi, enrollmentApi, submissionApi } from '../../api/services'
import StatCard from '../../components/common/StatCard'
import { PageSpinner } from '../../components/common/Spinner'
import { BookOpen, Users, FileText, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function InstructorDashboard() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseApi.myCourses().then(r => r.data),
  })
  const { data: pending = [] } = useQuery({
    queryKey: ['pending-enrollments'],
    queryFn: () => enrollmentApi.pending().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />

  const approved = courses.filter(c => c.status === 'APPROVED')
  const pendingCourses = courses.filter(c => c.status === 'PENDING')

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Courses"      value={courses.length}       icon={BookOpen} color="blue" />
        <StatCard label="Live Courses"       value={approved.length}      icon={BookOpen} color="green" />
        <StatCard label="Pending Approval"   value={pendingCourses.length}icon={Clock}    color="gold" />
        <StatCard label="Enrollment Requests"value={pending.length}       icon={Users}    color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-navy-900">My Courses</h2>
            <Link to="/instructor/courses" className="btn-ghost text-xs">Manage →</Link>
          </div>
          <div className="space-y-3">
            {courses.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-royal-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-royal-gradient flex items-center justify-center flex-shrink-0">
                  <BookOpen size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-lms">{c.category}</p>
                </div>
                <span className={c.status === 'APPROVED' ? 'badge-green' : c.status === 'PENDING' ? 'badge-yellow' : 'badge-red'}>
                  {c.status}
                </span>
              </div>
            ))}
            {courses.length === 0 && <p className="text-sm text-slate-lms text-center py-4">No courses created yet.</p>}
          </div>
        </div>

        {/* Pending enrollments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-navy-900">Enrollment Requests</h2>
            <Link to="/instructor/enrollments" className="btn-ghost text-xs">View all →</Link>
          </div>
          <div className="space-y-3">
            {pending.slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-royal-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(e.student?.name || e.student?.email || 'S')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800">{e.student?.name || e.student?.email}</p>
                  <p className="text-xs text-slate-lms truncate">{e.course?.title}</p>
                </div>
                <span className="badge-yellow">Pending</span>
              </div>
            ))}
            {pending.length === 0 && <p className="text-sm text-slate-lms text-center py-4">No pending requests.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
