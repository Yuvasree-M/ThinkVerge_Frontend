// components/submissions/GradeModal.jsx
import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { submissionApi } from '../../api/services'
import { X, Star, FileText, Download, Eye, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

// ✅ Use Google Docs viewer so Cloudinary raw PDFs render inline in browser
const pdfViewerUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('blob:')) return url
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

export default function GradeModal({
  isOpen,
  onClose,
  submission,   // SubmissionResponse from backend
  onGraded,
}) {
  const [grade,    setGrade]    = useState('')
  const [feedback, setFeedback] = useState('')

  // ✅ Reset form whenever a different submission is opened
  useEffect(() => {
    if (submission) {
      setGrade(submission.grade ?? '')
      setFeedback(submission.feedback ?? '')
    }
  }, [submission?.id])

  const { mutate: gradeSubmit, isPending } = useMutation({
    mutationFn: () =>
      submissionApi.grade(submission.id, {
        grade:    Number(grade),
        feedback: feedback.trim() || null,
      }),
    onSuccess: () => {
      toast.success('Graded successfully!')
      onGraded?.()
      onClose()
    },
    onError: () => toast.error('Failed to grade'),
  })

  const handleSubmit = () => {
    if (grade === '' || grade === null) { toast.error('Enter a grade'); return }
    if (Number(grade) < 0)             { toast.error('Grade cannot be negative'); return }
    gradeSubmit()
  }

  if (!isOpen || !submission) return null

  const statusColor = {
    LATE:      'text-red-500 bg-red-50',
    EARLY:     'text-emerald-500 bg-emerald-50',
    SUBMITTED: 'text-blue-500 bg-blue-50',
  }[submission.status] || 'text-slate-500 bg-slate-50'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-royal-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {(submission.studentName || 'S')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-navy-800 text-sm">{submission.studentName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400">
                  {submission.assignmentTitle || 'Submission'}
                </span>
                {submission.status && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
                    {submission.status}
                  </span>
                )}
                {submission.submittedAt && (
                  <span className="text-xs text-slate-400">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Written answer */}
          {submission.content && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Written Answer
              </p>
              <div className="bg-surface rounded-xl p-4 text-sm text-navy-700 leading-relaxed whitespace-pre-wrap">
                {submission.content}
              </div>
            </div>
          )}

          {/* Student's submitted PDF */}
          {submission.fileUrl ? (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Submitted PDF
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mb-3">
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-xs text-royal-500 flex items-center gap-1.5"
                >
                  <Eye size={13} /> View Full Screen
                </a>
                {/* ✅ download with explicit filename so it saves as .pdf */}
                <a
                  href={submission.fileUrl}
                  download={`${submission.studentName || 'student'}_submission.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-xs text-emerald-600 flex items-center gap-1.5"
                >
                  <Download size={13} /> Download
                </a>
              </div>

              {/* ✅ Inline PDF preview via Google Docs viewer */}
              <div className="border border-royal-100 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-royal-50 border-b border-royal-100">
                  <FileText size={13} className="text-royal-500" />
                  <span className="text-xs text-navy-600 font-medium">Student's submission</span>
                </div>
                <iframe
                  src={pdfViewerUrl(submission.fileUrl)}
                  title="Student Submission PDF"
                  className="w-full"
                  style={{ height: 360 }}
                />
              </div>
            </div>
          ) : !submission.content ? (
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-surface rounded-xl p-4">
              <FileText size={16} />
              No file or text submitted.
            </div>
          ) : null}

          {/* Previous grade notice */}
          {submission.grade != null && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <Star size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold text-emerald-700">
                  Previously graded: {submission.grade} pts
                </span>
                {submission.feedback && (
                  <p className="text-emerald-600 mt-0.5">{submission.feedback}</p>
                )}
              </div>
            </div>
          )}

          {/* Grade form */}
          <div className="space-y-3 bg-surface rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {submission.grade != null ? 'Update Grade' : 'Grade This Submission'}
            </p>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Grade (marks)
              </label>
              <input
                type="number"
                min={0}
                className="input w-48"
                placeholder="e.g. 85"
                value={grade}
                onChange={e => setGrade(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Feedback (optional)
              </label>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Well done! / You missed the following points..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-surface flex-shrink-0">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="btn-primary flex items-center gap-2"
          >
            {isPending
              ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
              : <><Star size={14} /> {submission.grade != null ? 'Update Grade' : 'Submit Grade'}</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}