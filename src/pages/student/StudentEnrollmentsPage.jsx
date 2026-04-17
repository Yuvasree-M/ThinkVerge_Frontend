import { useQuery } from '@tanstack/react-query'
import {
  enrollmentApi,
  moduleApi,
  lessonApi,
  progressApi
} from '../../api/services'

import Modal from '../../components/common/Modal'
import useModal from '../../hooks/useModal'
import CourseLessonsPanel from '../../components/progress/CourseLessonsPanel'

import {
  BookOpen,
  Clock,
  XCircle,
  PlayCircle
} from 'lucide-react'

export default function StudentEnrollmentsPage() {
  const modal = useModal()

  // ───────── ENROLLMENTS ─────────
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.myEnrollments().then(r => r.data),
  })

  // ───────── PROGRESS ─────────
  const { data: progressList = [] } = useQuery({
    queryKey: ['my-progress'],
    queryFn: () => progressApi.myProgress().then(r => r.data),
  })

  if (isLoading) return <p>Loading...</p>

  // ✅ progress map
  const progressMap = {}
  progressList.forEach(p => {
    if (p.lessonId) progressMap[p.lessonId] = p
  })

  const approved = enrollments.filter(e => e.status === 'APPROVED')
  const pending  = enrollments.filter(e => e.status === 'PENDING')
  const rejected = enrollments.filter(e => e.status === 'REJECTED')

  return (
    <div className="space-y-8">

      {/* ACTIVE COURSES */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Active Courses ({approved.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {approved.map(e => (
            <CourseCard
              key={e.id}
              enrollment={e}
              progressMap={progressMap}
              onOpen={() => modal.open(e.course)}
            />
          ))}

        </div>
      </section>

      {/* PENDING */}
      {pending.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">
            Pending ({pending.length})
          </h2>

          {pending.map(e => (
            <div key={e.id} className="bg-yellow-50 p-3 rounded mb-2 flex gap-2 items-center">
              <Clock size={14} />
              {e.course?.title}
            </div>
          ))}
        </section>
      )}

      {/* REJECTED */}
      {rejected.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">
            Rejected ({rejected.length})
          </h2>

          {rejected.map(e => (
            <div key={e.id} className="bg-red-50 p-3 rounded mb-2 flex gap-2 items-center">
              <XCircle size={14} />
              {e.course?.title}
            </div>
          ))}
        </section>
      )}

      {/* MODAL */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.data?.title}
      >
        {modal.data && (
          <CourseLessonsPanel
            courseId={modal.data.id}
            progressMap={progressMap}
          />
        )}
      </Modal>
    </div>
  )
}

//////////////////////////////////////////////////////////////////////////
// ✅ COURSE CARD (FIXED PROGRESS CALCULATION)
//////////////////////////////////////////////////////////////////////////

function CourseCard({ enrollment, progressMap, onOpen }) {
  const courseId = enrollment.course?.id

  // ───────── MODULES ─────────
  const { data: modules = [] } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  // ───────── LESSONS ─────────
  const { data: lessons = [] } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const results = await Promise.all(
        modules.map(m =>
          lessonApi.getByModule(m.id).then(r => r.data)
        )
      )
      return results.flat()
    },
    enabled: modules.length > 0,
  })

  // ───────── CALCULATE PROGRESS ─────────
  let progress = 0

  if (lessons.length > 0) {
    const completed = lessons.filter(l => {
      const p = progressMap[l.id]
      return p?.completed || (p?.percentage ?? 0) >= 100
    }).length

    progress = Math.round((completed / lessons.length) * 100)
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">

      {/* Thumbnail */}
      <div className="h-28 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        {enrollment.course?.thumbnail ? (
          <img
            src={enrollment.course.thumbnail}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen size={28} className="text-gray-400" />
        )}
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-sm">
          {enrollment.course?.title}
        </h3>
        <p className="text-xs text-gray-500">
          {enrollment.course?.category}
        </p>
      </div>

      {/* ✅ PROGRESS BAR */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={onOpen}
        className="bg-blue-600 text-white text-xs py-2 rounded flex items-center justify-center gap-1"
      >
        <PlayCircle size={14} />
        Continue
      </button>
    </div>
  )
}