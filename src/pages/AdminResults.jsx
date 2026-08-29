import { useEffect, useState } from "react";
import { fetchAdminExams, fetchExamResults } from "../services/Api";
import "./Admin.css";

function AdminResults() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [results, setResults] = useState([]);

  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoadingExams(true);
        setError("");

        const data = await fetchAdminExams();

        setExams(
          Array.isArray(data)
            ? data
            : data?.exams || []
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingExams(false);
      }
    };

    loadExams();
  }, []);

  const loadResults = async (examId) => {
    if (!examId) {
      setResults([]);
      return;
    }

    try {
      setLoadingResults(true);
      setError("");

      const data = await fetchExamResults(examId);
console.log("Données résultats :", data);
      setResults(
        Array.isArray(data)
          ? data
          : data?.results || []
      );
    } catch (err) {
      setResults([]);
      setError(err.message);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleExamChange = (event) => {
    const examId = event.target.value;

    setSelectedExam(examId);
    setError("");
    loadResults(examId);
  };

 const getStudentDisplay = (res, index) => {
  
  if (res.student_name || res.studentName || res.user_name || res.student?.name) {
    return res.student_name || res.studentName || res.user_name || res.student?.name;
  }

   if (res.student_number || res.studentNumber) {
    return res.student_number || res.studentNumber;
  }
  
  const formattedIndex = String(index + 1).padStart(4, '0');
  return `STD${formattedIndex}`;
};
  
  const getScoreDisplay = (res) => {
    // Ajout de score_obtained, note, points, correct_answers...
    const scoreVal = res.score ?? res.score_obtained ?? res.note ?? res.points ?? res.correct_answers ?? res.user_score;
    return scoreVal !== undefined && scoreVal !== null && scoreVal !== ""
      ? Number(scoreVal).toFixed(2)
      : "0.00";
  };

  const getTotalDisplay = (res) => {
    const totalVal = res.total ?? res.total_score ?? res.total_questions ?? res.max_score ?? res.questions_count;
    return totalVal !== undefined && totalVal !== null ? totalVal : "1";
  };
  
  const getAttemptsDisplay = (res) => {
    return (
      res.attempts ??
      res.attempt_count ??
      res.tentatives ??
      res.attempts_count ??
      "1"
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Résultats des examens</h1>
            <p>Consultez les résultats des étudiants.</p>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-card">
          <h2>Sélectionner un examen</h2>

          <div className="form-group">
            <label htmlFor="exam">Examen</label>

            {loadingExams ? (
              <div className="admin-loading">Chargement des examens...</div>
            ) : (
              <select
                id="exam"
                value={selectedExam}
                onChange={handleExamChange}
              >
                <option value="">Sélectionner un examen</option>

                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title || exam.name || `Examen ${exam.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {selectedExam && (
          <div className="admin-card">
            <h2>Résultats des étudiants</h2>

            {loadingResults ? (
              <div className="admin-loading">Chargement des résultats...</div>
            ) : results.length === 0 ? (
              <p>Aucun résultat disponible pour cet examen.</p>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Étudiant</th>
                      <th>Note</th>
                      <th>Total</th>
                      <th>Tentatives</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((result, index) => (
                      <tr key={result.id || result.student_id || result.studentId || index}>
                        <td>{getStudentDisplay(result,index)}</td>
                        <td>{getScoreDisplay(result)}</td>
                        <td>{getTotalDisplay(result)}</td>
                        <td>{getAttemptsDisplay(result)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminResults;