const BASE_URL = "http://localhost:5000/api"; // Ajuste le port selon ton backend

const customFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  // Configuration par défaut
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Gestion des erreurs HTTP (ex: 404, 500)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP : ${response.status}`);
  }

  return response.json();
};
export const fetchExams = () => customFetch("/exams");

export const fetchExamById = (id) => customFetch(`/exams/${id}`);

export const submitExam = (examData) =>
  customFetch("/results", {
    method: "POST",
    body: JSON.stringify(examData),
  });

export const fetchStudentResults = (studentId) =>
  customFetch(`/results/student/${studentId}`);

export const loginUser = (credentials) =>
  customFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });