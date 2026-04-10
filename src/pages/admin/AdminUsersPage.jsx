import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import { Users, GraduationCap,Trash2, Shield } from 'lucide-react'
import clsx from 'clsx'

export default function AdminUsersPage() {
  const [tab, setTab] = useState('students')
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

  const users = tab === 'students' ? students : instructors
  const isLoading = ls || li

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => userApi.changeRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries(['students'])
      qc.invalidateQueries(['instructors'])
      setRoleModal(false)
    }
  })

  const deleteUser = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries(['students'])
      qc.invalidateQueries(['instructors'])
      setDeleteModal(false)
    }
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'students', label: 'Students', icon: GraduationCap, count: students.length },
          { key: 'instructors', label: 'Instructors', icon: Users, count: instructors.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
              tab === key
                ? 'bg-royal-gradient text-white shadow-royal'
                : 'bg-white text-slate-lms border border-royal-100'
            )}
          >
            <Icon size={15} /> {label}
            <span className="px-1.5 py-0.5 rounded-full text-xs bg-white/20">
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  
                  {/* User */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-royal-gradient flex items-center justify-center text-white text-xs font-bold">
                        {(u.name || u.email)[0].toUpperCase()}
                      </div>
                      <span className="font-medium">
                        {u.name || '—'}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td>{u.email}</td>

                  {/* Role Badge */}
                  <td>
                    <span className={clsx(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      u.role === "ADMIN" && "bg-purple-100 text-purple-700",
                      u.role === "INSTRUCTOR" && "bg-yellow-100 text-yellow-700",
                      u.role === "STUDENT" && "bg-blue-100 text-blue-700"
                    )}>
                      {u.role}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="text-xs">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : '—'}
                  </td>

                  {/* Actions */}
                 <td>
  <div className="flex items-center gap-2">

    <button
      onClick={() => {
        setSelectedUser(u)
        setNewRole(u.role)
        setRoleModal(true)
      }}
      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold 
                 rounded-lg bg-blue-50 text-blue-600 
                 hover:bg-blue-100 transition"
    >
      <Shield size={14} />
      Role
    </button>

    <button
      onClick={() => {
        setSelectedUser(u)
        setDeleteModal(true)
      }}
      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold 
                 rounded-lg bg-red-50 text-red-600 
                 hover:bg-red-100 transition"
    >
      <Trash2 size={14} />
      Delete
    </button>

  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Role Modal */}
      {roleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4">
            
            <h3 className="text-lg font-semibold">
              Change Role
            </h3>

            <p className="text-sm text-gray-500">
              {selectedUser?.email}
            </p>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRoleModal(false)}
                className="px-3 py-1 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  changeRole.mutate({
                    id: selectedUser.id,
                    role: newRole
                  })
                }
                className="bg-royal-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4">
            
            <h3 className="text-lg font-semibold text-red-600">
              Delete User
            </h3>

            <p className="text-sm text-gray-500">
              Delete {selectedUser?.email} ?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-3 py-1 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteUser.mutate(selectedUser.id)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}