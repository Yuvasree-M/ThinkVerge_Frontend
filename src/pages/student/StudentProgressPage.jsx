import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { progressApi, enrollmentApi, lessonApi, moduleApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import ProgressBar from '../../components/common/ProgressBar'
import {
  BarChart2, PlayCircle, FileText, CheckCircle2,
  ChevronDown, ChevronUp, Download, ExternalLink,
  Video, File, Image, BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Download helper ───────────────────────────────────────
async function handleDownload(url, filename) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  } catch {
    // Fallback: open in new tab if CORS blocks direct download
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// ── Lesson type config ────────────────────────────────────
const TYPE_CONFIG = {
  VIDEO: { icon: Video,    color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'Video'  },
  TEXT:  { icon: FileText, color: 'text-green-500',  bg: 'bg-green-50',  label: 'Text'   },
  PDF:   { icon: File,     color: 'text-red-500',    bg: 'bg-red-50',    label: 'PDF'    },
  IMAGE: { icon: Image,    color: 'text-purple-500', bg: 'bg-purple-50', label: 'Image'  },
}
const getTypeConf = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.TEXT

// ── Single lesson viewer row ──────────────────────────────
function LessonViewRow({ lesson, progressEntry }) {
  const [expanded, setExpanded] = useState(false)
  const conf = getTypeConf(lesson.type)
  const Icon = conf.icon
  const isDone = progressEntry?.completed || (progressEntry?.percentage ?? 0) >= 100

  const downloadUrl  = lesson.type === 'VIDEO' ? lesson.videoUrl : lesson.content
  const isDownloadable =
    lesson.type === 'IMAGE' ||
    lesson.type === 'PDF'   ||
    (lesson.type === 'VIDEO' && /cloudinary\.com/.test(lesson.videoUrl || ''))

  const hasPreview =
    (lesson.type === 'TEXT'  && lesson.content)  ||
    (lesson.type === 'IMAGE' && lesson.content)  ||
    (lesson.type === 'PDF'   && lesson.content)  ||
    (lesson.type === 'VIDEO' && lesson.videoUrl)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-3 p-3">
        {/* type icon */}
        <div className={`${conf.bg} ${conf.color} p-2 rounded-lg flex-shrink-0`}>
          <Icon size={14} />
        </div>

        {/* title + meta */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm truncate ${isDone ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
            {lesson.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs font-medium ${conf.color}`}>{conf.label}</span>
            {lesson.durationSeconds && (
              <span className="text-xs text-gray-400">
                {Math.floor(lesson.durationSeconds / 60)}m {lesson.durationSeconds % 60}s
              </span>
            )}
            {progressEntry?.percentage != null && !isDone && (
              <span className="text-xs text-royal-500 font-medium">{progressEntry.percentage}%</span>
            )}
            {/* Inline download link */}
            {isDownloadable && downloadUrl && (
              <button
                onClick={() => {
                  const ext = lesson.type === 'PDF' ? '.pdf' : lesson.type === 'IMAGE' ? '.jpg' : '.mp4'
                  handleDownload(downloadUrl, `${lesson.title.replace(/\s+/g, '_')}${ext}`)
                }}
                className={`flex items-center gap-0.5 text-xs font-medium ${conf.color} hover:opacity-70 transition-opacity`}
                title={`Download ${conf.label}`}
              >
                <Download size={11} /> Download
              </button>
            )}
          </div>
        </div>

        {/* status + expand */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isDone && <CheckCircle2 size={14} className="text-emerald-500" />}
          {hasPreview && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Preview panel ── */}
      {expanded && (
        <div className="border-t border-gray-100 p-3 bg-gray-50 space-y-2">

          {lesson.type === 'TEXT' && (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{lesson.content}</p>
          )}

          {lesson.type === 'IMAGE' && lesson.content && (
            <div className="space-y-2">
              <img
                src={lesson.content}
                alt={lesson.title}
                className="max-h-56 rounded object-contain"
              />
              <div className="flex gap-3">
                <a
                  href={lesson.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  <ExternalLink size={12} /> View Full Size
                </a>
                <button
                  onClick={() => handleDownload(lesson.content, `${lesson.title.replace(/\s+/g, '_')}.jpg`)}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  <Download size={12} /> Download Image
                </button>
              </div>
            </div>
          )}

          {lesson.type === 'PDF' && lesson.content && (
            <div className="space-y-2">
              <iframe
                src={lesson.content}
                title={lesson.title}
                className="w-full rounded border border-gray-200"
                style={{ height: '320px' }}
              />
              <div className="flex gap-3">
                <a
                  href={lesson.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  <ExternalLink size={12} /> Open in Tab
                </a>
                <button
                  onClick={() => handleDownload(lesson.content, `${lesson.title.replace(/\s+/g, '_')}.pdf`)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  <Download size={12} /> Download PDF
                </button>
              </div>
            </div>
          )}

          {lesson.type === 'VIDEO' && lesson.videoUrl && (
            <div className="space-y-2">
              {/cloudinary\.com/.test(lesson.videoUrl) ? (
                <video
                  src={lesson.videoUrl}
                  controls
                  className="w-full rounded border border-gray-200 max-h-64"
                />
              ) : (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink size={14} /> Watch Video
                </a>
              )}
              <div className="flex gap-3">
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <ExternalLink size={12} /> Open in Tab
                </a>
                {/cloudinary\.com/.test(lesson.videoUrl) && (
                  <button
                    onClick={() => handleDownload(lesson.videoUrl, `${lesson.title.replace(/\s+/g, '_')}.mp4`)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <Download size={12} /> Download Video
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Course lessons panel (lazy-loaded) ────────────────────
function CourseLessonsPanel({ courseId, progressList }) {
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules-for-progress', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  // Build lessonId → progress map
  const progressMap = {}
  progressList.forEach(p => {
    if (p.lessonId) progressMap[p.lessonId] = p
  })

  if (isLoading)
    return <p className="text-xs text-gray-400 py-2 pl-1">Loading lessons…</p>

  if (modules.length === 0)
    return <p className="text-xs text-gray-400 py-2 pl-1">No modules found.</p>

  return (
    <div className="space-y-4 mt-3">
      {modules.map(mod => (
        <ModuleLessonsSection
          key={mod.id}
          module={mod}
          progressMap={progressMap}
        />
      ))}
    </div>
  )
}

// ── Per-module lesson section ─────────────────────────────
function ModuleLessonsSection({ module, progressMap }) {
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons-progress', module.id],
    queryFn: () => lessonApi.getByModule(module.id).then(r => r.data),
    enabled: !!module.id,
  })

  if (isLoading)
    return <p className="text-xs text-gray-400 py-1 pl-1">Loading…</p>

  if (lessons.length === 0) return null

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
        {module.title}
      </p>
      {lessons.map(lesson => (
        <LessonViewRow
          key={lesson.id}
          lesson={lesson}
          progressEntry={progressMap[lesson.id]}
        />
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────
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

  // Group progress by courseId
  const byCourse = {}
  progressList.forEach(p => {
    const cid = p.courseId || p.lesson?.module?.courseId
    if (!cid) return
    if (!byCourse[cid]) byCourse[cid] = []
    byCourse[cid].push(p)
  })

  const totalCompleted = progressList.filter(p => p.completed || p.percentage >= 100).length

  const toggleCourse = (cid) =>
    setExpandedCourseId(prev => (prev === cid ? null : cid))

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
        <EmptyState
          icon={BarChart2}
          title="No progress yet"
          description="Enroll in courses and start completing lessons to track your progress."
        />
      ) : (
        <div className="space-y-4">
          {approved.map(e => {
            const cid = e.course?.id
            const courseProgress = byCourse[cid] || []
            const completed = courseProgress.filter(p => p.completed || p.percentage >= 100).length
            const total     = courseProgress.length || 0
            const pct       = total > 0 ? Math.round((completed / total) * 100) : 0
            const isOpen    = expandedCourseId === cid

            return (
              <div key={e.id} className="card">
                {/* Course header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-navy-800">{e.course?.title}</h3>
                    <p className="text-xs text-slate-lms mt-0.5">{e.course?.category}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {pct === 100 && (
                      <span className="badge-green">
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    )}
                    {/* Toggle lessons panel */}
                    <button
                      onClick={() => toggleCourse(cid)}
                      className="flex items-center gap-1 text-xs text-royal-600 hover:text-royal-800 font-medium border border-royal-200 rounded-lg px-2.5 py-1.5 transition-colors"
                      title={isOpen ? 'Hide lessons' : 'View & Download lessons'}
                    >
                      <BookOpen size={12} />
                      {isOpen ? 'Hide' : 'View Lessons'}
                      {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>

                <ProgressBar value={pct} label={`${completed} of ${total} lessons done`} />

                {/* Quick lesson summary (up to 5) */}
                {!isOpen && courseProgress.length > 0 && (
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

                {/* Full lessons panel with view & download */}
                {isOpen && cid && (
                  <CourseLessonsPanel
                    courseId={cid}
                    progressList={courseProgress}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}