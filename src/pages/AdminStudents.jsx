import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

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

    if (!response.ok) {
      let message = "Une erreur est survenue.";

      try {
        const data = await response.json();
        message = data.message || data.error || message;
      } catch {
        // La réponse n'est pas au format JSON
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await request("/api/students");

      setStudents(
        Array.isArray(data) ? data : data.students || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      await request("/api/students", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess("Étudiant créé avec succès.");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleActivate = async (student) => {
    try {
      setError("");
      setSuccess("");

      await request(`/api/students/${student.id}`, {
        method: "PUT",
        body: JSON.stringify({
          active: true,
        }),
      });

      setSuccess("Étudiant activé avec succès.");
      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivate = async (student) => {
    try {
      setError("");
      setSuccess("");

      await request(`/api/students/${student.id}`, {
        method: "DELETE",
      });

      setSuccess("Étudiant désactivé avec succès.");
      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (student) => {
    const confirmed = window.confirm(
      `Réinitialiser le mot de passe de ${
        student.name || student.email
      } ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await request(`/api/students/${student.id}`, {
        method: "PUT",
        body: JSON.stringify({
          resetPassword: true,
        }),
      });

      setSuccess("Mot de passe réinitialisé avec succès.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <h1>Gestion des étudiants</h1>
            <p>Gérez les comptes et les accès des étudiants.</p>
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
          <h2>Créer un étudiant</h2>

          <form
            className="admin-form"
            onSubmit={handleCreate}
          >
            <div className="form-group">
              <label htmlFor="name">Nom</label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Mot de passe initial
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-actions">
              <button
                className="btn btn-primary"
                type="submit"
              >
                Créer l'étudiant
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <h2>Liste des étudiants</h2>

          {loading ? (
            <div className="admin-loading">
              Chargement des étudiants...
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>E-mail</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const active =
                      student.active ??
                      student.enabled ??
                      student.isActive ??
                      true;

                    return (
                      <tr key={student.id}>
                        <td>{student.id}</td>

                        <td>
                          {student.name ||
                            student.username ||
                            "-"}
                        </td>

                        <td>
                          {student.email || "-"}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              active
                                ? "badge-active"
                                : "badge-inactive"
                            }`}
                          >
                            {active
                              ? "Actif"
                              : "Désactivé"}
                          </span>
                        </td>

                        <td>
                          <div className="admin-actions">

                            {active ? (
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleDeactivate(student)
                                }
                              >
                                Désactiver
                              </button>
                            ) : (
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  handleActivate(student)
                                }
                              >
                                Activer
                              </button>
                            )}

                            <button
                              className="btn btn-warning"
                              onClick={() =>
                                handleResetPassword(student)
                              }
                            >
                              Réinitialiser le mot de passe
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminStudents;