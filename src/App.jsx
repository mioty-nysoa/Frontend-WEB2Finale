import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCourses from "./pages/AdminCourses";
import AdminExams from "./pages/AdminExams";
import AdminQuestions from "./pages/AdminQuestions";
import AdminResults from "./pages/AdminResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/admin/students"
          element={<AdminStudents />}
        />

        <Route
          path="/admin/courses"
          element={<AdminCourses />}
        />

        <Route
          path="/admin/exams"
          element={<AdminExams />}
        />

        <Route
          path="/admin/exams/:id/questions"
          element={<AdminQuestions />}
        />

        <Route
          path="/admin/exams/:id/results"
          element={<AdminResults />}
        />

        <Route
          path="/"
          element={<Navigate to="/admin" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/admin" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;