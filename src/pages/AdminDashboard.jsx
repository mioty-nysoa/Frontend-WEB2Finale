import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";
import {
  fetchStudents,
  fetchCourses,
  fetchAdminExams,
  fetchExamQuestions,
} from "../services/Api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    exams: 0,
    questions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [studentsData, coursesData, examsData] = await Promise.all([
          fetchStudents(),
          fetchCourses(),
          fetchAdminExams(),
        ]);

        const students = Array.isArray(studentsData)
          ? studentsData
          : studentsData?.students || [];
        const courses = Array.isArray(coursesData)
          ? coursesData
          : coursesData?.courses || [];
        const exams = Array.isArray(examsData)
          ? examsData
          : examsData?.exams || [];

        const questionsCounts = await Promise.all(
          exams.map((exam) =>
            fetchExamQuestions(exam.id)
              .then((data) => (Array.isArray(data) ? data.length : 0))
              .catch(() => 0)
          )
        );

        const totalQuestions = questionsCounts.reduce(
          (sum, count) => sum + count,
          0
        );

        setStats({
          students: students.length,
          courses: courses.length,
          exams: exams.length,
          questions: totalQuestions,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Tableau de bord</h1>
            <p>Bienvenue dans l'espace administrateur.</p>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-dashboard-grid">
          <div className="admin-stat-card">
            <h3>Étudiants</h3>
            <p>{loading ? "..." : stats.students}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Cours</h3>
            <p>{loading ? "..." : stats.courses}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Examens</h3>
            <p>{loading ? "..." : stats.exams}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Questions</h3>
            <p>{loading ? "..." : stats.questions}</p>
          </div>
        </div>

        <div className="admin-card">
          <h2>Accès rapides</h2>

          <div className="admin-quick-links">
            <Link to="/admin/students">Étudiants</Link>

            <Link to="/admin/courses">Cours</Link>

            <Link to="/admin/exams">Examens</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;