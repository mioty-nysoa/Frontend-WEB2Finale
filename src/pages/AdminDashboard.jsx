import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [errorInfo, setErrorInfo] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorInfo("Pas de token dans localStorage !");
      return;
    }
    
    setErrorInfo("");
    const headers = { Authorization: `Bearer ${token}` };

    fetch("http://localhost:3000/api/students", { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`Students HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
      // Extrait le tableau peu importe le format renvoyé par le backend
      const list = Array.isArray(data) ? data : data.users || data.students || [];
      setStudents(list);
    })
      .catch((err) => setErrorInfo((prev) => prev + " | " + err.message));

    
    fetch("http://localhost:3000/api/courses", { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`Courses HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => setErrorInfo((prev) => prev + " | " + err.message));

    // Test Examens
    fetch("http://localhost:3000/api/exams", { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`Exams HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setExams(data))
      .catch((err) => setErrorInfo((prev) => prev + " | " + err.message));
  }, []);

  // Décompte sécurisé (gère les formats [ ] ou { students: [ ] })
  const count = (data) => {
    if (Array.isArray(data)) return data.length;
    if (data && typeof data === "object") {
      const arrayKey = Object.values(data).find((val) => Array.isArray(val));
      return arrayKey ? arrayKey.length : 0;
    }
    return 0;
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Tableau de bord</h1>
            <p>Bienvenue dans l'espace administrateur.</p>
          </div>
        </div>

        {errorInfo && (
          <div className="admin-error" style={{ marginBottom: "20px" }}>
            {errorInfo}
          </div>
        )}

        <div className="admin-dashboard-grid">
          <div className="admin-stat-card">
            <h3>Étudiants</h3>
            <p>{count(students)}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Cours</h3>
            <p>{count(courses)}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Examens</h3>
            <p>{count(exams)}</p>
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