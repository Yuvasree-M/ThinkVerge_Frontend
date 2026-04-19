// components/quiz/FinalQuizBuilder.jsx
// Instructor tool to create/edit the course-level final exam
import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { quizApi } from '../../api/services.js'
import {
  Plus, Save, Loader2, ChevronDown, ChevronUp, X, GraduationCap, Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_QUESTION = () => ({
  _key: Math.random(),
  question: '',
  optionA: '', optionB: '', optionC: '', optionD: '',
  correctOption: 'A',
})

export default function FinalQuizBuilder({ courseId, courseTitle }) {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [passingScore, setPassingScore] = useState(70)
  const [questions, setQuestions] = useState([EMPTY_QUESTION()])

  const { data: existing, isLoading } = useQuery({
    queryKey: ['final-quiz-instructor', courseId],
    queryFn: () => quizApi.getFinalForInstructor(courseId).then(r => r.data),
    enabled: open && !!courseId,
  })

  useEffect(() => {
    if (existing) {
      setTitle(existing.title || '')
      setPassingScore(existing.passingScore ?? 70)
      if (existing.questions?.length) {
        setQuestions(existing.questions.map(q => ({ ...q, _key: q.id })))
      }
    } else if (open && !isLoading) {
      // No existing — reset to blank
      setTitle(`Final Exam – ${courseTitle}`)
      setPassingScore(70)
      setQuestions([EMPTY_QUESTION()])
    }
  }, [existing, open, isLoading])

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => quizApi.createOrUpdateFinal({
      courseId,
      title,
      passingScore: Number(passingScore),
      isFinalQuiz: true,
      questions: questions.map(q => ({
        question: q.question, optionA: q.optionA, optionB: q.optionB,
        optionC: q.optionC, optionD: q.optionD, correctOption: q.correctOption,
      })),
    }),
    onSuccess: () => {
      toast.success('Final quiz saved!')
      qc.invalidateQueries({ queryKey: ['final-quiz-instructor', courseId] })
    },
    onError: () => toast.error('Failed to save final quiz'),
  })

  const { mutate: deleteQuiz, isPending: isDeleting } = useMutation({
    mutationFn: () => quizApi.deleteQuiz(existing.id),
    onSuccess: () => {
      toast.success('Final quiz deleted')
      qc.invalidateQueries({ queryKey: ['final-quiz-instructor', courseId] })
      setOpen(false)
    },
    onError: () => toast.error('Failed to delete'),
  })

  const addQuestion    = () => setQuestions(q => [...q, EMPTY_QUESTION()])
  const removeQuestion = (key) => setQuestions(q => q.filter(x => x._key !== key))
  const updateQuestion = (key, field, value) =>
    setQuestions(q => q.map(x => x._key === key ? { ...x, [field]: value } : x))

  const handleSave = () => {
    if (!title.trim()) { toast.error('Quiz title is required'); return }
    if (questions.length === 0) { toast.error('Add at least one question'); return }
    const invalid = questions.find(q => !q.question.trim() || !q.optionA.trim() || !q.optionB.trim())
    if (invalid) { toast.error('Fill in all question fields'); return }
    save()
  }

  return (
    <div className="border-2 border-dashed border-amber-200 rounded-2xl overflow-hidden mt-4">

      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <GraduationCap size={16} className="text-amber-600" />
          <span className="text-sm font-bold text-amber-900">Final Exam (Certificate Quiz)</span>
          {existing && !isLoading && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
              {existing.questions?.length ?? 0} questions · Pass {existing.passingScore}%
            </span>
          )}
          {!existing && !isLoading && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
              Not set yet
            </span>
          )}
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="p-4 space-y-4 bg-white">
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            🎓 This final exam unlocks only after the student completes <strong>all module quizzes</strong>. Passing it (along with graded assignments) issues the certificate.
          </p>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Exam Title</label>
              <input
                className="input w-full"
                placeholder={`Final Exam – ${courseTitle}`}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Passing Score (%)</label>
              <input
                type="number" min={1} max={100}
                className="input w-full"
                value={passingScore}
                onChange={e => setPassingScore(e.target.value)}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q._key} className="border border-slate-100 rounded-xl p-4 bg-surface space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Question {idx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(q._key)} className="btn-icon text-red-400">
                      <X size={13} />
                    </button>
                  )}
                </div>
                <textarea
                  className="input w-full resize-none" rows={2}
                  placeholder="Enter your question..."
                  value={q.question}
                  onChange={e => updateQuestion(q._key, 'question', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div key={opt} className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        q.correctOption === opt ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>{opt}</span>
                      <input
                        className="input flex-1 text-sm py-1.5"
                        placeholder={`Option ${opt}`}
                        value={q[`option${opt}`]}
                        onChange={e => updateQuestion(q._key, `option${opt}`, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Correct answer:</span>
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateQuestion(q._key, 'correctOption', opt)}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                        q.correctOption === opt
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button onClick={addQuestion} className="btn-ghost text-sm text-amber-700 flex items-center gap-1.5">
              <Plus size={14} /> Add Question
            </button>
            <div className="flex items-center gap-2">
              {existing && (
                <button
                  onClick={() => deleteQuiz()}
                  disabled={isDeleting}
                  className="btn-ghost text-xs text-red-400 flex items-center gap-1.5"
                >
                  <Trash2 size={12} /> Delete
                </button>
              )}
              <button onClick={handleSave} disabled={isPending} className="btn-primary flex items-center gap-2">
                {isPending
                  ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                  : <><Save size={13} /> Save Final Exam</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
