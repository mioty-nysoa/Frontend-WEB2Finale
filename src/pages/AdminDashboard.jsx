import { Link } from "react-router-dom";
import "./Admin.css";

function AdminDashboard() {
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

        <div className="admin-dashboard-grid">
          <div className="admin-stat-card">
            <h3>Étudiants</h3>
            <p>0</p>
          </div>

          <div className="admin-stat-card">
            <h3>Cours</h3>
            <p>0</p>
          </div>

          <div className="admin-stat-card">
            <h3>Examens</h3>
            <p>0</p>
          </div>

          <div className="admin-stat-card">
            <h3>Questions</h3>
            <p>0</p>
          </div>
        </div>

        <div className="admin-card">
          <h2>Accès rapides</h2>

          <div className="admin-quick-links">
            <Link to="/admin/students">
              Étudiants
            </Link>

            <Link to="/admin/courses">
              Cours
            </Link>

            <Link to="/admin/exams">
              Examens
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;