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

export interface CountryEmergencyProfile {
  name: string;
  flag: string;
  primaryNumber: string;
  ambulance: string;
  police: string;
  fire: string;
  gendarmerie?: string;
  desc: string;
}

export const COUNTRY_PROFILES: { [key: string]: CountryEmergencyProfile } = {
  Cameroon: {
    name: "Cameroon",
    flag: "🇨🇲",
    primaryNumber: "112",
    ambulance: "119 (SAMU [Service d'Aide Médicale Urgente])",
    police: "117",
    gendarmerie: "113",
    fire: "118 (Sapeurs-Pompiers)",
    desc: "In Cameroon, emergency services are highly decentralized. Dial 112 from any mobile phone for general routing. For clinical emergencies, call 119 (SAMU [Service d'Aide Médicale Urgente]) or 118 for Sapeurs-Pompiers."
  },
  Nigeria: {
    name: "Nigeria",
    flag: "🇳🇬",
    primaryNumber: "112",
    ambulance: "112 / 199",
    police: "112 / 199",
    fire: "112 / 199",
    desc: "Nigeria operates a unified National Emergency number 112. Both 112 and 199 route to local emergency dispatch agencies."
  },
  Kenya: {
    name: "Kenya",
    flag: "🇰🇪",
    primaryNumber: "112",
    ambulance: "999 / 112",
    police: "999 / 112",
    fire: "999",
    desc: "Kenya's official emergency toll-free service is 999. Major mobile service providers also support 112."
  },
  Senegal: {
    name: "Senegal",
    flag: "🇸🇳",
    primaryNumber: "112",
    ambulance: "15 (SAMU [Service d'Aide Médicale Urgente])",
    police: "17 (Police)",
    fire: "18 (Sapeurs-Pompiers)",
    desc: "Senegal uses 17 for Police, 18 for Fire/Accidents, and 15 for SAMU [Service d'Aide Médicale Urgente] medical triage. 112 is supported as a general mobile emergency line."
  },
  "South Africa": {
    name: "South Africa",
    flag: "🇿🇦",
    primaryNumber: "112",
    ambulance: "10177 (Ambulance)",
    police: "10111 (SAPS [South African Police Service])",
    fire: "10177",
    desc: "South Africa routes cell phone emergency calls to 112. Landline users dial 10111 for police and 10177 for medical emergency."
  }
};

