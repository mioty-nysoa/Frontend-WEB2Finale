import React,{useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentResults.css";  
const StudentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const recentSubmission = location.state;

  const [savedResults, setSavedResults] = useState([]);

  useEffect(() => {
    fetchStudentResults()
      .then((data) => {
        setSavedResults(data || []);
      })
      .catch((err) => {
        console.error("Erreur de chargement de l'historique :", err);
      });
  }, []);

  return (
    <div className="results-container">
      <h2>Mes Résultats</h2>

      {/* RÉSULTAT DU TEST VENANT D'ÊTRE SOUMIS */}
      {recentSubmission && (
        <div className="exam-result-card">
          <h3>Examen terminé : {recentSubmission.examTitle}</h3>
          
          <div className="score-summary">
            <strong>Note finale : </strong>
            <span>
              {recentSubmission.score} / {recentSubmission.totalQuestions}
            </span>
          </div>

          <h4>Détail de votre copie :</h4>
          <div className="questions-list">
            {recentSubmission.questions.map((q, index) => (
              <div key={q.id || index} className="question-result-item">
                <p>
                  <strong>Q{index + 1} :</strong> {q.text}
                </p>
                <p>
                  <strong>Votre réponse :</strong> {q.userAnswer || "Non répondue"}
                </p>
                <p>
                  <strong>Note obtenue : </strong>
                  <span className={q.isCorrect ? "score-success" : "score-danger"}>
                    {q.isCorrect ? "1 / 1" : "0 / 1"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLEAU DE TOUS LES EXAMENS PASSÉS */}
      <div className="history-section">
        <h3>Historique des examens passés</h3>
        {savedResults.length > 0 ? (
          <table className="results-table">
            <thead>
              <tr>
                <th>Examen</th>
                <th>Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {savedResults.map((res) => (
                <tr key={res.id}>
                  <td>{res.examTitle}</td>
                  <td>{res.date}</td>
                  <td>
                    {res.score} / {res.totalQuestions}
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