import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  fetchAdminExams, 
  fetchExamQuestions, 
  createQuestion, 
  deleteQuestion 
} from "../services/Api";
import "./Admin.css";

function AdminQuestions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    text: "",
    points: 1,
    choices: [
      { text: "", correct: true },
      { text: "", correct: false },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadExam = async () => {
    try {
      const exams = await fetchAdminExams();
      const list = Array.isArray(exams) ? exams : exams?.exams || [];
      const currentExam = list.find((e) => String(e.id) === String(id));
      setExam(currentExam || null);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchExamQuestions(id);

      setQuestions(
        Array.isArray(data)
          ? data
          : data?.questions || []
      );
    } catch (err) {
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Identifiant de l'examen manquant.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      await Promise.all([
        loadExam(),
        loadQuestions(),
      ]);
    };

    loadData();
  }, [id]);

  const handleTextChange = (event) => {
    setForm({
      ...form,
      text: event.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handlePointsChange = (event) => {
    setForm({
      ...form,
      points: event.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...form.choices];
    updatedChoices[index] = {
      ...updatedChoices[index],
      text: value,
    };

    setForm({
      ...form,
      choices: updatedChoices,
    });
    setError("");
    setSuccess("");
  };

  const handleCorrectChoice = (index) => {
    const updatedChoices = form.choices.map((choice, choiceIndex) => ({
      ...choice,
      correct: choiceIndex === index,
    }));

    setForm({
      ...form,
      choices: updatedChoices,
    });
    setError("");
  };

  const addChoice = () => {
    if (form.choices.length >= 6) {
      setError("Une question ne peut pas avoir plus de 6 choix.");
      return;
    }

    setForm({
      ...form,
      choices: [
        ...form.choices,
        { text: "", correct: false },
      ],
    });
    setError("");
  };

  const removeChoice = (index) => {
    if (form.choices.length <= 2) {
      setError("Une question doit avoir au moins 2 choix.");
      return;
    }

    const removedChoice = form.choices[index];
    const updatedChoices = form.choices.filter(
      (_, choiceIndex) => choiceIndex !== index
    );

    if (removedChoice.correct) {
      updatedChoices.forEach((choice, choiceIndex) => {
        choice.correct = choiceIndex === 0;
      });
    }

    setForm({
      ...form,
      choices: updatedChoices,
    });
    setError("");
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.text.trim()) {
      setError("L'énoncé de la question est obligatoire.");
      return;
    }

    const points = Number(form.points);
    if (!Number.isInteger(points) || points < 1) {
      setError("Le nombre de points doit être un entier supérieur ou égal à 1.");
      return;
    }

    if (form.choices.length < 2 || form.choices.length > 6) {
      setError("Une question doit avoir entre 2 et 6 choix.");
      return;
    }

    if (form.choices.some((choice) => !choice.text.trim())) {
      setError("Tous les choix doivent être remplis.");
      return;
    }

    const correctChoices = form.choices.filter((choice) => choice.correct);
    if (correctChoices.length !== 1) {
      setError("Une question doit avoir exactement une bonne réponse.");
      return;
    }

    try {
      setCreating(true);

      await createQuestion(id, {
        text: form.text.trim(),
        points,
        choices: form.choices.map((choice) => ({
          text: choice.text.trim(),
          is_correct: Boolean(choice.correct), 
          isCorrect: Boolean(choice.correct),  
          correct: Boolean(choice.correct),
        })),
      });

      setSuccess("Question créée avec succès.");

      setForm({
        text: "",
        points: 1,
        choices: [
          { text: "", correct: true },
          { text: "", correct: false },
        ],
      });

      await loadQuestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (questionId) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette question ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteQuestion(id, questionId);

      setSuccess("Question supprimée avec succès.");
      await loadQuestions();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <h1>Gestion des questions</h1>
            <p>Créez et gérez les questions de l'examen.</p>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        <div className="admin-card">
          <h2>Examen</h2>
          {loading ? (
            <p>Chargement de l'examen...</p>
          ) : exam ? (
            <>
              <h3>{exam.title || exam.name || `Examen ${id}`}</h3>
              {exam.description && <p>{exam.description}</p>}
            </>
          ) : (
            <p>Impossible de charger l'examen.</p>
          )}
        </div>

        <div className="admin-card">
          <h2>Créer une question</h2>

          <form className="admin-form" onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="question">Énoncé de la question</label>
              <textarea
                id="question"
                value={form.text}
                onChange={handleTextChange}
                placeholder="Saisissez la question..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="points">Nombre de points</label>
              <input
                id="points"
                type="number"
                min="1"
                value={form.points}
                onChange={handlePointsChange}
                required
              />
            </div>

            <div className="form-group">
              <label><strong>Réponses</strong></label>
              <p>Sélectionnez une seule bonne réponse.</p>

              {form.choices.map((choice, index) => (
                <div className="choice-row" key={index}>
                  <input
                    type="radio"
                    name="correctChoice"
                    checked={choice.correct}
                    onChange={() => handleCorrectChoice(index)}
                  />

                  <input
                    type="text"
                    value={choice.text}
                    placeholder={`Choix ${index + 1}`}
                    onChange={(event) =>
                      handleChoiceChange(index, event.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeChoice(index)}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>

            <div className="admin-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addChoice}
                disabled={form.choices.length >= 6}
              >
                Ajouter un choix
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={creating}
              >
                {creating ? "Création..." : "Créer la question"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <h2>Questions existantes</h2>

          {loading ? (
            <div className="admin-loading">Chargement des questions...</div>
          ) : questions.length === 0 ? (
            <p>Aucune question pour cet examen.</p>
          ) : (
            questions.map((question, index) => (
              <div className="question-card" key={question.id}>
                <h3>Question {index + 1}</h3>
                <strong>
                  {question.text || question.statement || question.question}
                </strong>
                <p>Points : {question.points ?? 1}</p>

                <div>
                  {question.choices?.map((choice) => (
                    <div key={choice.id}>
                      {choice.correct ? "✓ " : "○ "}
                      {choice.text}
                    </div>
                  ))}
                </div>

                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(question.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="admin-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/exams")}
          >
            Retour aux examens
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminQuestions;