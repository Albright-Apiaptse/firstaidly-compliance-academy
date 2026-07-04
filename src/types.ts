export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  profilePic?: string;
  isVerified?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseLesson {
  title: string;
  content: string;
  image?: string;
  subtitle?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: "CPR" | "Choking" | "Bleeding" | "Other" | "Bites & Stings" | "Burns" | "Fractures";
  lessons: CourseLesson[];
  videoUrl: string;
  quizQuestions: QuizQuestion[];
  simulationScenario: {
    title: string;
    description: string;
    initialState: string;
    criticalSteps: string[];
  };
}

export interface DiscussionPost {
  id: string;
  courseId: string;
  studentName: string;
  studentRole: string;
  profilePic?: string;
  text: string;
  createdAt: string;
  replies?: {
    id: string;
    authorName: string;
    authorRole: string;
    profilePic?: string;
    text: string;
    createdAt: string;
  }[];
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  status: "active" | "expiring" | "expired";
  issueDate: string;
  expiryDate: string;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  completedQuizzes: { [courseId: string]: { score: number; maxScore: number; date: string } };
  completedSimulations: { [courseId: string]: { passed: boolean; score: number; feedback: string; date: string; videoUrl?: string } };
  certificates: Certificate[];
  points?: number;
  badges?: string[];
  profilePic?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // supports placeholders like {{student_name}}, {{course_title}}, {{expiry_date}}
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
  status: "delivered" | "failed";
  triggerType: "auto_scan" | "manual_reminder" | "test_send";
}

