import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentExams.css"; 

const StudentExams = () => {
  const navigate = useNavigate();

  const allExams = [
    {
      id: 1,
      title: "Examen Java & Spring Boot",
      course: "PROG2",
      duration: "30 min",
      startDate: "2026-08-01T08:00:00",
      endDate: "2026-08-31T23:59:59",
    },
    {
      id: 2,
      title: "Réseaux & Protocoles DHCP",
      course: "SYS2",
      duration: "45 min",
      startDate: "2026-08-10T08:00:00",
      endDate: "2026-08-20T18:00:00", // Examen expiré
    },
    {
      id: 3,
      title: "Systèmes Linux & Bash",
      course: "SYS2",
      duration: "60 min",
      startDate: "2026-09-01T08:00:00", // Examen pas encore commencé
      endDate: "2026-09-05T18:00:00",
    },
  ];

  // 1. Récupération des examens déjà passés depuis le localStorage
  const savedResults = JSON.parse(
    localStorage.getItem("student_results") || "[]"
  );
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