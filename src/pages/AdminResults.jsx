import { useEffect, useState } from "react";
import "./Admin.css";
import { fetchAdminExams, fetchExamResults } from "../services/Api";

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

        setExams(Array.isArray(data) ? data : data.exams || []);
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

      setResults(Array.isArray(data) ? data : data.results || []);
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
              <select id="exam" value={selectedExam} onChange={handleExamChange}>
                <option value="">Sélectionner un examen</option>

                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title || exam.name}
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
                      <tr key={result.id || index}>
                        <td>{result.student_name || "-"}</td>

                        <td>{result.score ?? "-"}</td>

                        <td>{result.total_points ?? "-"}</td>

                        <td>1</td>
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