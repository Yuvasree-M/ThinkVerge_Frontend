import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { courseApi, enrollmentApi } from '../../api/services'
import CourseCard from '../../components/courses/CourseCard'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import { BookOpen, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Programming Language', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business', 'DevOps', 'AI / ML']

export default function StudentBrowseCoursesPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [requesting, setRequesting] = useState(null)

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll().then(r => r.data),
  })

  const { data: enrollments = [] } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.myEnrollments().then(r => r.data),
  })

  const enrolledIds = new Set(enrollments.map(e => e.course?.id))

  const filtered = courses.filter(c => {
    const matchCat = category === 'All' || c.category === category
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleEnroll = async (courseId) => {
    setRequesting(courseId)
    try {
      await enrollmentApi.request(courseId)
      toast.success('Enrollment request sent! Awaiting instructor approval.')
      qc.invalidateQueries({ queryKey: ['my-enrollments'] })
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to request enrollment')
    } finally {
      setRequesting(null)
    }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      {/* Search + Filter */}
      <div className="card flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5 border border-royal-100 flex-1">
          <Search size={15} className="text-slate-lms" />
          <input
            className="bg-transparent text-sm flex-1 focus:outline-none placeholder-slate-muted"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${category === cat ? 'bg-royal-gradient text-white shadow-royal' : 'bg-white border border-royal-100 text-slate-lms hover:border-royal-300 hover:text-navy-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-lms">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" description="Try a different search or category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(course => {
            const isEnrolled = enrolledIds.has(course.id)
            return (
              <CourseCard
                key={course.id}
                course={course}
                actions={
                  isEnrolled ? (
                    <span className="badge-green flex-1 justify-center py-2">✓ Enrolled</span>
                  ) : (
                    <button
                      className="btn-primary flex-1 justify-center text-xs py-2"
                      disabled={requesting === course.id}
                      onClick={() => handleEnroll(course.id)}
                    >
                      {requesting === course.id ? 'Requesting...' : 'Request Enrollment'}
                    </button>
                  )
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
