
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext.jsx";

// Public
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";

// Instructor
import InstructorDashboard from "./pages/instructor/InstructorDashboard.jsx";
import InstructorCoursesPage from "./pages/instructor/InstructorCoursesPage.jsx";
import InstructorAssignmentsPage from "./pages/instructor/InstructorAssignmentsPage.jsx";
import InstructorSubmissionsPage from "./pages/instructor/InstructorSubmissionsPage.jsx";
import InstructorEnrollmentsPage from "./pages/instructor/InstructorEnrollmentsPage.jsx";

// Student
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentBrowseCoursesPage from "./pages/student/StudentBrowseCoursesPage.jsx";
import StudentEnrollmentsPage from "./pages/student/StudentEnrollmentsPage.jsx";
import CertificateViewPage from "./pages/CertificateViewPage.jsx";
import StudentProgressPage from "./pages/student/StudentProgressPage.jsx";
import StudentSubmissionsPage from "./pages/student/StudentSubmissionsPage.jsx";
import CertificatePage from './pages/student/CertificatePage'
// Layout
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import LogoutConfirm from "./components/common/LogoutConfirm"
// Errors
import { NotFoundPage, UnauthorizedPage } from "./pages/ErrorPages.jsx";

import PageSpinner from "./components/common/Spinner.jsx";

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

    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "INSTRUCTOR") return <Navigate to="/instructor" replace />;
    if (role === "STUDENT") return <Navigate to="/student" replace />;
  }

  return children;
};


// ---------- App ----------

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Public certificate view */}
          <Route path="/certificate/:id" element={<CertificateViewPage />} />

          {/* Auth */}
          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

          {/* ================= ADMIN ================= */}
          <Route element={
            <RequireAuth>
              <RequireRole roles={["ADMIN"]}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>


          {/* ================= INSTRUCTOR ================= */}
          <Route element={
            <RequireAuth>
              <RequireRole roles={["INSTRUCTOR"]}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }>
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<InstructorCoursesPage />} />

            {/* sidebar routes */}
            <Route path="/instructor/enrollments" element={<InstructorEnrollmentsPage />} />
            <Route path="/instructor/assignments" element={<InstructorAssignmentsPage />} />
            <Route path="/instructor/submissions" element={<InstructorSubmissionsPage />} />

            {/* deep routes */}
            <Route 
              path="/instructor/course/:courseId/assignments" 
              element={<InstructorAssignmentsPage />} 
            />

            <Route 
              path="/instructor/assignment/:assignmentId/submissions" 
              element={<InstructorSubmissionsPage />} 
            />
          </Route>


          {/* ================= STUDENT ================= */}
          <Route element={
            <RequireAuth>
              <RequireRole roles={["STUDENT"]}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }>
            <Route path="/student" element={<StudentDashboard />} />

            <Route 
              path="/student/courses" 
              element={<StudentBrowseCoursesPage />} 
            />

            <Route 
              path="/student/enrollments" 
              element={<StudentEnrollmentsPage />} 
            />

            <Route
              path="/student/progress"
              element={<StudentProgressPage />}
            />

            <Route 
              path="/student/certificates" 
              element={<CertificatePage />} 
            />

            <Route 
              path="/student/submissions" 
              element={<StudentSubmissionsPage />} 
            />
          </Route>


          {/* errors */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />

        </Routes>


  <LogoutConfirm />

      </Router>
    </AuthProvider>
  );
}