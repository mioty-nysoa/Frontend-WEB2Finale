import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login"; // <-- Importe ta page Login

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Route publique pour afficher le Login */}
        <Route path="/login" element={<Login />} />

        {/* Vos autres routes protégées ici */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/exams" element={<h2>Page Examens</h2>} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<h2>Dashboard Admin</h2>} />
        </Route>

        {/* Redirection vers /login par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;