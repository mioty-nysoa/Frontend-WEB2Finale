import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Admin.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function AdminQuestions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    text: "",
    points: 1,
    choices: [
      {
        text: "",
        correct: true,
      },
      {
        text: "",
        correct: false,
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // TOKEN JWT
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // REQUÊTE API
  // =========================

  const request = async (url, options = {}) => {
    const token = getToken();

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    });

    const data =
      response.status === 204
        ? null
        : await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "Une erreur est survenue."
      );
    }

    return data;
  };

  // =========================
  // CHARGER L'EXAMEN
  // =========================

  const loadExam = async () => {
    try {
      const data = await request(
        `/api/exams/${id}`
      );

      setExam(data?.exam || data);
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // CHARGER LES QUESTIONS
  // =========================

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await request(
        `/api/exams/${id}/questions`
      );

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

  // =========================
  // CHARGEMENT INITIAL
  // =========================

  useEffect(() => {
    if (!id) {
      setError(
        "Identifiant de l'examen manquant."
      );
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

  // =========================
  // MODIFIER L'ÉNONCÉ
  // =========================

  const handleTextChange = (event) => {
    setForm({
      ...form,
      text: event.target.value,
    });

    setError("");
    setSuccess("");
  };

  // =========================
  // MODIFIER LES POINTS
  // =========================

  const handlePointsChange = (event) => {
    setForm({
      ...form,
      points: event.target.value,
    });

    setError("");
    setSuccess("");
  };

  // =========================
  // MODIFIER UN CHOIX
  // =========================

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

  // =========================
  // CHOISIR LA BONNE RÉPONSE
  // =========================

  const handleCorrectChoice = (index) => {
    const updatedChoices = form.choices.map(
      (choice, choiceIndex) => ({
        ...choice,
        correct: choiceIndex === index,
      })
    );

    setForm({
      ...form,
      choices: updatedChoices,
    });

    setError("");
  };

  // =========================
  // AJOUTER UN CHOIX
  // =========================

  const addChoice = () => {
    if (form.choices.length >= 6) {
      setError(
        "Une question ne peut pas avoir plus de 6 choix."
      );
      return;
    }

    setForm({
      ...form,
      choices: [
        ...form.choices,
        {
          text: "",
          correct: false,
        },
      ],
    });

    setError("");
  };

  // =========================
  // SUPPRIMER UN CHOIX
  // =========================

  const removeChoice = (index) => {
    if (form.choices.length <= 2) {
      setError(
        "Une question doit avoir au moins 2 choix."
      );
      return;
    }

    const removedChoice = form.choices[index];

    const updatedChoices = form.choices.filter(
      (_, choiceIndex) =>
        choiceIndex !== index
    );

    // Si on supprime la bonne réponse,
    // le premier choix devient correct.
    if (removedChoice.correct) {
      updatedChoices.forEach(
        (choice, choiceIndex) => {
          choice.correct =
            choiceIndex === 0;
        }
      );
    }

    setForm({
      ...form,
      choices: updatedChoices,
    });

    setError("");
  };

  // =========================
  // CRÉER UNE QUESTION
  // =========================

  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.text.trim()) {
      setError(
        "L'énoncé de la question est obligatoire."
      );
      return;
    }

    const points = Number(form.points);

    if (
      !Number.isInteger(points) ||
      points < 1
    ) {
      setError(
        "Le nombre de points doit être un entier supérieur ou égal à 1."
      );
      return;
    }

    if (
      form.choices.length < 2 ||
      form.choices.length > 6
    ) {
      setError(
        "Une question doit avoir entre 2 et 6 choix."
      );
      return;
    }

    if (
      form.choices.some(
        (choice) => !choice.text.trim()
      )
    ) {
      setError(
        "Tous les choix doivent être remplis."
      );
      return;
    }

    const correctChoices =
      form.choices.filter(
        (choice) => choice.correct
      );

    if (correctChoices.length !== 1) {
      setError(
        "Une question doit avoir exactement une bonne réponse."
      );
      return;
    }

    try {
      setCreating(true);

      await request(
        `/api/exams/${id}/questions`,
        {
          method: "POST",
          body: JSON.stringify({
            text: form.text.trim(),
            points,
            choices: form.choices.map(
              (choice) => ({
                text: choice.text.trim(),
                correct: choice.correct,
              })
            ),
          }),
        }
      );

      setSuccess(
        "Question créée avec succès."
      );

      // Réinitialiser le formulaire
      setForm({
        text: "",
        points: 1,
        choices: [
          {
            text: "",
            correct: true,
          },
          {
            text: "",
            correct: false,
          },
        ],
      });

      // Recharger les questions depuis le backend
      await loadQuestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // SUPPRIMER UNE QUESTION
  // =========================

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

      await request(
        `/api/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        "Question supprimée avec succès."
      );

      await loadQuestions();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-header">
          <div>
            <h1>Gestion des questions</h1>

            <p>
              Créez et gérez les questions de
              l'examen.
            </p>
          </div>
        </div>

        {/* =========================
            MESSAGES
        ========================= */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-success">
            {success}
          </div>
        )}

        {/* =========================
            INFORMATIONS EXAMEN
        ========================= */}

        <div className="admin-card">
          <h2>Examen</h2>

          {loading ? (
            <p>
              Chargement de l'examen...
            </p>
          ) : exam ? (
            <>
              <h3>
                {exam.title ||
                  exam.name ||
                  `Examen ${id}`}
              </h3>

              {exam.description && (
                <p>
                  {exam.description}
                </p>
              )}
            </>
          ) : (
            <p>
              Impossible de charger
              l'examen.
            </p>
          )}
        </div>

        {/* =========================
            CREER QUESTION
        ========================= */}

        <div className="admin-card">
          <h2>Créer une question</h2>

          <form
            className="admin-form"
            onSubmit={handleCreate}
          >

            {/* ÉNONCÉ */}

            <div className="form-group">
              <label htmlFor="question">
                Énoncé de la question
              </label>

              <textarea
                id="question"
                value={form.text}
                onChange={handleTextChange}
                placeholder="Saisissez la question..."
                required
              />
            </div>

            {/* POINTS */}

            <div className="form-group">
              <label htmlFor="points">
                Nombre de points
              </label>

              <input
                id="points"
                type="number"
                min="1"
                value={form.points}
                onChange={handlePointsChange}
                required
              />
            </div>

            {/* CHOIX */}

            <div className="form-group">
              <label>
                <strong>
                  Réponses
                </strong>
              </label>

              <p>
                Sélectionnez une seule
                bonne réponse.
              </p>

              {form.choices.map(
                (choice, index) => (
                  <div
                    className="choice-row"
                    key={index}
                  >

                    {/* RADIO */}

                    <input
                      type="radio"
                      name="correctChoice"
                      checked={
                        choice.correct
                      }
                      onChange={() =>
                        handleCorrectChoice(
                          index
                        )
                      }
                    />

                    {/* TEXTE */}

                    <input
                      type="text"
                      value={choice.text}
                      placeholder={`Choix ${
                        index + 1
                      }`}
                      onChange={(event) =>
                        handleChoiceChange(
                          index,
                          event.target.value
                        )
                      }
                      required
                    />

                    {/* SUPPRIMER */}

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        removeChoice(index)
                      }
                    >
                      Supprimer
                    </button>

                  </div>
                )
              )}
            </div>

            {/* ACTIONS */}

            <div className="admin-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={addChoice}
                disabled={
                  form.choices.length >= 6
                }
              >
                Ajouter un choix
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={creating}
              >
                {creating
                  ? "Création..."
                  : "Créer la question"}
              </button>

            </div>
          </form>
        </div>

        {/* =========================
            QUESTIONS EXISTANTES
        ========================= */}

        <div className="admin-card">
          <h2>
            Questions existantes
          </h2>

          {loading ? (
            <div className="admin-loading">
              Chargement des questions...
            </div>
          ) : questions.length === 0 ? (
            <p>
              Aucune question pour cet
              examen.
            </p>
          ) : (
            questions.map(
              (question, index) => (
                <div
                  className="question-card"
                  key={question.id}
                >

                  <h3>
                    Question {index + 1}
                  </h3>

                  <strong>
                    {question.text ||
                      question.statement ||
                      question.question}
                  </strong>

                  <p>
                    Points :{" "}
                    {question.points ?? 1}
                  </p>

                  <div>
                    {question.choices?.map(
                      (choice) => (
                        <div
                          key={choice.id}
                        >
                          {choice.correct
                            ? "✓ "
                            : "○ "}
                          {choice.text}
                        </div>
                      )
                    )}
                  </div>

                  <div className="admin-actions">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        handleDelete(
                          question.id
                        )
                      }
                    >
                      Supprimer
                    </button>
                  </div>

                </div>
              )
            )
          )}
        </div>

        {/* =========================
            RETOUR
        ========================= */}

        <div className="admin-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate("/admin/exams")
            }
          >
            Retour aux examens
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminQuestions;