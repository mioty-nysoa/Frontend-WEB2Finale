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
    body: JSON.stringify({
      email: credentials.email,
      username: credentials.email, // Garantit la comptabilité si le backend lit req.body.username
      password: credentials.password,
    }),
  });

export const fetchMyExams = () => customFetch("/my/exams");

export const fetchMyExamById = async (id) => {
  try {
    return await customFetch(`/my/exams/${id}`);
  } catch (err) {
    // Si la route /my/exams/:id n'embarque pas les questions, bascule sur /exams/:id
    return await customFetch(`/exams/${id}`);
  }
};
export const submitExam = (examId, answers) =>
  customFetch(`/my/exams/${examId}/submit`, {
    method: "POST",
    body: JSON.stringify({answers}),
  });
export const fetchStudents = () => 
  customFetch("/students");
export const fetchMyResults = () => customFetch("/my/results");

export const fetchAdminExams = () => customFetch("/exams");

export const fetchExamQuestions = (examId) => customFetch(`/exams/${examId}/questions`);
export const fetchExamResults = (examId) => 
  customFetch(`/exams/${examId}/results`);

export const createQuestion = (examId, questionData) =>
  customFetch(`/exams/${examId}/questions`, {
    method: "POST",
    body: JSON.stringify(questionData),
  });

export const fetchCourses = () => customFetch("/courses");

export const createCourse = (courseData) =>
  customFetch("/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });

export const createExam = async (examData) => {
  const response = await fetch("http://localhost:3000/api/exams", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(examData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Détail de l'erreur Backend :", data);
    throw new Error(data.message || "Erreur lors de la création de l'examen");
  }

  return data;
};

  export const deleteQuestion = (examId, questionId) =>
  customFetch(`/exams/${examId}/questions/${questionId}`, {
    method: "DELETE",
  });
  export const createStudent = (studentData) =>
  customFetch("/students", {
    method: "POST",
    body: JSON.stringify({
      name: studentData.name,
      email: studentData.email,
      password: studentData.password,
      initialPassword: studentData.password,
     }),
  });

export const updateStudent = (studentId, studentData) =>
  customFetch(`/students/${studentId}`, {
    method: "PUT",
    body: JSON.stringify(studentData),
  });

  export const desactivateStudent = (studentId) =>
  customFetch(`/students/${studentId}`, {
    method: "DELETE",
  });

  export const activateStudent = (studentId) =>
  customFetch(`/students/${studentId}/reactivate`, {
    method: "PUT",
  });

  export const resetStudentPassword = (studentId, newPassword ) =>
  customFetch(`/students/${studentId}/reset-password`, {
    method: "PUT",
    body: JSON.stringify({ password: newPassword }),
      password: newPassword,
      newPassword: newPassword
  });