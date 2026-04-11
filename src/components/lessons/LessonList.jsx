import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonApi } from '../../api/services'
import { PlayCircle, FileText, Plus, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LessonList({ moduleId, editable = false }) {
  const qc = useQueryClient()

  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    title: '',
    type: 'VIDEO',
    content: ''
  })

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => lessonApi.getByModule(moduleId).then(r => r.data),
  })

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await lessonApi.create({
        ...form,
        moduleId
      })
      toast.success('Lesson created!')
      setAdding(false)
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    } catch {
      toast.error('Failed')
    }
  }

  // UPDATE
  const handleUpdate = async (id) => {
    try {
      await lessonApi.update(id, form)
      toast.success('Updated!')
      setEditingId(null)
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    } catch {
      toast.error('Update failed')
    }
  }

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm('Delete lesson?')) return
    try {
      await lessonApi.delete(id)
      toast.success('Deleted!')
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    } catch {
      toast.error('Failed')
    }
  }

  return (
    <div className="space-y-2">

      {lessons.map(l => (
        <div key={l.id} className="flex justify-between items-center border p-2 rounded">

          {editingId === l.id ? (
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            />
          ) : (
            <div>
              <p>{l.title}</p>
              <small>{l.type}</small>
            </div>
          )}

          {editable && (
            <div className="flex gap-2">

              {editingId === l.id ? (
                <button onClick={() => handleUpdate(l.id)}>Save</button>
              ) : (
                <button onClick={() => {
                  setEditingId(l.id)
                  setForm(l)
                }}>
                  <Edit size={14} />
                </button>
              )}

              <button onClick={() => handleDelete(l.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          )}

        </div>
      ))}

      {editable && (
        <button onClick={() => setAdding(true)} className="btn-ghost">
          <Plus /> Add Lesson
        </button>
      )}

      {adding && (
        <form onSubmit={handleCreate}>
          <input
            placeholder="Title"
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          />
          <select
            onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
          >
            <option value="VIDEO">Video</option>
            <option value="TEXT">Text</option>
            <option value="PDF">PDF</option>
            <option value="IMAGE">Image</option>
          </select>

          <button type="submit">Save</button>
        </form>
      )}
    </div>
  )
}