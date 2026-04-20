// components/quiz/QuizBuilder.jsx
import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { quizApi } from '../../api/services.js'
import {
  Plus, Trash2, Save, CheckCircle2, Loader2,
  ChevronDown, ChevronUp, HelpCircle, X
} from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_QUESTION = () => ({
  _key: Math.random(),
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: 'A',
})

export default function QuizBuilder({ moduleId, moduleTitle }) {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [passingScore, setPassingScore] = useState(70)
  const [questions, setQuestions] = useState([EMPTY_QUESTION()])

  // Load existing quiz if any
  const { data: existing, isLoading } = useQuery({
    queryKey: ['quiz-instructor', moduleId],
    queryFn: () => quizApi.getForInstructor(moduleId).then(r => r.data),
    enabled: open,
  })

  // Pre-fill form when existing quiz loaded
  useEffect(() => {
    if (existing) {
      setTitle(existing.title || '')
      setPassingScore(existing.passingScore ?? 70)
      if (existing.questions?.length) {
        setQuestions(existing.questions.map(q => ({ ...q, _key: q.id })))
      }
    }
  }, [existing])

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => quizApi.createOrUpdate({
      moduleId,
      title,
      passingScore: Number(passingScore),
      questions: questions.map(q => ({
        question:      q.question,
        optionA:       q.optionA,
        optionB:       q.optionB,
        optionC:       q.optionC,
        optionD:       q.optionD,
        correctOption: q.correctOption,
      })),
    }),
    onSuccess: () => {
      toast.success('Quiz saved!')
      qc.invalidateQueries({ queryKey: ['quiz-instructor', moduleId] })
      setOpen(false)
    },
    onError: () => toast.error('Failed to save quiz'),
  })

  const addQuestion = () =>
    setQuestions(q => [...q, EMPTY_QUESTION()])

  const removeQuestion = (key) =>
    setQuestions(q => q.filter(x => x._key !== key))

  const updateQuestion = (key, field, value) =>
    setQuestions(q => q.map(x => x._key === key ? { ...x, [field]: value } : x))

  const handleSave = () => {
    if (!title.trim()) { toast.error('Quiz title is required'); return }
    if (questions.length === 0) { toast.error('Add at least one question'); return }
    const invalid = questions.find(q =>
      !q.question.trim() || !q.optionA.trim() || !q.optionB.trim()
    )
    if (invalid) { toast.error('Fill in all question fields'); return }
    save()
  }

  return (
    <div className="border border-royal-100 rounded-2xl overflow-hidden mt-3">

      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-royal-50 hover:bg-royal-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle size={15} className="text-royal-500" />
          <span className="text-sm font-semibold text-navy-800">
            Module Quiz
          </span>
          {existing && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
              {existing.questions?.length ?? 0} questions · Pass {existing.passingScore}%
            </span>
          )}
          {!existing && !isLoading && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              No quiz yet
            </span>
          )}
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Builder body */}
      {open && (
        <div className="p-4 space-y-4 bg-white">

          {/* Quiz meta */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Quiz Title
              </label>
              <input
                className="input w-full"
                placeholder={`Quiz for ${moduleTitle}`}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={1} max={100}
                className="input w-full"
                value={passingScore}
                onChange={e => setPassingScore(e.target.value)}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q._key}
                className="border border-slate-100 rounded-xl p-4 bg-surface space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Question {idx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(q._key)}
                      className="btn-icon text-red-400"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Question text */}
                <textarea
                  className="input w-full resize-none"
                  rows={2}
                  placeholder="Enter your question..."
                  value={q.question}
                  onChange={e => updateQuestion(q._key, 'question', e.target.value)}
                />

                {/* Options grid */}
                <div className="grid grid-cols-2 gap-2">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <div key={opt} className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        q.correctOption === opt
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {opt}
                      </span>
                      <input
                        className="input flex-1 text-sm py-1.5"
                        placeholder={`Option ${opt}`}
                        value={q[`option${opt}`]}
                        onChange={e =>
                          updateQuestion(q._key, `option${opt}`, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Correct answer */}
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
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add question + Save */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={addQuestion}
              className="btn-ghost text-sm text-royal-600 flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Question
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="btn-primary flex items-center gap-2"
            >
              {isPending
                ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                : <><Save size={13} /> Save Quiz</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
