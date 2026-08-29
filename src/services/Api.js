const BASE_URL = "http://localhost:3000/api";

const customFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

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
    body: JSON.stringify(answers),
  });

export const fetchMyResults = () => customFetch("/my/results");

export const fetchAdminExams = () => customFetch("/exams");

export const fetchExamById = (id) => customFetch(`/exams/${id}`);

export const fetchExamQuestions = (examId) => customFetch(`/exams/${examId}/questions`);

export const createQuestion = (examId, questionData) =>
  customFetch(`/exams/${examId}/questions`, {
    method: "POST",
    body: JSON.stringify(questionData),
  });

export const deleteQuestion = (questionId) =>
  customFetch(`/exams/questions/${questionId}`, {
    method: "DELETE",
  });

export const fetchCourses = () => customFetch("/courses");

export const createExam = (examData) =>
  customFetch("/exams", {
    method: "POST",
    body: JSON.stringify(examData),
  });

export const deleteExam = (examId) =>
  customFetch(`/exams/${examId}`, {
    method: "DELETE",
  });

export const createCourse = (courseData) =>
  customFetch("/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });

export const fetchExamResults = (examId) =>
  customFetch(`/exams/${examId}/results`);

export const fetchStudents = () => customFetch("/students");

export const createStudent = (studentData) =>
  customFetch("/students", {
    method: "POST",
    body: JSON.stringify(studentData),
  });

export const updateStudent = (studentId, updateData) =>
  customFetch(`/students/${studentId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });

export const deactivateStudent = (studentId) =>
  customFetch(`/students/${studentId}`, {
    method: "DELETE",
  });

export const resetStudentPassword = (studentId, newPassword) =>
  customFetch(`/students/${studentId}/reset-password`, {
    method: "PUT",
    body: JSON.stringify({ newPassword }),
  });

export const reactivateStudent = (studentId) =>
  customFetch(`/students/${studentId}/reactivate`, {
    method: "PUT",
  });