import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
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
          "Une erreur est survenue lors de la requête."
      );
    }

    return data;
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await request("/api/courses");

      setCourses(
        Array.isArray(data) ? data : data?.courses || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      await request("/api/courses", {
        method: "POST",
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          description: form.description,
        }),
      });

      setSuccess("Cours créé avec succès.");

      setForm({
        code: "",
        name: "",
        description: "",
      });

      await loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <h1>Gestion des cours</h1>
            <p>Créer et consulter les cours.</p>
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
          <h2>Créer un cours</h2>

          <form
            className="admin-form"
            onSubmit={handleCreate}
          >
            <div className="form-group">
              <label htmlFor="code">
                Code du cours
              </label>

              <input
                id="code"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="PROG2"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">
                Nom du cours
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
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

            <button
              className="btn btn-primary"
              type="submit"
            >
              Créer le cours
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Liste des cours</h2>

          {loading ? (
            <div className="admin-loading">
              Chargement des cours...
            </div>
          ) : courses.length === 0 ? (
            <div className="admin-loading">
              Aucun cours disponible.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Nom</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.code || "-"}</td>
                      <td>{course.name || "-"}</td>
                      <td>
                        {course.description || "-"}
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

export default AdminCourses;