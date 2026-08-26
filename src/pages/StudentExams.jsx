import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { fetchExams } from "../services/Api";
import "./StudentExams.css"; 

const StudentExams = () => {
  const navigate = useNavigate();
  const [allExams, setAllExams] = useState([]);
  const [savedResults, setSavedResults] = useState([]);

  useEffect(() => {
    Promise.all([fetchExams(), fetchStudentResults()])
      .then(([examsData, resultsData]) => {
        setAllExams(examsData || []);
        setSavedResults(resultsData || []);
      })
      .catch((err) => {
        console.error("Erreur de chargement des données :", err);
      });
  }, []);

  const completedExamIds = savedResults.map((result) => result.examId);
  const currentDate = new Date();

  const availableExams = allExams.filter((exam) => {
    const notTaken = !completedExamIds.includes(exam.id);

    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    const isInRange = currentDate >= startDate && currentDate <= endDate;

    return notTaken && isInRange;
  });

  const handleStartExam = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  return (
    <div className="exams-container">
      <h2>Examens Disponibles</h2>

      <div className="exams-grid">
        {availableExams.length > 0 ? (
          availableExams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <h3>{exam.title}</h3>
              <p><strong>Cours :</strong> {exam.course}</p>
              <p><strong>Durée :</strong> {exam.duration}</p>
              <p>
                <strong>Disponible jusqu'au :</strong>{" "}
                {new Date(exam.endDate).toLocaleDateString("fr-FR")}
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