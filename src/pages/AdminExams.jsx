import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function AdminExams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    courseId: "",
  });

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

    let data = null;

    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "Une erreur est survenue."
      );
    }

    return data;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [examData, courseData] = await Promise.all([
        request("/api/exams"),
        request("/api/courses"),
      ]);

      setExams(
        Array.isArray(examData)
          ? examData
          : examData?.exams || []
      );

      setCourses(
        Array.isArray(courseData)
          ? courseData
          : courseData?.courses || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setError(
        "La date de début doit être antérieure à la date de fin."
      );
      return;
    }

    try {
      await request("/api/exams", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          startDate: form.startDate,
          endDate: form.endDate,
          courseId: Number(form.courseId),
        }),
      });

      setSuccess("Examen créé avec succès.");

      setForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        courseId: "",
      });

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Gestion des examens</h1>
            <p>
              Créez et gérez les examens et leurs périodes de
              disponibilité.
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
          <h2>Créer un examen</h2>

          <form
            className="admin-form"
            onSubmit={handleCreate}
          >
            <div className="form-group">
              <label htmlFor="title">
                Titre de l'examen
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseId">
                Cours
              </label>

              <select
                id="courseId"
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Sélectionner un cours
                </option>

                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">
                Date et heure de début
              </label>

              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                Date et heure de fin
              </label>

              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-actions">
              <button
                className="btn btn-primary"
                type="submit"
              >
                Créer l'examen
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <h2>Liste des examens</h2>

          {loading ? (
            <div className="admin-loading">
              Chargement des examens...
            </div>
          ) : exams.length === 0 ? (
            <div>
              Aucun examen disponible.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Cours</th>
                    <th>Début</th>
                    <th>Fin</th>
                  </tr>
                </thead>

                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id}>
                      <td>{exam.id}</td>

                      <td>
                        {exam.title || "-"}
                      </td>

                      <td>
                        {exam.course?.name ||
                          exam.course?.code ||
                          exam.courseName ||
                          exam.courseId ||
                          "-"}
                      </td>

                      <td>
                        {exam.startDate || "-"}
                      </td>

                      <td>
                        {exam.endDate || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminExams;