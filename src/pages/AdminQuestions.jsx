import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function AdminQuestions() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    text: "",
    points: 1,
    choices: [
      { text: "", correct: true },
      { text: "", correct: false },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => localStorage.getItem("token");

  const request = async (url, options = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        ...(options.headers || {}),
      },
    });

    const data =
      response.status === 204 ? null : await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "Une erreur est survenue."
      );
    }

    return data;
  };

  const loadExams = async () => {
    try {
      setError("");

      const data = await request("/api/exams");

      setExams(
        Array.isArray(data)
          ? data
          : data.exams || []
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const loadQuestions = async (examId) => {
    if (!examId) {
      setQuestions([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await request(
        `/api/exams/${examId}/questions`
      );

      setQuestions(
        Array.isArray(data)
          ? data
          : data.questions || []
      );
    } catch (err) {
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    loadQuestions(selectedExam);
  }, [selectedExam]);

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
  };

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
  };

  const addChoice = () => {
    if (form.choices.length >= 6) {
      setError(
        "Une question ne peut pas avoir plus de 6 choix."
      );
      return;
    }

    setError("");

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
  };

  const removeChoice = (index) => {
    if (form.choices.length <= 2) {
      setError(
        "Une question doit avoir au moins 2 choix."
      );
      return;
    }

    const removedChoice = form.choices[index];

    const updatedChoices = form.choices.filter(
      (_, choiceIndex) => choiceIndex !== index
    );

    if (removedChoice.correct) {
      updatedChoices.forEach(
        (choice, choiceIndex) => {
          choice.correct = choiceIndex === 0;
        }
      );
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

    if (!selectedExam) {
      setError(
        "Veuillez sélectionner un examen."
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

    const correctChoices = form.choices.filter(
      (choice) => choice.correct
    );

    if (correctChoices.length !== 1) {
      setError(
        "Une question doit avoir exactement une bonne réponse."
      );
      return;
    }

    if (
      form.choices.some(
        (choice) => choice.text.trim() === ""
      )
    ) {
      setError(
        "Tous les choix doivent être remplis."
      );
      return;
    }

    try {
      await request(
        `/api/exams/${selectedExam}/questions`,
        {
          method: "POST",
          body: JSON.stringify({
            text: form.text,
            points: Number(form.points),
            choices: form.choices,
          }),
        }
      );

      setSuccess(
        "Question créée avec succès."
      );

      setForm({
        text: "",
        points: 1,
        choices: [
          { text: "", correct: true },
          { text: "", correct: false },
        ],
      });

      await loadQuestions(selectedExam);
    } catch (err) {
      setError(err.message);
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

      await request(
        `/api/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        "Question supprimée avec succès."
      );

      await loadQuestions(selectedExam);
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
            <p>
              Créez et gérez les questions des examens.
            </p>
          </div>
        </div>

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

        <div className="admin-card">
          <h2>Sélectionner un examen</h2>

          <div className="form-group">
            <label htmlFor="exam">
              Examen
            </label>

            <select
              id="exam"
              value={selectedExam}
              onChange={(event) => {
                setSelectedExam(
                  event.target.value
                );
                setError("");
                setSuccess("");
              }}
            >
              <option value="">
                Sélectionner un examen
              </option>

              {exams.map((exam) => (
                <option
                  key={exam.id}
                  value={exam.id}
                >
                  {exam.title ||
                    exam.name ||
                    `Examen ${exam.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedExam && (
          <>
            <div className="admin-card">
              <h2>Créer une question</h2>

              <form
                className="admin-form"
                onSubmit={handleCreate}
              >
                <div className="form-group">
                  <label htmlFor="question">
                    Énoncé de la question
                  </label>

                  <textarea
                    id="question"
                    value={form.text}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        text: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="points">
                    Nombre de points
                  </label>

                  <input
                    id="points"
                    type="number"
                    min="1"
                    value={form.points}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        points:
                          event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <strong>
                      Choix de réponse
                    </strong>
                  </label>

                  {form.choices.map(
                    (choice, index) => (
                      <div
                        className="choice-row"
                        key={index}
                      >
                        <input
                          type="radio"
                          name="correctChoice"
                          checked={choice.correct}
                          onChange={() =>
                            handleCorrectChoice(
                              index
                            )
                          }
                        />

                        <input
                          type="text"
                          placeholder={`Choix ${
                            index + 1
                          }`}
                          value={choice.text}
                          onChange={(event) =>
                            handleChoiceChange(
                              index,
                              event.target.value
                            )
                          }
                          required
                        />

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
                  >
                    Créer la question
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h2>Questions existantes</h2>

              {loading ? (
                <div className="admin-loading">
                  Chargement des questions...
                </div>
              ) : questions.length === 0 ? (
                <p>
                  Aucune question pour cet examen.
                </p>
              ) : (
                questions.map((question) => (
                  <div
                    className="question-card"
                    key={question.id}
                  >
                    <strong>
                      {question.statement ||
                        question.text ||
                        question.question}
                    </strong>

                    <p>
                      Points :{" "}
                      {question.points ?? 1}
                    </p>

                    {question.choices?.map(
                      (choice) => (
                        <div
                          key={choice.id}
                        >
                          {choice.text}{" "}
                          {choice.correct &&
                            "✓"}
                        </div>
                      )
                    )}

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
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminQuestions;