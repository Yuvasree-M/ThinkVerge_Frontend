import api from './axios'

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  logout:   ()      => api.post('/auth/logout'),
}

// ── Users ─────────────────────────────────────────────────
export const userApi = {
  me:           ()     => api.get('/users/me'),
  instructors:  ()     => api.get('/users/instructors'),
  students:     ()     => api.get('/users/students'),
  updateLastSeen: ()   => api.put('/users/last-seen'),

  // ADMIN
  all:          ()     => api.get('/users'),
  changeRole:   (id, role) => api.put(`/users/${id}/role?role=${role}`),
  deleteUser:   (id)   => api.delete(`/users/${id}`),
}

// ── Courses ───────────────────────────────────────────────
export const courseApi = {
  getAll:     ()       => api.get('/courses'),
     getAllAdmin: () => api.get('/courses/admin/all'),
  getById:    (id)     => api.get(`/courses/${id}`),
  myCourses:  ()       => api.get('/courses/instructor/my'),
  create: (formData)   => api.post('/courses/instructor', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  approve:    (id)     => api.put(`/courses/admin/${id}/approve`),
  reject:     (id)     => api.put(`/courses/admin/${id}/reject`),
}

// ── Modules API ───────────────────────────────────────────────

export const moduleApi = {
  create: (data, instructorId) =>
  api.post(`/modules?instructorId=${instructorId}`, data),

update: (id, data) => api.put(`/modules/${id}`, data),
delete: (id) => api.delete(`/modules/${id}`),
getByCourse: (courseId) => api.get(`/modules/course/${courseId}`),
}

// ── Lessons ───────────────────────────────────────────────
export const lessonApi = {
  create: (data) =>
    api.post('/lessons', data),           // Content-Type: application/json (axios default)
 
  getByModule: (moduleId) =>
    api.get(`/lessons/module/${moduleId}`),
 
  update: (id, data) =>
    api.put(`/lessons/${id}`, data),
 
  delete: (id) =>
    api.delete(`/lessons/${id}`),
}

// ── Assignments ───────────────────────────────────────────
export const assignmentApi = {
  create:    (data)     => api.post('/assignments', data),
  update:    (id, data) => api.put(`/assignments/${id}`, data),
  delete:    (id)       => api.delete(`/assignments/${id}`),
  byCourse:  (courseId) => api.get(`/assignments/course/${courseId}`),
}

// ── Submissions ───────────────────────────────────────────
export const submissionApi = {
  submit:        (data)         => api.post('/submissions', data),
  grade:         (id, data)     => api.put(`/submissions/${id}/grade`, data),
  mySubmissions: ()             => api.get('/submissions/my'),
  byAssignment:  (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
}

// ── Enrollments ───────────────────────────────────────────
export const enrollmentApi = {
  request:       (courseId) => api.post(`/enrollments/${courseId}/request`),
  approve:       (id)       => api.put(`/enrollments/${id}/approve`),
  reject:        (id)       => api.put(`/enrollments/${id}/reject`),
  myEnrollments: ()         => api.get('/enrollments/my'),
  pending:       ()         => api.get('/enrollments/instructor/pending'),
  all: () => api.get("/enrollments/instructor/all"),
}

// ── Progress ──────────────────────────────────────────────
export const progressApi = {
  updateVideo: (lessonId, percentage) =>
    api.post(`/progress/video/${lessonId}`, null, { params: { percentage } }),
  completeText: (lessonId) => api.post(`/progress/text/${lessonId}/complete`),
  myProgress:   ()         => api.get('/progress/my'),
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
