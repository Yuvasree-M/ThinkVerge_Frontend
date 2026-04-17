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

import { BookOpen, Clock, XCircle, PlayCircle, ChevronRight, Award } from 'lucide-react'

export default function StudentEnrollmentsPage() {
  const modal = useModal()

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.myEnrollments().then(r => r.data),
  })

  const { data: progressList = [] } = useQuery({
    queryKey: ['my-progress'],
    queryFn: () => progressApi.myProgress().then(r => r.data),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400 tracking-wide">Loading your courses…</p>
      </div>
    </div>
  )

  const progressMap = {}
  progressList.forEach(p => {
    if (p.lessonId) progressMap[p.lessonId] = p
  })

  const approved = enrollments.filter(e => e.status === 'APPROVED')
  const pending  = enrollments.filter(e => e.status === 'PENDING')
  const rejected = enrollments.filter(e => e.status === 'REJECTED')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

  

      {/* ACTIVE COURSES */}
      {approved.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
  <Award size={15} />
  Active Courses
</h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {approved.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
      )}

      {/* EMPTY STATE */}
      {approved.length === 0 && pending.length === 0 && rejected.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <BookOpen size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No enrollments yet</p>
          <p className="text-sm text-gray-400 mt-1">Browse courses to get started</p>
        </div>
      )}

      {/* PENDING + REJECTED IN A ROW */}
      {(pending.length > 0 || rejected.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {pending.length > 0 && (
            <section className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={15} className="text-amber-500" />
                <h2 className="text-sm font-semibold text-amber-800">
                  Pending Approval
                </h2>
                <span className="ml-auto bg-amber-100 text-amber-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pending.length}
                </span>
              </div>
              <ul className="space-y-2">
                {pending.map(e => (
                  <li key={e.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Clock size={13} className="text-amber-500" />
                    </div>
                    <span className="truncate">{e.course?.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {rejected.length > 0 && (
            <section className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={15} className="text-red-400" />
                <h2 className="text-sm font-semibold text-red-800">
                  Rejected
                </h2>
                <span className="ml-auto bg-red-100 text-red-500 text-xs font-medium px-2 py-0.5 rounded-full">
                  {rejected.length}
                </span>
              </div>
              <ul className="space-y-2">
                {rejected.map(e => (
                  <li key={e.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <XCircle size={13} className="text-red-400" />
                    </div>
                    <span className="truncate">{e.course?.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
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

// ─────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────

function CourseCard({ enrollment, progressMap, onOpen }) {
  const courseId = enrollment.course?.id

  const { data: modules = [] } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  const { data: lessons = [] } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const results = await Promise.all(
        modules.map(m => lessonApi.getByModule(m.id).then(r => r.data))
      )
      return results.flat()
    },
    enabled: modules.length > 0,
  })

  let progress = 0
  if (lessons.length > 0) {
    const completed = lessons.filter(l => {
      const p = progressMap[l.id]
      return p?.completed || (p?.percentage ?? 0) >= 100
    }).length
    progress = Math.round((completed / lessons.length) * 100)
  }

  const isComplete = progress === 100
  const completedCount = lessons.filter(l => {
    const p = progressMap[l.id]
    return p?.completed || (p?.percentage ?? 0) >= 100
  }).length

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">

      {/* THUMBNAIL */}
      <div className="relative h-40 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
        {enrollment.course?.thumbnail ? (
          <img
            src={enrollment.course.thumbnail}
            alt={enrollment.course?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={32} className="text-indigo-200" />
          </div>
        )}

        {/* Category badge */}
        {enrollment.course?.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
            {enrollment.course.category}
          </span>
        )}

        {/* Completion badge */}
        {isComplete && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Award size={11} />
            Done
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-4 gap-4">

        {/* Title */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
            {enrollment.course?.title}
          </h3>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{modules.length} module{modules.length !== 1 ? 's' : ''}</span>
          <span className="w-1 h-1 rounded-full bg-gray-200" />
          <span>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</span>
          <span className="w-1 h-1 rounded-full bg-gray-200" />
          <span className={isComplete ? 'text-emerald-500 font-medium' : 'text-gray-400'}>
            {completedCount}/{lessons.length} done
          </span>
        </div>

        {/* PROGRESS */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Progress</span>
            <span className={`font-semibold tabular-nums ${
              isComplete ? 'text-emerald-500' : progress > 0 ? 'text-indigo-600' : 'text-gray-400'
            }`}>
              {progress}%
            </span>
          </div>

          {/* Track */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isComplete
                  ? 'bg-emerald-400'
                  : progress > 60
                    ? 'bg-indigo-500'
                    : progress > 0
                      ? 'bg-indigo-400'
                      : 'bg-gray-200'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
  onClick={onOpen}
  className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
    isComplete
      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
  }`}
>
  {isComplete ? (
    <>
      <Award size={14} />
      Review Course
    </>
  ) : (
    <>
      <PlayCircle size={14} />
      {progress > 0 ? 'Continue Learning' : 'Start Learning'}
      <ChevronRight size={13} className="opacity-60" />
    </>
  )}
</button>
      </div>
    </article>
  )
}