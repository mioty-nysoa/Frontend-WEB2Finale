import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMyResults } from "../services/Api";
import "./Student.css";  

const StudentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Résultat renvoyé immédiatement par POST /my/exams/{id}/submit
  const recentSubmission = location.state;

  const [savedResults, setSavedResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Règle : Récupération sécurisée de l'historique via le Token JWT
    fetchMyResults()
      .then((data) => {
        setSavedResults(data || []);
      })
      .catch((err) => {
        console.error("Erreur de chargement de l'historique :", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="results-container">
      <h2>Mes Résultats</h2>

      {/* RÈGLE : Affichage de la copie corrigée après soumission */}
      {recentSubmission && (
        <div className="exam-result-card">
          <h3>Examen : {recentSubmission.exam_title || "Résultat de votre examen"}</h3>
          
          <div className="score-summary">
            <strong>Note finale : </strong>
            <span>
              {recentSubmission.score} / {recentSubmission.total_points}
            </span>
          </div>

          <h4>Détail de votre copie :</h4>
          <div className="questions-list">
            {recentSubmission.correction?.map((item, index) => (
              <div key={item.question_id || index} className="question-result-item">
                <p>
                  <strong>Q{index + 1} :</strong> {item.question_statement}
                </p>
                <p>
                  <strong>Votre réponse :</strong>{" "}
                  <span className={item.is_correct ? "text-success" : "text-danger"}>
                    {item.student_choice_text || "Non répondue (0 pt)"}
                  </span>
                </p>

                {/* RÈGLE : Si la réponse est fausse, on affiche la bonne réponse */}
                {!item.is_correct && item.correct_choice_text && (
                  <p className="correct-answer">
                    <strong>Bonne réponse :</strong> {item.correct_choice_text}
                  </p>
                )}

                <p>
                  <strong>Points : </strong>
                  <span>
                    {item.points_earned} / {item.max_points || 1}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RÈGLE : Consultation du tableau de l'historique */}
      <div className="history-section">
        <h3>Historique des examens passés</h3>
        {loading ? (
          <p>Chargement de l'historique...</p>
        ) : savedResults.length > 0 ? (
          <table className="results-table">
            <thead>
              <tr>
                <th>Examen</th>
                <th>Date de passage</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {savedResults.map((res) => (
                <tr key={res.id}>
                  <td>{res.exam_title}</td>
                  <td>
                    {res.submitted_at
                      ? new Date(res.submitted_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td>
                    <strong>
                      {Number(res.score || 0).toFixed(2)} / {res.totalQuestions || res.total_questions || 20}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun examen passé pour le moment.</p>
        )}
      </div>

      <button onClick={() => navigate("/student/exams")}>
        Retour aux examens
      </button>
    </div>
  );
};

export default StudentResults;