import { useNavigate } from "react-router-dom";

function AdminExams() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Gestion des examens</h1>
            <p>
              Gérez les examens disponibles.
            </p>
          </div>
        </div>

        <div className="admin-card">
          <h2>Examens</h2>

          <p>
            Affichez ici la liste de vos examens.
          </p>

          <div className="admin-quick-links">
            <button
              onClick={() =>
                navigate("/admin/exams/1/questions")
              }
            >
              Questions
            </button>

            <button
              onClick={() =>
                navigate("/admin/exams/1/results")
              }
            >
              Résultats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminExams;