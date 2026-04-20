import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { courseApi } from '../../api/services'
import Modal from '../common/Modal'
import FormField, { Input, Select, Textarea } from '../common/FormField'
import toast from 'react-hot-toast'
import { ImagePlus } from 'lucide-react'

export default function CreateCourseModal({ isOpen, onClose, onCreated }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState(null)

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
      const res = await courseApi.create(fd)
      toast.success('Course created!')
      reset(); setThumbnail(null); setPreview(null)
      onCreated?.(res.data)
      onClose()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Course" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Thumbnail upload */}
        <div className="flex justify-center">
          <label className="cursor-pointer group">
            <div className="w-full h-32 rounded-xl border-2 border-dashed border-royal-200 group-hover:border-royal-400 bg-royal-50 flex flex-col items-center justify-center transition-colors overflow-hidden">
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                : <>
                    <ImagePlus size={24} className="text-royal-300 mb-1" />
                    <span className="text-xs text-slate-lms">Click to upload thumbnail</span>
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

        <div className="flex gap-3 pt-2 justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
