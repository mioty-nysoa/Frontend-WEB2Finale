import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Navbar from "./components/Navbar";

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
      <Navbar/>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

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
          path="/student/results"
          element={<StudentResults />}
        />

        <Route
          path="/student/exams"
          element={<StudentsExams />}
        />

        <Route
          path="/student/exams/:id"
          element={<TakeExam />}
        />

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;