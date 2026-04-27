import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { progressApi, enrollmentApi, moduleApi, lessonApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import ProgressBar from '../../components/common/ProgressBar'
import {
  BarChart2, PlayCircle, FileText, CheckCircle2,
  ChevronDown, ChevronUp, BookOpen, Trophy
} from 'lucide-react'

function useCourseProgress(courseId, progressMap) {
  const { data: modules = [] } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  const { data: allLessons = [], isFetching } = useQuery({
    queryKey: ['course-lessons-progress', courseId, modules.map(m => m.id).join(',')],
    queryFn: async () => {
      const results = await Promise.all(
        modules.map(m => lessonApi.getByModule(m.id).then(r => r.data))
      )
      return results.flat()
    },
    enabled: modules.length > 0,
  })

  const completed = allLessons.filter(l => {
    const p = progressMap[l.id]
    return p?.completed || (p?.percentage ?? 0) >= 100
  }).length

  return { completed, total: allLessons.length, ready: !isFetching }
}

function LessonProgressRow({ lesson, progressEntry, index }) {
  const isDone = progressEntry?.completed || (progressEntry?.percentage ?? 0) >= 100
  const percentage = progressEntry?.percentage ?? 0
  const typeIcon = lesson.type === 'VIDEO' ? <PlayCircle size={12} /> : <FileText size={12} />

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
      isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-600'
    }`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
      }`}>
        {isDone ? <CheckCircle2 size={11} className="text-emerald-500" /> : typeIcon}
      </div>
      <span className="flex-1 truncate font-medium">{index + 1}. {lesson.title}</span>
      {!isDone && percentage > 0 && (
        <span className="text-indigo-500 font-semibold tabular-nums">{percentage}%</span>
      )}
      {isDone && <span className="text-emerald-500 font-medium">Done</span>}
    </div>
  )
}

function ModuleProgressSection({ module, progressMap, index }) {
  const [open, setOpen] = useState(false)

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', module.id],
    queryFn: () => lessonApi.getByModule(module.id).then(r => r.data),
    enabled: !!module.id,
  })

  const completedCount = lessons.filter(l => {
    const p = progressMap[l.id]
    return p?.completed || (p?.percentage ?? 0) >= 100
  }).length
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0
  const isDone = lessons.length > 0 && completedCount === lessons.length

  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
        }`}>
          {isDone ? <CheckCircle2 size={14} /> : index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{module.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-32">
              <div
                className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-xs font-medium tabular-nums ${isDone ? 'text-emerald-500' : 'text-gray-400'}`}>
              {completedCount}/{lessons.length}
            </span>
          </div>
        </div>
        <div className="text-gray-300 flex-shrink-0">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-1.5 bg-gray-50/50">
          {isLoading ? (
            [1, 2].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)
          ) : lessons.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">No lessons yet.</p>
          ) : (
            lessons.map((lesson, idx) => (
              <LessonProgressRow
                key={lesson.id}
                lesson={lesson}
                progressEntry={progressMap[lesson.id]}
                index={idx}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function CourseProgressCard({ enrollment, progressMap, isOpen, onToggle }) {
  const cid = enrollment.course?.id
  const { completed, total, ready } = useCourseProgress(cid, progressMap)
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const isComplete = pct === 100 && ready && total > 0

  const { data: modules = [] } = useQuery({
    queryKey: ['modules', cid],
    queryFn: () => moduleApi.getByCourse(cid).then(r => r.data),
    enabled: !!cid,
  })

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-navy-800 truncate">
              {enrollment.course?.title}
            </h3>
            {isComplete && (
              <span className="badge-green flex items-center gap-1">
                <Trophy size={11} /> Completed
              </span>
            )}
          </div>
          <p className="text-xs text-slate-lms mt-0.5">{enrollment.course?.category}</p>
        </div>
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-xs text-royal-600 hover:text-royal-800 font-medium border border-royal-200 rounded-lg px-2.5 py-1.5 transition-colors sm:flex-shrink-0"
        >
          <BookOpen size={12} />
          {isOpen ? 'Hide' : 'View Modules'}
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      <ProgressBar
        value={pct}
        label={total > 0 ? `${completed} of ${total} lessons done` : 'No lessons yet'}
      />

      {isOpen && cid && (
        <div className="mt-5 space-y-3">
          {modules.length === 0 ? (
            <p className="text-xs text-slate-lms py-4 text-center">No modules in this course.</p>
          ) : (
            modules.map((mod, idx) => (
              <ModuleProgressSection
                key={mod.id}
                module={mod}
                progressMap={progressMap}
                index={idx}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function StudentProgressPage() {
  const [expandedCourseId, setExpandedCourseId] = useState(null)

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

  const byCourse = {}
  progressList.forEach(p => {
    const cid = p.courseId
    if (!cid) return
    if (!byCourse[cid]) byCourse[cid] = {}
    byCourse[cid][p.lessonId] = p
  })

  const totalCompleted = progressList.filter(p => p.completed || (p.percentage ?? 0) >= 100).length
  const completionRate = progressList.length
    ? Math.round((totalCompleted / progressList.length) * 100)
    : 0

  const toggleCourse = (cid) =>
    setExpandedCourseId(prev => (prev === cid ? null : cid))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center py-5">
          <p className="text-3xl font-display font-bold text-royal-600">{approved.length}</p>
          <p className="text-xs text-slate-lms mt-1">Active Courses</p>
        </div>
        <div className="card text-center py-5">
          <p className="text-3xl font-display font-bold text-emerald-500">{totalCompleted}</p>
          <p className="text-xs text-slate-lms mt-1">Lessons Completed</p>
        </div>
        <div className="card text-center py-5">
          <p className="text-3xl font-display font-bold text-gold-600">{completionRate}%</p>
          <p className="text-xs text-slate-lms mt-1">Overall Completion</p>
        </div>
      </div>

      {approved.length === 0 ? (
        <EmptyState
          icon={BarChart2}
          title="No progress yet"
          description="Enroll in courses and start completing lessons to track your progress."
        />
      ) : (
        <div className="space-y-4">
          {approved.map(e => {
            const cid = e.course?.id
            const courseProgressMap = byCourse[cid] || {}
            return (
              <CourseProgressCard
                key={e.id}
                enrollment={e}
                progressMap={courseProgressMap}
                isOpen={expandedCourseId === cid}
                onToggle={() => toggleCourse(cid)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
