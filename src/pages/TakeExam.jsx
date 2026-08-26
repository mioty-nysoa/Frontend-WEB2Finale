import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TakeExam.css"; // Assurez-vous de créer ce fichier CSS pour le style
const TakeExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [exam, setExam] = useState({
    id: parseInt(id) || 1,
    title: "",
    questions: [],
  });
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Récupération du sujet d'examen depuis l'API
    fetchExamById(id)
      .then((data) => {
        if (data) setExam(data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération de l'examen :", err);
      });
  }, [id]);

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    let score = 0;

    const processedQuestions = exam.questions.map((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) {
        score += 1;
      }

      return {
        id: q.id,
        text: q.text,
        userAnswer: userAnswer || "Non répondue",
        isCorrect: isCorrect,
      };
    });

    const newResult = {
      id: Date.now(),
      examId: parseInt(id) || exam.id,
      examTitle: exam.title,
      score: score,
      totalQuestions: exam.questions.length,
      questions: processedQuestions,
      date: new Date().toLocaleDateString("fr-FR"),
    };

    try {
      await submitExam({
        examId: parseInt(id) || exam.id,
        answers: answers,
      });
    } catch (err) {
      console.error("Erreur de sauvegarde sur le serveur :", err);
    }

    // 2. Navigation vers la page des résultats
    navigate("/student/results", { state: newResult });
  };

  return (
    <div className="take-exam-container">
      <h2>{exam.title}</h2>
      
      <form onSubmit={handleSubmit}>
        {exam.questions.map((question) => (
          <div key={question.id} className="question-card">
            <h3>{question.text}</h3>
            <div className="options-list">
              {question.options.map((option, i) => (
                <label key={i} className="option-label">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleSelectOption(question.id, option)}
                  />
                  {option}
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