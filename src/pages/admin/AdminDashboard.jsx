import { useQuery } from '@tanstack/react-query'
import { courseApi, userApi } from '../../api/services'
import StatCard from '../../components/common/StatCard'
import { PageSpinner } from '../../components/common/Spinner'
import { BookOpen, Users, GraduationCap, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  // Fetch all courses (pending + approved + rejected)
  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => courseApi.getAllAdmin().then(r => r.data), // <-- changed here
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

  // Filter pending & approved courses
  const pending  = courses.filter(c => c.status === 'PENDING')
  const approved = courses.filter(c => c.status === 'APPROVED')

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Courses"   value={courses.length}      icon={BookOpen}      color="blue" />
        <StatCard label="Approved"        value={approved.length}     icon={CheckCircle2}  color="green" />
        <StatCard label="Instructors"     value={instructors.length}  icon={GraduationCap} color="gold" />
        <StatCard label="Students"        value={students.length}     icon={Users}         color="purple" />
      </div>

      {/* Pending approvals */}
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
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.slice(0, 5).map(course => (
                  <PendingRow key={course.id} course={course} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-display font-semibold text-navy-800 mb-4">Recent Instructors</h3>
          <div className="space-y-3">
            {instructors.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-royal-gradient flex items-center justify-center text-white text-xs font-bold">
                  {(u.name || u.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-800">{u.name || '—'}</p>
                  <p className="text-xs text-slate-lms">{u.email}</p>
                </div>
              </div>
            ))}
            {instructors.length === 0 && <p className="text-sm text-slate-lms">No instructors yet.</p>}
          </div>
        </div>

        <div className="card">
          <h3 className="font-display font-semibold text-navy-800 mb-4">Approved Courses</h3>
          <div className="space-y-3">
            {approved.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-lms">{c.category}</p>
                </div>
              </div>
            ))}
            {approved.length === 0 && <p className="text-sm text-slate-lms">No approved courses yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function PendingRow({ course }) {
  return (
    <tr>
      <td className="font-medium">{course.title}</td>

      <td className="text-slate-lms">
        {course.instructorName || '—'}
      </td>

      <td>
        <span className="badge-blue">
          {course.category}
        </span>
      </td>

      <td>{course.durationHours}h</td>

      <td>
        <Link
          to="/admin/courses"
          className="text-xs text-royal-600 hover:underline"
        >
          Review →
        </Link>
      </td>
    </tr>
  )
}