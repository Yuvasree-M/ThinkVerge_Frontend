import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { courseApi, assignmentApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import AssignmentModal from '../../components/assignments/AssignmentModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useModal from '../../hooks/useModal'
import { ClipboardList, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function InstructorAssignmentsPage() {
  const qc = useQueryClient()
  const createModal = useModal()
  const editModal   = useModal()
  const deleteModal = useModal()
  const [expanded, setExpanded] = useState(null)

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseApi.myCourses().then(r => r.data),
  })

  const { data: assignments = [], isLoading: loadingA } = useQuery({
    queryKey: ['assignments', expanded],
    queryFn: () => assignmentApi.byCourse(expanded).then(r => r.data),
    enabled: !!expanded,
  })

  const handleDelete = async (id) => {
    try { await assignmentApi.delete(id); toast.success('Deleted!'); qc.invalidateQueries({ queryKey: ['assignments', expanded] }) }
    catch { toast.error('Failed to delete') }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => createModal.open()} disabled={courses.length === 0}>
          <Plus size={15} /> New Assignment
        </button>
      </div>

      {courses.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No courses yet" description="Create a course first before adding assignments." />
      ) : (
        courses.map(course => (
          <div key={course.id} className="card p-0 overflow-hidden">
            <button
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-royal-50 transition-colors text-left"
              onClick={() => setExpanded(p => p === course.id ? null : course.id)}
            >
              <div className="w-9 h-9 rounded-xl bg-royal-gradient flex items-center justify-center flex-shrink-0">
                <ClipboardList size={15} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-navy-800">{course.title}</p>
                <p className="text-xs text-slate-lms">{course.category}</p>
              </div>
              <button
                className="btn-ghost text-xs mr-2"
                onClick={(e) => { e.stopPropagation(); createModal.open({ courseId: course.id }) }}
              >
                <Plus size={13} /> Add
              </button>
              {expanded === course.id
                ? <ChevronDown size={16} className="text-slate-lms flex-shrink-0" />
                : <ChevronRight size={16} className="text-slate-lms flex-shrink-0" />
              }
            </button>

            {expanded === course.id && (
              <div className="border-t border-royal-50 bg-surface px-5 py-4">
                {loadingA ? (
                  <p className="text-sm text-slate-lms">Loading...</p>
                ) : assignments.length === 0 ? (
                  <p className="text-sm text-slate-lms text-center py-4">No assignments for this course.</p>
                ) : (
                  <div className="space-y-2">
                    {assignments.map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-royal-50 group hover:border-royal-200 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0">
                          <ClipboardList size={14} className="text-gold-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-navy-800 text-sm">{a.title}</p>
                          <p className="text-xs text-slate-lms">
                            {a.dueDate ? `Due: ${new Date(a.dueDate).toLocaleDateString()}` : 'No due date'}
                            {a.maxPoints ? ` · ${a.maxPoints} pts` : ''}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="btn-icon text-royal-500" onClick={() => editModal.open(a)}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn-icon text-red-400" onClick={() => deleteModal.open(a)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      <AssignmentModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        courseId={createModal.data?.courseId || expanded}
        onSaved={() => qc.invalidateQueries({ queryKey: ['assignments', expanded] })}
      />
      <AssignmentModal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        assignment={editModal.data}
        courseId={expanded}
        onSaved={() => qc.invalidateQueries({ queryKey: ['assignments', expanded] })}
      />
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={() => handleDelete(deleteModal.data?.id)}
        title="Delete Assignment"
        message={`Delete "${deleteModal.data?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
