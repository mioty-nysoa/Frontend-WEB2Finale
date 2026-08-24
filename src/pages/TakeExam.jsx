import React,{useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";

const TakeExam = () => {
    const navigate = useNavigate();

    const exam = {
    title: "Examen Java & Spring Boot",
    questions: [
      {
        id: 1,
        text: "Quelle annotation permet de définir une classe comme un service Spring ?",
        options: ["@Repository", "@Service", "@Controller", "@Entity"],
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
      },
    ],
  };
    const [answers,setAnswers] = useState({});
    const [isSubmitted,setIsSubmitted] = useState(false);

    const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };
    const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setIsSubmitted(true); // Active l'affichage du message de succès
    };

        if (isSubmitted) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>🎉 Examen soumis avec succès !</h2>
        <p>Voici les réponses enregistrées :</p>
        <pre style={{ background: "#f1f5f9", padding: "15px", borderRadius: "8px" }}>
          {JSON.stringify(answers, null, 2)}
        </pre>
        <button onClick={() => setIsSubmitted(false)}>Recommencer le test</button>
      </div>
    );
  }

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
                    <button className="submit-btn" onClick={()=> setIsSubmitted(true)}>
                        ENVOYER
                    </button>
                </div>
                </form>
            </div>
        )
}
export default TakeExam;