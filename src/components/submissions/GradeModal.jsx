import { useState } from 'react'
import { submissionApi } from '../../api/services'
import Modal from '../common/Modal'
import FormField, { Input, Textarea } from '../common/FormField'
import toast from 'react-hot-toast'

export default function GradeModal({ isOpen, onClose, submission, onGraded }) {
  const [grade, setGrade] = useState(submission?.grade ?? '')
  const [feedback, setFeedback] = useState(submission?.feedback ?? '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submissionApi.grade(submission.id, { grade: Number(grade), feedback })
      toast.success('Graded successfully!')
      onGraded?.(); onClose()
    } catch { toast.error('Failed to grade') }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Grade Submission">
      {submission && (
        <div className="mb-4 p-3 bg-royal-50 rounded-xl">
          <p className="text-xs text-slate-lms mb-1">Student response:</p>
          <p className="text-sm text-navy-800">{submission.content || <span className="italic text-slate-lms">No text content</span>}</p>
          {submission.fileUrl && (
            <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-royal-500 underline mt-1 block">
              View submitted file ↗
            </a>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Grade" required>
          <Input type="number" min="0" max={submission?.assignment?.maxPoints || 100} value={grade} onChange={e => setGrade(e.target.value)} placeholder={`Out of ${submission?.assignment?.maxPoints || 100}`} required />
        </FormField>
        <FormField label="Feedback">
          <Textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Leave feedback for the student..." />
        </FormField>
        <div className="flex gap-3 justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Submit Grade'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
