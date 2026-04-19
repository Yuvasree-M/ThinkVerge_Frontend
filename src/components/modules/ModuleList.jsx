
// import { useState } from 'react'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { moduleApi } from '../../api/services'
// import {
//   Layers,
//   Plus,
//   ChevronDown,
//   ChevronRight,
//   Trash2,
//   Edit3,
//   HelpCircle,
//   Check,
//   X
// } from 'lucide-react'

// import { PageSpinner } from '../common/Spinner'
// import LessonList from '../lessons/LessonList'
// import QuizBuilder from '../quiz/QuizBuilder'
// import toast from 'react-hot-toast'

// /* ─────────────────────────────────────────────
//    Global styles injected once
//    ───────────────────────────────────────────── */
// const globalStyles = `
//   /* ── Invisible scrollbar (all browsers) ── */
//   .no-scrollbar {
//     scrollbar-width: none !important;
//     -ms-overflow-style: none !important;
//   }
//   .no-scrollbar::-webkit-scrollbar { display: none !important; }

//   /* ── Module card hover ── */
//   .module-card {
//     transition: box-shadow 0.18s ease, border-color 0.18s ease;
//   }
//   .module-card:hover {
//     box-shadow: 0 4px 18px rgba(0,0,0,0.07);
//   }

//   /* ── Title: always truncates, never overflows ── */
//   .module-title {
//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//     min-width: 0;
//   }

//   /* ── Tap-friendly icon buttons ── */
//   .icon-btn {
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     min-width: 2rem;
//     height: 2rem;
//     border-radius: 0.5rem;
//     color: #64748b;
//     transition: background 0.15s ease, color 0.15s ease;
//     flex-shrink: 0;
//   }
//   .icon-btn:hover  { background: rgba(99,102,241,0.08); color: #4f46e5; }
//   .icon-btn:active { background: rgba(99,102,241,0.16); }

//   /* ── Inline action row that wraps cleanly ── */
//   .action-row {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 0.5rem;
//     align-items: center;
//   }

//   /* ── Full-width buttons below 400 px ── */
//   @media (max-width: 399px) {
//     .btn-full-xs {
//       width: 100%;
//       justify-content: center;
//     }
//   }
// `

// /* ─────────────────────────────────────────────
//    Component
//    ───────────────────────────────────────────── */
// export default function ModuleList({ courseId, editable = false }) {
//   const qc = useQueryClient()

//   const [expanded,  setExpanded]  = useState({})
//   const [adding,    setAdding]    = useState(false)
//   const [editingId, setEditingId] = useState(null)
//   const [newTitle,  setNewTitle]  = useState('')
//   const [editTitle, setEditTitle] = useState('')
//   const [saving,    setSaving]    = useState(false)

//   /* ── Fetch ── */
//   const { data, isLoading } = useQuery({
//     queryKey: ['modules', courseId],
//     queryFn:  () => moduleApi.getByCourse(courseId).then(r => r.data),
//     enabled:  !!courseId,
//   })
//   const modules = Array.isArray(data) ? data : []

//   const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

//   /* ── Create ── */
//   const handleCreate = async (e) => {
//     e.preventDefault()
//     if (!newTitle.trim()) return
//     setSaving(true)
//     try {
//       await moduleApi.create({
//         courseId,
//         title: newTitle,
//         description: '',
//         orderIndex: modules.length + 1,
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

//   /* ── Delete ── */
//   const handleDelete = async (id) => {
//     try {
//       await moduleApi.delete(id)
//       toast.success('Module deleted')
//       qc.invalidateQueries({ queryKey: ['modules', courseId] })
//     } catch {
//       toast.error('Delete failed')
//     }
//   }

//   /* ── Update ── */
//   const handleUpdate = async (id) => {
//     if (!editTitle.trim()) return
//     try {
//       const existing = modules.find(m => m.id === id)
//       await moduleApi.update(id, {
//         title:      editTitle,
//         description: existing?.description || '',
//         orderIndex:  existing?.orderIndex  || 0,
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
//     <>
//       <style>{globalStyles}</style>

//       {/* Outer wrapper: full width, never overflows */}
//       <div className="w-full min-w-0 space-y-3 no-scrollbar" style={{ maxHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>

//         {/* ── Header ── */}
//         <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
//           <h3 className="font-semibold text-navy-800 text-sm sm:text-base leading-tight truncate min-w-0">
//             Course Modules
//           </h3>

//           {editable && (
//             <button
//               className="btn-ghost text-xs flex items-center gap-1 shrink-0 whitespace-nowrap"
//               onClick={() => setAdding(p => !p)}
//             >
//               <Plus size={13} />
//               Add Module
//             </button>
//           )}
//         </div>

//         {/* ── Create form ── */}
//         {editable && adding && (
//           <form
//             onSubmit={handleCreate}
//             className="p-3 bg-royal-50 rounded-xl border space-y-2"
//           >
//             <input
//               className="input w-full text-sm py-2"
//               placeholder="Module title…"
//               value={newTitle}
//               onChange={e => setNewTitle(e.target.value)}
//               autoFocus
//             />
//             <div className="action-row justify-end">
//               <button
//                 type="submit"
//                 className="btn-primary text-xs btn-full-xs"
//                 disabled={saving}
//               >
//                 {saving ? 'Saving…' : 'Save'}
//               </button>
//               <button
//                 type="button"
//                 className="btn-secondary text-xs btn-full-xs"
//                 onClick={() => setAdding(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}

//         {/* ── Empty state ── */}
//         {modules.length === 0 && (
//           <p className="text-sm text-center py-8 text-slate-lms">
//             No modules yet.
//           </p>
//         )}

//         {/* ── Module cards ── */}
//         {modules.map((mod, idx) => (
//           <div key={mod.id} className="card module-card w-full min-w-0">

//             {/* ── Module header row ── */}
//             <div
//               className="flex items-center gap-2 px-3 py-3 hover:bg-royal-50 cursor-pointer min-w-0 w-full"
//               onClick={() => toggle(mod.id)}
//             >
//               {/* Chevron */}
//               <span className="shrink-0 text-slate-400 leading-none">
//                 {expanded[mod.id]
//                   ? <ChevronDown size={16} />
//                   : <ChevronRight size={16} />
//                 }
//               </span>

//               {/* Index badge */}
//               <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-royal-gradient text-white flex items-center justify-center text-xs font-bold shrink-0 leading-none">
//                 {idx + 1}
//               </div>

//               {/* Title — flex-1 + min-w-0 ensures it shrinks and ellipsis-truncates */}
//               <p className="module-title flex-1 min-w-0 font-semibold text-sm">
//                 {mod.title}
//               </p>

//               {/* Layers icon — decorative, disappears on small screens */}
//               <Layers size={13} className="hidden sm:block shrink-0 text-slate-300" />

//               {/* Edit / Delete — stopPropagation so row click doesn't toggle */}
//               {editable && (
//                 <div
//                   className="flex items-center gap-0.5 shrink-0 ml-1"
//                   onClick={e => e.stopPropagation()}
//                 >
//                   <button
//                     className="icon-btn"
//                     aria-label="Edit module"
//                     onClick={() => { setEditingId(mod.id); setEditTitle(mod.title) }}
//                   >
//                     <Edit3 size={14} />
//                   </button>
//                   <button
//                     className="icon-btn"
//                     aria-label="Delete module"
//                     onClick={() => handleDelete(mod.id)}
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* ── Inline edit form ── */}
//             {editable && editingId === mod.id && (
//               <div className="px-3 pb-3 pt-2 border-t bg-royal-50 space-y-2">
//                 <input
//                   className="input w-full text-sm py-2"
//                   value={editTitle}
//                   onChange={e => setEditTitle(e.target.value)}
//                   autoFocus
//                   onKeyDown={e => { if (e.key === 'Enter') handleUpdate(mod.id) }}
//                 />
//                 <div className="action-row justify-end">
//                   <button
//                     className="btn-primary text-xs flex items-center gap-1 btn-full-xs"
//                     onClick={() => handleUpdate(mod.id)}
//                   >
//                     <Check size={13} /> Update
//                   </button>
//                   <button
//                     className="btn-secondary text-xs flex items-center gap-1 btn-full-xs"
//                     onClick={() => { setEditingId(null); setEditTitle('') }}
//                   >
//                     <X size={13} /> Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ── Expanded panel: lessons + quiz ── */}
//             {expanded[mod.id] && (
//               <div
//                 className="border-t bg-surface px-3 sm:px-4 py-4 space-y-4 no-scrollbar w-full min-w-0"
//                 style={{ maxHeight: '55vh', overflowY: 'auto', overflowX: 'hidden' }}
//               >
//                 <LessonList moduleId={mod.id} editable={editable} />

//                 {editable && (
//                   <div className="border-t border-dashed border-gray-200 pt-4">
//                     <div className="flex items-center gap-2 mb-3 flex-wrap">
//                       <HelpCircle size={13} className="text-indigo-400 shrink-0" />
//                       <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         Module Quiz
//                       </span>
//                     </div>
//                     <div className="w-full min-w-0">
//                       <QuizBuilder moduleId={mod.id} moduleTitle={mod.title} />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         ))}
//       </div>
//     </>
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
import FinalQuizBuilder from '../quiz/FinalQuizBuilder'
import toast from 'react-hot-toast'

export default function ModuleList({ courseId, courseTitle = '', editable = false }) {
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

      {/* FINAL EXAM BUILDER — instructor only, shown after all modules */}
      {editable && modules.length > 0 && (
        <FinalQuizBuilder courseId={courseId} courseTitle={courseTitle} />
      )}
    </div>
  )
}