// // pages/student/StudentSubmissionsPage.jsx
// import { useState } from 'react'
// import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
// import { submissionApi, enrollmentApi, assignmentApi } from '../../api/services'
// import { PageSpinner } from '../../components/common/Spinner'
// import EmptyState from '../../components/common/EmptyState'
// import SubmitAssignmentModal from '../../components/submissions/SubmitAssignmentModal'
// import useModal from '../../hooks/useModal'
// import {
//   FileText, Plus, Star, Clock,
//   Download, Eye, ChevronDown, ChevronRight, CheckCircle2,
//   Trash2, RefreshCw, AlertTriangle, Loader2
// } from 'lucide-react'
// import toast from 'react-hot-toast'

// // ✅ Google Docs viewer for inline PDF rendering
// const pdfViewerUrl = (url) => {
//   if (!url) return ''
//   if (url.startsWith('blob:')) return url
//   return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
// }

// // ── Confirm Delete Dialog ─────────────────────────────────
// function ConfirmDeleteDialog({ isOpen, onConfirm, onCancel, isPending }) {
//   if (!isOpen) return null
//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
//             <AlertTriangle size={18} className="text-red-500" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-navy-800 text-sm">Delete Submission?</h3>
//             <p className="text-xs text-slate-500 mt-0.5">
//               This will permanently remove your submission. You can resubmit afterwards.
//             </p>
//           </div>
//         </div>
//         <div className="flex justify-end gap-2 mt-5">
//           <button
//             onClick={onCancel}
//             disabled={isPending}
//             className="btn-ghost text-sm"
//           >
//             Keep It
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isPending}
//             className="btn-primary bg-red-500 hover:bg-red-600 text-sm flex items-center gap-2"
//           >
//             {isPending
//               ? <><Loader2 size={13} className="animate-spin" /> Deleting…</>
//               : <><Trash2 size={13} /> Yes, Delete</>
//             }
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function StudentSubmissionsPage() {
//   const qc = useQueryClient()
//   const submitModal = useModal()
//   const [expandedCourse, setExpandedCourse] = useState(null)
//   const [deleteTarget, setDeleteTarget] = useState(null)   // submission id to delete

//   const { data: submissions = [], isLoading: ls } = useQuery({
//     queryKey: ['my-submissions'],
//     queryFn:  () => submissionApi.mySubmissions().then(r => r.data),
//   })

//   const { data: enrollments = [] } = useQuery({
//     queryKey: ['my-enrollments'],
//     queryFn:  () => enrollmentApi.myEnrollments().then(r => r.data),
//   })

//   const { data: assignments = [] } = useQuery({
//     queryKey: ['assignments-for-course', expandedCourse],
//     queryFn:  () => assignmentApi.byCourse(expandedCourse).then(r => r.data),
//     enabled:  !!expandedCourse,
//   })

//   // ✅ Delete mutation
//   const { mutate: deleteSubmission, isPending: isDeleting } = useMutation({
//     mutationFn: (id) => submissionApi.delete(id),
//     onSuccess: () => {
//       toast.success('Submission deleted. You can resubmit now.')
//       setDeleteTarget(null)
//       qc.invalidateQueries({ queryKey: ['my-submissions'] })
//     },
//     onError: () => {
//       toast.error('Failed to delete submission')
//       setDeleteTarget(null)
//     },
//   })

//   if (ls) return <PageSpinner />

//   const approved     = enrollments.filter(e => e.status === 'APPROVED')
//   // ✅ Map by assignmentId for quick lookup
//   const submissionByAssignment = Object.fromEntries(
//     submissions.map(s => [s.assignmentId, s])
//   )

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

//       {/* ── Left: courses + assignments ── */}
//       <div className="lg:col-span-2 space-y-3">
//         <p className="text-xs font-semibold text-slate-lms uppercase tracking-wider">
//           Available Assignments
//         </p>

//         {approved.map(e => (
//           <div key={e.id}>
//             <button
//               className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
//                 expandedCourse === e.course?.id
//                   ? 'border-royal-400 bg-royal-50'
//                   : 'border-royal-100 bg-white hover:border-royal-200'
//               }`}
//               onClick={() => setExpandedCourse(p => p === e.course?.id ? null : e.course?.id)}
//             >
//               <div className="w-8 h-8 rounded-lg bg-royal-gradient flex items-center justify-center flex-shrink-0">
//                 <FileText size={13} className="text-white" />
//               </div>
//               <span className="text-sm font-medium text-navy-800 flex-1 truncate">
//                 {e.course?.title}
//               </span>
//               {expandedCourse === e.course?.id
//                 ? <ChevronDown  size={14} className="text-slate-lms" />
//                 : <ChevronRight size={14} className="text-slate-lms" />
//               }
//             </button>

//             {expandedCourse === e.course?.id && (
//               <div className="ml-4 mt-1 space-y-1 border-l-2 border-royal-100 pl-3">
//                 {assignments.length === 0 && (
//                   <p className="text-xs text-slate-lms py-2">No assignments.</p>
//                 )}
//                 {assignments.map(a => {
//                   const existing   = submissionByAssignment[a.id]
//                   const submitted  = !!existing
//                   const isGraded   = existing?.grade != null
//                   const isOverdue  = a.dueDate && new Date() > new Date(a.dueDate)

//                   return (
//                     <div
//                       key={a.id}
//                       className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-royal-50"
//                     >
//                       <div className="flex-1 min-w-0">
//                         <span className="text-xs text-navy-700 block truncate">{a.title}</span>
//                         <div className="flex items-center gap-2 mt-0.5">
//                           {a.pdfUrl && (
//                             <a
//                               href={a.pdfUrl}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="text-xs text-royal-500 hover:underline flex items-center gap-0.5"
//                             >
//                               <Eye size={9} /> View PDF
//                             </a>
//                           )}
//                           {isOverdue && !submitted && (
//                             <span className="text-xs text-red-400">Overdue</span>
//                           )}
//                           {/* ✅ show graded badge on the left panel too */}
//                           {isGraded && (
//                             <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
//                               <Star size={9} /> {existing.grade}pts
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* ✅ Action buttons based on state */}
//                       {isGraded ? (
//                         // Graded — locked, no actions
//                         <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
//                       ) : submitted ? (
//                         // Submitted but not graded — allow resubmit or delete
//                         <div className="flex items-center gap-1 flex-shrink-0">
//                           <button
//                             title="Resubmit"
//                             className="btn-ghost text-xs text-royal-500 px-1.5 py-1 flex items-center gap-0.5"
//                             onClick={() => submitModal.open(a)}
//                           >
//                             <RefreshCw size={11} /> Edit
//                           </button>
//                           <button
//                             title="Delete submission"
//                             className="btn-ghost text-xs text-red-400 px-1.5 py-1 flex items-center gap-0.5"
//                             onClick={() => setDeleteTarget(existing.id)}
//                           >
//                             <Trash2 size={11} />
//                           </button>
//                         </div>
//                       ) : (
//                         // Not submitted yet
//                         <button
//                           className="btn-ghost text-xs text-royal-500 px-2 py-1 flex-shrink-0 flex items-center gap-0.5"
//                           onClick={() => submitModal.open(a)}
//                         >
//                           <Plus size={11} /> Submit
//                         </button>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         ))}

//         {approved.length === 0 && (
//           <p className="text-xs text-slate-lms py-4">Enroll in courses to see assignments.</p>
//         )}
//       </div>

//       {/* ── Right: My submissions ── */}
//       <div className="lg:col-span-3">
//         <p className="text-xs font-semibold text-slate-lms uppercase tracking-wider mb-3">
//           My Submissions ({submissions.length})
//         </p>

//         {submissions.length === 0 ? (
//           <EmptyState
//             icon={FileText}
//             title="No submissions yet"
//             description="Select an assignment from the left to submit your work."
//           />
//         ) : (
//           <div className="space-y-3">
//             {submissions.map(s => {
//               const isGraded = s.grade != null
//               return (
//                 <div key={s.id} className="card">

//                   {/* Header */}
//                   <div className="flex items-start justify-between gap-3 mb-3">
//                     <div>
//                       <p className="font-semibold text-navy-800 text-sm">
//                         {s.assignmentTitle || 'Assignment'}
//                       </p>
//                       <p className="text-xs text-slate-lms mt-0.5 flex items-center gap-1">
//                         <Clock size={10} />
//                         {s.submittedAt
//                           ? `Submitted: ${new Date(s.submittedAt).toLocaleDateString()}`
//                           : '—'
//                         }
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-2 flex-shrink-0">
//                       {isGraded ? (
//                         <div className="flex items-center gap-1 badge-green">
//                           <Star size={11} /> {s.grade} pts
//                         </div>
//                       ) : (
//                         <>
//                           <span className="badge-yellow flex items-center gap-1">
//                             <Clock size={11} /> Pending
//                           </span>
//                           {/* ✅ Resubmit + Delete on card header (pending only) */}
//                           <button
//                             title="Resubmit"
//                             onClick={() => {
//                               // Find the assignment from submissions data and open modal
//                               submitModal.open({ id: s.assignmentId, title: s.assignmentTitle })
//                             }}
//                             className="btn-ghost text-xs text-royal-500 flex items-center gap-1 px-2 py-1"
//                           >
//                             <RefreshCw size={11} /> Resubmit
//                           </button>
//                           <button
//                             title="Delete submission"
//                             onClick={() => setDeleteTarget(s.id)}
//                             className="btn-ghost text-xs text-red-400 flex items-center gap-1 px-2 py-1"
//                           >
//                             <Trash2 size={11} />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* ✅ Graded lock notice */}
//                   {isGraded && (
//                     <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 mb-2">
//                       <CheckCircle2 size={12} className="text-emerald-400" />
//                       This submission has been graded and can no longer be modified.
//                     </div>
//                   )}

//                   {/* Written answer preview */}
//                   {s.content && (
//                     <p className="text-xs text-navy-600 bg-surface rounded-lg p-2.5 line-clamp-2 mb-2">
//                       {s.content}
//                     </p>
//                   )}

//                   {/* Submitted PDF — inline preview + view + download */}
//                   {s.fileUrl && (
//                     <div className="border border-royal-100 rounded-xl overflow-hidden mb-2">
//                       <div className="flex items-center justify-between px-3 py-2 bg-royal-50 border-b border-royal-100">
//                         <div className="flex items-center gap-1.5">
//                           <FileText size={12} className="text-royal-500" />
//                           <span className="text-xs font-medium text-navy-700">Your submission</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <a
//                             href={s.fileUrl}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="btn-ghost text-xs text-royal-500 flex items-center gap-1 px-2 py-1"
//                           >
//                             <Eye size={10} /> View
//                           </a>
//                           <a
//                             href={s.fileUrl}
//                             download="my_submission.pdf"
//                             target="_blank"
//                             rel="noreferrer"
//                             className="btn-ghost text-xs text-emerald-600 flex items-center gap-1 px-2 py-1"
//                           >
//                             <Download size={10} /> Download
//                           </a>
//                         </div>
//                       </div>
//                       <iframe
//                         src={pdfViewerUrl(s.fileUrl)}
//                         title="My submission"
//                         className="w-full"
//                         style={{ height: 180 }}
//                       />
//                     </div>
//                   )}

//                   {/* Instructor feedback */}
//                   {s.feedback && (
//                     <div className="text-xs bg-emerald-50 text-emerald-700 rounded-lg px-3 py-2">
//                       <strong>Instructor Feedback:</strong> {s.feedback}
//                     </div>
//                   )}
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </div>

//       {/* ── Modals ── */}
//       <SubmitAssignmentModal
//         isOpen={submitModal.isOpen}
//         onClose={submitModal.close}
//         assignment={submitModal.data}
//         onSubmitted={() => qc.invalidateQueries({ queryKey: ['my-submissions'] })}
//       />

//       <ConfirmDeleteDialog
//         isOpen={!!deleteTarget}
//         isPending={isDeleting}
//         onConfirm={() => deleteSubmission(deleteTarget)}
//         onCancel={() => setDeleteTarget(null)}
//       />
//     </div>
//   )
// }


// pages/student/StudentSubmissionsPage.jsx
// pages/student/StudentSubmissionsPage.jsx
import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { submissionApi, enrollmentApi, assignmentApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import SubmitAssignmentModal from '../../components/submissions/SubmitAssignmentModal'
import useModal from '../../hooks/useModal'
import {
  FileText, Plus, Star, Clock, Download, Eye,
  ChevronDown, ChevronRight, CheckCircle2, Trash2,
  RefreshCw, AlertTriangle, Loader2, BookOpen, TrendingUp, Award,
} from 'lucide-react'
import toast from 'react-hot-toast'

const pdfViewerUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('blob:')) return url
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

// ── Confirm Delete Dialog ──────────────────────────────────────────────────
function ConfirmDeleteDialog({ isOpen, onConfirm, onCancel, isPending }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Delete Submission?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This will permanently remove your submission. You can resubmit afterwards.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isPending
              ? <><Loader2 size={13} className="animate-spin" /> Deleting…</>
              : <><Trash2 size={13} /> Yes, Delete</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',    text: 'text-blue-600',    icon: 'text-blue-400'    },
    green:  { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-400' },
    amber:  { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: 'text-amber-400'   },
    purple: { bg: 'bg-violet-50',  text: 'text-violet-600',  icon: 'text-violet-400'  },
  }
  const c = colors[color] || colors.blue
  return (
    <div className={`${c.bg} rounded-xl p-3.5 flex items-center gap-3`}>
      <div className={c.icon}><Icon size={18} /></div>
      <div>
        <p className={`text-lg font-semibold leading-none ${c.text}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ── Inline Submission Detail ───────────────────────────────────────────────
function SubmissionDetail({ s, onResubmit, onDelete }) {
  const isGraded = s.grade != null

  return (
    <div className="mx-4 mb-3 border border-slate-200 rounded-xl overflow-hidden bg-white">

      {/* Status + actions bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          {isGraded ? (
            <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100">
              <Star size={10} /> {s.grade} pts
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-100">
              <Clock size={10} /> Pending review
            </span>
          )}
          {s.submittedAt && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock size={9} />
              {new Date(s.submittedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          )}
        </div>

        {!isGraded && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onResubmit({ id: s.assignmentId, title: s.assignmentTitle })}
              className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              <RefreshCw size={10} /> Resubmit
            </button>
            <button
              onClick={() => onDelete(s.id)}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-500 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash2 size={10} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Written content */}
      {s.content && (
        <p className="text-xs text-slate-600 px-3 py-2.5 leading-relaxed line-clamp-3 border-b border-slate-100">
          {s.content}
        </p>
      )}

      {/* PDF */}
      {s.fileUrl && (
        <div>
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <FileText size={10} className="text-slate-400" /> Submitted file
            </span>
            <div className="flex items-center gap-1">
              <a
                href={s.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-500 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Eye size={9} /> View
              </a>
              <a
                href={s.fileUrl}
                download="my_submission.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
              >
                <Download size={9} /> Save
              </a>
            </div>
          </div>
          <iframe
            src={pdfViewerUrl(s.fileUrl)}
            title="Submitted file"
            className="w-full"
            style={{ height: 160 }}
          />
        </div>
      )}

      {/* Feedback */}
      {s.feedback && (
        <div className="text-xs bg-emerald-50 text-emerald-700 px-3 py-2 leading-relaxed border-t border-emerald-100">
          <strong>Feedback:</strong> {s.feedback}
        </div>
      )}

      {/* Graded lock */}
      {isGraded && (
        <div className="flex items-center gap-2 text-[11px] text-slate-400 px-3 py-2 border-t border-slate-100 bg-slate-50">
          <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0" />
          Graded — no further edits allowed
        </div>
      )}
    </div>
  )
}

// ── Assignment Row (with collapsible question + submission) ───────────────
function AssignmentRow({ a, existing, onSubmit, onResubmit, onDelete }) {
  const [qOpen,   setQOpen]   = useState(false)   // question / brief
  const [subOpen, setSubOpen] = useState(false)   // my submission

  const isGraded  = existing?.grade != null
  const submitted = !!existing
  const isOverdue = a.dueDate && new Date() > new Date(a.dueDate)

  const hasQuestion = !!(a.description || a.pdfUrl)

  return (
    <div className="border-b border-slate-100 last:border-b-0">

      {/* ── Top row: title + actions ── */}
      <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/80 transition-colors">

        {/* Status dot */}
        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
          isGraded  ? 'bg-emerald-400' :
          submitted ? 'bg-amber-400'   :
          isOverdue ? 'bg-red-400'     : 'bg-slate-200'
        }`} />

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 font-semibold">{a.title}</p>

          {/* description text (shown directly if short, otherwise truncated) */}
          {a.description && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {a.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {a.dueDate && (
              <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                <Clock size={9} />
                Due {new Date(a.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            )}
            {isOverdue && !submitted && (
              <span className="text-[11px] text-red-400 font-medium">Overdue</span>
            )}
            {isGraded && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <Star size={9} /> {existing.grade} pts
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">

          {/* Question / PDF brief toggle */}
          {hasQuestion && (
            <button
              onClick={() => setQOpen(p => !p)}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                qOpen
                  ? 'border-violet-200 bg-violet-50 text-violet-600'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {qOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              Question
            </button>
          )}

          {/* Submit / view submission */}
          {submitted ? (
            <button
              onClick={() => setSubOpen(p => !p)}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                subOpen
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {subOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              My submission
            </button>
          ) : (
            <button
              onClick={() => onSubmit(a)}
              className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 px-2.5 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <Plus size={11} /> Submit
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsible: Question / PDF brief ── */}
      {hasQuestion && qOpen && (
        <div className="mx-4 mb-3 border border-violet-100 rounded-xl overflow-hidden bg-violet-50/40">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-violet-100 bg-violet-50">
            <FileText size={11} className="text-violet-400" />
            <span className="text-[11px] font-semibold text-violet-600 uppercase tracking-wide">
              Assignment Question
            </span>
          </div>

          {/* Text description */}
          {a.description && (
            <p className="text-xs text-slate-700 px-3 py-2.5 leading-relaxed whitespace-pre-wrap">
              {a.description}
            </p>
          )}

          {/* PDF question paper */}
          {a.pdfUrl && (
            <div className={a.description ? 'border-t border-violet-100' : ''}>
              <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-violet-100">
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <FileText size={10} /> Question paper (PDF)
                </span>
                <a
                  href={a.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-violet-500 hover:text-violet-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-violet-50 transition-colors"
                >
                  <Eye size={9} /> Open full
                </a>
              </div>
              <iframe
                src={pdfViewerUrl(a.pdfUrl)}
                title="Assignment question"
                className="w-full bg-white"
                style={{ height: 220 }}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Collapsible: My submission ── */}
      {submitted && subOpen && (
        <SubmissionDetail
          s={existing}
          onResubmit={onResubmit}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}

// ── Course Section — fetches its own assignments lazily ────────────────────
function CourseSection({ enrollment, submissionByAssignment, onSubmit, onResubmit, onDelete }) {
  const [open, setOpen] = useState(true)
  const courseId        = enrollment.course?.id
  const courseTitle     = enrollment.course?.title ?? 'Unnamed Course'

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments-for-course', courseId],
    queryFn:  () => assignmentApi.byCourse(courseId).then(r => r.data),
    enabled:  !!courseId,
  })

  const submittedCount = assignments.filter(a => !!submissionByAssignment[a.id]).length
  const gradedCount    = assignments.filter(a => submissionByAssignment[a.id]?.grade != null).length
  const pendingCount   = submittedCount - gradedCount

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">

      {/* Course header — click to open/close */}
      <button
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
          open ? 'bg-blue-50/60' : 'bg-white hover:bg-slate-50'
        }`}
        onClick={() => setOpen(p => !p)}
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
          open ? 'bg-blue-100' : 'bg-slate-100'
        }`}>
          <BookOpen size={14} className={open ? 'text-blue-500' : 'text-slate-400'} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${open ? 'text-blue-700' : 'text-slate-700'}`}>
            {courseTitle}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isLoading ? 'Loading…' : (
              <>
                {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
                {submittedCount > 0 && ` · ${submittedCount} submitted`}
              </>
            )}
          </p>
        </div>

        {/* Summary badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {gradedCount > 0 && (
            <span className="hidden sm:inline text-[11px] font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
              {gradedCount} graded
            </span>
          )}
          {pendingCount > 0 && (
            <span className="hidden sm:inline text-[11px] font-medium bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100">
              {pendingCount} pending
            </span>
          )}
          {open
            ? <ChevronDown  size={14} className="text-blue-400 ml-1" />
            : <ChevronRight size={14} className="text-slate-400 ml-1" />}
        </div>
      </button>

      {/* Assignments */}
      {open && (
        <div className="border-t border-slate-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 gap-2 text-xs text-slate-400">
              <Loader2 size={13} className="animate-spin" /> Loading assignments…
            </div>
          ) : assignments.length === 0 ? (
            <p className="text-xs text-slate-400 py-5 text-center">No assignments yet.</p>
          ) : (
            assignments.map(a => (
              <AssignmentRow
                key={a.id}
                a={a}
                existing={submissionByAssignment[a.id]}
                onSubmit={onSubmit}
                onResubmit={onResubmit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function StudentSubmissionsPage() {
  const qc          = useQueryClient()
  const submitModal = useModal()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: submissions = [], isLoading: ls } = useQuery({
    queryKey: ['my-submissions'],
    queryFn:  () => submissionApi.mySubmissions().then(r => r.data),
  })

  const { data: enrollments = [], isLoading: le } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn:  () => enrollmentApi.myEnrollments().then(r => r.data),
  })

  const { mutate: deleteSubmission, isPending: isDeleting } = useMutation({
    mutationFn: (id) => submissionApi.delete(id),
    onSuccess: () => {
      toast.success('Submission deleted. You can resubmit now.')
      setDeleteTarget(null)
      qc.invalidateQueries({ queryKey: ['my-submissions'] })
    },
    onError: () => {
      toast.error('Failed to delete submission')
      setDeleteTarget(null)
    },
  })

  if (ls || le) return <PageSpinner />

  const approved = enrollments.filter(e => e.status === 'APPROVED')

  // assignmentId → submission lookup
  const submissionByAssignment = Object.fromEntries(
    submissions.map(s => [s.assignmentId, s])
  )

  const gradedCount  = submissions.filter(s => s.grade != null).length
  const pendingCount = submissions.length - gradedCount
  const avgScore     = gradedCount > 0
    ? Math.round(
        submissions
          .filter(s => s.grade != null)
          .reduce((acc, s) => acc + s.grade, 0) / gradedCount
      )
    : '—'

  const handleOpenSubmit = (a)  => submitModal.open(a)
  const handleOpenDelete = (id) => setDeleteTarget(id)

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total submitted" value={submissions.length} icon={FileText}  color="blue"   />
        <StatCard label="Graded"          value={gradedCount}        icon={Award}      color="green"  />
        <StatCard label="Pending review"  value={pendingCount}       icon={Clock}      color="amber"  />
        <StatCard label="Avg score (pts)" value={avgScore}           icon={TrendingUp} color="purple" />
      </div>

      {/* Courses → Assignments → Submissions */}
      {approved.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No enrolled courses"
          description="Enroll in a course to see assignments and submit your work."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {approved.map(e => (
            <CourseSection
              key={e.id}
              enrollment={e}
              submissionByAssignment={submissionByAssignment}
              onSubmit={handleOpenSubmit}
              onResubmit={handleOpenSubmit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SubmitAssignmentModal
        isOpen={submitModal.isOpen}
        onClose={submitModal.close}
        assignment={submitModal.data}
        onSubmitted={() => qc.invalidateQueries({ queryKey: ['my-submissions'] })}
      />

      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        isPending={isDeleting}
        onConfirm={() => deleteSubmission(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}