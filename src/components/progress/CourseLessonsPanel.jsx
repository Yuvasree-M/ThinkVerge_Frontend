import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonApi, moduleApi, progressApi } from '../../api/services'
import {
  ChevronDown, ChevronUp, CheckCircle2,
  ExternalLink, Download, Video, FileText, File, Image
} from 'lucide-react'

// ── TYPE CONFIG ─────────────────────────────
const TYPE_CONFIG = {
  VIDEO: { icon: Video,    color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'Video'  },
  TEXT:  { icon: FileText, color: 'text-green-500',  bg: 'bg-green-50',  label: 'Text'   },
  PDF:   { icon: File,     color: 'text-red-500',    bg: 'bg-red-50',    label: 'PDF'    },
  IMAGE: { icon: Image,    color: 'text-purple-500', bg: 'bg-purple-50', label: 'Image'  },
}
const getTypeConf = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.TEXT

// ── DOWNLOAD ────────────────────────────────
async function handleDownload(url, filename) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    a.click()

    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// ── LESSON ROW ──────────────────────────────
function LessonViewRow({ lesson, progressEntry }) {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)

  const conf = getTypeConf(lesson.type || 'TEXT')
  const Icon = conf.icon

  const isDone =
    progressEntry?.completed ||
    (progressEntry?.percentage ?? 0) >= 100

  // ── Auto-complete ──
  useEffect(() => {
    if (!expanded || isDone) return
    if (!['TEXT', 'PDF', 'IMAGE'].includes(lesson.type)) return

    const autoComplete = async () => {
      try {
        if (lesson.type === 'TEXT') {
          await progressApi.completeText(lesson.id)
        } else {
          await progressApi.completeLesson(lesson.id)
        }
        queryClient.invalidateQueries({ queryKey: ['my-progress'] })
      } catch {}
    }

    autoComplete()
  }, [expanded, isDone, lesson.id, lesson.type])

  // ── Video progress ──
  const lastReportedRef = useRef(-1)

  const handleVideoProgress = (e) => {
    const video = e.target
    if (!video.duration) return

    const percentage = Math.floor((video.currentTime / video.duration) * 100)

    if (percentage % 10 === 0 && percentage !== lastReportedRef.current) {
      lastReportedRef.current = percentage
      progressApi.updateVideo(lesson.id, percentage)
      queryClient.invalidateQueries({ queryKey: ['my-progress'] })
    }

    if (percentage >= 95 && !isDone) {
      progressApi.completeLesson(lesson.id)
      queryClient.invalidateQueries({ queryKey: ['my-progress'] })
    }
  }

  return (
    <div className={`rounded-xl border transition-all shadow-sm ${
      isDone
        ? 'bg-emerald-50 border-emerald-100'
        : 'bg-white border-gray-100 hover:shadow-md'
    }`}>

      {/* HEADER */}
      <div className="flex items-center gap-3 p-3 sm:p-4">

        {/* ICON */}
        <div className={`${conf.bg} ${conf.color} p-2 rounded-lg`}>
          <Icon size={16} />
        </div>

        {/* TEXT */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm sm:text-base font-medium truncate ${
            isDone ? 'line-through text-gray-400' : 'text-gray-800'
          }`}>
            {lesson.title}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs font-medium ${conf.color}`}>
              {conf.label}
            </span>

            {progressEntry?.percentage > 0 && !isDone && (
              <span className="text-xs text-blue-500 font-semibold">
                {progressEntry.percentage}%
              </span>
            )}
          </div>
        </div>

        {/* ACTION */}
        <div className="flex items-center gap-2">
          {isDone && (
            <CheckCircle2 size={18} className="text-emerald-500" />
          )}

          <button
            onClick={() => setExpanded(v => !v)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {expanded && (
        <div className="border-t bg-gray-50 p-3 sm:p-4 space-y-3">

          {lesson.type === 'TEXT' && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {lesson.content}
            </p>
          )}

          {lesson.type === 'IMAGE' && lesson.fileUrl && (
            <img
              src={lesson.fileUrl}
              className="w-full max-h-64 object-contain rounded"
            />
          )}

          {lesson.type === 'PDF' && lesson.fileUrl && (
            <iframe
              src={lesson.fileUrl}
              className="w-full h-72 rounded border"
            />
          )}

          {lesson.type === 'VIDEO' && lesson.fileUrl && (
            <video
              src={lesson.fileUrl}
              controls
              className="w-full max-h-72 rounded"
              onTimeUpdate={handleVideoProgress}
            />
          )}

          {/* ACTIONS */}
          {lesson.fileUrl && (
            <div className="flex gap-4 flex-wrap text-xs font-medium">
              <a
                href={lesson.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <ExternalLink size={12}/> Open
              </a>

              <button
                onClick={() => handleDownload(lesson.fileUrl, lesson.title)}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Download size={12}/> Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── MODULE SECTION ──────────────────────────
function ModuleLessonsSection({ module, progressMap }) {
  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons', module.id],
    queryFn: () => lessonApi.getByModule(module.id).then(r => r.data),
    enabled: !!module.id,
  })

  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase">
          {module.title}
        </h4>

        <span className="text-xs text-gray-400">
          {lessons.filter(l => progressMap[l.id]?.completed).length}/{lessons.length}
        </span>
      </div>

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

// ── MAIN PANEL ──────────────────────────────
export default function CourseLessonsPanel({ courseId, progressMap }) {
  const { data: modules = [] } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  return (
    <div className="space-y-5 sm:space-y-6">
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