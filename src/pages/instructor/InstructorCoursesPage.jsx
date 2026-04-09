import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { courseApi } from '../../api/services'
import CourseCard from '../../components/courses/CourseCard'
import CreateCourseModal from '../../components/courses/CreateCourseModal'
import ModuleList from '../../components/modules/ModuleList'
import Modal from '../../components/common/Modal'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import useModal from '../../hooks/useModal'
import { Plus, BookOpen, Layers } from 'lucide-react'

export default function InstructorCoursesPage() {
  const qc = useQueryClient()
  const createModal  = useModal()
  const modulesModal = useModal()

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseApi.myCourses().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-lms">{courses.length} course{courses.length !== 1 ? 's' : ''} created</p>
        </div>
        <button className="btn-primary" onClick={createModal.open}>
          <Plus size={16} /> New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Create your first course and start teaching students around the world."
          action={<button className="btn-primary" onClick={createModal.open}><Plus size={15} />Create Course</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              showStatus
              actions={
                <button
                  className="btn-ghost text-xs flex-1 justify-center"
                  onClick={() => modulesModal.open(course)}
                >
                  <Layers size={13} /> Manage Content
                </button>
              }
            />
          ))}
        </div>
      )}

      <CreateCourseModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onCreated={() => qc.invalidateQueries({ queryKey: ['my-courses'] })}
      />

      <Modal
        isOpen={modulesModal.isOpen}
        onClose={modulesModal.close}
        title={modulesModal.data?.title || 'Course Content'}
        size="lg"
      >
        {modulesModal.data && (
          <ModuleList courseId={modulesModal.data.id} editable />
        )}
      </Modal>
    </div>
  )
}
