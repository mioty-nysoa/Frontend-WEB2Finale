export const mockStudents = [
  {
    id: 1,
    name: "Alice Martin",
    email: "alice@example.com",
    active: true,
  },
  {
    id: 2,
    name: "Bob Dupont",
    email: "bob@example.com",
    active: true,
  },
  {
    id: 3,
    name: "Charlie Smith",
    email: "charlie@example.com",
    active: false,
  },
];

export const mockCourses = [
  {
    id: 1,
    code: "PROG2",
    name: "Programming 2",
    description: "Object-oriented programming",
  },
  {
    id: 2,
    code: "WEB2",
    name: "Web Development 2",
    description: "Advanced web development",
  },
];

export const mockExams = [
  {
    id: 1,
    title: "WEB2 Final Exam",
    description: "Final web development examination",
    courseId: 2,
    courseName: "Web Development 2",
    startDate: "2026-08-20T08:00",
    endDate: "2026-08-30T18:00",
    attempts: 0,
  },
  {
    id: 2,
    title: "PROG2 Final Exam",
    description: "Final programming examination",
    courseId: 1,
    courseName: "Programming 2",
    startDate: "2026-08-15T08:00",
    endDate: "2026-08-25T18:00",
    attempts: 3,
  },
];

export const mockQuestions = [
  {
    id: 1,
    examId: 1,
    statement: "Which language is used to create web pages?",
    points: 1,
    choices: [
      {
        id: 1,
        text: "HTML",
        correct: true,
      },
      {
        id: 2,
        text: "Java",
        correct: false,
      },
      {
        id: 3,
        text: "Python",
        correct: false,
      },
    ],
  },
  {
    id: 2,
    examId: 1,
    statement: "Which one is a JavaScript framework?",
    points: 2,
    choices: [
      {
        id: 4,
        text: "React",
        correct: true,
      },
      {
        id: 5,
        text: "PostgreSQL",
        correct: false,
      },
      {
        id: 6,
        text: "Docker",
        correct: false,
      },
    ],
  },
];

export const mockResults = [
  {
    id: 1,
    examId: 1,
    studentId: 1,
    studentName: "Alice Martin",
    score: 17,
    total: 20,
    attempts: 1,
  },
  {
    id: 2,
    examId: 1,
    studentId: 2,
    studentName: "Bob Dupont",
    score: 14,
    total: 20,
    attempts: 1,
  },
  {
    id: 3,
    examId: 2,
    studentId: 3,
    studentName: "Charlie Smith",
    score: 12,
    total: 20,
    attempts: 1,
  },
];