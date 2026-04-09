import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { enrollmentApi } from '../../api/services'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import ModuleList from '../../components/modules/ModuleList'
import Modal from '../../components/common/Modal'
import useModal from '../../hooks/useModal'
import { GraduationCap, BookOpen, Clock, CheckCircle2, XCircle, PlayCircle } from 'lucide-react'
import clsx from 'clsx'

const STATUS_ICON = {
  APPROVED: <CheckCircle2 size={14} className="text-emerald-500" />,
  PENDING:  <Clock size={14} className="text-gold-500" />,
  REJECTED: <XCircle size={14} className="text-red-400" />,
}

export default function StudentEnrollmentsPage() {
  const contentModal = useModal()

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.myEnrollments().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />

  const approved = enrollments.filter(e => e.status === 'APPROVED')
  const pending  = enrollments.filter(e => e.status === 'PENDING')
  const rejected = enrollments.filter(e => e.status === 'REJECTED')

  return (
    <div className="space-y-8">
      {/* Active courses */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={13} className="text-white" />
          </div>
          <h2 className="font-display font-semibold text-navy-900">Active Courses ({approved.length})</h2>
        </div>

        {approved.length === 0 ? (
          <p className="text-sm text-slate-lms">No approved enrollments yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map(e => (
              <div key={e.id} className="card-hover flex flex-col gap-3">
                <div className="h-28 rounded-xl bg-royal-gradient flex items-center justify-center relative overflow-hidden">
                  {e.course?.thumbnailUrl
                    ? <img src={e.course.thumbnailUrl} alt={e.course.title} className="w-full h-full object-cover" />
                    : <BookOpen size={28} className="text-white/60" />
                  }
                  <div className="absolute bottom-2 left-2">
                    <span className="badge bg-emerald-500/90 text-white backdrop-blur-sm">Active</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-800 text-sm leading-snug">{e.course?.title}</h3>
                  <p className="text-xs text-slate-lms mt-0.5">{e.course?.category}</p>
                </div>
                <button
                  className="btn-primary text-xs justify-center py-2"
                  onClick={() => contentModal.open(e.course)}
                >
                  <PlayCircle size={13} /> Continue Learning
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending */}
      {pending.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-gold-500 flex items-center justify-center">
              <Clock size={13} className="text-white" />
            </div>
            <h2 className="font-display font-semibold text-navy-900">Pending Approval ({pending.length})</h2>
          </div>
          <div className="space-y-2">
            {pending.map(e => (
              <div key={e.id} className="card flex items-center gap-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-gold-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-gold-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-navy-800 text-sm">{e.course?.title}</p>
                  <p className="text-xs text-slate-lms">Awaiting instructor approval</p>
                </div>
                <span className="badge-yellow">Pending</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-red-400 flex items-center justify-center">
              <XCircle size={13} className="text-white" />
            </div>
            <h2 className="font-display font-semibold text-navy-900">Rejected ({rejected.length})</h2>
          </div>
          <div className="space-y-2">
            {rejected.map(e => (
              <div key={e.id} className="card flex items-center gap-4 py-3 opacity-60">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-navy-800 text-sm">{e.course?.title}</p>
                  <p className="text-xs text-red-400">Enrollment rejected</p>
                </div>
                <span className="badge-red">Rejected</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {enrollments.length === 0 && (
        <EmptyState icon={GraduationCap} title="No enrollments yet" description="Browse courses and request enrollment to start learning." />
      )}

      {/* Course content modal */}
      <Modal
        isOpen={contentModal.isOpen}
        onClose={contentModal.close}
        title={contentModal.data?.title || 'Course Content'}
        size="lg"
      >
        {contentModal.data && (
          <ModuleList courseId={contentModal.data.id} editable={false} enrolled={true} />
        )}
      </Modal>
    </div>
  )
}
