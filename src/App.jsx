import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import StudentExams from "./pages/StudentExams";
import TakeExam from "./pages/TakeExam";
import StudentResults from "./pages/StudentResults";
import "./index.css";

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
          path="/student/exam/:id"
          element={
           <ProtectedRoute allowedRoles={["student"]}>
           <TakeExam />
           </ProtectedRoute>
          }
        />  
        {/* La route DOIT s'appeler exactement comme dans le navigate de TakeExam.jsx */}
        <Route
          path="/student/results"
          element={
           <ProtectedRoute allowedRoles={["student"]}>
           <StudentResults />
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