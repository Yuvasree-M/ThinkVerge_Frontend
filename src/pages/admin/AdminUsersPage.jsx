import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi, publicApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import { Users, GraduationCap, Trash2, Shield, Clock, CheckCircle, X, MessageSquare, Star, ThumbsUp } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [tab, setTab] = useState('pending')
  const [selectedUser, setSelectedUser] = useState(null)
  const [roleModal, setRoleModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [newRole, setNewRole] = useState('STUDENT')

  const qc = useQueryClient()

  const { data: students = [], isLoading: ls } = useQuery({
    queryKey: ['students'],
    queryFn: () => userApi.students().then(r => r.data)
  })

  const { data: instructors = [], isLoading: li } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => userApi.instructors().then(r => r.data)
  })

  const { data: pendingUsers = [], isLoading: lp } = useQuery({
    queryKey: ['pending-users'],
    queryFn: () => userApi.pending().then(r => r.data)
  })

  const { data: pendingFeedback = [], isLoading: lf, refetch: refetchFeedback } = useQuery({
    queryKey: ['pending-feedback'],
    queryFn: () => publicApi.pendingFeedback().then(r => r.data).catch(() => []),
    enabled: tab === 'feedback'
  })

  const users = tab === 'students' ? students : tab === 'instructors' ? instructors : tab === 'pending' ? pendingUsers : []
  const isLoading = ls || li || lp || lf

  const approveUser = useMutation({
    mutationFn: (id) => userApi.approveUser(id),
    onSuccess: () => {
      qc.invalidateQueries(['pending-users'])
      qc.invalidateQueries(['students'])
      qc.invalidateQueries(['instructors'])
      toast.success('User approved! They can now log in.')
    },
    onError: () => toast.error('Failed to approve user')
  })

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => userApi.changeRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries(['students'])
      qc.invalidateQueries(['instructors'])
      qc.invalidateQueries(['pending-users'])
      setRoleModal(false)
      toast.success('Role updated')
    },
    onError: () => toast.error('Failed to update role')
  })

  const deleteUser = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries(['students'])
      qc.invalidateQueries(['instructors'])
      qc.invalidateQueries(['pending-users'])
      setDeleteModal(false)
      toast.success('User deleted')
    },
    onError: () => toast.error('Failed to delete user')
  })

  const approveFeedback = useMutation({
    mutationFn: (id) => publicApi.approveFeedback(id),
    onSuccess: () => { qc.invalidateQueries(['pending-feedback']); toast.success('Feedback approved and published!') },
    onError: () => toast.error('Failed to approve feedback')
  })

  const deleteFeedback = useMutation({
    mutationFn: (id) => publicApi.deleteFeedback(id),
    onSuccess: () => { qc.invalidateQueries(['pending-feedback']); toast.success('Feedback deleted') },
    onError: () => toast.error('Failed to delete feedback')
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'pending', label: 'Pending Approval', icon: Clock, count: pendingUsers.length, accent: 'amber' },
          { key: 'students', label: 'Students', icon: GraduationCap, count: students.length, accent: 'blue' },
          { key: 'instructors', label: 'Instructors', icon: Users, count: instructors.length, accent: 'purple' },
        { key: 'feedback', label: 'Feedback', icon: MessageSquare, count: pendingFeedback.length, accent: 'green' },
        ].map(({ key, label, icon: Icon, count, accent }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
              tab === key
                ? 'bg-royal-gradient text-white shadow-royal'
                : 'bg-white text-slate-lms border border-royal-100 hover:border-royal-300'
            )}
          >
            <Icon size={15} /> {label}
            {count > 0 && (
              <span className={clsx(
                'px-1.5 py-0.5 rounded-full text-xs',
                tab === key ? 'bg-white/20 text-white' : key === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-royal-50 text-royal-600'
              )}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending approval notice */}
      {tab === 'pending' && pendingUsers.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <Clock size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {pendingUsers.length} user{pendingUsers.length > 1 ? 's' : ''} waiting for approval
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              These users registered but cannot log in until you approve them.
            </p>
          </div>
        </div>
      )}

      {tab === 'pending' && pendingUsers.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle size={24} className="text-emerald-500" />
          </div>
          <p className="font-semibold text-navy-800 mb-1">All caught up!</p>
          <p className="text-sm text-slate-lms">No pending registrations at the moment.</p>
        </div>
      )}

      {/* Table */}
      {users.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-royal-gradient flex items-center justify-center text-white text-xs font-bold">
                          {(u.name || u.email)[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{u.name || '—'}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-semibold',
                        u.role === 'ADMIN' && 'bg-purple-100 text-purple-700',
                        u.role === 'INSTRUCTOR' && 'bg-yellow-100 text-yellow-700',
                        u.role === 'STUDENT' && 'bg-blue-100 text-blue-700'
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      {u.approved === false || tab === 'pending' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Active</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {(u.approved === false || tab === 'pending') && (
                          <button
                            onClick={() => approveUser.mutate(u.id)}
                            disabled={approveUser.isPending}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedUser(u); setNewRole(u.role); setRoleModal(true) }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Shield size={13} /> Role
                        </button>
                        <button
                          onClick={() => { setSelectedUser(u); setDeleteModal(true) }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback moderation panel */}
      {tab === 'feedback' && (
        <div className="space-y-4">
          {pendingFeedback.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <ThumbsUp size={24} className="text-emerald-500" />
              </div>
              <p className="font-semibold text-navy-800 mb-1">No pending feedback</p>
              <p className="text-sm text-slate-lms">All submitted feedback has been reviewed.</p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <MessageSquare size={16} className="text-royal-500" />
                <h3 className="font-semibold text-navy-800 text-sm">{pendingFeedback.length} Feedback Submission{pendingFeedback.length > 1 ? 's' : ''} Awaiting Review</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {pendingFeedback.map(f => (
                  <div key={f.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-navy-800 text-sm">{f.name}</span>
                          {f.email && <span className="text-xs text-slate-lms">·  {f.email}</span>}
                          {f.courseTitle && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-royal-50 text-royal-600 font-medium">{f.courseTitle}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({length: 5}).map((_, i) => (
                            <Star key={i} size={12} className={i < (f.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                          ))}
                          <span className="text-xs text-slate-lms ml-1">{f.rating}/5</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">"{f.message}"</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => approveFeedback.mutate(f.id)}
                          disabled={approveFeedback.isPending}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          <CheckCircle size={13} /> Publish
                        </button>
                        <button
                          onClick={() => deleteFeedback.mutate(f.id)}
                          disabled={deleteFeedback.isPending}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Change Role Modal */}
      {roleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-royal-gradient flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <h3 className="font-semibold text-navy-800">Change Role</h3>
              </div>
              <button onClick={() => setRoleModal(false)} className="btn-icon text-slate-400">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-lms">{selectedUser?.email}</p>
              <div>
                <label className="label">New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="input w-full"
                >
                  <option value="STUDENT">Student</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-surface">
              <button onClick={() => setRoleModal(false)} className="btn-ghost">Cancel</button>
              <button
                onClick={() => changeRole.mutate({ id: selectedUser.id, role: newRole })}
                disabled={changeRole.isPending}
                className="btn-primary"
              >
                {changeRole.isPending ? 'Updating…' : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <Trash2 size={16} className="text-red-600" />
                </div>
                <h3 className="font-semibold text-red-700">Delete User</h3>
              </div>
              <button onClick={() => setDeleteModal(false)} className="btn-icon text-slate-400">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-lms">
                Are you sure you want to delete <strong>{selectedUser?.name || selectedUser?.email}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-surface">
              <button onClick={() => setDeleteModal(false)} className="btn-ghost">Cancel</button>
              <button
                onClick={() => deleteUser.mutate(selectedUser.id)}
                disabled={deleteUser.isPending}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                {deleteUser.isPending ? 'Deleting…' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
