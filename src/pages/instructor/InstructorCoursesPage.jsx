// import { useState } from 'react'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { courseApi } from '../../api/services'
// import CourseCard from '../../components/courses/CourseCard'
// import CreateCourseModal from '../../components/courses/CreateCourseModal'
// import EditCourseModal from '../../components/courses/EditCourseModal'
// import ModuleList from '../../components/modules/ModuleList'
// import Modal from '../../components/common/Modal'
// import { PageSpinner } from '../../components/common/Spinner'
// import EmptyState from '../../components/common/EmptyState'
// import useModal from '../../hooks/useModal'
// import { Plus, BookOpen, Layers, Pencil, Trash2 } from 'lucide-react'
// import toast from 'react-hot-toast'

// export default function InstructorCoursesPage() {
//   const qc = useQueryClient()
//   const createModal  = useModal()
//   const editModal    = useModal()
//   const modulesModal = useModal()
//   const [deletingId, setDeletingId] = useState(null)

//   const { data: courses = [], isLoading } = useQuery({
//     queryKey: ['my-courses'],
//     queryFn: () => courseApi.myCourses().then(r => r.data),
//   })

//   const handleDelete = async (course) => {
//     if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return
//     setDeletingId(course.id)
//     try {
//       await courseApi.delete(course.id)
//       toast.success('Course deleted.')
//       qc.invalidateQueries({ queryKey: ['my-courses'] })
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to delete course')
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   if (isLoading) return <PageSpinner />

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-slate-lms">{courses.length} course{courses.length !== 1 ? 's' : ''} created</p>
//         </div>
//         <button className="btn-primary" onClick={createModal.open}>
//           <Plus size={16} /> New Course
//         </button>
//       </div>

//       {courses.length === 0 ? (
//         <EmptyState
//           icon={BookOpen}
//           title="No courses yet"
//           description="Create your first course and start teaching students around the world."
//           action={<button className="btn-primary" onClick={createModal.open}><Plus size={15} />Create Course</button>}
//         />
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {courses.map(course => (
//             <CourseCard
//               key={course.id}
//               course={course}
//               showStatus
//               actions={
//                 <>
//                   {/* Manage Content */}
//                   <button
//                     className="btn-ghost text-xs flex-1 justify-center"
//                     onClick={() => modulesModal.open(course)}
//                   >
//                     <Layers size={13} /> Content
//                   </button>

//                   {/* Edit */}
//                   <button
//                     className="btn-ghost text-xs px-2 justify-center text-royal-600 hover:bg-royal-50"
//                     onClick={() => editModal.open(course)}
//                     title="Edit course"
//                   >
//                     <Pencil size={13} />
//                   </button>

//                   {/* Delete */}
//                   <button
//                     className="btn-ghost text-xs px-2 justify-center text-red-500 hover:bg-red-50"
//                     onClick={() => handleDelete(course)}
//                     disabled={deletingId === course.id}
//                     title="Delete course"
//                   >
//                     <Trash2 size={13} />
//                   </button>
//                 </>
//               }
//             />
//           ))}
//         </div>
//       )}

//       {/* Create Modal */}
//       <CreateCourseModal
//         isOpen={createModal.isOpen}
//         onClose={createModal.close}
//         onCreated={() => qc.invalidateQueries({ queryKey: ['my-courses'] })}
//       />

//       {/* Edit Modal */}
//       <EditCourseModal
//         isOpen={editModal.isOpen}
//         onClose={editModal.close}
//         course={editModal.data}
//         onUpdated={() => qc.invalidateQueries({ queryKey: ['my-courses'] })}
//       />

//       {/* Manage Content Modal */}
//       <Modal
//         isOpen={modulesModal.isOpen}
//         onClose={modulesModal.close}
//         title={modulesModal.data?.title || 'Course Content'}
//         size="lg"
//       >
//         {modulesModal.data && (
//           <ModuleList courseId={modulesModal.data.id} editable />
//         )}
//       </Modal>
//     </div>
//   )
// }

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { courseApi } from '../../api/services'
import CourseCard from '../../components/courses/CourseCard'
import CreateCourseModal from '../../components/courses/CreateCourseModal'
import EditCourseModal from '../../components/courses/EditCourseModal'
import ModuleList from '../../components/modules/ModuleList'
import Modal from '../../components/common/Modal'
import { PageSpinner } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import useModal from '../../hooks/useModal'
import { Plus, BookOpen, Layers, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function InstructorCoursesPage() {
  const qc = useQueryClient()
  const createModal  = useModal()
  const editModal    = useModal()
  const modulesModal = useModal()
  const [deletingId, setDeletingId] = useState(null)

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseApi.myCourses().then(r => r.data),
  })

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return
    setDeletingId(course.id)
    try {
      await courseApi.delete(course.id)
      toast.success('Course deleted.')
      qc.invalidateQueries({ queryKey: ['my-courses'] })
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete course')
    } finally {
      setDeletingId(null)
    }
  }

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
                <>
                  {/* Manage Content */}
                  <button
                    className="btn-ghost text-xs flex-1 justify-center"
                    onClick={() => modulesModal.open(course)}
                  >
                    <Layers size={13} /> Content
                  </button>

                  {/* Edit */}
                  <button
                    className="btn-ghost text-xs px-2 justify-center text-royal-600 hover:bg-royal-50"
                    onClick={() => editModal.open(course)}
                    title="Edit course"
                  >
                    <Pencil size={13} />
                  </button>

                  {/* Delete */}
                  <button
                    className="btn-ghost text-xs px-2 justify-center text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(course)}
                    disabled={deletingId === course.id}
                    title="Delete course"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateCourseModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onCreated={() => qc.invalidateQueries({ queryKey: ['my-courses'] })}
      />

      {/* Edit Modal */}
      <EditCourseModal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        course={editModal.data}
        onUpdated={() => qc.invalidateQueries({ queryKey: ['my-courses'] })}
      />

      {/* Manage Content Modal */}
      <Modal
        isOpen={modulesModal.isOpen}
        onClose={modulesModal.close}
        title={modulesModal.data?.title || 'Course Content'}
        size="lg"
      >
        {modulesModal.data && (
          <ModuleList courseId={modulesModal.data.id} courseTitle={modulesModal.data.title} editable />
        )}
      </Modal>
    </div>
  )
}