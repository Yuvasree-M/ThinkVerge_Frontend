// import api from './axios'

// // ── Auth ──────────────────────────────────────────────────
// export const authApi = {
//   register: (data) => api.post('/auth/register', data),
//   login:    (data) => api.post('/auth/login', data),
//   logout:   ()     => api.post('/auth/logout'),
// }

// // ── Users ─────────────────────────────────────────────────
// export const userApi = {
//   me:           ()          => api.get('/users/me'),
//   instructors:  ()          => api.get('/users/instructors'),
//   students:     ()          => api.get('/users/students'),
//   updateLastSeen: ()        => api.put('/users/last-seen'),
//   all:          ()          => api.get('/users'),
//   changeRole:   (id, role)  => api.put(`/users/${id}/role?role=${role}`),
//   deleteUser:   (id)        => api.delete(`/users/${id}`),
// }

// // ── Courses ───────────────────────────────────────────────
// export const courseApi = {
//   getAll:     ()             => api.get('/courses'),
//   getAllAdmin: ()             => api.get('/courses/admin/all'),
//   getById:    (id)           => api.get(`/courses/${id}`),
//   myCourses:  ()             => api.get('/courses/instructor/my'),
//   create:     (formData)     => api.post('/courses/instructor', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }),
//   update:     (id, formData) => api.put(`/courses/instructor/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }),
//   delete:     (id)           => api.delete(`/courses/instructor/${id}`),
//   approve:    (id)           => api.put(`/courses/admin/${id}/approve`),
//   reject:     (id)           => api.put(`/courses/admin/${id}/reject`),
// }

// // ── Modules ───────────────────────────────────────────────
// export const moduleApi = {
//   create:     (data, instructorId) =>
//     api.post(`/modules?instructorId=${instructorId}`, data),
//   update:     (id, data)    => api.put(`/modules/${id}`, data),
//   delete:     (id)          => api.delete(`/modules/${id}`),
//   getByCourse:(courseId)    => api.get(`/modules/course/${courseId}`),
// }

// // ── Lessons ───────────────────────────────────────────────
// export const lessonApi = {
//   create:      (data)     => api.post('/lessons', data),
//   getByModule: (moduleId) => api.get(`/lessons/module/${moduleId}`),
//   update:      (id, data) => api.put(`/lessons/${id}`, data),
//   delete:      (id)       => api.delete(`/lessons/${id}`),
// }

// // ── Assignments ───────────────────────────────────────────
// export const assignmentApi = {
//   create:   (data)     => api.post('/assignments', data),
//   update:   (id, data) => api.put(`/assignments/${id}`, data),
//   delete:   (id)       => api.delete(`/assignments/${id}`),
//   byCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
// }

// // ── Submissions ───────────────────────────────────────────
// export const submissionApi = {
//   submit:        (data)          => api.post('/submissions', data),
//   grade:         (id, data)      => api.put(`/submissions/${id}/grade`, data),
//   delete:        (id)            => api.delete(`/submissions/${id}`),
//   mySubmissions: ()              => api.get('/submissions/my'),
//   byAssignment:  (assignmentId)  =>
//     api.get(`/submissions/assignment/${assignmentId}`),
// }

// // ── Quizzes ───────────────────────────────────────────────
// export const quizApi = {
//   // Instructor — module quiz
//   createOrUpdate: (data)      => api.post('/quizzes', data),
//   getForInstructor:(moduleId) => api.get(`/quizzes/module/${moduleId}/instructor`),
//   deleteQuiz:     (quizId)    => api.delete(`/quizzes/${quizId}`),

//   // Instructor — final quiz
//   createOrUpdateFinal: (data)    => api.post('/quizzes/final', data),
//   getFinalForInstructor:(courseId)=> api.get(`/quizzes/final/course/${courseId}/instructor`),

//   // Student — module quiz
//   getForStudent:  (moduleId) => api.get(`/quizzes/module/${moduleId}`),

//   // Student — final quiz
//   getFinalForStudent: (courseId) => api.get(`/quizzes/final/course/${courseId}`),

//   // Shared
//   submit:         (data)     => api.post('/quizzes/submit', data),
//   myAttempts:     (courseId) => api.get(`/quizzes/my/course/${courseId}`),
//   moduleStatuses: (courseId) => api.get(`/quizzes/module-status/${courseId}`),
// }

// // ── Certificates ──────────────────────────────────────────
// export const certificateApi = {
//   myCertificates: () => api.get('/certificates/my'),
//   getById: (id)   => api.get(`/certificates/${id}`),
// }

// // ── Enrollments ───────────────────────────────────────────
// export const enrollmentApi = {
//   request:       (courseId) => api.post(`/enrollments/${courseId}/request`),
//   approve:       (id)       => api.put(`/enrollments/${id}/approve`),
//   reject:        (id)       => api.put(`/enrollments/${id}/reject`),
//   myEnrollments: ()         => api.get('/enrollments/my'),
//   pending:       ()         => api.get('/enrollments/instructor/pending'),
//   all:           ()         => api.get('/enrollments/instructor/all'),
// }

// // ── Progress ──────────────────────────────────────────────
// export const progressApi = {
//   updateVideo:    (lessonId, percentage) =>
//     api.post(`/progress/video/${lessonId}`, null, { params: { percentage } }),
//   completeText:   (lessonId) => api.post(`/progress/text/${lessonId}/complete`),
//   completeLesson: (lessonId) => api.post(`/progress/complete/${lessonId}`),
//   myProgress:     ()         => api.get('/progress/my'),
// }

// // ── File Upload ───────────────────────────────────────────
// export const uploadApi = {
//   upload: (file) => {
//     const fd = new FormData()
//     fd.append('file', file)
//     return api.post('/upload', fd, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//   },
// }

import api from './axios'

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
}

// ── Users ─────────────────────────────────────────────────
export const userApi = {
  me:           ()          => api.get('/users/me'),
  instructors:  ()          => api.get('/users/instructors'),
  students:     ()          => api.get('/users/students'),
  updateLastSeen: ()        => api.put('/users/last-seen'),
  all:          ()          => api.get('/users'),
  pending:      ()          => api.get('/users/pending'),
  approveUser:  (id)        => api.put(`/users/${id}/approve`),
  changeRole:   (id, role)  => api.put(`/users/${id}/role?role=${role}`),
  deleteUser:   (id)        => api.delete(`/users/${id}`),
}

// ── Courses ───────────────────────────────────────────────
export const courseApi = {
  getAll:     ()             => api.get('/courses'),
  getAllAdmin: ()             => api.get('/courses/admin/all'),
  getById:    (id)           => api.get(`/courses/${id}`),
  myCourses:  ()             => api.get('/courses/instructor/my'),
  create:     (formData)     => api.post('/courses/instructor', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update:     (id, formData) => api.put(`/courses/instructor/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete:     (id)           => api.delete(`/courses/instructor/${id}`),
  approve:    (id)           => api.put(`/courses/admin/${id}/approve`),
  reject:     (id)           => api.put(`/courses/admin/${id}/reject`),
}

// ── Modules ───────────────────────────────────────────────
export const moduleApi = {
  create:     (data, instructorId) =>
    api.post(`/modules?instructorId=${instructorId}`, data),
  update:     (id, data)    => api.put(`/modules/${id}`, data),
  delete:     (id)          => api.delete(`/modules/${id}`),
  getByCourse:(courseId)    => api.get(`/modules/course/${courseId}`),
}

// ── Lessons ───────────────────────────────────────────────
export const lessonApi = {
  create:      (data)     => api.post('/lessons', data),
  getByModule: (moduleId) => api.get(`/lessons/module/${moduleId}`),
  update:      (id, data) => api.put(`/lessons/${id}`, data),
  delete:      (id)       => api.delete(`/lessons/${id}`),
}

// ── Assignments ───────────────────────────────────────────
export const assignmentApi = {
  create:   (data)     => api.post('/assignments', data),
  update:   (id, data) => api.put(`/assignments/${id}`, data),
  delete:   (id)       => api.delete(`/assignments/${id}`),
  byCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
}

// ── Submissions ───────────────────────────────────────────
export const submissionApi = {
  submit:        (data)          => api.post('/submissions', data),
  grade:         (id, data)      => api.put(`/submissions/${id}/grade`, data),
  delete:        (id)            => api.delete(`/submissions/${id}`),
  mySubmissions: ()              => api.get('/submissions/my'),
  byAssignment:  (assignmentId)  =>
    api.get(`/submissions/assignment/${assignmentId}`),
}

// ── Quizzes ───────────────────────────────────────────────
export const quizApi = {
  // Instructor — module quiz
  createOrUpdate: (data)      => api.post('/quizzes', data),
  getForInstructor:(moduleId) => api.get(`/quizzes/module/${moduleId}/instructor`),
  deleteQuiz:     (quizId)    => api.delete(`/quizzes/${quizId}`),

  // Instructor — final quiz
  createOrUpdateFinal: (data)    => api.post('/quizzes/final', data),
  getFinalForInstructor:(courseId)=> api.get(`/quizzes/final/course/${courseId}/instructor`),

  // Student — module quiz
  getForStudent:  (moduleId) => api.get(`/quizzes/module/${moduleId}`),

  // Student — final quiz
  getFinalForStudent: (courseId) => api.get(`/quizzes/final/course/${courseId}`),

  // Shared
  submit:         (data)     => api.post('/quizzes/submit', data),
  myAttempts:     (courseId) => api.get(`/quizzes/my/course/${courseId}`),
  moduleStatuses: (courseId) => api.get(`/quizzes/module-status/${courseId}`),
}

// ── Certificates ──────────────────────────────────────────
export const certificateApi = {
  myCertificates: () => api.get('/certificates/my'),
  getById: (id)   => api.get(`/certificates/${id}`),
}

// ── Enrollments ───────────────────────────────────────────
export const enrollmentApi = {
  request:       (courseId) => api.post(`/enrollments/${courseId}/request`),
  approve:       (id)       => api.put(`/enrollments/${id}/approve`),
  reject:        (id)       => api.put(`/enrollments/${id}/reject`),
  myEnrollments: ()         => api.get('/enrollments/my'),
  pending:       ()         => api.get('/enrollments/instructor/pending'),
  all:           ()         => api.get('/enrollments/instructor/all'),
}

// ── Progress ──────────────────────────────────────────────
export const progressApi = {
  updateVideo:    (lessonId, percentage) =>
    api.post(`/progress/video/${lessonId}`, null, { params: { percentage } }),
  completeText:   (lessonId) => api.post(`/progress/text/${lessonId}/complete`),
  completeLesson: (lessonId) => api.post(`/progress/complete/${lessonId}`),
  myProgress:     ()         => api.get('/progress/my'),
}

// ── File Upload ───────────────────────────────────────────
export const uploadApi = {
  upload: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ── Public Landing & Feedback ─────────────────────────────────
export const publicApi = {
  instructors:        ()     => api.get('/public/instructors'),
  submitFeedback:     (data) => api.post('/public/feedback', data),
  pendingFeedback:    ()     => api.get('/public/feedback/pending'),
  approveFeedback:    (id)   => api.put(`/public/feedback/${id}/approve`),
  deleteFeedback:     (id)   => api.delete(`/public/feedback/${id}`),
  approvedFeedback: () => api.get('/public/feedback/approved'),
}

