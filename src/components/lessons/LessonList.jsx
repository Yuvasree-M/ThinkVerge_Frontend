import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonApi, uploadApi } from '../../api/services'
import {
  Plus, Trash2, Edit, Video, FileText,
  File, Image, ChevronDown, ChevronUp, X,
  Download, ExternalLink, CheckCircle2
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────
// No changes to LESSON_TYPES, getTypeConfig, EMPTY_FORM
// ─────────────────────────────────────────────────────────────
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
  content: '', fileUrl: '',
  durationSeconds: '', orderIndex: '',
}

async function handleDownload(url, filename) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// ─────────────────────────────────────────────────────────────
// LessonTypeFields — no functional changes, only layout fix:
// CHANGE 1: Type-selector grid is now grid-cols-2 sm:grid-cols-4
//           so it doesn't overflow on narrow screens.
// CHANGE 2: Duration + Order row wraps with flex-wrap on mobile.
// ─────────────────────────────────────────────────────────────
function LessonTypeFields({ form, setForm, uploading, setUploading }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadApi.upload(file)
      const url = typeof res.data === 'string' ? res.data : res.data.url
      setForm(p => ({ ...p, fileUrl: url }))
      toast.success('File uploaded!')
    } catch (err) {
      console.error(err)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const inputCls = 'border border-gray-200 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 mt-1'

  switch (form.type) {

    case 'VIDEO':
      return (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Video URL</label>
          <input
            placeholder="Paste YouTube / Vimeo / direct URL"
            value={form.fileUrl}
            onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))}
            className={`${inputCls} focus:ring-blue-500`}
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
          {form.fileUrl && <p className="text-xs text-green-600 truncate">✓ {form.fileUrl}</p>}
          {/* CHANGE 2: flex-wrap so Duration+Order don't overflow */}
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration (sec)</label>
              <input type="number" placeholder="e.g. 360" value={form.durationSeconds}
                onChange={e => setForm(p => ({ ...p, durationSeconds: e.target.value }))}
                className={`${inputCls} focus:ring-blue-500`} />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order</label>
              <input type="number" placeholder="e.g. 1" value={form.orderIndex}
                onChange={e => setForm(p => ({ ...p, orderIndex: e.target.value }))}
                className={`${inputCls} focus:ring-blue-500`} />
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
              className={`${inputCls} focus:ring-green-500`} />
          </div>
        </div>
      )

    case 'PDF':
      return (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">PDF File</label>
          <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-3 py-4 text-sm text-gray-500 cursor-pointer hover:border-red-400 hover:text-red-500 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <File size={16} />
            {uploading ? 'Uploading…' : form.fileUrl ? '✓ Uploaded — click to replace' : 'Upload PDF'}
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          </label>
          {form.fileUrl && <p className="text-xs text-green-600 truncate">✓ {form.fileUrl}</p>}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order</label>
            <input type="number" placeholder="e.g. 1" value={form.orderIndex}
              onChange={e => setForm(p => ({ ...p, orderIndex: e.target.value }))}
              className={`${inputCls} focus:ring-red-500`} />
          </div>
        </div>
      )

    case 'IMAGE':
      return (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Image File</label>
          <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-3 py-4 text-sm text-gray-500 cursor-pointer hover:border-purple-400 hover:text-purple-500 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {form.fileUrl
              ? <img src={form.fileUrl} alt="preview" className="max-h-28 rounded object-contain" />
              : <><Image size={20} /><span>{uploading ? 'Uploading…' : 'Upload image'}</span></>
            }
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order</label>
            <input type="number" placeholder="e.g. 1" value={form.orderIndex}
              onChange={e => setForm(p => ({ ...p, orderIndex: e.target.value }))}
              className={`${inputCls} focus:ring-purple-500`} />
          </div>
        </div>
      )

    default: return null
  }
}

// ─────────────────────────────────────────────────────────────
// LessonPreview — no functional changes.
// ─────────────────────────────────────────────────────────────
function LessonPreview({ lesson }) {
  const filename = lesson.title.replace(/\s+/g, '_')
  return (
    <div className="border-t border-gray-100 p-3 bg-gray-50 space-y-3">
      {lesson.type === 'TEXT' && (
        <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-6">{lesson.content}</p>
      )}
      {lesson.type === 'IMAGE' && lesson.fileUrl && (
        <div className="space-y-2">
          <img src={lesson.fileUrl} alt={lesson.title}
            className="max-h-48 w-full rounded object-contain" />
          <div className="flex gap-2 flex-wrap">
            <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium">
              <ExternalLink size={13} /> View Full Size
            </a>
            <button onClick={() => handleDownload(lesson.fileUrl, `${filename}.jpg`)}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium">
              <Download size={13} /> Download Image
            </button>
          </div>
        </div>
      )}
      {lesson.type === 'PDF' && lesson.fileUrl && (
        <div className="space-y-2">
          {/* CHANGE 3: iframe is responsive height on mobile */}
          <iframe src={lesson.fileUrl} title={lesson.title}
            className="w-full rounded border border-gray-200 min-h-[200px] sm:h-[320px]" />
          <div className="flex gap-2 flex-wrap">
            <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
              <ExternalLink size={13} /> Open in Tab
            </a>
            <button onClick={() => handleDownload(lesson.fileUrl, `${filename}.pdf`)}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
              <Download size={13} /> Download PDF
            </button>
          </div>
        </div>
      )}
      {lesson.type === 'VIDEO' && lesson.fileUrl && (
        <div className="space-y-2">
          {/cloudinary\.com/.test(lesson.fileUrl) ? (
            <video src={lesson.fileUrl} controls
              className="w-full rounded border border-gray-200 max-h-64" />
          ) : (
            <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <ExternalLink size={14} /> Watch Video
            </a>
          )}
          <div className="flex gap-2 flex-wrap">
            <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
              <ExternalLink size={13} /> Open in Tab
            </a>
            {/cloudinary\.com/.test(lesson.fileUrl) && (
              <button onClick={() => handleDownload(lesson.fileUrl, `${filename}.mp4`)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                <Download size={13} /> Download Video
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LessonRow — responsive improvements:
// CHANGE 4: Meta row wraps with flex-wrap so it doesn't overflow.
// CHANGE 5: Edit/Delete buttons are always visible (not hidden
//           behind overflow) on narrow screens.
// ─────────────────────────────────────────────────────────────
function LessonRow({ lesson, editable, onEdit, onDelete }) {
  const { icon: Icon, color, bg } = getTypeConfig(lesson.type)
  const [expanded, setExpanded] = useState(false)

  const hasPreview =
    (lesson.type === 'TEXT'  && lesson.content) ||
    (lesson.type === 'IMAGE' && lesson.fileUrl) ||
    (lesson.type === 'PDF'   && lesson.fileUrl) ||
    (lesson.type === 'VIDEO' && lesson.fileUrl)

  const downloadUrl = lesson.type === 'TEXT' ? null : lesson.fileUrl
  const isDownloadable =
    lesson.type === 'IMAGE' ||
    lesson.type === 'PDF'   ||
    (lesson.type === 'VIDEO' && /cloudinary\.com/.test(lesson.fileUrl || ''))

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <div className={`${bg} ${color} p-2 rounded-lg flex-shrink-0`}>
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-800 truncate">{lesson.title}</p>
          {/* CHANGE 4: flex-wrap on meta row */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs font-medium ${color}`}>{lesson.type}</span>
            {lesson.durationSeconds && (
              <span className="text-xs text-gray-400">
                {Math.floor(lesson.durationSeconds / 60)}m {lesson.durationSeconds % 60}s
              </span>
            )}
            {lesson.orderIndex != null && (
              <span className="text-xs text-gray-400">#{lesson.orderIndex}</span>
            )}
            {isDownloadable && downloadUrl && (
              <button
                onClick={() => {
                  const ext = lesson.type === 'PDF' ? '.pdf' : lesson.type === 'IMAGE' ? '.jpg' : '.mp4'
                  handleDownload(downloadUrl, `${lesson.title.replace(/\s+/g, '_')}${ext}`)
                }}
                className={`flex items-center gap-0.5 text-xs font-medium ${color} hover:opacity-70 transition-opacity`}
              >
                <Download size={11} /> Download
              </button>
            )}
          </div>
        </div>
        {/* CHANGE 5: action buttons always accessible */}
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
                className="text-gray-400 hover:text-blue-600 p-1.5 rounded transition-colors"
                title="Edit lesson">
                <Edit size={14} />
              </button>
              <button onClick={onDelete}
                className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors"
                title="Delete lesson">
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
      {expanded && <LessonPreview lesson={lesson} />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LessonForm — responsive improvements:
// CHANGE 6: Type-selector grid is grid-cols-2 sm:grid-cols-4.
// CHANGE 7: Action buttons use flex-wrap so they don't overflow.
// ─────────────────────────────────────────────────────────────
function LessonForm({ initial = EMPTY_FORM, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const [uploading, setUploading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (form.type === 'VIDEO' && !form.fileUrl.trim()) {
      toast.error('Please add a video URL or upload a file'); return
    }
    if ((form.type === 'PDF' || form.type === 'IMAGE') && !form.fileUrl.trim()) {
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
        {/* CHANGE 6: 2 cols on mobile, 4 on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
          {LESSON_TYPES.map(({ value, label, icon: Icon, color: c, bg }) => (
            <button key={value} type="button"
              onClick={() => setForm(p => ({ ...p, type: value, content: '', fileUrl: '' }))}
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

      {/* CHANGE 7: flex-wrap on actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" disabled={submitting || uploading}
          className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors">
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

// ─────────────────────────────────────────────────────────────
// Main LessonList — no functional changes needed here.
// All the important fixes are in the sub-components above.
// ─────────────────────────────────────────────────────────────
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

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    qc.invalidateQueries({ queryKey: ['modules-for-progress'] })
    qc.invalidateQueries({ queryKey: ['all-lessons-for-course'] })
    qc.invalidateQueries({ queryKey: ['lessons-progress'] })
  }

  const handleCreate = async (form) => {
    setSubmitting(true)
    try {
      await lessonApi.create({
        moduleId,
        title:           form.title,
        type:            form.type,
        content:         form.type === 'TEXT' ? (form.content || null) : null,
        fileUrl:         form.type !== 'TEXT' ? (form.fileUrl  || null) : null,
        durationSeconds: form.durationSeconds ? Number(form.durationSeconds) : null,
        orderIndex:      form.orderIndex      ? Number(form.orderIndex)      : null,
      })
      toast.success('Lesson created!')
      setAdding(false)
      invalidateAll()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create lesson')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (id, form) => {
    setSubmitting(true)
    try {
      await lessonApi.update(id, {
        title:           form.title,
        type:            form.type,
        content:         form.type === 'TEXT' ? (form.content || null) : null,
        fileUrl:         form.type !== 'TEXT' ? (form.fileUrl  || null) : null,
        durationSeconds: form.durationSeconds ? Number(form.durationSeconds) : null,
        orderIndex:      form.orderIndex      ? Number(form.orderIndex)      : null,
      })
      toast.success('Lesson updated!')
      setEditingId(null)
      invalidateAll()
    } catch (err) {
      console.error(err)
      toast.error('Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this lesson?')) return
    try {
      await lessonApi.delete(id)
      toast.success('Lesson deleted!')
      invalidateAll()
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
              title:           lesson.title           || '',
              type:            lesson.type            || 'VIDEO',
              content:         lesson.content         || '',
              fileUrl:         lesson.fileUrl         || '',
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