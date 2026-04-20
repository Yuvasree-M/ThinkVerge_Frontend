import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { courseApi } from '../../api/services'
import Modal from '../common/Modal'
import FormField, { Input, Select, Textarea } from '../common/FormField'
import toast from 'react-hot-toast'
import { ImagePlus } from 'lucide-react'

export default function EditCourseModal({ isOpen, onClose, onUpdated, course }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState(null)

  // Pre-fill form when course changes
  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description,
        category: course.category,
        durationHours: course.durationHours,
      })
      setPreview(course.thumbnail || null)
      setThumbnail(null)
    }
  }, [course, reset])

  const onFileChange = (e) => {
    const f = e.target.files[0]
    if (f) { setThumbnail(f); setPreview(URL.createObjectURL(f)) }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', data.title)
      fd.append('description', data.description)
      fd.append('category', data.category)
      fd.append('durationHours', data.durationHours)
      if (thumbnail) fd.append('thumbnail', thumbnail)
      const res = await courseApi.update(course.id, fd)
      toast.success('Course updated! Awaiting re-approval.')
      onUpdated?.(res.data)
      onClose()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Course" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Thumbnail upload */}
        <div className="flex justify-center">
          <label className="cursor-pointer group w-full">
            <div className="w-full h-32 rounded-xl border-2 border-dashed border-royal-200 group-hover:border-royal-400 bg-royal-50 flex flex-col items-center justify-center transition-colors overflow-hidden">
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                : <>
                    <ImagePlus size={24} className="text-royal-300 mb-1" />
                    <span className="text-xs text-slate-lms">Click to replace thumbnail</span>
                  </>
              }
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </label>
        </div>

        <FormField label="Course Title" error={errors.title?.message} required>
          <Input {...register('title', { required: 'Title is required' })} placeholder="e.g. React for Beginners" error={errors.title} />
        </FormField>

        <FormField label="Description" error={errors.description?.message} required>
          <Textarea {...register('description', { required: 'Description is required' })} placeholder="What will students learn?" error={errors.description} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" error={errors.category?.message} required>
            <Select {...register('category', { required: 'Category required' })} error={errors.category}>
              <option value="">Select category</option>
              {['Programming Language','Web Development','Mobile Development','Data Science','Design','Business','Marketing','DevOps','AI / ML'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Duration (hours)" error={errors.durationHours?.message} required>
            <Input
              type="number" min="1"
              {...register('durationHours', { required: 'Duration required', min: 1 })}
              placeholder="e.g. 12"
              error={errors.durationHours}
            />
          </FormField>
        </div>

        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          ⚠️ Editing will reset this course to <strong>Pending</strong> status for re-approval.
        </p>

        <div className="flex gap-3 pt-2 justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}