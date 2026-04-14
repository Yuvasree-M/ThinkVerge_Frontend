import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonApi, uploadApi } from '../../api/services'
import {
  Plus, Trash2, Edit, Video, FileText,
  File, Image, ChevronDown, ChevronUp, X
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Type config ───────────────────────────────────────────
const LESSON_TYPES = [
  { value: 'VIDEO', label: 'Video', icon: Video,    color: 'text-blue-500',   bg: 'bg-blue-50'   },
  { value: 'TEXT',  label: 'Text',  icon: FileText, color: 'text-green-500',  bg: 'bg-green-50'  },
  { value: 'PDF',   label: 'PDF',   icon: File,     color: 'text-red-500',    bg: 'bg-red-50'    },
  { value: 'IMAGE', label: 'Image', icon: Image,    color: 'text-purple-500', bg: 'bg-purple-50' },
]

const getTypeConfig = (type) =>
  LESSON_TYPES.find(t => t.value === type) || LESSON_TYPES[0]

const EMPTY_FORM = {
  title: '', type: 'VIDEO',
  content: '', videoUrl: '',
  durationSeconds: '', orderIndex: '',
}

// ── Type-specific fields ──────────────────────────────────
function LessonTypeFields({ form, setForm, uploading, setUploading }) {

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadApi.upload(file)
      const url = typeof res.data === 'string' ? res.data : res.data.url
      if (form.type === 'VIDEO') {
        setForm(p => ({ ...p, videoUrl: url }))
      } else {
        setForm(p => ({ ...p, content: url }))
      }
      toast.success('File uploaded!')
    } catch (err) {
      console.error(err)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  switch (form.type) {

    case 'VIDEO':
      return (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Video URL</label>
          <input
            placeholder="Paste YouTube / Vimeo / direct URL"
            value={form.videoUrl}
            onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
            className="border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or upload</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Video size={16} />
            {uploading ? 'Uploading…' : 'Choose video file'}
            <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
          </label>
          {form.videoUrl && <p className="text-xs text-green-600 truncate">✓ {form.videoUrl}</p>}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration (sec)</label>
              <input type="number" placeholder="e.g. 360" value={form.durationSeconds}
                onChange={e => setForm(p => ({ ...p, durationSeconds: e.target.value }))}
                className="border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order</label>
              <input type="number" placeholder="e.g. 1" value={form.orderIndex}
                onChange={e => setForm(p => ({ ...p, orderIndex: e.target.value }))}
                className="border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" />
            </div>
          </div>
        </div>
      )

    case 'TEXT':
      return (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Content</label>
          <textarea
            placeholder="Write lesson content here…"
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            rows={5}
            className="border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
          />
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order</label>
            <input type="number" placeholder="e.g. 1" value={form.orderIndex}
              onChange={e => setForm(p => ({ ...p, orderIndex: e.target.value }))}
              className="border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mt-1" />
          </div>
        </div>
      )

    case 'PDF':
      return (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">PDF File</label>
          <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-3 py-4 text-sm text-gray-500 cursor-pointer hover:border-red-400 hover:text-red-500 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <File size={16} />
            {uploading ? 'Uploading…' : form.content ? '✓ Uploaded — click to replace' : 'Upload PDF'}
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          </label>
          {form.content && <p className="text-xs text-green-600 truncate">✓ {form.content}</p>}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order</label>
            <input type="number" placeholder="e.g. 1" value={form.orderIndex}
              onChange={e => setForm(p => ({ ...p, orderIndex: e.target.value }))}
              className="border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mt-1" />
          </div>
        </div>
      )

    case 'IMAGE':
      return (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Image File</label>
          <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-3 py-4 text-sm text-gray-500 cursor-pointer hover:border-purple-400 hover:text-purple-500 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {form.content
              ? <img src={form.content} alt="preview" className="max-h-28 rounded object-contain" />
              : <><Image size={20} /><span>{uploading ? 'Uploading…' : 'Upload image'}</span></>
            }
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order</label>
            <input type="number" placeholder="e.g. 1" value={form.orderIndex}
              onChange={e => setForm(p => ({ ...p, orderIndex: e.target.value }))}
              className="border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1" />
          </div>
        </div>
      )

    default: return null
  }
}

// ── Lesson row ────────────────────────────────────────────
function LessonRow({ lesson, editable, onEdit, onDelete }) {
  const { icon: Icon, color, bg } = getTypeConfig(lesson.type)
  const [expanded, setExpanded] = useState(false)

  const hasPreview =
    (lesson.type === 'TEXT'  && lesson.content)  ||
    (lesson.type === 'IMAGE' && lesson.content)  ||
    (lesson.type === 'PDF'   && lesson.content)  ||
    (lesson.type === 'VIDEO' && lesson.videoUrl)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <div className={`${bg} ${color} p-2 rounded-lg flex-shrink-0`}>
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-800 truncate">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs font-medium ${color}`}>{lesson.type}</span>
            {lesson.durationSeconds && (
              <span className="text-xs text-gray-400">
                {Math.floor(lesson.durationSeconds / 60)}m {lesson.durationSeconds % 60}s
              </span>
            )}
            {lesson.orderIndex != null && (
              <span className="text-xs text-gray-400">#{lesson.orderIndex}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {hasPreview && (
            <button onClick={() => setExpanded(v => !v)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors">
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
          {editable && (
            <>
              <button onClick={onEdit}
                className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors">
                <Edit size={14} />
              </button>
              <button onClick={onDelete}
                className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors">
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          {lesson.type === 'TEXT' && (
            <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-6">{lesson.content}</p>
          )}
          {lesson.type === 'IMAGE' && (
            <img src={lesson.content} alt={lesson.title} className="max-h-48 rounded object-contain" />
          )}
          {lesson.type === 'PDF' && (
            <a href={lesson.content} target="_blank" rel="noopener noreferrer"
              className="text-sm text-red-600 hover:underline flex items-center gap-1">
              <File size={14} /> Open PDF
            </a>
          )}
          {lesson.type === 'VIDEO' && lesson.videoUrl && (
            <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <Video size={14} /> Watch Video
            </a>
          )}
        </div>
      )}
    </div>
  )
}

// ── Lesson form ───────────────────────────────────────────
function LessonForm({ initial = EMPTY_FORM, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const [uploading, setUploading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (form.type === 'VIDEO' && !form.videoUrl.trim()) {
      toast.error('Please add a video URL or upload a file'); return
    }
    if ((form.type === 'PDF' || form.type === 'IMAGE') && !form.content.trim()) {
      toast.error('Please upload a file first'); return
    }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}
      className="border border-gray-200 rounded-xl p-4 space-y-4 bg-white shadow-sm">

      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lesson Title *</label>
        <input
          placeholder="e.g. Introduction to Variables"
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          className="border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type *</label>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {LESSON_TYPES.map(({ value, label, icon: Icon, color: c, bg }) => (
            <button key={value} type="button"
              onClick={() => setForm(p => ({ ...p, type: value, content: '', videoUrl: '' }))}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border-2 text-xs font-medium transition-all ${
                form.type === value
                  ? `border-current ${c} ${bg}`
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <LessonTypeFields
        form={form} setForm={setForm}
        uploading={uploading} setUploading={setUploading}
      />

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={submitting || uploading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors">
          {submitting ? 'Saving…' : 'Save Lesson'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
          <X size={15} />
        </button>
      </div>
    </form>
  )
}

// ── Main ──────────────────────────────────────────────────
export default function LessonList({ moduleId, editable = false }) {
  const qc = useQueryClient()
  const [adding, setAdding]         = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => lessonApi.getByModule(moduleId).then(res => res.data),
    enabled: !!moduleId,
  })

  const lessons = Array.isArray(data) ? data : data?.content || data?.data || []

  // CREATE — plain JSON (backend now uses @RequestBody, not @RequestPart)
  const handleCreate = async (form) => {
    setSubmitting(true)
    try {
      await lessonApi.create({
        moduleId,
        title:           form.title,
        type:            form.type,
        content:         form.content         || null,
        videoUrl:        form.videoUrl        || null,
        durationSeconds: form.durationSeconds ? Number(form.durationSeconds) : null,
        orderIndex:      form.orderIndex      ? Number(form.orderIndex)      : null,
      })
      toast.success('Lesson created!')
      setAdding(false)
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    } catch (err) {
      console.error(err)
      toast.error('Failed to create lesson')
    } finally {
      setSubmitting(false)
    }
  }

  // UPDATE — plain JSON
  const handleUpdate = async (id, form) => {
    setSubmitting(true)
    try {
      await lessonApi.update(id, {
        title:           form.title,
        type:            form.type,
        content:         form.content         || null,
        videoUrl:        form.videoUrl        || null,
        durationSeconds: form.durationSeconds ? Number(form.durationSeconds) : null,
        orderIndex:      form.orderIndex      ? Number(form.orderIndex)      : null,
      })
      toast.success('Lesson updated!')
      setEditingId(null)
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    } catch (err) {
      console.error(err)
      toast.error('Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm('Delete this lesson?')) return
    try {
      await lessonApi.delete(id)
      toast.success('Lesson deleted!')
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    } catch (err) {
      console.error(err)
      toast.error('Delete failed')
    }
  }

  if (isLoading) return <p className="text-sm text-gray-400 py-2">Loading lessons…</p>

  return (
    <div className="space-y-2">

      {lessons.length === 0 && !adding && (
        <p className="text-sm text-gray-400 py-2">No lessons yet — add one below.</p>
      )}

      {lessons.map(lesson =>
        editingId === lesson.id ? (
          <LessonForm
            key={lesson.id}
            initial={{
              title:           lesson.title                           || '',
              type:            lesson.type                           || 'VIDEO',
              content:         lesson.content                        || '',
              videoUrl:        lesson.videoUrl                       || '',
              durationSeconds: lesson.durationSeconds != null ? String(lesson.durationSeconds) : '',
              orderIndex:      lesson.orderIndex      != null ? String(lesson.orderIndex)      : '',
            }}
            onSubmit={(form) => handleUpdate(lesson.id, form)}
            onCancel={() => setEditingId(null)}
            submitting={submitting}
          />
        ) : (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            editable={editable}
            onEdit={() => setEditingId(lesson.id)}
            onDelete={() => handleDelete(lesson.id)}
          />
        )
      )}

      {adding && (
        <LessonForm
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
          submitting={submitting}
        />
      )}

      {editable && !adding && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium py-1 transition-colors">
          <Plus size={16} /> Add Lesson
        </button>
      )}
    </div>
  )
}