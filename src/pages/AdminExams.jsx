import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  fetchAdminExams, 
  fetchCourses, 
  createExam 
} from "../services/Api";

function AdminExams() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadExams = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAdminExams();

      setExams(
        Array.isArray(data)
          ? data
          : data?.exams || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);

      const data = await fetchCourses();

      setCourses(
        Array.isArray(data)
          ? data
          : data?.courses || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadExams();
    loadCourses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  
  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Le titre de l'examen est obligatoire.");
      return;
    }

    if (!form.description.trim()) {
      setError("La description de l'examen est obligatoire.");
      return;
    }

    if (!form.courseId) {
      setError("Veuillez sélectionner un cours.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError("Veuillez renseigner les dates de début et de fin.");
      return;
    }

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setError("La date de fin doit être après la date de début.");
      return;
    }

    try {
      setLoading(true);

      await createExam({
        title: form.title,
        description: form.description,
        courseId: form.courseId,
        startDate: form.startDate,
        endDate: form.endDate,
        course_id: form.courseId,
        start_date: form.startDate,
        end_date: form.endDate,
      });

      setSuccess("Examen créé avec succès.");

      setForm({
        title: "",
        description: "",
        courseId: "",
        startDate: "",
        endDate: "",
      });

      await loadExams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCourseName = (exam) => {
    if (!exam) return "Cours non renseigné";
   
    if (exam.course_name || exam.courseName) {
      return exam.course_name || exam.courseName;
    }

   const targetCourseId = exam.courseId || exam.course_id;
    if (!targetCourseId) return "Cours non renseigné";

    const course = courses.find((c) => String(c.id) === String(targetCourseId));
    return course ? (course.name || course.title) : "Cours non renseigné";
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <h1>Gestion des examens</h1>
            <p>Créez, planifiez et gérez les examens.</p>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        <div className="admin-card">
          <h2>Créer un examen</h2>

          <form className="admin-form" onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="title">Titre de l'examen</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Ex : Examen final Java"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Description de l'examen..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseId">Cours</label>
              <select
                id="courseId"
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                required
              >
                <option value="">
                  {loadingCourses
                    ? "Chargement des cours..."
                    : "Sélectionner un cours"}
                </option>

                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name || course.title || `Cours ${course.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Date de début</label>
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
              <label htmlFor="endDate">Date de fin</label>
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
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer l'examen"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <h2>Examens créés</h2>

          {loading && exams.length === 0 ? (
            <div className="admin-loading">Chargement des examens...</div>
          ) : exams.length === 0 ? (
            <p>Aucun examen n'a encore été créé.</p>
          ) : (
            <div className="exam-list">
              {exams.map((exam) => (
                <div className="exam-card" key={exam.id}>
                  <h3>{exam.title || exam.name || `Examen ${exam.id}`}</h3>
                  <p>{exam.description || "Aucune description."}</p>
                  <p>
                    <strong>Cours :</strong> {getCourseName(exam)}
                  </p>
                  <p>
                    <strong>Début :</strong>{" "}
                    {exam.startDate || exam.start_date
                      ? new Date(exam.startDate || exam.start_date).toLocaleString()
                      : "Non renseignée"}
                  </p>
                  <p>
                    <strong>Fin :</strong>{" "}
                    {exam.endDate || exam.end_date
                      ? new Date(exam.endDate || exam.end_date).toLocaleString()
                      : "Non renseignée"}
                  </p>

                  <div className="admin-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/admin/exams/${exam.id}/questions`)
                      }
                    >
                      Ajouter des questions
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        navigate(`/admin/exams/${exam.id}/results`)
                      }
                    >
                      Résultats
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminExams;