// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext.jsx";
import { lazy, Suspense } from 'react'

// Public (keep eager — these load before auth is known)
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import CertificateViewPage from "./pages/CertificateViewPage.jsx";

// Layout & shared (keep eager)
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import LogoutConfirm from "./components/common/LogoutConfirm";
import { NotFoundPage, UnauthorizedPage } from "./pages/ErrorPages.jsx";
import PageSpinner from "./components/common/Spinner.jsx";

// Admin (lazy)
const AdminDashboard   = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminCoursesPage = lazy(() => import("./pages/admin/AdminCoursesPage.jsx"));
const AdminUsersPage   = lazy(() => import("./pages/admin/AdminUsersPage.jsx"));

// Instructor (lazy)
const InstructorDashboard       = lazy(() => import("./pages/instructor/InstructorDashboard.jsx"));
const InstructorCoursesPage     = lazy(() => import("./pages/instructor/InstructorCoursesPage.jsx"));
const InstructorAssignmentsPage = lazy(() => import("./pages/instructor/InstructorAssignmentsPage.jsx"));
const InstructorSubmissionsPage = lazy(() => import("./pages/instructor/InstructorSubmissionsPage.jsx"));
const InstructorEnrollmentsPage = lazy(() => import("./pages/instructor/InstructorEnrollmentsPage.jsx"));

// Student (lazy)
const StudentDashboard         = lazy(() => import("./pages/student/StudentDashboard.jsx"));
const StudentBrowseCoursesPage = lazy(() => import("./pages/student/StudentBrowseCoursesPage.jsx"));
const StudentEnrollmentsPage   = lazy(() => import("./pages/student/StudentEnrollmentsPage.jsx"));
const StudentProgressPage      = lazy(() => import("./pages/student/StudentProgressPage.jsx"));
const StudentSubmissionsPage   = lazy(() => import("./pages/student/StudentSubmissionsPage.jsx"));
const CertificatePage          = lazy(() => import("./pages/student/CertificatePage.jsx"));
const MessagingPage            = lazy(() => import('./pages/MessagingPage.jsx'))
// ---------- Guards ----------

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const RequireRole = ({ roles, children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner />;
  if (!user || !roles.includes(user.role.toUpperCase())) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

const GuestOnly = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    const role = user.role.toUpperCase();
    if (role === "ADMIN")      return <Navigate to="/admin" replace />;
    if (role === "INSTRUCTOR") return <Navigate to="/instructor" replace />;
    if (role === "STUDENT")    return <Navigate to="/student" replace />;
  }
  return children;
};

// ---------- App ----------

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageSpinner />}>
          <Routes>

            {/* Landing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/certificate/:id" element={<CertificateViewPage />} />

            {/* Auth */}
            <Route path="/login"    element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

            {/* ================= ADMIN ================= */}
            <Route element={
              <RequireAuth>
                <RequireRole roles={["ADMIN"]}>
                  <DashboardLayout />
                </RequireRole>
              </RequireAuth>
            }>
              <Route path="/admin"         element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/users"   element={<AdminUsersPage />} />
            </Route>

            {/* ================= INSTRUCTOR ================= */}
            <Route element={
              <RequireAuth>
                <RequireRole roles={["INSTRUCTOR"]}>
                  <DashboardLayout />
                </RequireRole>
              </RequireAuth>
            }>
              <Route path="/instructor"              element={<InstructorDashboard />} />
              <Route path="/instructor/courses"      element={<InstructorCoursesPage />} />
              <Route path="/instructor/enrollments"  element={<InstructorEnrollmentsPage />} />
              <Route path="/instructor/assignments"  element={<InstructorAssignmentsPage />} />
              <Route path="/instructor/submissions"  element={<InstructorSubmissionsPage />} />
              <Route path="/instructor/course/:courseId/assignments"        element={<InstructorAssignmentsPage />} />
              <Route path="/instructor/assignment/:assignmentId/submissions" element={<InstructorSubmissionsPage />} />
              <Route path="/instructor/messages" element={<MessagingPage />} />
            </Route>

            {/* ================= STUDENT ================= */}
            <Route element={
              <RequireAuth>
                <RequireRole roles={["STUDENT"]}>
                  <DashboardLayout />
                </RequireRole>
              </RequireAuth>
            }>
              <Route path="/student"              element={<StudentDashboard />} />
              <Route path="/student/courses"      element={<StudentBrowseCoursesPage />} />
              <Route path="/student/enrollments"  element={<StudentEnrollmentsPage />} />
              <Route path="/student/progress"     element={<StudentProgressPage />} />
              <Route path="/student/certificates" element={<CertificatePage />} />
              <Route path="/student/submissions"  element={<StudentSubmissionsPage />} />
          <Route path="/student/messages" element={<MessagingPage />} />
            </Route>

            {/* Errors */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*"             element={<NotFoundPage />} />

          </Routes>
        </Suspense>

        <LogoutConfirm />
      </Router>
    </AuthProvider>
  );
}