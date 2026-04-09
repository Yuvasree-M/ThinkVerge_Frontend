# ThinkVerge LMS — React Frontend

A production-grade React frontend for the ThinkVerge Learning Management System, built with **Vite**, **React 18**, and **Tailwind CSS**.

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework + build tool |
| React Router v6 | Client-side routing |
| TanStack Query v5 | Server state & caching |
| React Hook Form | Form management |
| Axios | HTTP client with JWT interceptors |
| Tailwind CSS 3 | Utility-first styling |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |

## Color Theme

| Token | Hex | Usage |
|-------|-----|-------|
| Royal Blue `royal-500` | `#4169e1` | Primary actions, sidebar |
| Navy `navy-900` | `#1a2563` | Headings, body text |
| Soft Blue-Grey `slate-lms` | `#8fa3bf` | Muted text, placeholders |
| Gold `gold-500` | `#d4a017` | Accents, badges, highlights |

## Project Structure

```
src/
├── api/
│   ├── axios.js          # Axios instance + JWT interceptor
│   └── services.js       # All API calls (one per controller)
├── components/
│   ├── common/           # Modal, Spinner, EmptyState, StatCard, ProgressBar, ConfirmDialog, FormField
│   ├── layout/           # DashboardLayout, Sidebar, Topbar
│   ├── courses/          # CourseCard, CreateCourseModal
│   ├── modules/          # ModuleList
│   ├── lessons/          # LessonList
│   ├── assignments/      # AssignmentModal
│   └── submissions/      # SubmitAssignmentModal, GradeModal
├── contexts/
│   └── AuthContext.jsx   # Auth state, login/logout/register
├── hooks/
│   ├── useAsync.js       # Generic async + toast handler
│   └── useModal.js       # Modal open/close/data state
├── pages/
│   ├── auth/             # LoginPage, RegisterPage
│   ├── admin/            # AdminDashboard, AdminCoursesPage, AdminUsersPage
│   ├── instructor/       # Dashboard, Courses, Enrollments, Assignments, Submissions
│   └── student/          # Dashboard, BrowseCourses, Enrollments, Progress, Submissions
├── routes/
│   └── guards.jsx        # RequireAuth, RequireRole, GuestOnly
├── App.jsx               # All routes
├── main.jsx              # Entry point
└── index.css             # Global styles + Tailwind components
```

## API Coverage

Every Spring Boot controller endpoint is covered:

| Controller | Endpoints |
|-----------|-----------|
| AuthController | POST /register, /login, /logout |
| UserController | GET /me, /instructors, /students · PUT /last-seen |
| CourseController | GET /, /:id, /instructor/my · POST /instructor · PUT /admin/:id/approve\|reject |
| CourseModuleController | POST /modules · GET /modules/course/:id |
| LessonController | POST /lessons · GET /lessons/module/:id |
| AssignmentController | POST, PUT /:id, DELETE /:id, GET /course/:id |
| SubmissionController | POST, PUT /:id/grade · GET /my, /assignment/:id |
| EnrollmentController | POST /:courseId/request · PUT /:id/approve\|reject · GET /my, /instructor/pending |
| ProgressController | POST /video/:id, /text/:id/complete · GET /my |
| FileUploadController | POST /upload |

## Roles & Routes

| Role | Routes |
|------|--------|
| `ADMIN` | `/admin`, `/admin/courses`, `/admin/users` |
| `INSTRUCTOR` | `/instructor`, `/instructor/courses`, `/instructor/enrollments`, `/instructor/assignments`, `/instructor/submissions` |
| `STUDENT` | `/student`, `/student/courses`, `/student/enrollments`, `/student/progress`, `/student/submissions` |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (proxies /api → http://localhost:8080)
npm run dev

# 3. Build for production
npm run build
```

The Vite dev server proxies all `/api/*` requests to your Spring Boot backend at `http://localhost:8080`.

## Notes

- JWT is stored in `localStorage` under key `token`
- Automatic redirect to `/login` on 401 responses
- Role-based route guards redirect unauthorized users
- All forms use React Hook Form with validation
- Data fetching uses TanStack Query with 5-minute stale time
