import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonApi, progressApi } from '../../api/services'
import { PlayCircle, FileText, Plus, CheckCircle2, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LessonList({ moduleId, editable = false, enrolled = false }) {
  const qc = useQueryClient()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'VIDEO', content: '' })
  const [videoFile, setVideoFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => lessonApi.getByModule(moduleId).then(r => r.data),
    enabled: !!moduleId,
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('data', new Blob([JSON.stringify({ ...form, moduleId })], { type: 'application/json' }))
      if (videoFile) fd.append('video', videoFile)
      await lessonApi.create(fd)
      toast.success('Lesson created!')
      setAdding(false); setForm({ title: '', type: 'VIDEO', content: '' }); setVideoFile(null)
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    } catch { toast.error('Failed to create lesson') }
    finally { setSaving(false) }
  }

  const handleComplete = async (lessonId, type) => {
    try {
      if (type === 'TEXT') await progressApi.completeText(lessonId)
      else await progressApi.updateVideo(lessonId, 100)
      toast.success('Lesson completed! 🎉')
      qc.invalidateQueries({ queryKey: ['progress'] })
    } catch { toast.error('Failed to update progress') }
  }

  return (
    <div className="space-y-2">
      {lessons.length === 0 && !adding && (
        <p className="text-xs text-slate-lms py-2">No lessons yet.</p>
      )}

      {lessons.map((lesson) => (
        <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-royal-50 group hover:border-royal-200 transition-colors">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${lesson.type === 'VIDEO' ? 'bg-royal-50 text-royal-500' : 'bg-gold-50 text-gold-600'}`}>
            {lesson.type === 'VIDEO' ? <PlayCircle size={16} /> : <FileText size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-navy-800 truncate">{lesson.title}</p>
            <p className="text-xs text-slate-lms">{lesson.type}</p>
          </div>
          {enrolled && (
            <button
              onClick={() => handleComplete(lesson.id, lesson.type)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-all"
              title="Mark complete"
            >
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      ))}

      {editable && !adding && (
        <button className="w-full flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-royal-200 text-royal-400 text-xs hover:border-royal-400 hover:text-royal-600 hover:bg-royal-50 transition-all" onClick={() => setAdding(true)}>
          <Plus size={14} /> Add Lesson
        </button>
      )}

      {editable && adding && (
        <form onSubmit={handleCreate} className="p-3 bg-royal-50 rounded-xl border border-royal-100 space-y-2">
          <input className="input text-sm py-2" placeholder="Lesson title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <select className="input text-sm py-2" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
            <option value="VIDEO">Video</option>
            <option value="TEXT">Text</option>
          </select>
          {form.type === 'TEXT' && (
            <textarea className="input text-sm py-2 min-h-[60px]" placeholder="Content..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
          )}
          {form.type === 'VIDEO' && (
            <input type="file" accept="video/*" className="text-xs text-slate-lms" onChange={e => setVideoFile(e.target.files[0])} />
          )}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary py-1.5 text-xs" disabled={saving}>{saving ? '...' : 'Save'}</button>
            <button type="button" className="btn-secondary py-1.5 text-xs" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
