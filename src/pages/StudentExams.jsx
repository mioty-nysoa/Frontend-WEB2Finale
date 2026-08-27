import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyExams, fetchMyResults } from "../services/Api";
import "./Student.css"; 

const StudentExams = () => {
  const navigate = useNavigate();
  const [allExams, setAllExams] = useState([]);
  const [savedResults, setSavedResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Plus besoin d'extraire user.id, le token JWT gère l'authentification dans l'en-tête
    Promise.all([fetchMyExams(), fetchMyResults()])
      .then(([examsData, resultsData]) => {
        setAllExams(examsData || []);
        setSavedResults(resultsData || []);
      })
      .catch((err) => {
        console.error("Erreur de chargement des données :", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // OpenAPI utilise exam_id en snake_case dans les résultats
  const completedExamIds = savedResults.map((result) => result.exam_id);
  const currentDate = new Date();

  const availableExams = allExams.filter((exam) => {
    const notTaken = !completedExamIds.includes(exam.id);

    // OpenAPI utilise start_date et end_date en snake_case
    const startDate = new Date(exam.start_date);
    const endDate = new Date(exam.end_date);
    const isInRange = currentDate >= startDate && currentDate <= endDate;

    return notTaken && isInRange;
  });

  const handleStartExam = (examId) => {
    // Redirection vers le passage d'examen
    navigate(`/student/exam/${examId}`);
  };

  if (loading) {
    return <div className="exams-container"><p>Chargement des examens...</p></div>;
  }
  return (
    <div className="exams-container">
      <h2>Examens Disponibles</h2>

      <div className="exams-grid">
        {availableExams.length > 0 ? (
          availableExams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <h3>{exam.title}</h3>
              <p><strong>Cours :</strong> {exam.course_name || exam.course?.name}</p>
              <p><strong>Durée :</strong> {exam.duration} min</p>
              <p>
                <strong>Disponible jusqu'au :</strong>{" "}
                {new Date(exam.end_date).toLocaleDateString("fr-FR")}
              </p>
              <button
                type="button"
                className="start-btn"
                onClick={() => handleStartExam(exam.id)}
              >
                COMMENCER L'EXAMEN
              </button>
            </div>
          ))
        ) : (
          <p>Aucun examen disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default StudentExams;