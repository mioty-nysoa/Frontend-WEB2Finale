import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import StudentExams from "./pages/StudentExams";
import TakeExam from "./pages/TakeExam";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées Étudiant avec la prop `children` */}
        <Route
          path="/student/exams"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentExams />
            </ProtectedRoute>
            
          }
        />
        <Route
          path="/student/exam"
          element={
           <ProtectedRoute allowedRoles={["student"]}>
           <TakeExam />
           </ProtectedRoute>
          }
        />  

        {/* Route protégée Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <h2>Dashboard Admin</h2>
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;