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
    async function loadData() {
      try {
        const examsData = await fetchMyExams();
        console.log("Examens reçus depuis l'API :", examsData); 
        setAllExams(examsData || []);
      } catch (err) {
        console.error("Erreur chargement examens :", err);
      }

       try {
        const resultsData = await fetchMyResults();
        setSavedResults(Array.isArray(resultsData) ? resultsData : []);
      } catch (err) {
        console.warn("Aucun résultat préalable ou erreur serveur sur les résultats :", err);
        setSavedResults([]); 
       } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // OpenAPI utilise exam_id en snake_case dans les résultats
  const completedExamIds = savedResults.map((result) => result.exam_id);
  
  const availableExams = allExams.filter((exam) => {
    const notTaken = !completedExamIds.includes(exam.id);
    if (!notTaken) return false;
    // Si start_date ou end_date sont absentes, on autorise l'affichage par sécurité
    if (!exam.start_date || !exam.end_date) return true;
    
    const currentDate = new Date();
    const startDate = new Date(exam.start_date);
    const endDate = new Date(exam.end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return true;
    return currentDate >= startDate && currentDate <= endDate;

  });

  const handleStartExam = (examId) => {
    navigate(`/student/exams/${examId}`);
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
              <p><strong>Cours :</strong> {exam.course_name || exam.course?.name || exam.title || "Non spécifié"}</p>
              <p><strong>Durée :</strong>{exam.duration
               ? `${exam.duration} min`
               : exam.start_date && exam.end_date
               ? `${Math.round(
                  (new Date(exam.end_date) - new Date(exam.start_date)) / (1000 * 60)
                 )} min`
                 : "Non définie"}
              </p>
              <p>
                <strong>Disponible jusqu'au :</strong>{" "}
                {new Date(exam.end_date).toLocaleDateString("fr-FR")}
              </p>
              <button
                type="button"
                className="start-btn"
                onClick={(e) => {
                  e.preventDefault(); 
                  handleStartExam(exam.id);
                }}
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