import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Vos pages communes & étudiant
import Login from './pages/Login';
import StudentExams from './pages/StudentExams';
import TakeExam from './pages/TakeExam'; // ou la page de passage d'examen
import StudentResults from './pages/StudentResults';

// Les pages admin apportées par ta collaboratrice
import AdminDashboard from './pages/AdminDashboard'; // /admin
import StudentManagement from './pages/StudentManagement'; // /admin/students
import CourseManagement from './pages/CourseManagement'; // /admin/courses
import ExamManagement from './pages/ExamManagement'; // /admin/exams
import QuestionEditor from './pages/QuestionEditor'; // /admin/exams/:id/questions
import ExamResultsAdmin from './pages/ExamResultsAdmin'; // /admin/exams/:id/results

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<Login />} />

          {/* Espace ÉTUDIANT (Rôle: student) */}
          <Route path="/student" element={
            <ProtectedRoute allowedRole="student">
              <StudentExams />
            </ProtectedRoute>
          } />
          <Route path="/student/exams/:id" element={
            <ProtectedRoute allowedRole="student">
              <TakeExam />
            </ProtectedRoute>
          } />
          <Route path="/student/results" element={
            <ProtectedRoute allowedRole="student">
              <StudentResults />
            </ProtectedRoute>
          } />

          {/* Espace ADMINISTRATEUR (Rôle: admin) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRole="admin">
              <StudentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRole="admin">
              <CourseManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams" element={
            <ProtectedRoute allowedRole="admin">
              <ExamManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams/:id/questions" element={
            <ProtectedRoute allowedRole="admin">
              <QuestionEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams/:id/results" element={
            <ProtectedRoute allowedRole="admin">
              <ExamResultsAdmin />
            </ProtectedRoute>
          } />

          {/* Redirection par défaut si la route n'existe pas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;