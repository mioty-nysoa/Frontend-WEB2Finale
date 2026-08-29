import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminExams, fetchExamQuestions, submitExam } from "../services/Api";
import "./Student.css";

const TakeExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        setLoading(true);

        // 1. Informations de l'examen
        const examsList = await fetchAdminExams().catch(() => []);
        const currentExam = Array.isArray(examsList) 
          ? examsList.find((e) => e.id === id || e.exam_id === id) 
          : null;

        if (currentExam) {
          setExam(currentExam);
        }

        // 2. Questions de l'examen
        const fetchedQuestions = await fetchExamQuestions(id);
        const qList = Array.isArray(fetchedQuestions)
          ? fetchedQuestions
          : (fetchedQuestions?.data || []);

        setQuestions(qList);
      } catch (err) {
        console.error("Erreur de chargement :", err);
        setError("Impossible de charger l'examen.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSelectOption = (questionId, choiceId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  const formattedAnswers = Object.entries(answers).map(([qId, cId]) => ({
    question_id: qId,
    choice_id: cId,
    questionId: qId,
    choiceId: cId
  }));

  try {
    const resultData = await submitExam(id, { answers: formattedAnswers });
    navigate("/student/results", { state: resultData });
  } catch (err) {
    console.error("Erreur de soumission :", err);
    alert(err.message || "Erreur lors de la soumission de l'examen.");
  }
};

  if (loading) {
    return (
      <div className="take-exam-container">
        <p>Chargement de l'examen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="take-exam-container">
        <p>{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="take-exam-container" style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2>{exam?.title || "Examen"}</h2>
        <p style={{ margin: "20px 0", color: "#666" }}>
          Cet examen ne contient aucune question pour le moment.
        </p>
        <button
          type="button"
          className="submit-btn"
          onClick={() => navigate("/student/exams")}
        >
          RETOUR AUX EXAMENS
        </button>
      </div>
    );
  }

  return (
    <div className="take-exam-container">
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>{exam?.title || "Examen"}</h2>

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => {
          const questionText = question.text || question.statement || question.question;
          const optionsList = question.choices || question.options || [];

          return (
            <div key={question.id || index} className="question-card" style={{ marginBottom: "25px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
                {index + 1}. {questionText}
              </h3>
              
             <div className="options-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {optionsList.map((choice, cIdx) => {
                  // Récupère le véritable ID de la réponse (UUID ou int) depuis l'API
                  const choiceId = choice.id ?? choice.choice_id ?? choice.option_id ?? cIdx;
                  const choiceText = choice.text || choice.label || choice.statement || choice.text_content;

                  return (
                    <label 
                      key={choiceId} 
                      className="option-label"
                      style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={choiceId}
                        checked={answers[question.id] === choiceId}
                        onChange={() => handleSelectOption(question.id, choiceId)}
                      />
                      <span>{choiceText}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="exam-actions" style={{ textAlign: "center", marginTop: "30px" }}>
          <button type="submit" className="submit-btn">
            ENVOYER
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeExam;