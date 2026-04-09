import { useState } from 'react'
import { submissionApi } from '../../api/services'
import Modal from '../common/Modal'
import FormField, { Textarea, Input } from '../common/FormField'
import toast from 'react-hot-toast'

export default function SubmitAssignmentModal({ isOpen, onClose, assignment, onSubmitted }) {
  const [content, setContent] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submissionApi.submit({ assignmentId: assignment?.id, content, fileUrl })
      toast.success('Assignment submitted!')
      setContent(''); setFileUrl('')
      onSubmitted?.(); onClose()
    } catch { toast.error('Submission failed') }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submit: ${assignment?.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Your Answer / Notes">
          <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your response..." />
        </FormField>
        <FormField label="File URL (optional)" hint="Paste a link to your work (Google Drive, GitHub, etc.)">
          <Input type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://..." />
        </FormField>
        <div className="flex gap-3 justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-gold" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
