import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMyExamById, submitExam } from "../services/Api";
import "./Student.css";

const TakeExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!id) return;
  fetchMyExamById(id)
      .then((data) => {
        if (data) setExam(data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération de l'examen :", err);
        setError("Impossible de charger l'examen.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSelectOption = (questionId, choiceId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const formattedAnswers = Object.entries(answers).map(([questionId, choiceId]) => ({
      question_id: parseInt(questionId, 10),
      choice_id: parseInt(choiceId, 10),
    }));

    try {
     const resultData = await submitExam(id, formattedAnswers);

      navigate("/student/results", { state: resultData });
    } catch (err) {
      console.error("Erreur de sauvegarde sur le serveur :", err);
      alert(err.message || "Erreur lors de la soumission de l'examen.");
    }
  };

  if (loading) return <div className="take-exam-container"><p>Chargement de l'examen...</p></div>;
  if (error) return <div className="take-exam-container"><p>{error}</p></div>;
  if (!exam) return null;
  return (
    <div className="take-exam-container">
      <h2>{exam.title}</h2>
      
      <form onSubmit={handleSubmit}>
        {exam.questions?.map((question) => (
          <div key={question.id} className="question-card">
            <h3>{question.statement}</h3>
            <div className="options-list">
              {question.choices?.map((choice) => (
                <label key={i} className="option-label">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={choice.id}
                    checked={answers[question.id] === choice.id}
                    onChange={() => handleSelectOption(question.id, choice.id)}
                  />
                  {choice.text}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="exam-actions">
          <button type="submit" className="submit-btn">
            ENVOYER
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeExam;