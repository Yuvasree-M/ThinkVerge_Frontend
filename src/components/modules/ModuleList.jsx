import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { moduleApi } from '../../api/services'
import { Layers, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { PageSpinner } from '../common/Spinner'
import LessonList from '../lessons/LessonList'
import toast from 'react-hot-toast'

export default function ModuleList({ courseId, editable = false }) {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState({})
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      await moduleApi.create({ courseId, title })
      toast.success('Module created!')
      setTitle(''); setAdding(false)
      qc.invalidateQueries({ queryKey: ['modules', courseId] })
    } catch { toast.error('Failed to create module') }
    finally { setSaving(false) }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-semibold text-navy-800">Course Modules</h3>
        {editable && (
          <button className="btn-ghost text-xs" onClick={() => setAdding(p => !p)}>
            <Plus size={14} /> Add Module
          </button>
        )}
      </div>

      {editable && adding && (
        <form onSubmit={handleCreate} className="flex gap-2 p-3 bg-royal-50 rounded-xl border border-royal-100">
          <input
            className="input flex-1 py-2 text-sm"
            placeholder="Module title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-primary py-2 text-xs" disabled={saving}>
            {saving ? '...' : 'Save'}
          </button>
          <button type="button" className="btn-secondary py-2 text-xs" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </form>
      )}

      {modules.length === 0 && (
        <p className="text-sm text-slate-lms text-center py-6">No modules yet.</p>
      )}

      {modules.map((mod, idx) => (
        <div key={mod.id} className="card p-0 overflow-hidden">
          <button
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-royal-50 transition-colors text-left"
            onClick={() => toggle(mod.id)}
          >
            <div className="w-7 h-7 rounded-lg bg-royal-gradient flex items-center justify-center flex-shrink-0 shadow-royal text-white text-xs font-bold">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-800 text-sm">{mod.title}</p>
            </div>
            <Layers size={14} className="text-slate-lms" />
            {expanded[mod.id]
              ? <ChevronDown size={16} className="text-slate-lms" />
              : <ChevronRight size={16} className="text-slate-lms" />
            }
          </button>

          {expanded[mod.id] && (
            <div className="border-t border-royal-50 px-4 py-4 bg-surface">
              <LessonList moduleId={mod.id} editable={editable} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
