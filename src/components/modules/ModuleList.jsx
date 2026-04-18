// import { useState } from 'react'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { moduleApi } from '../../api/services'
// import {
//   Layers,
//   Plus,
//   ChevronDown,
//   ChevronRight,
//   Trash2,
//   Edit3
// } from 'lucide-react'

// import { PageSpinner } from '../common/Spinner'
// import LessonList from '../lessons/LessonList'
// import toast from 'react-hot-toast'

// export default function ModuleList({ courseId, editable = false }) {
//   const qc = useQueryClient()

//   const [expanded, setExpanded] = useState({})
//   const [adding, setAdding] = useState(false)
//   const [editingId, setEditingId] = useState(null)

//   // 🔥 separate states (IMPORTANT FIX)
//   const [newTitle, setNewTitle] = useState('')
//   const [editTitle, setEditTitle] = useState('')

//   const [saving, setSaving] = useState(false)

//   // =========================
//   // FETCH MODULES
//   // =========================
//   const { data, isLoading } = useQuery({
//     queryKey: ['modules', courseId],
//     queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
//     enabled: !!courseId,
//   })

//   const modules = Array.isArray(data) ? data : []

//   const toggle = (id) =>
//     setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

//   // =========================
//   // CREATE MODULE
//   // =========================
//   const handleCreate = async (e) => {
//     e.preventDefault()
//     if (!newTitle.trim()) return

//     setSaving(true)
//     try {
//       await moduleApi.create({
//         courseId,
//         title: newTitle,
//         description: '',
//         orderIndex: modules.length + 1
//       })

//       toast.success('Module created!')
//       setNewTitle('')
//       setAdding(false)

//       qc.invalidateQueries({ queryKey: ['modules', courseId] })
//     } catch {
//       toast.error('Failed to create module')
//     } finally {
//       setSaving(false)
//     }
//   }

//   // =========================
//   // DELETE MODULE
//   // =========================
//   const handleDelete = async (id) => {
//     try {
//       await moduleApi.delete(id)
//       toast.success('Module deleted')

//       qc.invalidateQueries({ queryKey: ['modules', courseId] })
//     } catch {
//       toast.error('Delete failed')
//     }
//   }

//   // =========================
//   // UPDATE MODULE
//   // =========================
//   const handleUpdate = async (id) => {
//     if (!editTitle.trim()) return

//     try {
//       const existing = modules.find(m => m.id === id)

//       await moduleApi.update(id, {
//         title: editTitle,
//         description: existing?.description || '',
//         orderIndex: existing?.orderIndex || 0
//       })

//       toast.success('Module updated')

//       setEditingId(null)
//       setEditTitle('')

//       qc.invalidateQueries({ queryKey: ['modules', courseId] })
//     } catch {
//       toast.error('Update failed')
//     }
//   }

//   if (isLoading) return <PageSpinner />

//   return (
//     <div className="space-y-3">

//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//         <h3 className="font-semibold text-navy-800">Course Modules</h3>

//         {editable && (
//           <button
//             className="btn-ghost text-xs"
//             onClick={() => setAdding(p => !p)}
//           >
//             <Plus size={14} /> Add Module
//           </button>
//         )}
//       </div>

//       {/* CREATE FORM */}
//       {editable && adding && (
//         <form
//           onSubmit={handleCreate}
//           className="flex flex-col sm:flex-row gap-2 p-3 bg-royal-50 rounded-xl border"
//         >
//           <input
//             className="input flex-1 text-sm py-2"
//             placeholder="Module title..."
//             value={newTitle}
//             onChange={(e) => setNewTitle(e.target.value)}
//             autoFocus
//           />

//           <button
//             type="submit"
//             className="btn-primary text-xs"
//             disabled={saving}
//           >
//             {saving ? '...' : 'Save'}
//           </button>

//           <button
//             type="button"
//             className="btn-secondary text-xs"
//             onClick={() => setAdding(false)}
//           >
//             Cancel
//           </button>
//         </form>
//       )}

//       {/* EMPTY */}
//       {modules.length === 0 && (
//         <p className="text-sm text-center py-6 text-slate-lms">
//           No modules yet.
//         </p>
//       )}

//       {/* MODULE LIST */}
//       {modules.map((mod, idx) => (
//         <div key={mod.id} className="card overflow-hidden">

//           {/* MODULE HEADER */}
//      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 px-3 sm:px-4 py-3 hover:bg-royal-50">
//             {/* expand */}
//             <button onClick={() => toggle(mod.id)}>
//               {expanded[mod.id]
//                 ? <ChevronDown size={16} />
//                 : <ChevronRight size={16} />
//               }
//             </button>

//             {/* index */}
//             <div className="w-7 h-7 rounded-lg bg-royal-gradient text-white flex items-center justify-center text-xs font-bold">
//               {idx + 1}
//             </div>

//             {/* title */}
//             <div className="flex-1">
//           <p className="font-semibold text-sm truncate max-w-[140px] sm:max-w-none">
//   {mod.title}
// </p>
//             </div>

//             <Layers size={14} />

//             {/* ACTIONS */}
//             {editable && (<div className="flex gap-2 ml-auto">

//                 {/* EDIT */}
//                 <button
//                   onClick={() => {
//                     setEditingId(mod.id)
//                     setEditTitle(mod.title)
//                   }}
//                 >
//                   <Edit3 size={14} />
//                 </button>

//                 {/* DELETE */}
//                 <button onClick={() => handleDelete(mod.id)}>
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* EDIT FORM */}
//           {editable && editingId === mod.id && (
//           <div className="p-3 border-t bg-royal-50 flex flex-col sm:flex-row gap-2">
//               <input
//                 className="input flex-1 text-sm py-2"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//               />

//               <button
//                 className="btn-primary text-xs"
//                 onClick={() => handleUpdate(mod.id)}
//               >
//                 Update
//               </button>

//               <button
//                 className="btn-secondary text-xs"
//                 onClick={() => {
//                   setEditingId(null)
//                   setEditTitle('')
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}

//           {/* LESSONS */}
//           {expanded[mod.id] && (
//             <div className="border-t px-3 sm:px-4 py-4 bg-surface max-h-[50vh] overflow-y-auto">
//               <LessonList moduleId={mod.id} editable={editable} />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }


import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { moduleApi } from '../../api/services'
import {
  Layers,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit3,
  HelpCircle
} from 'lucide-react'

import { PageSpinner } from '../common/Spinner'
import LessonList from '../lessons/LessonList'
import QuizBuilder from '../quiz/QuizBuilder'
import toast from 'react-hot-toast'

export default function ModuleList({ courseId, editable = false }) {
  const qc = useQueryClient()

  const [expanded, setExpanded] = useState({})
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // 🔥 separate states (IMPORTANT FIX)
  const [newTitle, setNewTitle] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const [saving, setSaving] = useState(false)

  // =========================
  // FETCH MODULES
  // =========================
  const { data, isLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  const modules = Array.isArray(data) ? data : []

  const toggle = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  // =========================
  // CREATE MODULE
  // =========================
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setSaving(true)
    try {
      await moduleApi.create({
        courseId,
        title: newTitle,
        description: '',
        orderIndex: modules.length + 1
      })

      toast.success('Module created!')
      setNewTitle('')
      setAdding(false)

      qc.invalidateQueries({ queryKey: ['modules', courseId] })
    } catch {
      toast.error('Failed to create module')
    } finally {
      setSaving(false)
    }
  }

  // =========================
  // DELETE MODULE
  // =========================
  const handleDelete = async (id) => {
    try {
      await moduleApi.delete(id)
      toast.success('Module deleted')

      qc.invalidateQueries({ queryKey: ['modules', courseId] })
    } catch {
      toast.error('Delete failed')
    }
  }

  // =========================
  // UPDATE MODULE
  // =========================
  const handleUpdate = async (id) => {
    if (!editTitle.trim()) return

    try {
      const existing = modules.find(m => m.id === id)

      await moduleApi.update(id, {
        title: editTitle,
        description: existing?.description || '',
        orderIndex: existing?.orderIndex || 0
      })

      toast.success('Module updated')

      setEditingId(null)
      setEditTitle('')

      qc.invalidateQueries({ queryKey: ['modules', courseId] })
    } catch {
      toast.error('Update failed')
    }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="font-semibold text-navy-800">Course Modules</h3>

        {editable && (
          <button
            className="btn-ghost text-xs"
            onClick={() => setAdding(p => !p)}
          >
            <Plus size={14} /> Add Module
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {editable && adding && (
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-2 p-3 bg-royal-50 rounded-xl border"
        >
          <input
            className="input flex-1 text-sm py-2"
            placeholder="Module title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />

          <button
            type="submit"
            className="btn-primary text-xs"
            disabled={saving}
          >
            {saving ? '...' : 'Save'}
          </button>

          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => setAdding(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* EMPTY */}
      {modules.length === 0 && (
        <p className="text-sm text-center py-6 text-slate-lms">
          No modules yet.
        </p>
      )}

      {/* MODULE LIST */}
      {modules.map((mod, idx) => (
        <div key={mod.id} className="card overflow-hidden">

          {/* MODULE HEADER */}
     <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 px-3 sm:px-4 py-3 hover:bg-royal-50">
            {/* expand */}
            <button onClick={() => toggle(mod.id)}>
              {expanded[mod.id]
                ? <ChevronDown size={16} />
                : <ChevronRight size={16} />
              }
            </button>

            {/* index */}
            <div className="w-7 h-7 rounded-lg bg-royal-gradient text-white flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </div>

            {/* title */}
            <div className="flex-1">
          <p className="font-semibold text-sm truncate max-w-[140px] sm:max-w-none">
  {mod.title}
</p>
            </div>

            <Layers size={14} />

            {/* ACTIONS */}
            {editable && (<div className="flex gap-2 ml-auto">

                {/* EDIT */}
                <button
                  onClick={() => {
                    setEditingId(mod.id)
                    setEditTitle(mod.title)
                  }}
                >
                  <Edit3 size={14} />
                </button>

                {/* DELETE */}
                <button onClick={() => handleDelete(mod.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* EDIT FORM */}
          {editable && editingId === mod.id && (
          <div className="p-3 border-t bg-royal-50 flex flex-col sm:flex-row gap-2">
              <input
                className="input flex-1 text-sm py-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <button
                className="btn-primary text-xs"
                onClick={() => handleUpdate(mod.id)}
              >
                Update
              </button>

              <button
                className="btn-secondary text-xs"
                onClick={() => {
                  setEditingId(null)
                  setEditTitle('')
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* LESSONS + QUIZ */}
          {expanded[mod.id] && (
            <div className="border-t px-3 sm:px-4 py-4 bg-surface max-h-[60vh] overflow-y-auto space-y-4">
              <LessonList moduleId={mod.id} editable={editable} />
              {editable && (
                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle size={14} className="text-indigo-400" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Module Quiz</span>
                  </div>
                  <QuizBuilder moduleId={mod.id} moduleTitle={mod.title} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// components/course/ModuleList.jsx
// Student view — shows modules with lock/unlock status + quiz entry per module
// import { useState } from 'react'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { quizApi, lessonApi } from '../../api/services.js'
// import QuizTracker from '../quiz/QuizTracker.jsx'
// import {
//   Lock, Unlock, CheckCircle2, ChevronDown, ChevronRight,
//   HelpCircle, PlayCircle, FileText, BookOpen, Star
// } from 'lucide-react'

// const LESSON_ICON = { VIDEO: PlayCircle, PDF: FileText, TEXT: BookOpen, IMAGE: FileText }

// export default function ModuleList({ courseId, onLessonSelect, completedLessonIds = new Set() }) {
//   const qc = useQueryClient()
//   const [expandedModule, setExpandedModule] = useState(null)
//   const [quizModal, setQuizModal] = useState({ open: false, quiz: null })

//   // Module lock/unlock statuses
//   const { data: statuses = [], isLoading } = useQuery({
//     queryKey: ['module-statuses', courseId],
//     queryFn:  () => quizApi.moduleStatuses(courseId).then(r => r.data),
//     enabled:  !!courseId,
//   })

//   // Lessons per expanded module
//   const { data: lessons = [] } = useQuery({
//     queryKey: ['lessons', expandedModule],
//     queryFn:  () => lessonApi.getByModule(expandedModule).then(r => r.data),
//     enabled:  !!expandedModule,
//   })

//   // Quiz for expanded module (student view — no correct answers)
//   const { data: moduleQuiz } = useQuery({
//     queryKey: ['quiz-student', expandedModule],
//     queryFn:  () => quizApi.getForStudent(expandedModule).then(r => r.data),
//     enabled:  !!expandedModule,
//   })

//   const handleQuizOpen = () => {
//     if (moduleQuiz) setQuizModal({ open: true, quiz: moduleQuiz })
//   }

//   const handleQuizPassed = () => {
//     // Refresh statuses so next module unlocks
//     qc.invalidateQueries({ queryKey: ['module-statuses', courseId] })
//     qc.invalidateQueries({ queryKey: ['quiz-student', expandedModule] })
//   }

//   if (isLoading) return (
//     <div className="space-y-2">
//       {[1,2,3].map(i => (
//         <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
//       ))}
//     </div>
//   )

//   return (
//     <>
//       <div className="space-y-2">
//         {statuses.map(mod => {
//           const isExpanded = expandedModule === mod.moduleId
//           const Icon = mod.unlocked ? Unlock : Lock

//           return (
//             <div key={mod.moduleId} className={`border rounded-2xl overflow-hidden transition-all ${
//               mod.unlocked
//                 ? 'border-royal-100 bg-white'
//                 : 'border-slate-200 bg-slate-50 opacity-70'
//             }`}>

//               {/* Module header */}
//               <button
//                 disabled={!mod.unlocked}
//                 onClick={() => {
//                   if (!mod.unlocked) return
//                   setExpandedModule(isExpanded ? null : mod.moduleId)
//                 }}
//                 className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
//               >
//                 {/* Lock icon */}
//                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                   mod.unlocked ? 'bg-royal-gradient' : 'bg-slate-200'
//                 }`}>
//                   <Icon size={14} className={mod.unlocked ? 'text-white' : 'text-slate-400'} />
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-navy-800 truncate">
//                     {mod.moduleTitle}
//                   </p>
//                   <div className="flex items-center gap-2 mt-0.5">
//                     {/* Lessons done */}
//                     {mod.lessonsCompleted && (
//                       <span className="text-xs text-emerald-600 flex items-center gap-0.5">
//                         <CheckCircle2 size={10} /> Lessons done
//                       </span>
//                     )}
//                     {/* Quiz status */}
//                     {mod.quizExists && (
//                       <span className={`text-xs flex items-center gap-0.5 ${
//                         mod.quizPassed ? 'text-emerald-600' : 'text-amber-500'
//                       }`}>
//                         <HelpCircle size={10} />
//                         {mod.quizPassed
//                           ? `Quiz passed (${mod.quizBestScore}%)`
//                           : mod.quizBestScore != null
//                             ? `Quiz: ${mod.quizBestScore}% (need ${mod.passingScore}%)`
//                             : 'Quiz required'
//                         }
//                       </span>
//                     )}
//                     {/* Locked message */}
//                     {!mod.unlocked && (
//                       <span className="text-xs text-slate-400">
//                         Complete previous module to unlock
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {mod.unlocked && (
//                   isExpanded
//                     ? <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
//                     : <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
//                 )}
//               </button>

//               {/* Expanded: lessons + quiz button */}
//               {isExpanded && mod.unlocked && (
//                 <div className="border-t border-slate-100 bg-surface">

//                   {/* Lessons list */}
//                   {lessons.length === 0 && (
//                     <p className="text-xs text-slate-400 px-5 py-3">No lessons yet.</p>
//                   )}
//                   {lessons.map(lesson => {
//                     const LIcon = LESSON_ICON[lesson.type] || FileText
//                     const done  = completedLessonIds.has(lesson.id)
//                     return (
//                       <button
//                         key={lesson.id}
//                         onClick={() => onLessonSelect?.(lesson)}
//                         className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-royal-50 text-left transition-colors"
//                       >
//                         <LIcon size={13} className="text-royal-400 flex-shrink-0" />
//                         <span className="text-sm text-navy-700 flex-1 truncate">
//                           {lesson.title}
//                         </span>
//                         {done && (
//                           <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
//                         )}
//                       </button>
//                     )
//                   })}

//                   {/* Quiz section */}
//                   {mod.quizExists && (
//                     <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <HelpCircle size={14} className="text-royal-500" />
//                         <span className="text-xs font-semibold text-navy-700">
//                           Module Quiz
//                         </span>
//                         {mod.quizPassed && (
//                           <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
//                             <Star size={10} /> {mod.quizBestScore}%
//                           </span>
//                         )}
//                       </div>
//                       <button
//                         onClick={handleQuizOpen}
//                         className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
//                           mod.quizPassed
//                             ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
//                             : 'bg-royal-gradient text-white hover:opacity-90'
//                         }`}
//                       >
//                         {mod.quizPassed ? '✓ Retake Quiz' : 'Take Quiz →'}
//                       </button>
//                     </div>
//                   )}

//                   {/* No quiz, all done */}
//                   {!mod.quizExists && mod.lessonsCompleted && (
//                     <div className="px-5 py-3 border-t border-slate-100">
//                       <span className="text-xs text-emerald-600 flex items-center gap-1">
//                         <CheckCircle2 size={11} /> Module complete
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )
//         })}
//       </div>

//       {/* Quiz Modal */}
//       <QuizTracker
//         isOpen={quizModal.open}
//         quiz={quizModal.quiz}
//         onClose={() => setQuizModal({ open: false, quiz: null })}
//         onPassed={handleQuizPassed}
//       />
//     </>
//   )
// }
