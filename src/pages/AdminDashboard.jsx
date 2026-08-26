import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    exams: 0,
    questions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const request = async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data =
      response.status === 204
        ? null
        : await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "Impossible de récupérer les données."
      );
    }

    return data;
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          studentsData,
          coursesData,
          examsData,
          questionsData,
        ] = await Promise.all([
          request("/api/students"),
          request("/api/courses"),
          request("/api/exams"),
          request("/api/questions"),
        ]);

        setStats({
          students: Array.isArray(studentsData)
            ? studentsData.length
            : studentsData?.students?.length || 0,

          courses: Array.isArray(coursesData)
            ? coursesData.length
            : coursesData?.courses?.length || 0,

          exams: Array.isArray(examsData)
            ? examsData.length
            : examsData?.exams?.length || 0,

          questions: Array.isArray(questionsData)
            ? questionsData.length
            : questionsData?.questions?.length || 0,
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
            <p>
              Bienvenue dans l'espace administrateur.
            </p>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-card">
            <p>Chargement des statistiques...</p>
          </div>
        ) : (
          <div className="admin-dashboard-grid">
            <div className="admin-stat-card">
              <h3>Étudiants</h3>
              <p>{stats.students}</p>
            </div>

            <div className="admin-stat-card">
              <h3>Cours</h3>
              <p>{stats.courses}</p>
            </div>

            <div className="admin-stat-card">
              <h3>Examens</h3>
              <p>{stats.exams}</p>
            </div>

            <div className="admin-stat-card">
              <h3>Questions</h3>
              <p>{stats.questions}</p>
            </div>
          </div>
        )}

        <div className="admin-card">
          <h2>Accès rapides</h2>

          <div className="admin-quick-links">
            <Link to="/admin/students">
              Gérer les étudiants
            </Link>

            <Link to="/admin/courses">
              Gérer les cours
            </Link>

            <Link to="/admin/exams">
              Gérer les examens
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;