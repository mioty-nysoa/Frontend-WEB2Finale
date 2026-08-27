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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP : ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
};

export const loginUser = (credentials) =>
  customFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const fetchMyExams = () => customFetch("/my/exams");

export const fetchMyExamById = (id) => customFetch(`/my/exams/${id}`);

export const submitExam = (examId, answers) =>
  customFetch(`/my/exams/${examId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

export const fetchMyResults = () => customFetch("/my/results");

export const fetchAdminExams = () => customFetch("/exams");

export const fetchExamQuestions = (examId) => customFetch(`/exams/${examId}/questions`);

export const createQuestion = (examId, questionData) =>
  customFetch(`/exams/${examId}/questions`, {
    method: "POST",
    body: JSON.stringify(questionData),
  });

  export const deleteQuestion = (questionId) =>
  customFetch(`/questions/${questionId}`, {
    method: "DELETE",
  });