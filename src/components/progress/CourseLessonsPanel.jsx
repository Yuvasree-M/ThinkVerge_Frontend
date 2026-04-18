// import { useState, useEffect, useRef } from 'react'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { lessonApi, moduleApi, progressApi } from '../../api/services'
// import {
//   ChevronDown, ChevronUp, CheckCircle2,
//   ExternalLink, Download, Video, FileText, File, Image,
//   BookOpen, Lock
// } from 'lucide-react'

// // ── TYPE CONFIG ─────────────────────────────────
// const TYPE_CONFIG = {
//   VIDEO: {
//     icon: Video,
//     color: 'text-blue-600',
//     bg: 'bg-blue-50',
//     badge: 'bg-blue-100 text-blue-700',
//     label: 'Video',
//   },
//   TEXT: {
//     icon: FileText,
//     color: 'text-violet-600',
//     bg: 'bg-violet-50',
//     badge: 'bg-violet-100 text-violet-700',
//     label: 'Reading',
//   },
//   PDF: {
//     icon: File,
//     color: 'text-rose-500',
//     bg: 'bg-rose-50',
//     badge: 'bg-rose-100 text-rose-600',
//     label: 'PDF',
//   },
//   IMAGE: {
//     icon: Image,
//     color: 'text-amber-500',
//     bg: 'bg-amber-50',
//     badge: 'bg-amber-100 text-amber-700',
//     label: 'Image',
//   },
// }
// const getTypeConf = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.TEXT

// // ── DOWNLOAD ─────────────────────────────────────
// async function handleDownload(url, filename) {
//   try {
//     const res = await fetch(url)
//     const blob = await res.blob()
//     const blobUrl = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = blobUrl
//     a.download = filename
//     a.click()
//     URL.revokeObjectURL(blobUrl)
//   } catch {
//     window.open(url, '_blank', 'noopener,noreferrer')
//   }
// }

// // ── LESSON ROW ────────────────────────────────────
// function LessonViewRow({ lesson, progressEntry, index }) {
//   const queryClient = useQueryClient()
//   const [expanded, setExpanded] = useState(false)

//   const conf = getTypeConf(lesson.type || 'TEXT')
//   const Icon = conf.icon

//   const isDone =
//     progressEntry?.completed ||
//     (progressEntry?.percentage ?? 0) >= 100

//   const percentage = progressEntry?.percentage ?? 0

//   // Auto-complete text/pdf/image on expand
//   useEffect(() => {
//     if (!expanded || isDone) return
//     if (!['TEXT', 'PDF', 'IMAGE'].includes(lesson.type)) return

//     const autoComplete = async () => {
//       try {
//         if (lesson.type === 'TEXT') {
//           await progressApi.completeText(lesson.id)
//         } else {
//           await progressApi.completeLesson(lesson.id)
//         }
//         queryClient.invalidateQueries({ queryKey: ['my-progress'] })
//       } catch {}
//     }
//     autoComplete()
//   }, [expanded, isDone, lesson.id, lesson.type])

//   // Video progress
//   const lastReportedRef = useRef(-1)

//   const handleVideoProgress = (e) => {
//     const video = e.target
//     if (!video.duration) return
//     const pct = Math.floor((video.currentTime / video.duration) * 100)

//     if (pct % 10 === 0 && pct !== lastReportedRef.current) {
//       lastReportedRef.current = pct
//       progressApi.updateVideo(lesson.id, pct)
//       queryClient.invalidateQueries({ queryKey: ['my-progress'] })
//     }

//     if (pct >= 95 && !isDone) {
//       progressApi.completeLesson(lesson.id)
//       queryClient.invalidateQueries({ queryKey: ['my-progress'] })
//     }
//   }

//   return (
//     <div className={`rounded-xl border transition-all duration-200 ${
//       isDone
//         ? 'border-emerald-100 bg-emerald-50/50'
//         : expanded
//           ? 'border-indigo-100 bg-white shadow-sm'
//           : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
//     }`}>

//       {/* HEADER */}
//       <button
//         className="w-full flex items-center gap-3 p-3 sm:p-4 text-left"
//         onClick={() => setExpanded(v => !v)}
//         aria-expanded={expanded}
//       >
//         {/* Index number */}
//         <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center ${
//           isDone
//             ? 'bg-emerald-100 text-emerald-600'
//             : 'bg-gray-100 text-gray-400'
//         }`}>
//           {isDone ? <CheckCircle2 size={13} className="text-emerald-500" /> : index + 1}
//         </span>

//         {/* Type icon */}
//         <div className={`shrink-0 ${conf.bg} ${conf.color} p-2 rounded-lg`}>
//           <Icon size={14} />
//         </div>

//         {/* Text */}
//         <div className="flex-1 min-w-0">
//           <p className={`text-sm font-medium`}>
//             {lesson.title}
//           </p>

//           <div className="flex items-center gap-2 mt-0.5 flex-wrap">
//             <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${conf.badge}`}>
//               {conf.label}
//             </span>

//             {percentage > 0 && !isDone && (
//               <span className="text-xs text-indigo-500 font-semibold">
//                 {percentage}% watched
//               </span>
//             )}

//             {isDone && (
//               <span className="text-xs text-emerald-500 font-medium">
//                 Completed
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Chevron */}
//         <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
//           expanded ? 'bg-indigo-100 text-indigo-600' : 'text-gray-300 hover:bg-gray-100'
//         }`}>
//           {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//         </div>
//       </button>

//       {/* VIDEO PROGRESS BAR (inline, slim) */}
//       {percentage > 0 && !isDone && lesson.type === 'VIDEO' && (
//         <div className="px-4 pb-0">
//           <div className="w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-indigo-400 transition-all duration-500"
//               style={{ width: `${percentage}%` }}
//             />
//           </div>
//         </div>
//       )}

//       {/* EXPANDED CONTENT */}
//       {expanded && (
//         <div className="border-t border-gray-100 bg-gray-50/80 p-3 sm:p-4 space-y-3 rounded-b-xl">

//           {lesson.type === 'TEXT' && (
//             <div className="prose prose-sm max-w-none text-gray-700">
//               <p className="whitespace-pre-wrap text-sm leading-relaxed">
//                 {lesson.content}
//               </p>
//             </div>
//           )}

//           {lesson.type === 'IMAGE' && lesson.fileUrl && (
//             <div className="rounded-lg overflow-hidden border border-gray-200">
//               <img
//                 src={lesson.fileUrl}
//                 alt={lesson.title}
//                 className="w-full max-h-72 object-contain bg-gray-100"
//               />
//             </div>
//           )}

//           {lesson.type === 'PDF' && lesson.fileUrl && (
//             <iframe
//               src={lesson.fileUrl}
//               title={lesson.title}
//               className="w-full h-80 rounded-lg border border-gray-200"
//             />
//           )}

//           {lesson.type === 'VIDEO' && lesson.fileUrl && (
//             <video
//               src={lesson.fileUrl}
//               controls
//               className="w-full max-h-72 rounded-lg border border-gray-200 bg-black"
//               onTimeUpdate={handleVideoProgress}
//             />
//           )}

//           {/* FILE ACTIONS */}
//           {lesson.fileUrl && (
//             <div className="flex items-center gap-1 pt-1 flex-wrap">
//               <a
//                 href={lesson.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
//               >
//                 <ExternalLink size={11} />
//                 Open
//               </a>

//               <button
//                 onClick={() => handleDownload(lesson.fileUrl, lesson.title)}
//                 className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
//               >
//                 <Download size={11} />
//                 Download
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// // ── MODULE SECTION ────────────────────────────────
// function ModuleLessonsSection({ module, progressMap, moduleIndex }) {
//   const { data: lessons = [], isLoading } = useQuery({
//     queryKey: ['lessons', module.id],
//     queryFn: () => lessonApi.getByModule(module.id).then(r => r.data),
//     enabled: !!module.id,
//   })

//   const completedCount = lessons.filter(l => progressMap[l.id]?.completed).length
//   const moduleProgress = lessons.length > 0
//     ? Math.round((completedCount / lessons.length) * 100)
//     : 0
//   const isModuleDone = lessons.length > 0 && completedCount === lessons.length

//   return (
//     <div className="space-y-2">

//       {/* MODULE HEADER */}
//       <div className="flex items-center gap-3 mb-3">
//         <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
//           isModuleDone
//             ? 'bg-emerald-100 text-emerald-600'
//             : 'bg-gray-100 text-gray-500'
//         }`}>
//           {isModuleDone ? <CheckCircle2 size={14} /> : moduleIndex + 1}
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between gap-2">
//             <h4 className="text-sm font-semibold text-gray-700 truncate">
//               {module.title}
//             </h4>
//             <span className={`shrink-0 text-xs font-medium tabular-nums ${
//               isModuleDone ? 'text-emerald-500' : 'text-gray-400'
//             }`}>
//               {completedCount}/{lessons.length}
//             </span>
//           </div>

//           {/* Mini progress bar */}
//           {lessons.length > 0 && (
//             <div className="mt-1.5 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
//               <div
//                 className={`h-full rounded-full transition-all duration-500 ${
//                   isModuleDone ? 'bg-emerald-400' : 'bg-indigo-400'
//                 }`}
//                 style={{ width: `${moduleProgress}%` }}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* LESSONS */}
//       {isLoading ? (
//         <div className="space-y-2">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
//           ))}
//         </div>
//       ) : lessons.length === 0 ? (
//         <div className="flex items-center gap-2 text-sm text-gray-400 py-4 pl-10">
//           <BookOpen size={14} />
//           No lessons in this module
//         </div>
//       ) : (
//         <div className="space-y-2 pl-0 sm:pl-2">
//           {lessons.map((lesson, idx) => (
//             <LessonViewRow
//               key={lesson.id}
//               lesson={lesson}
//               progressEntry={progressMap[lesson.id]}
//               index={idx}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // ── MAIN PANEL ────────────────────────────────────
// export default function CourseLessonsPanel({ courseId, progressMap }) {
//   const { data: modules = [], isLoading } = useQuery({
//     queryKey: ['modules', courseId],
//     queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
//     enabled: !!courseId,
//   })

//   if (isLoading) return (
//     <div className="space-y-4 py-2">
//       {[1, 2].map(i => (
//         <div key={i} className="space-y-2">
//           <div className="h-6 w-40 bg-gray-100 rounded-lg animate-pulse" />
//           <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
//           <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
//         </div>
//       ))}
//     </div>
//   )

//   if (modules.length === 0) return (
//     <div className="text-center py-12 text-gray-400">
//       <BookOpen size={28} className="mx-auto mb-2 opacity-40" />
//       <p className="text-sm">No modules available for this course</p>
//     </div>
//   )

//   return (
//     <div
//     className="max-h-[75vh] overflow-y-auto pr-2 space-y-6 sm:space-y-8 py-1 [&::-webkit-scrollbar]:hidden"
//     style={{
//       scrollbarWidth: 'none',
//       msOverflowStyle: 'none',
//     }}
//   >
//       {modules.map((mod, idx) => (
//         <ModuleLessonsSection
//           key={mod.id}
//           module={mod}
//           progressMap={progressMap}
//           moduleIndex={idx}
//         />
//       ))}
//     </div>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonApi, moduleApi, progressApi, quizApi } from '../../api/services'
import {
  ChevronDown, ChevronUp, CheckCircle2,
  ExternalLink, Download, Video, FileText, File, Image,
  BookOpen, Lock, HelpCircle, Trophy, AlertCircle
} from 'lucide-react'
import QuizTracker from '../quiz/QuizTracker'

// ── TYPE CONFIG ─────────────────────────────────
const TYPE_CONFIG = {
  VIDEO: { icon: Video,    color: 'text-blue-600',   bg: 'bg-blue-50',   badge: 'bg-blue-100 text-blue-700',   label: 'Video'   },
  TEXT:  { icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50', badge: 'bg-violet-100 text-violet-700', label: 'Reading' },
  PDF:   { icon: File,     color: 'text-rose-500',   bg: 'bg-rose-50',   badge: 'bg-rose-100 text-rose-600',    label: 'PDF'     },
  IMAGE: { icon: Image,    color: 'text-amber-500',  bg: 'bg-amber-50',  badge: 'bg-amber-100 text-amber-700',  label: 'Image'   },
}
const getTypeConf = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.TEXT

// ── DOWNLOAD ─────────────────────────────────────
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

// ── LESSON ROW ────────────────────────────────────
function LessonViewRow({ lesson, progressEntry, index }) {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)

  const conf = getTypeConf(lesson.type || 'TEXT')
  const Icon = conf.icon

  const isDone =
    progressEntry?.completed ||
    (progressEntry?.percentage ?? 0) >= 100

  const percentage = progressEntry?.percentage ?? 0

  // Auto-complete text/pdf/image on expand
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

  // Video progress
  const lastReportedRef = useRef(-1)

  const handleVideoProgress = (e) => {
    const video = e.target
    if (!video.duration) return
    const pct = Math.floor((video.currentTime / video.duration) * 100)
    if (pct % 10 === 0 && pct !== lastReportedRef.current) {
      lastReportedRef.current = pct
      progressApi.updateVideo(lesson.id, pct)
      queryClient.invalidateQueries({ queryKey: ['my-progress'] })
    }
    if (pct >= 95 && !isDone) {
      progressApi.completeLesson(lesson.id)
      queryClient.invalidateQueries({ queryKey: ['my-progress'] })
    }
  }

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      isDone
        ? 'border-emerald-100 bg-emerald-50/50'
        : expanded
          ? 'border-indigo-100 bg-white shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
    }`}>
      <button
        className="w-full flex items-center gap-3 p-3 sm:p-4 text-left"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
      >
        <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center ${
          isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {isDone ? <CheckCircle2 size={13} className="text-emerald-500" /> : index + 1}
        </span>
        <div className={`shrink-0 ${conf.bg} ${conf.color} p-2 rounded-lg`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${conf.badge}`}>{conf.label}</span>
            {percentage > 0 && !isDone && (
              <span className="text-xs text-indigo-500 font-semibold">{percentage}% watched</span>
            )}
            {isDone && <span className="text-xs text-emerald-500 font-medium">Completed</span>}
          </div>
        </div>
        <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
          expanded ? 'bg-indigo-100 text-indigo-600' : 'text-gray-300 hover:bg-gray-100'
        }`}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {percentage > 0 && !isDone && lesson.type === 'VIDEO' && (
        <div className="px-4 pb-0">
          <div className="w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400 transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      )}

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/80 p-3 sm:p-4 space-y-3 rounded-b-xl">
          {lesson.type === 'TEXT' && (
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{lesson.content}</p>
            </div>
          )}
          {lesson.type === 'IMAGE' && lesson.fileUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img src={lesson.fileUrl} alt={lesson.title} className="w-full max-h-72 object-contain bg-gray-100" />
            </div>
          )}
          {lesson.type === 'PDF' && lesson.fileUrl && (
            <iframe src={lesson.fileUrl} title={lesson.title} className="w-full h-80 rounded-lg border border-gray-200" />
          )}
          {lesson.type === 'VIDEO' && lesson.fileUrl && (
            <video
              src={lesson.fileUrl}
              controls
              className="w-full max-h-72 rounded-lg border border-gray-200 bg-black"
              onTimeUpdate={handleVideoProgress}
            />
          )}
          {lesson.fileUrl && (
            <div className="flex items-center gap-1 pt-1 flex-wrap">
              <a
                href={lesson.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ExternalLink size={11} /> Open
              </a>
              <button
                onClick={() => handleDownload(lesson.fileUrl, lesson.title)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Download size={11} /> Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── QUIZ SECTION (per module) ─────────────────────
function ModuleQuizSection({ module, courseId, allLessonsDone }) {
  const [quizOpen, setQuizOpen] = useState(false)
  const qc = useQueryClient()

  const { data: moduleStatuses = [] } = useQuery({
    queryKey: ['module-statuses', courseId],
    queryFn: () => quizApi.moduleStatuses(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  const { data: quiz } = useQuery({
    queryKey: ['quiz-student', module.id],
    queryFn: () => quizApi.getForStudent(module.id).then(r => r.data),
    enabled: !!module.id,
  })

  const status = moduleStatuses.find(s => s.moduleId === module.id)
  const quizPassed = status?.quizPassed ?? false
  const bestScore = status?.quizBestScore
  const passingScore = status?.passingScore

  if (!quiz) return null   // no quiz for this module

  const canTakeQuiz = allLessonsDone

  return (
    <div className="mt-3">
      <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
        quizPassed
          ? 'border-emerald-100 bg-emerald-50'
          : canTakeQuiz
            ? 'border-indigo-100 bg-indigo-50/50'
            : 'border-gray-100 bg-gray-50'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          quizPassed ? 'bg-emerald-100' : canTakeQuiz ? 'bg-indigo-100' : 'bg-gray-100'
        }`}>
          {quizPassed
            ? <Trophy size={15} className="text-emerald-600" />
            : canTakeQuiz
              ? <HelpCircle size={15} className="text-indigo-600" />
              : <Lock size={15} className="text-gray-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">{quiz.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {quizPassed
              ? `Passed · ${bestScore}% (need ${passingScore}%)`
              : canTakeQuiz
                ? `Pass mark: ${passingScore}%`
                : 'Complete all lessons to unlock'
            }
          </p>
        </div>
        {quizPassed ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={13} /> Passed
          </span>
        ) : canTakeQuiz ? (
          <button
            onClick={() => setQuizOpen(true)}
            className="shrink-0 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {bestScore != null ? 'Retake' : 'Take Quiz'}
          </button>
        ) : (
          <AlertCircle size={14} className="text-gray-300 flex-shrink-0" />
        )}
      </div>

      <QuizTracker
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        quiz={quiz}
        onPassed={() => {
          setQuizOpen(false)
          qc.invalidateQueries({ queryKey: ['module-statuses', courseId] })
          qc.invalidateQueries({ queryKey: ['my-certificates'] })
        }}
      />
    </div>
  )
}

// ── MODULE SECTION ────────────────────────────────
function ModuleLessonsSection({ module, progressMap, moduleIndex, courseId, isLocked }) {
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', module.id],
    queryFn: () => lessonApi.getByModule(module.id).then(r => r.data),
    enabled: !!module.id,
  })

  const completedCount = lessons.filter(l => {
    const p = progressMap[l.id]
    return p?.completed || (p?.percentage ?? 0) >= 100
  }).length
  const moduleProgress = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0
  const isModuleDone = lessons.length > 0 && completedCount === lessons.length
  const allLessonsDone = isModuleDone

  return (
    <div className={`space-y-2 ${isLocked ? 'opacity-60' : ''}`}>
      {/* MODULE HEADER */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
          isLocked
            ? 'bg-gray-100 text-gray-300'
            : isModuleDone
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-gray-100 text-gray-500'
        }`}>
          {isLocked ? <Lock size={13} /> : isModuleDone ? <CheckCircle2 size={14} /> : moduleIndex + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-700 truncate">{module.title}</h4>
            {isLocked ? (
              <span className="text-xs text-gray-400 italic shrink-0">Locked</span>
            ) : (
              <span className={`shrink-0 text-xs font-medium tabular-nums ${isModuleDone ? 'text-emerald-500' : 'text-gray-400'}`}>
                {completedCount}/{lessons.length}
              </span>
            )}
          </div>
          {!isLocked && lessons.length > 0 && (
            <div className="mt-1.5 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isModuleDone ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                style={{ width: `${moduleProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* LOCKED OVERLAY */}
      {isLocked ? (
        <div className="flex items-center gap-2 py-4 pl-10 text-sm text-gray-400">
          <Lock size={14} />
          Pass the previous module's quiz to unlock
        </div>
      ) : (
        <>
          {/* LESSONS */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : lessons.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-4 pl-10">
              <BookOpen size={14} /> No lessons in this module
            </div>
          ) : (
            <div className="space-y-2 pl-0 sm:pl-2">
              {lessons.map((lesson, idx) => (
                <LessonViewRow
                  key={lesson.id}
                  lesson={lesson}
                  progressEntry={progressMap[lesson.id]}
                  index={idx}
                />
              ))}
            </div>
          )}

          {/* QUIZ (per module) */}
          <ModuleQuizSection
            module={module}
            courseId={courseId}
            allLessonsDone={allLessonsDone}
          />
        </>
      )}
    </div>
  )
}

// ── MAIN PANEL ────────────────────────────────────
export default function CourseLessonsPanel({ courseId, progressMap }) {
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  const { data: moduleStatuses = [] } = useQuery({
    queryKey: ['module-statuses', courseId],
    queryFn: () => quizApi.moduleStatuses(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  if (isLoading) return (
    <div className="space-y-4 py-2">
      {[1, 2].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-6 w-40 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  )

  if (modules.length === 0) return (
    <div className="text-center py-12 text-gray-400">
      <BookOpen size={28} className="mx-auto mb-2 opacity-40" />
      <p className="text-sm">No modules available for this course</p>
    </div>
  )

  return (
    <div
      className="max-h-[75vh] overflow-y-auto pr-2 space-y-6 sm:space-y-8 py-1 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {modules.map((mod, idx) => {
        const status = moduleStatuses.find(s => s.moduleId === mod.id)
        const isLocked = status ? !status.unlocked : idx > 0
        return (
          <ModuleLessonsSection
            key={mod.id}
            module={mod}
            progressMap={progressMap}
            moduleIndex={idx}
            courseId={courseId}
            isLocked={isLocked}
          />
        )
      })}
    </div>
  )
}
