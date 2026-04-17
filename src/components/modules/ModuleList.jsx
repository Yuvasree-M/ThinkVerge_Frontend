import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { moduleApi } from '../../api/services'
import {
  Layers,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit3
} from 'lucide-react'

import { PageSpinner } from '../common/Spinner'
import LessonList from '../lessons/LessonList'
import toast from 'react-hot-toast'

export default function ModuleList({ courseId, editable = false }) {
  const qc = useQueryClient()

  const [expanded, setExpanded] = useState({})
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // 🔥 separate states (IMPORTANT FIX)
  const [newTitle, setNewTitle] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const [saving, setSaving] = useState(false)

  // =========================
  // FETCH MODULES
  // =========================
  const { data, isLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleApi.getByCourse(courseId).then(r => r.data),
    enabled: !!courseId,
  })

  const modules = Array.isArray(data) ? data : []

  const toggle = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  // =========================
  // CREATE MODULE
  // =========================
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setSaving(true)
    try {
      await moduleApi.create({
        courseId,
        title: newTitle,
        description: '',
        orderIndex: modules.length + 1
      })

      toast.success('Module created!')
      setNewTitle('')
      setAdding(false)

      qc.invalidateQueries({ queryKey: ['modules', courseId] })
    } catch {
      toast.error('Failed to create module')
    } finally {
      setSaving(false)
    }
  }

  // =========================
  // DELETE MODULE
  // =========================
  const handleDelete = async (id) => {
    try {
      await moduleApi.delete(id)
      toast.success('Module deleted')

      qc.invalidateQueries({ queryKey: ['modules', courseId] })
    } catch {
      toast.error('Delete failed')
    }
  }

  // =========================
  // UPDATE MODULE
  // =========================
  const handleUpdate = async (id) => {
    if (!editTitle.trim()) return

    try {
      const existing = modules.find(m => m.id === id)

      await moduleApi.update(id, {
        title: editTitle,
        description: existing?.description || '',
        orderIndex: existing?.orderIndex || 0
      })

      toast.success('Module updated')

      setEditingId(null)
      setEditTitle('')

      qc.invalidateQueries({ queryKey: ['modules', courseId] })
    } catch {
      toast.error('Update failed')
    }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="font-semibold text-navy-800">Course Modules</h3>

        {editable && (
          <button
            className="btn-ghost text-xs"
            onClick={() => setAdding(p => !p)}
          >
            <Plus size={14} /> Add Module
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {editable && adding && (
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-2 p-3 bg-royal-50 rounded-xl border"
        >
          <input
            className="input flex-1 text-sm py-2"
            placeholder="Module title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />

          <button
            type="submit"
            className="btn-primary text-xs"
            disabled={saving}
          >
            {saving ? '...' : 'Save'}
          </button>

          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => setAdding(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* EMPTY */}
      {modules.length === 0 && (
        <p className="text-sm text-center py-6 text-slate-lms">
          No modules yet.
        </p>
      )}

      {/* MODULE LIST */}
      {modules.map((mod, idx) => (
        <div key={mod.id} className="card overflow-hidden">

          {/* MODULE HEADER */}
     <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 px-3 sm:px-4 py-3 hover:bg-royal-50">
            {/* expand */}
            <button onClick={() => toggle(mod.id)}>
              {expanded[mod.id]
                ? <ChevronDown size={16} />
                : <ChevronRight size={16} />
              }
            </button>

            {/* index */}
            <div className="w-7 h-7 rounded-lg bg-royal-gradient text-white flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </div>

            {/* title */}
            <div className="flex-1">
          <p className="font-semibold text-sm truncate max-w-[140px] sm:max-w-none">
  {mod.title}
</p>
            </div>

            <Layers size={14} />

            {/* ACTIONS */}
            {editable && (<div className="flex gap-2 ml-auto">

                {/* EDIT */}
                <button
                  onClick={() => {
                    setEditingId(mod.id)
                    setEditTitle(mod.title)
                  }}
                >
                  <Edit3 size={14} />
                </button>

                {/* DELETE */}
                <button onClick={() => handleDelete(mod.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* EDIT FORM */}
          {editable && editingId === mod.id && (
          <div className="p-3 border-t bg-royal-50 flex flex-col sm:flex-row gap-2">
              <input
                className="input flex-1 text-sm py-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <button
                className="btn-primary text-xs"
                onClick={() => handleUpdate(mod.id)}
              >
                Update
              </button>

              <button
                className="btn-secondary text-xs"
                onClick={() => {
                  setEditingId(null)
                  setEditTitle('')
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* LESSONS */}
          {expanded[mod.id] && (
            <div className="border-t px-3 sm:px-4 py-4 bg-surface max-h-[50vh] overflow-y-auto">
              <LessonList moduleId={mod.id} editable={editable} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}