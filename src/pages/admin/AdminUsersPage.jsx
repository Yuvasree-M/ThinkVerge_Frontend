import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import { Users, GraduationCap } from 'lucide-react'
import clsx from 'clsx'

export default function AdminUsersPage() {
  const [tab, setTab] = useState('students')

  const { data: students = [], isLoading: ls } = useQuery({ queryKey: ['students'], queryFn: () => userApi.students().then(r => r.data) })
  const { data: instructors = [], isLoading: li } = useQuery({ queryKey: ['instructors'], queryFn: () => userApi.instructors().then(r => r.data) })

  const users = tab === 'students' ? students : instructors
  const isLoading = ls || li

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[
          { key: 'students', label: 'Students', icon: GraduationCap, count: students.length },
          { key: 'instructors', label: 'Instructors', icon: Users, count: instructors.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all', tab === key ? 'bg-royal-gradient text-white shadow-royal' : 'bg-white text-slate-lms border border-royal-100 hover:border-royal-300')}
          >
            <Icon size={15} /> {label}
            <span className={clsx('px-1.5 py-0.5 rounded-full text-xs', tab === key ? 'bg-white/20' : 'bg-royal-50 text-royal-600')}>{count}</span>
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-royal-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(u.name || u.email)[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-navy-800">{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="text-slate-lms">{u.email}</td>
                  <td><span className={tab === 'students' ? 'badge-blue' : 'badge-yellow'}>{u.role}</span></td>
                  <td className="text-slate-lms text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} className="text-center text-sm text-slate-lms py-8">No {tab} found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
