import { useForm } from 'react-hook-form'
import { assignmentApi } from '../../api/services'
import Modal from '../common/Modal'
import FormField, { Input, Textarea } from '../common/FormField'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AssignmentModal({ isOpen, onClose, onSaved, courseId, assignment }) {
  const isEdit = !!assignment
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: assignment || { courseId }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (isEdit) await assignmentApi.update(assignment.id, data)
      else await assignmentApi.create({ ...data, courseId })
      toast.success(isEdit ? 'Assignment updated!' : 'Assignment created!')
      reset(); onSaved?.(); onClose()
    } catch { toast.error('Failed to save assignment') }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Assignment' : 'New Assignment'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Title" error={errors.title?.message} required>
          <Input {...register('title', { required: 'Title required' })} placeholder="Assignment title" error={errors.title} />
        </FormField>
        <FormField label="Description" error={errors.description?.message}>
          <Textarea {...register('description')} placeholder="Describe the assignment..." />
        </FormField>
        <FormField label="Due Date" error={errors.dueDate?.message}>
          <Input type="datetime-local" {...register('dueDate')} />
        </FormField>
        <FormField label="Max Points" error={errors.maxPoints?.message}>
          <Input type="number" min="1" {...register('maxPoints')} placeholder="100" />
        </FormField>
        <div className="flex gap-3 justify-end pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
