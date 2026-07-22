export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  profilePic?: string;
  isVerified?: boolean;
  password?: string;
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

export interface CourseFile {
  name: string;
  size: string;
  type: string;
  data: string; // base64 encoded data
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
  uploadedFiles?: CourseFile[];
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
  // Africa
  Cameroon: {
    name: "Cameroon",
    flag: "🇨🇲",
    primaryNumber: "112",
    ambulance: "119 (SAMU)",
    police: "117",
    gendarmerie: "113",
    fire: "118 (Sapeurs-Pompiers)",
    desc: "In Cameroon, emergency services are decentralized. Dial 112 from any mobile phone for general routing. For clinical emergencies, call 119 (SAMU) or 118 for Sapeurs-Pompiers."
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
    ambulance: "15 (SAMU)",
    police: "17 (Police)",
    fire: "18 (Sapeurs-Pompiers)",
    desc: "Senegal uses 17 for Police, 18 for Fire/Accidents, and 15 for SAMU medical triage. 112 is supported as a general mobile emergency line."
  },
  "South Africa": {
    name: "South Africa",
    flag: "🇿🇦",
    primaryNumber: "112",
    ambulance: "10177 (Ambulance)",
    police: "10111 (SAPS)",
    fire: "10177",
    desc: "South Africa routes cell phone emergency calls to 112. Landline users dial 10111 for police and 10177 for medical emergency."
  },
  Egypt: {
    name: "Egypt",
    flag: "🇪🇬",
    primaryNumber: "112",
    ambulance: "123 (Ambulance)",
    police: "122 (Police)",
    fire: "180",
    desc: "Egypt uses 122 for Police, 123 for Ambulance, and 180 for Fire. Mobile operators support 112 as a unified emergency bypass."
  },
  Morocco: {
    name: "Morocco",
    flag: "🇲🇦",
    primaryNumber: "112",
    ambulance: "15 (Ambulance)",
    police: "19 (Police)",
    gendarmerie: "177",
    fire: "15",
    desc: "In Morocco, dial 19 for urban police, 177 for royal gendarmerie in rural areas, and 15 for ambulance and fire services."
  },
  Ghana: {
    name: "Ghana",
    flag: "🇬🇭",
    primaryNumber: "112",
    ambulance: "112",
    police: "112 / 191",
    fire: "112 / 192",
    desc: "Ghana operates a unified emergency number 112 for all distress calls, including police, fire, and ambulance."
  },
  // Asia
  India: {
    name: "India",
    flag: "🇮🇳",
    primaryNumber: "112",
    ambulance: "102 / 108",
    police: "100 / 112",
    fire: "101",
    desc: "India features a single national emergency response system 112. Traditional numbers 100 (Police), 101 (Fire), and 102/108 (Ambulance) are still active."
  },
  Japan: {
    name: "Japan",
    flag: "🇯🇵",
    primaryNumber: "119 / 110",
    ambulance: "119",
    police: "110",
    fire: "119",
    desc: "In Japan, dial 110 for police reporting and 119 for fire, rescue, and ambulance services. English dispatchers are available in major cities."
  },
  Singapore: {
    name: "Singapore",
    flag: "🇸🇬",
    primaryNumber: "999",
    ambulance: "995",
    police: "999",
    fire: "995",
    desc: "Singapore uses 999 for police and 995 for emergency ambulance/fire services. Non-emergency medical transport is routed to 1777."
  },
  Pakistan: {
    name: "Pakistan",
    flag: "🇵🇰",
    primaryNumber: "15 / 1122",
    ambulance: "1122 / 115",
    police: "15",
    fire: "16",
    desc: "In Pakistan, Rescue 1122 is the major medical and emergency service. Traditional police helpline is 15, and fire service is 16."
  },
  // Middle East
  "United Arab Emirates": {
    name: "United Arab Emirates",
    flag: "🇦🇪",
    primaryNumber: "999",
    ambulance: "998",
    police: "999",
    fire: "997",
    desc: "The UAE unified emergency number is 999 for police, 998 for ambulance, and 997 for fire. Text message emergency services are also active."
  },
  "Saudi Arabia": {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    primaryNumber: "911",
    ambulance: "997",
    police: "999 / 911",
    fire: "998",
    desc: "Saudi Arabia is transitioning to the unified 911 service. Alternatively, dial 999 for police, 997 for Red Crescent ambulance, and 998 for civil defense."
  },
  Lebanon: {
    name: "Lebanon",
    flag: "🇱🇧",
    primaryNumber: "112",
    ambulance: "140",
    police: "112 / 125",
    fire: "175",
    desc: "Lebanon uses 140 for the Lebanese Red Cross ambulance, 112 for the Internal Security Forces, and 175 for Civil Defense fire brigade."
  },
  Jordan: {
    name: "Jordan",
    flag: "🇯🇴",
    primaryNumber: "911",
    ambulance: "911",
    police: "911",
    fire: "911",
    desc: "Jordan operates a highly unified national emergency service at 911, routing all police, medical, and fire rescue requests."
  },
  Turkey: {
    name: "Turkey",
    flag: "🇹🇷",
    primaryNumber: "112",
    ambulance: "112",
    police: "112 / 155",
    fire: "112 / 110",
    desc: "Turkey has consolidated all emergency numbers (Ambulance, Police, Gendarmerie, Fire) into a unified 112 service center."
  }
};

