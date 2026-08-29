import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCourses from "./pages/AdminCourses";
import AdminExams from "./pages/AdminExams";
import AdminQuestions from "./pages/AdminQuestions";
import AdminResults from "./pages/AdminResults";

import StudentResults from "./pages/StudentResults";
import StudentsExams from "./pages/StudentExams";
import TakeExam from "./pages/TakeExam";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />

        {/* --- ROUTES ADMIN --- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:id/questions"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:id/results"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminResults />
            </ProtectedRoute>
          }
        />

        {/* --- ROUTES ÉTUDIANT --- */}
        <Route
          path="/student/results"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exams"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentsExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exams/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <TakeExam />
            </ProtectedRoute>
          }
        />

        {/* Redirections par défaut */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;