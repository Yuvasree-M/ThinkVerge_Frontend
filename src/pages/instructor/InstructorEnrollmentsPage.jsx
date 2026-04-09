import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { enrollmentApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useModal from '../../hooks/useModal'
import { Users, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function InstructorEnrollmentsPage() {
  const qc = useQueryClient()
  const approveModal = useModal()
  const rejectModal = useModal()

  const [tab, setTab] = useState('PENDING') // default tab

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ['pending-enrollments'],
    queryFn: () => enrollmentApi.pending().then(r => r.data),
  })

  const { data: all = [] } = useQuery({
    queryKey: ['all-enrollments'],
    queryFn: () => enrollmentApi.all().then(r => r.data),
  })

  const approved = all.filter(e => e.status === 'APPROVED')
  const rejected = all.filter(e => e.status === 'REJECTED')

  const handleApprove = async (id) => {
    try {
      await enrollmentApi.approve(id)
      toast.success('Enrollment approved!')
      qc.invalidateQueries({ queryKey: ['pending-enrollments'] })
      qc.invalidateQueries({ queryKey: ['all-enrollments'] })
    } catch {
      toast.error('Failed to approve')
    }
  }

  const handleReject = async (id) => {
    try {
      await enrollmentApi.reject(id)
      toast.success('Enrollment rejected')
      qc.invalidateQueries({ queryKey: ['pending-enrollments'] })
      qc.invalidateQueries({ queryKey: ['all-enrollments'] })
    } catch {
      toast.error('Failed to reject')
    }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('PENDING')}
          className={`tab ${tab === 'PENDING' ? 'tab-active' : ''}`}
        >
          Pending ({pending.length})
        </button>

        <button
          onClick={() => setTab('APPROVED')}
          className={`tab ${tab === 'APPROVED' ? 'tab-active' : ''}`}
        >
          Approved ({approved.length})
        </button>

        <button
          onClick={() => setTab('REJECTED')}
          className={`tab ${tab === 'REJECTED' ? 'tab-active' : ''}`}
        >
          Rejected ({rejected.length})
        </button>
      </div>


      {/* Pending */}
      {tab === 'PENDING' && (
        <>
          {pending.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No pending requests"
              description="All enrollment requests reviewed"
            />
          ) : (
            <div className="card p-0 overflow-hidden">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Requested</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pending.map(e => (
                    <tr key={e.id}>
                      <td>
                        <div>
                          <p className="font-medium">{e.student?.name}</p>
                          <p className="text-xs text-slate-500">
                            {e.student?.email}
                          </p>
                        </div>
                      </td>

                      <td>{e.course?.title}</td>

                      <td>
                        {new Date(e.requestedAt).toLocaleDateString()}
                      </td>

                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn-success-sm"
                            onClick={() => approveModal.open(e)}
                          >
                            Approve
                          </button>

                          <button
                            className="btn-danger-sm"
                            onClick={() => rejectModal.open(e)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}


      {/* Approved */}
      {tab === 'APPROVED' && (
        <>
          {approved.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No approved enrollments"
            />
          ) : (
            <div className="space-y-2">
              {approved.map(e => (
                <div
                  key={e.id}
                  className="card flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {e.student?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {e.course?.title}
                    </p>
                  </div>

                  <span className="badge-success">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}


      {/* Rejected */}
      {tab === 'REJECTED' && (
        <>
          {rejected.length === 0 ? (
            <EmptyState
              icon={XCircle}
              title="No rejected enrollments"
            />
          ) : (
            <div className="space-y-2">
              {rejected.map(e => (
                <div
                  key={e.id}
                  className="card flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {e.student?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {e.course?.title}
                    </p>
                  </div>

                  <span className="badge-danger">
                    Rejected
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}


      <ConfirmDialog
        isOpen={approveModal.isOpen}
        onClose={approveModal.close}
        onConfirm={() => handleApprove(approveModal.data?.id)}
        title="Approve Enrollment"
        message={`Allow ${approveModal.data?.student?.name} to enroll in "${approveModal.data?.course?.title}"?`}
        confirmLabel="Approve"
      />

      <ConfirmDialog
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.close}
        onConfirm={() => handleReject(rejectModal.data?.id)}
        title="Reject Enrollment"
        message={`Reject ${rejectModal.data?.student?.name}'s request?`}
        confirmLabel="Reject"
        danger
      />

    </div>
  )
}