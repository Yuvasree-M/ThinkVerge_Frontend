import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useModal from '../../hooks/useModal'
import { BookOpen, CheckCircle2, XCircle, Clock, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const STATUS_TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function AdminCoursesPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState('ALL')
  const [search, setSearch] = useState('')

  const approveModal = useModal()
  const rejectModal = useModal()

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['admin-all-courses'],
    queryFn: () => courseApi.getAllAdmin().then(r => r.data),
  })

const approveMutation = useMutation({
  mutationFn: (id) => courseApi.approve(id),

  // ⚡ instant UI update
  onMutate: async (id) => {
    await qc.cancelQueries(['admin-all-courses'])

    const previous = qc.getQueryData(['admin-all-courses'])

    qc.setQueryData(['admin-all-courses'], old =>
      old.map(c =>
        c.id === id ? { ...c, status: 'APPROVED' } : c
      )
    )

    return { previous }
  },

  onError: (err, variables, context) => {
    qc.setQueryData(['admin-all-courses'], context.previous)
  },

  onSettled: () => {
    qc.invalidateQueries(['admin-all-courses'])
  }
})

 const rejectMutation = useMutation({
  mutationFn: (id) => courseApi.reject(id),

  onMutate: async (id) => {
    await qc.cancelQueries(['admin-all-courses'])

    const previous = qc.getQueryData(['admin-all-courses'])

    qc.setQueryData(['admin-all-courses'], old =>
      old.map(c =>
        c.id === id ? { ...c, status: 'REJECTED' } : c
      )
    )

    return { previous }
  },

  onError: (err, variables, context) => {
    qc.setQueryData(['admin-all-courses'], context.previous)
  },

  onSettled: () => {
    qc.invalidateQueries(['admin-all-courses'])
  }
})
  const filtered = courses.filter(c => {
    const matchTab = tab === 'ALL' || c.status === tab
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase())

    return matchTab && matchSearch
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="card flex flex-col sm:flex-row gap-4">

        {/* Tabs */}
        <div className="flex gap-1 bg-surface rounded-xl p-1">
          {STATUS_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                tab === t
                  ? 'bg-royal-gradient text-white shadow-royal'
                  : 'text-slate-lms hover:text-navy-700'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-royal-100 flex-1">
          <Search size={14} className="text-slate-lms" />
          <input
            className="bg-transparent text-sm flex-1 focus:outline-none placeholder-slate-muted"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="Try adjusting your filters."
          />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(course => (
                  <tr key={course.id}>
                    
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-royal-gradient flex items-center justify-center">
                          <BookOpen size={14} className="text-white" />
                        </div>
                        <span className="font-medium text-navy-800">
                          {course.title}
                        </span>
                      </div>
                    </td>

                    <td className="text-slate-lms">
                      {course.instructorName || '—'}
                    </td>

                    <td>
                      <span className="badge-blue">
                        {course.category}
                      </span>
                    </td>

                    <td>{course.durationHours}h</td>

                    <td>
                      <StatusBadge status={course.status} />
                    </td>

                    {/* ACTION BUTTONS */}
                    <td>
                      <div className="flex items-center gap-2">

                        {(course.status === 'PENDING' || course.status === 'REJECTED') && (
                          <button
                            onClick={() => approveModal.open(course)}
                            className="
                              flex items-center gap-1.5
                              px-3 py-1.5
                              text-xs font-semibold
                              rounded-lg
                              bg-emerald-50 text-emerald-700
                              border border-emerald-200
                              hover:bg-emerald-100
                              transition-all
                            "
                          >
                            <CheckCircle2 size={13} />
                            {course.status === 'REJECTED'
                              ? 'Re-Approve'
                              : 'Approve'}
                          </button>
                        )}

                        {(course.status === 'PENDING' || course.status === 'APPROVED') && (
                          <button
                            onClick={() => rejectModal.open(course)}
                            className="
                              flex items-center gap-1.5
                              px-3 py-1.5
                              text-xs font-semibold
                              rounded-lg
                              bg-red-50 text-red-600
                              border border-red-200
                              hover:bg-red-100
                              transition-all
                            "
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      <ConfirmDialog
        isOpen={approveModal.isOpen}
        onClose={approveModal.close}
        onConfirm={() => approveMutation.mutate(approveModal.data?.id)}
        title="Approve Course"
        message={`Approve "${approveModal.data?.title}"? It will become visible to students.`}
        confirmLabel="Approve"
      />

      {/* Reject Modal */}
      <ConfirmDialog
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.close}
        onConfirm={() => rejectMutation.mutate(rejectModal.data?.id)}
        title="Reject Course"
        message={`Reject "${rejectModal.data?.title}"? The instructor will be notified.`}
        confirmLabel="Reject"
        danger
      />

    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'APPROVED')
    return (
      <span className="badge-green">
        <CheckCircle2 size={11} />
        Approved
      </span>
    )

  if (status === 'PENDING')
    return (
      <span className="badge-yellow">
        <Clock size={11} />
        Pending
      </span>
    )

  if (status === 'REJECTED')
    return (
      <span className="badge-red">
        <XCircle size={11} />
        Rejected
      </span>
    )

  return <span className="badge-grey">{status}</span>
}