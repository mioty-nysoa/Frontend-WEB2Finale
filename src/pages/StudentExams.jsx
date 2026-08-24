import { useNavigate } from "react-router-dom";
import "./StudentExams.css";

const StudentExams = () => {
    const navigate = useNavigate();

   // Liste des examens avec dates de début et de fin
  const exams = [
    {
      id: 1,
      title: "Examen Java & Spring Boot",
      startDate: "24/08/2026 08:00",
      endDate: "24/08/2026 18:00",
      questionsCount: 10,
    },
    {
      id: 2,
      title: "QCM JavaScript & React",
      startDate: "25/08/2026 10:00",
      endDate: "26/08/2026 12:00",
      questionsCount: 15,
    },
  ];

    return (
        <div className="exams-container">
            <h2>Examens Disponnibles</h2>
            <div className="exams-grid">
                {exams.map((exam) => (
                  <div key={exam.id} className="exam-card">
                    <h3>{exam.title}</h3>
                    <p><strong>Début :</strong> {exam.startDate}</p>
                    <p> <strong>Fin :</strong> {exam.endDate}</p>
                    <p> <strong>Questions :</strong> {exam.questionsCount}</p>
                    <button onClick={() => navigate("/student/exam")}>
                     Commencer l'examen
                    </button>
                  </div>  
                ))}
            </div>
        </div>
    );
};
export default StudentExams;