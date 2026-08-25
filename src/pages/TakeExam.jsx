import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TakeExam.css"; // Assurez-vous de créer ce fichier CSS pour le style
const TakeExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const exam = {
    id: 1,
    title: "Examen Java & Spring Boot",
    questions: [
      {
        id: 1,
        text: "Quelle annotation permet de définir une classe comme un service Spring ?",
        options: ["@Repository", "@Service", "@Controller", "@Entity"],
        correctAnswer: "@Service",
      },
      {
        id: 2,
        text: "Quel est le rôle du fichier application.properties ?",
        options: [
          "Définir les dépendances Maven",
          "Configurer l'application et la BDD",
          "Écrire le code HTML",
          "Gérer les routes React",
        ],
        correctAnswer: "Configurer l'application et la BDD",
      },
    ],
  };

  const [answers, setAnswers] = useState({});

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = (e) => {
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

    // 1. Enregistrement local
    const existingResults = JSON.parse(
      localStorage.getItem("student_results") || "[]"
    );
    localStorage.setItem(
      "student_results",
      JSON.stringify([newResult, ...existingResults])
    );

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