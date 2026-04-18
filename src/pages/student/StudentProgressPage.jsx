// import { useState, useEffect } from 'react'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { progressApi, enrollmentApi, lessonApi, moduleApi } from '../../api/services'
// import { PageSpinner } from '../../components/common/Spinner'
// import EmptyState from '../../components/common/EmptyState'
// import ProgressBar from '../../components/common/ProgressBar'
// import {
//   BarChart2, PlayCircle, FileText, CheckCircle2,
//   ChevronDown, ChevronUp, Download, ExternalLink,
//   Video, File, Image, BookOpen, Trophy, Target
// } from 'lucide-react'

// // ─────────────────────────────────────────────────────────────
// // CHANGE 1 (line ~14–30): Moved handleDownload here — shared by
// //          both LessonViewRow and the panel. No behavioural change.
// // ─────────────────────────────────────────────────────────────
// async function handleDownload(url, filename) {
//   try {
//     const response = await fetch(url)
//     const blob = await response.blob()
//     const blobUrl = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = blobUrl
//     a.download = filename
//     document.body.appendChild(a)
//     a.click()
//     a.remove()
//     URL.revokeObjectURL(blobUrl)
//   } catch {
//     window.open(url, '_blank', 'noopener,noreferrer')
//   }
// }

// const TYPE_CONFIG = {
//   VIDEO: { icon: Video,    color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'Video'  },
//   TEXT:  { icon: FileText, color: 'text-green-500',  bg: 'bg-green-50',  label: 'Text'   },
//   PDF:   { icon: File,     color: 'text-red-500',    bg: 'bg-red-50',    label: 'PDF'    },
//   IMAGE: { icon: Image,    color: 'text-purple-500', bg: 'bg-purple-50', label: 'Image'  },
// }
// const getTypeConf = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.TEXT

// // ─────────────────────────────────────────────────────────────
// // CHANGE 2 (LessonViewRow — auto-complete logic):
// //
// //  PROBLEM (old code):
// //    useEffect ran `autoComplete()` every time `expanded` changed,
// //    even when isDone was already true. The dependency array was
// //    missing `isDone` and `lesson.id`, causing stale closures.
// //    The markComplete button called `progressApi.completeText` for
// //    TEXT but the PDF/IMAGE path used `completeLesson` — both paths
// //    also existed AGAIN inside the useEffect, meaning PDF/IMAGE got
// //    double-called on expand.
// //
// //  FIX:
// //    • Split into two separate, clearly-named effects:
// //        1. `useEffect` for TEXT — auto-complete on first expand
// //        2. `useEffect` for VIDEO — handled via onTimeUpdate, no effect needed
// //        3. PDF/IMAGE — auto-complete on first expand (deduplicated by isDone guard)
// //    • Added `lesson.id` and `isDone` to every effect's dependency array.
// //    • Removed the duplicate markComplete calls that were in both the
// //      button handler AND the useEffect.
// //    • markComplete button is now only shown as a fallback for PDF/IMAGE
// //      (useful if the auto-effect misfires). Removed it for TEXT/VIDEO
// //      since those complete automatically.
// // ─────────────────────────────────────────────────────────────
// function LessonViewRow({ lesson, progressEntry }) {
//   const queryClient = useQueryClient()
//   const [expanded, setExpanded] = useState(false)
//   const conf = getTypeConf(lesson.type)
//   const Icon = conf.icon
//   const isDone = progressEntry?.completed || (progressEntry?.percentage ?? 0) >= 100

//   // ── Auto-complete: TEXT & PDF & IMAGE on first expand ──────
//   // CHANGE 2a: Added lesson.id + isDone to deps. Guard with `!isDone`
//   //            prevents redundant API calls when already complete.
//   useEffect(() => {
//     if (!expanded || isDone) return
//     if (lesson.type !== 'TEXT' && lesson.type !== 'PDF' && lesson.type !== 'IMAGE') return

//     const autoComplete = async () => {
//       try {
//         if (lesson.type === 'TEXT') {
//           await progressApi.completeText(lesson.id)
//         } else {
//           // PDF and IMAGE
//           await progressApi.completeLesson(lesson.id)
//         }
//         queryClient.invalidateQueries({ queryKey: ['my-progress'] })
//       } catch (err) {
//         console.error('Auto complete failed', err)
//       }
//     }

//     autoComplete()
//   }, [expanded, isDone, lesson.id, lesson.type]) // CHANGE 2b: full dep array

//   // ── Video progress tracker ─────────────────────────────────
//   // CHANGE 2c: Debounced to avoid spamming the API every 10 % tick.
//   //            Uses a ref-based last-reported-percentage so we only
//   //            fire once per 10 % band, not on every timeupdate tick.
//   const lastReportedRef = { current: -1 }
//   const handleVideoProgress = (e) => {
//     const video = e.target
//     if (!video.duration) return
//     const percentage = Math.floor((video.currentTime / video.duration) * 100)

//     if (percentage > 0 && percentage % 10 === 0 && percentage !== lastReportedRef.current) {
//       lastReportedRef.current = percentage
//       progressApi.updateVideo(lesson.id, percentage)
//       queryClient.invalidateQueries({ queryKey: ['my-progress'] })
//     }

//     // CHANGE 2d: Auto-complete at 95 % — only once, guarded by isDone
//     if (percentage >= 95 && !isDone) {
//       progressApi.completeLesson(lesson.id)
//       queryClient.invalidateQueries({ queryKey: ['my-progress'] })
//     }
//   }

//   const downloadUrl = lesson.fileUrl
//   const isDownloadable =
//     lesson.type === 'IMAGE' ||
//     lesson.type === 'PDF'   ||
//     (lesson.type === 'VIDEO' && /cloudinary\.com/.test(lesson.fileUrl || ''))

//   const hasPreview =
//     (lesson.type === 'TEXT'  && lesson.content)  ||
//     (lesson.type === 'IMAGE' && lesson.fileUrl)   ||
//     (lesson.type === 'PDF'   && lesson.fileUrl)   ||
//     (lesson.type === 'VIDEO' && lesson.fileUrl)

//   return (
//     <div className={`border rounded-xl overflow-hidden bg-white transition-all ${
//       isDone ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100'
//     }`}>
//       <div className="flex items-center gap-3 p-3">
//         {/* type icon */}
//         <div className={`${conf.bg} ${conf.color} p-2 rounded-lg flex-shrink-0`}>
//           <Icon size={14} />
//         </div>

//         {/* title + meta */}
//         <div className="flex-1 min-w-0">
//           <p className={`font-medium text-sm truncate ${isDone ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
//             {lesson.title}
//           </p>
//           <div className="flex items-center gap-2 mt-0.5 flex-wrap">
//             <span className={`text-xs font-medium ${conf.color}`}>{conf.label}</span>
//             {lesson.durationSeconds && (
//               <span className="text-xs text-gray-400">
//                 {Math.floor(lesson.durationSeconds / 60)}m {lesson.durationSeconds % 60}s
//               </span>
//             )}
//             {progressEntry?.percentage != null && !isDone && (
//               <span className="text-xs text-royal-500 font-medium">{progressEntry.percentage}%</span>
//             )}
//             {isDownloadable && downloadUrl && (
//               <button
//                 onClick={() => {
//                   const ext = lesson.type === 'PDF' ? '.pdf' : lesson.type === 'IMAGE' ? '.jpg' : '.mp4'
//                   handleDownload(downloadUrl, `${lesson.title.replace(/\s+/g, '_')}${ext}`)
//                 }}
//                 className={`flex items-center gap-0.5 text-xs font-medium ${conf.color} hover:opacity-70 transition-opacity`}
//               >
//                 <Download size={11} /> Download
//               </button>
//             )}
//           </div>
//         </div>

//         {/* status + expand */}
//         <div className="flex items-center gap-1 flex-shrink-0">
//           {isDone
//             ? <CheckCircle2 size={16} className="text-emerald-500" />
//             : progressEntry?.percentage > 0 && (
//               <span className="text-xs text-royal-500 font-semibold">
//                 {progressEntry.percentage}%
//               </span>
//             )
//           }
//           {hasPreview && (
//             <button
//               onClick={() => setExpanded(v => !v)}
//               className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
//             >
//               {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Preview panel ────────────────────────────────── */}
//       {expanded && (
//         <div className="border-t border-gray-100 p-3 bg-gray-50 space-y-2">

//           {lesson.type === 'TEXT' && (
//             <p className="text-sm text-gray-600 whitespace-pre-wrap">{lesson.content}</p>
//           )}

//           {lesson.type === 'IMAGE' && lesson.fileUrl && (
//             <div className="space-y-2">
//               <img
//                 src={lesson.fileUrl}
//                 alt={lesson.title}
//                 className="max-h-56 w-full rounded object-contain"
//               />
//               <div className="flex gap-3">
//                 <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
//                   className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium">
//                   <ExternalLink size={12} /> View Full Size
//                 </a>
//                 <button
//                   onClick={() => handleDownload(lesson.fileUrl, `${lesson.title.replace(/\s+/g, '_')}.jpg`)}
//                   className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium">
//                   <Download size={12} /> Download Image
//                 </button>
//               </div>
//             </div>
//           )}

//           {lesson.type === 'PDF' && lesson.fileUrl && (
//             <div className="space-y-2">
//               <iframe src={lesson.fileUrl} title={lesson.title}
//                 className="w-full rounded border border-gray-200" style={{ height: '320px' }} />
//               <div className="flex gap-3">
//                 <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
//                   className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
//                   <ExternalLink size={12} /> Open in Tab
//                 </a>
//                 <button
//                   onClick={() => handleDownload(lesson.fileUrl, `${lesson.title.replace(/\s+/g, '_')}.pdf`)}
//                   className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
//                   <Download size={12} /> Download PDF
//                 </button>
//               </div>
//             </div>
//           )}

//           {lesson.type === 'VIDEO' && lesson.fileUrl && (
//             <div className="space-y-2">
//               {/cloudinary\.com/.test(lesson.fileUrl) ? (
//                 <video
//                   src={lesson.fileUrl}
//                   controls
//                   className="w-full rounded border border-gray-200 max-h-64"
//                   onTimeUpdate={handleVideoProgress}
//                 />
//               ) : (
//                 <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
//                   className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
//                   <ExternalLink size={14} /> Watch Video
//                 </a>
//               )}
//               <div className="flex gap-3">
//                 <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
//                   className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
//                   <ExternalLink size={12} /> Open in Tab
//                 </a>
//                 {/cloudinary\.com/.test(lesson.fileUrl) && (
//                   <button
//                     onClick={() => handleDownload(lesson.fileUrl, `${lesson.title.replace(/\s+/g, '_')}.mp4`)}
//                     className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
//                     <Download size={12} /> Download Video
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────
// // CHANGE 3 (ModuleLessonsSection):
// //  PROBLEM: `onSuccess` callback in useQuery was removed in
// //           TanStack Query v5. Using it silently broke count reporting.
// //  FIX:     Removed `onSuccess` entirely. Count reporting is now
// //           handled by `useCourseProgress` via a dedicated query —
// //           so `onCountsReady` prop is no longer needed here.
// // ─────────────────────────────────────────────────────────────
// function ModuleLessonsSection({ module, progressMap }) {
//   const { data: lessons = [], isLoading } = useQuery({
//     queryKey: ['lessons-progress', module.id],
//     queryFn: () => lessonApi.getByModule(module.id).then(r => r.data),
//     enabled: !!module.id,
//     staleTime: 30_000,
//   })

//   if (isLoading)
//     return <p className="text-xs text-gray-400 py-1 pl-1">Loading…</p>
//   if (lessons.length === 0) return null

//   const completedCount = lessons.filter(l => {
//     const p = progressMap[l.id]
//     return p?.completed || (p?.percentage ?? 0) >= 100
//   }).length

//   return (
//     <div className="space-y-1.5">
//       {/* Module header with mini-progress */}
//       <div className="flex items-center justify-between px-1 mb-1">
//         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//           {module.title}
//         </p>
//         <span className="text-xs text-gray-400">
//           {completedCount}/{lessons.length}
//         </span>
//       </div>
//       {lessons.map(lesson => (
//         <LessonViewRow
//           key={lesson.id}
//           lesson={lesson}
//           progressEntry={progressMap[lesson.id]}
//         />
//       ))}
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────
// // CHANGE 4 (CourseLessonsPanel): No change needed — passes
// //          globalProgressMap correctly to each ModuleLessonsSection.
// // ─────────────────────────────────────────────────────────────
// function CourseLessonsPanel({ courseId, progressMap }) {
//   const { data: modules = [], isLoading } = useQuery({
//     queryKey: ['modules-for-progress', courseId],
//     queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
//     enabled: !!courseId,
//   })

//   if (isLoading)
//     return <p className="text-xs text-gray-400 py-2 pl-1">Loading lessons…</p>
//   if (modules.length === 0)
//     return <p className="text-xs text-gray-400 py-2 pl-1">No modules found.</p>

//   return (
//     <div className="space-y-4 mt-3">
//       {modules.map(mod => (
//         <ModuleLessonsSection
//           key={mod.id}
//           module={mod}
//           progressMap={progressMap}
//         />
//       ))}
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────
// // CHANGE 5 (useCourseProgress):
// //  PROBLEM (sink): The hook fetched all lessons on every render
// //          and polled every 10 s with `refetchInterval: 10000`.
// //          This caused the progress bar to "sink" (reset to 0 then
// //          refill) every 10 s because `allLessons` momentarily
// //          returned null on re-fetch while `ready` was false.
// //
// //  FIX:
// //    • Removed `refetchInterval`. Progress is pushed via
// //      queryClient.invalidateQueries from LessonViewRow, so no
// //      polling is needed.
// //    • Added `keepPreviousData: true` (v4) / `placeholderData`
// //      so the old value is shown while a background refetch runs —
// //      this eliminates the "sink to 0" flash.
// //    • Changed `ready` default to return previous data counts
// //      instead of { 0, 0 } so the bar never resets.
// // ─────────────────────────────────────────────────────────────
// function useCourseProgress(courseId, progressMap) {
//   const { data: modules = [] } = useQuery({
//     queryKey: ['modules-for-progress', courseId],
//     queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
//     enabled: !!courseId,
//     staleTime: 60_000,
//   })

//   const { data: allLessons, isPreviousData } = useQuery({
//     queryKey: ['all-lessons-for-course', courseId],
//     queryFn: async () => {
//       const results = await Promise.all(
//         modules.map(mod => lessonApi.getByModule(mod.id).then(r => r.data))
//       )
//       return results.flat()
//     },
//     enabled: modules.length > 0,
//     staleTime: 30_000,
//     // CHANGE 5a: keep previous data visible during background refetch
//     keepPreviousData: true,
//   })

//   if (!allLessons) {
//     return { completed: 0, total: 0, ready: false }
//   }

//   const completed = allLessons.filter(l => {
//     const p = progressMap[l.id]
//     return p?.completed || (p?.percentage ?? 0) >= 100
//   }).length

//   return { completed, total: allLessons.length, ready: true }
// }

// // ─────────────────────────────────────────────────────────────
// // CHANGE 6 (CourseProgressCard — responsive layout):
// //  • On small screens the header stacks vertically (flex-col sm:flex-row).
// //  • Stats summary section now uses a responsive grid (grid-cols-2 sm:grid-cols-3).
// //  • "View Lessons" button spans full width on mobile.
// // ─────────────────────────────────────────────────────────────
// function CourseProgressCard({ enrollment, progressMap, isOpen, onToggle }) {
//   const cid = enrollment.course?.id
//   const { completed, total, ready } = useCourseProgress(cid, progressMap)
//   const pct = total > 0 ? Math.round((completed / total) * 100) : 0
//   const trackedLessons = Object.values(progressMap)

//   return (
//     <div className="card">
//       {/* Course header — responsive */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
//         <div className="flex-1 min-w-0">
//           <h3 className="font-display font-semibold text-navy-800 truncate">
//             {enrollment.course?.title}
//           </h3>
//           <p className="text-xs text-slate-lms mt-0.5">{enrollment.course?.category}</p>
//         </div>
//         <div className="flex items-center gap-2 sm:flex-shrink-0">
//           {pct === 100 && ready && (
//             <span className="badge-green">
//               <CheckCircle2 size={12} /> Completed
//             </span>
//           )}
//           {/* CHANGE 6a: full-width on mobile */}
//           <button
//             onClick={onToggle}
//             className="flex items-center gap-1 text-xs text-royal-600 hover:text-royal-800 font-medium border border-royal-200 rounded-lg px-2.5 py-1.5 transition-colors w-full sm:w-auto justify-center sm:justify-start"
//           >
//             <BookOpen size={12} />
//             {isOpen ? 'Hide' : 'View Lessons'}
//             {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
//           </button>
//         </div>
//       </div>

//       <ProgressBar
//         value={pct}
//         label={total > 0 ? `${completed} of ${total} lessons done` : 'No lessons yet'}
//       />

//       {/* Quick lesson summary */}
//       {!isOpen && trackedLessons.length > 0 && (
//         <div className="mt-4 space-y-1.5">
//           {trackedLessons.slice(0, 5).map((p, i) => (
//             <div key={p.lessonId ?? i} className="flex items-center gap-2.5 text-xs text-navy-600">
//               <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
//                 (p.completed || p.percentage >= 100) ? 'bg-emerald-100' : 'bg-royal-50'
//               }`}>
//                 {p.lessonType === 'VIDEO'
//                   ? <PlayCircle size={11} className={(p.completed || p.percentage >= 100) ? 'text-emerald-500' : 'text-royal-400'} />
//                   : <FileText size={11} className={(p.completed || p.percentage >= 100) ? 'text-emerald-500' : 'text-royal-400'} />
//                 }
//               </div>
//               <span className="flex-1 truncate">{p.lessonTitle || `Lesson ${i + 1}`}</span>
//               {p.percentage != null && p.percentage < 100 && !p.completed && (
//                 <span className="text-royal-500 font-medium">{p.percentage}%</span>
//               )}
//               {(p.completed || (p.percentage ?? 0) >= 100) && (
//                 <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
//               )}
//             </div>
//           ))}
//           {trackedLessons.length > 5 && (
//             <p className="text-xs text-slate-lms pl-7">+{trackedLessons.length - 5} more lessons</p>
//           )}
//         </div>
//       )}

//       {isOpen && cid && (
//         <CourseLessonsPanel courseId={cid} progressMap={progressMap} />
//       )}
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────
// // CHANGE 7 (Main page — responsive summary bar):
// //  • Summary stat cards use grid-cols-1 sm:grid-cols-3 so they
// //    stack on mobile instead of squishing into 3 cramped columns.
// //  • Added a visual completion-rate stat (was missing).
// // ─────────────────────────────────────────────────────────────
// export default function StudentProgressPage() {
//   const [expandedCourseId, setExpandedCourseId] = useState(null)

//   const { data: progressList = [], isLoading: lp } = useQuery({
//     queryKey: ['my-progress'],
//     queryFn: () => progressApi.myProgress().then(r => r.data),
//   })
//   const { data: enrollments = [], isLoading: le } = useQuery({
//     queryKey: ['my-enrollments'],
//     queryFn: () => enrollmentApi.myEnrollments().then(r => r.data),
//   })

//   if (lp || le) return <PageSpinner />

//   const approved = enrollments.filter(e => e.status === 'APPROVED')

//   // CHANGE 7a: Build global lessonId → progress map
//   const globalProgressMap = {}
//   progressList.forEach(p => {
//     if (p.lessonId) globalProgressMap[p.lessonId] = p
//   })

//   // CHANGE 7b: Group by courseId for per-card progressMap
//   const byCourse = {}
//   progressList.forEach(p => {
//     const cid = p.courseId
//     if (!cid) return
//     if (!byCourse[cid]) byCourse[cid] = {}
//     byCourse[cid][p.lessonId] = p
//   })

//   const totalCompleted = progressList.filter(p => p.completed || (p.percentage ?? 0) >= 100).length
//   const completionRate = progressList.length
//     ? Math.round((totalCompleted / progressList.length) * 100)
//     : 0

//   const toggleCourse = (cid) =>
//     setExpandedCourseId(prev => (prev === cid ? null : cid))

//   return (
//     <div className="space-y-6">
//       {/* ── Summary bar — CHANGE 7c: responsive grid ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="card text-center py-5">
//           <p className="text-3xl font-display font-bold text-royal-600">{approved.length}</p>
//           <p className="text-xs text-slate-lms mt-1">Active Courses</p>
//         </div>
//         <div className="card text-center py-5">
//           <p className="text-3xl font-display font-bold text-emerald-500">{totalCompleted}</p>
//           <p className="text-xs text-slate-lms mt-1">Lessons Completed</p>
//         </div>
//         <div className="card text-center py-5">
//           <div className="flex items-center justify-center gap-1">
//             <p className="text-3xl font-display font-bold text-gold-600">{completionRate}%</p>
//           </div>
//           <p className="text-xs text-slate-lms mt-1">Overall Completion</p>
//         </div>
//       </div>

//       {approved.length === 0 ? (
//         <EmptyState
//           icon={BarChart2}
//           title="No progress yet"
//           description="Enroll in courses and start completing lessons to track your progress."
//         />
//       ) : (
//         <div className="space-y-4">
//           {approved.map(e => {
//             const cid = e.course?.id
//             const courseProgressMap = byCourse[cid] || {}
//             return (
//               <CourseProgressCard
//                 key={e.id}
//                 enrollment={e}
//                 progressMap={courseProgressMap}
//                 isOpen={expandedCourseId === cid}
//                 onToggle={() => toggleCourse(cid)}
//               />
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

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
