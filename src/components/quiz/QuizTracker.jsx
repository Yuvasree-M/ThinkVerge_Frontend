// // components/quiz/QuizTaker.jsx
// import { useState } from 'react'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { quizApi } from '../../api/services.js'
// import {
//   X, CheckCircle2, XCircle, Loader2,
//   Trophy, RotateCcw, Lock
// } from 'lucide-react'
// import toast from 'react-hot-toast'

// export default function QuizTracker({ isOpen, onClose, quiz, onPassed }) {
//   const qc = useQueryClient()
//   const [answers, setAnswers] = useState({})   // { questionId: 'A'|'B'|'C'|'D' }
//   const [result, setResult] = useState(null)   // QuizAttemptResponse

//   const { mutate: submit, isPending } = useMutation({
//     mutationFn: () => quizApi.submit({
//       quizId: quiz.id,
//       answers,
//     }),
//     onSuccess: (res) => {
//       setResult(res.data)
//       if (res.data.passed) {
//         toast.success('🎉 You passed!')
//         // Invalidate module statuses so lock icons refresh
//         qc.invalidateQueries({ queryKey: ['module-statuses'] })
//         onPassed?.()
//       } else {
//         toast.error(`Score ${res.data.score}% — need ${res.data.passingScore}% to pass`)
//       }
//     },
//     onError: () => toast.error('Failed to submit quiz'),
//   })

//   const handleSubmit = () => {
//     const unanswered = quiz.questions.filter(q => !answers[q.id])
//     if (unanswered.length > 0) {
//       toast.error(`Answer all questions (${unanswered.length} remaining)`)
//       return
//     }
//     submit()
//   }

//   const handleRetry = () => {
//     setAnswers({})
//     setResult(null)
//   }

//   const handleClose = () => {
//     setAnswers({})
//     setResult(null)
//     onClose()
//   }

//   if (!isOpen || !quiz) return null

//   const answered = Object.keys(answers).length
//   const total    = quiz.questions.length

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
//           <div>
//             <h2 className="font-semibold text-navy-800">{quiz.title}</h2>
//             <p className="text-xs text-slate-400 mt-0.5">
//               Pass mark: {quiz.passingScore}% · {total} questions
//             </p>
//           </div>
//           <button onClick={handleClose} className="btn-icon text-slate-400">
//             <X size={18} />
//           </button>
//         </div>

//         {/* ── Result screen ── */}
//         {result ? (
//           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
//             <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
//               result.passed ? 'bg-emerald-100' : 'bg-red-100'
//             }`}>
//               {result.passed
//                 ? <Trophy size={36} className="text-emerald-500" />
//                 : <XCircle size={36} className="text-red-400" />
//               }
//             </div>

//             <div>
//               <p className="text-3xl font-bold text-navy-800">{result.score}%</p>
//               <p className={`text-sm font-semibold mt-1 ${
//                 result.passed ? 'text-emerald-600' : 'text-red-500'
//               }`}>
//                 {result.passed ? '✅ Passed!' : '❌ Not passed'}
//               </p>
//               <p className="text-xs text-slate-400 mt-2">
//                 {result.correctAnswers} of {result.totalQuestions} correct
//                 · Need {result.passingScore}% to pass
//               </p>
//             </div>

//             {result.passed ? (
//               <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-3 text-sm text-emerald-700 max-w-sm">
//                 🎉 Module unlocked! You can now proceed to the next module.
//               </div>
//             ) : (
//               <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3 text-sm text-red-600 max-w-sm">
//                 Review the lessons and try again. You can retake this quiz.
//               </div>
//             )}

//             <div className="flex gap-3 mt-2">
//               {!result.passed && (
//                 <button
//                   onClick={handleRetry}
//                   className="btn-ghost flex items-center gap-2"
//                 >
//                   <RotateCcw size={14} /> Retry Quiz
//                 </button>
//               )}
//               <button onClick={handleClose} className="btn-primary">
//                 {result.passed ? 'Continue' : 'Close'}
//               </button>
//             </div>
//           </div>

//         ) : (
//           /* ── Question list ── */
//           <>
//             {/* Progress bar */}
//             <div className="px-6 py-2 border-b border-slate-50 flex-shrink-0">
//               <div className="flex items-center justify-between mb-1">
//                 <span className="text-xs text-slate-400">Progress</span>
//                 <span className="text-xs font-medium text-navy-700">
//                   {answered}/{total}
//                 </span>
//               </div>
//               <div className="w-full h-1.5 bg-slate-100 rounded-full">
//                 <div
//                   className="h-1.5 bg-royal-gradient rounded-full transition-all"
//                   style={{ width: `${(answered / total) * 100}%` }}
//                 />
//               </div>
//             </div>

//             {/* Questions */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               {quiz.questions.map((q, idx) => (
//                 <div key={q.id}>
//                   <p className="text-sm font-medium text-navy-800 mb-3">
//                     <span className="text-royal-500 font-bold mr-1">{idx + 1}.</span>
//                     {q.question}
//                   </p>
//                   <div className="grid grid-cols-1 gap-2">
//                     {['A', 'B', 'C', 'D'].map(opt => {
//                       const text = q[`option${opt}`]
//                       if (!text) return null
//                       const selected = answers[q.id] === opt
//                       return (
//                         <button
//                           key={opt}
//                           onClick={() =>
//                             setAnswers(a => ({ ...a, [q.id]: opt }))
//                           }
//                           className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
//                             selected
//                               ? 'border-royal-400 bg-royal-50 text-navy-800 font-medium'
//                               : 'border-slate-200 hover:border-royal-200 text-slate-700 hover:bg-royal-50/30'
//                           }`}
//                         >
//                           <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
//                             selected
//                               ? 'bg-royal-500 text-white'
//                               : 'bg-slate-100 text-slate-500'
//                           }`}>
//                             {opt}
//                           </span>
//                           {text}
//                           {selected && (
//                             <CheckCircle2 size={14} className="text-royal-500 ml-auto flex-shrink-0" />
//                           )}
//                         </button>
//                       )
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Footer */}
//             <div className="px-6 py-4 border-t border-slate-100 bg-surface flex justify-end gap-3 flex-shrink-0">
//               <button onClick={handleClose} className="btn-ghost">Cancel</button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={isPending || answered < total}
//                 className="btn-primary flex items-center gap-2"
//               >
//                 {isPending
//                   ? <><Loader2 size={13} className="animate-spin" /> Submitting…</>
//                   : `Submit Quiz (${answered}/${total})`
//                 }
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }



import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { quizApi } from '../../api/services.js'
import { useNavigate } from 'react-router-dom'
import {
  X, CheckCircle2, XCircle, Loader2,
  Trophy, RotateCcw, Award
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function QuizTracker({ isOpen, onClose, quiz, onPassed }) {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({})   // { questionId: 'A'|'B'|'C'|'D' }
  const [result, setResult] = useState(null)   // QuizAttemptResponse

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () => quizApi.submit({
      quizId: quiz.id,
      answers,
    }),
    onSuccess: (res) => {
      setResult(res.data)
      if (res.data.passed) {
        toast.success('🎉 You passed!')
        // Invalidate module statuses so lock icons refresh
        qc.invalidateQueries({ queryKey: ['module-statuses'] })
        onPassed?.()
      } else {
        toast.error(`Score ${res.data.score}% — need ${res.data.passingScore}% to pass`)
      }
    },
    onError: () => toast.error('Failed to submit quiz'),
  })

  const handleSubmit = () => {
    const unanswered = quiz.questions.filter(q => !answers[q.id])
    if (unanswered.length > 0) {
      toast.error(`Answer all questions (${unanswered.length} remaining)`)
      return
    }
    submit()
  }

  const handleRetry = () => {
    setAnswers({})
    setResult(null)
  }

  const handleClose = () => {
    setAnswers({})
    setResult(null)
    onClose()
  }

  if (!isOpen || !quiz) return null

  const answered = Object.keys(answers).length
  const total    = quiz.questions.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="font-semibold text-navy-800">{quiz.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pass mark: {quiz.passingScore}% · {total} questions
            </p>
          </div>
          <button onClick={handleClose} className="btn-icon text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* ── Result screen ── */}
        {result ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              result.passed ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              {result.passed
                ? <Trophy size={36} className="text-emerald-500" />
                : <XCircle size={36} className="text-red-400" />
              }
            </div>

            <div>
              <p className="text-3xl font-bold text-navy-800">{result.score}%</p>
              <p className={`text-sm font-semibold mt-1 ${
                result.passed ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {result.passed ? '✅ Passed!' : '❌ Not passed'}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                {result.correctAnswers} of {result.totalQuestions} correct
                · Need {result.passingScore}% to pass
              </p>
            </div>

            {result.passed ? (
              <>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-3 text-sm text-emerald-700 max-w-sm">
                  🎉 Module unlocked! You can now proceed to the next module.
                </div>
                <p className="text-xs text-slate-400 max-w-sm text-center">
                  If this was the last module quiz and all your assignments are graded, a certificate will be issued automatically.
                  <button
                    onClick={() => { handleClose(); navigate('/student/certificates') }}
                    className="ml-1 text-royal-500 underline hover:text-royal-700"
                  >
                    View Certificates
                  </button>
                </p>
              </>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3 text-sm text-red-600 max-w-sm">
                Review the lessons and try again. You can retake this quiz.
              </div>
            )}

            <div className="flex gap-3 mt-2">
              {!result.passed && (
                <button
                  onClick={handleRetry}
                  className="btn-ghost flex items-center gap-2"
                >
                  <RotateCcw size={14} /> Retry Quiz
                </button>
              )}
              <button onClick={handleClose} className="btn-primary">
                {result.passed ? 'Continue' : 'Close'}
              </button>
            </div>
          </div>

        ) : (
          /* ── Question list ── */
          <>
            {/* Progress bar */}
            <div className="px-6 py-2 border-b border-slate-50 flex-shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Progress</span>
                <span className="text-xs font-medium text-navy-700">
                  {answered}/{total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full">
                <div
                  className="h-1.5 bg-royal-gradient rounded-full transition-all"
                  style={{ width: `${(answered / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {quiz.questions.map((q, idx) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-navy-800 mb-3">
                    <span className="text-royal-500 font-bold mr-1">{idx + 1}.</span>
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const text = q[`option${opt}`]
                      if (!text) return null
                      const selected = answers[q.id] === opt
                      return (
                        <button
                          key={opt}
                          onClick={() =>
                            setAnswers(a => ({ ...a, [q.id]: opt }))
                          }
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                            selected
                              ? 'border-royal-400 bg-royal-50 text-navy-800 font-medium'
                              : 'border-slate-200 hover:border-royal-200 text-slate-700 hover:bg-royal-50/30'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            selected
                              ? 'bg-royal-500 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {opt}
                          </span>
                          {text}
                          {selected && (
                            <CheckCircle2 size={14} className="text-royal-500 ml-auto flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-surface flex justify-end gap-3 flex-shrink-0">
              <button onClick={handleClose} className="btn-ghost">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={isPending || answered < total}
                className="btn-primary flex items-center gap-2"
              >
                {isPending
                  ? <><Loader2 size={13} className="animate-spin" /> Submitting…</>
                  : `Submit Quiz (${answered}/${total})`
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
