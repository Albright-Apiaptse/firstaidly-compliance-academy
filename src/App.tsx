import React, { useState, useEffect } from "react";
import {
  Shield,
  BookOpen,
  Award,
  Users,
  Settings,
  Mail,
  Bell,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Clock,
  LogOut,
  ChevronRight,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  FileText,
  Activity,
  Send,
  Eye,
  Check,
  ChevronLeft,
  Trophy,
  Zap,
  Camera,
  Key,
  LayoutDashboard,
  Lock,
  ShieldAlert,
  Search,
  FileCheck,
  Phone,
  Flame,
  Target,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification 
} from "./lib/firebase";

import PhoneMockup from "./components/PhoneMockup";
import CourseCatalog from "./components/CourseCatalog";
import LessonViewer from "./components/LessonViewer";
import QuizRunner from "./components/QuizRunner";
import SimulationRunner from "./components/SimulationRunner";
import CertificateBadge from "./components/CertificateBadge";
import StudentVerificationPage from "./components/StudentVerificationPage";
import UserProfileForm from "./components/UserProfileForm";
import { User, Course, StudentProgress, Certificate, EmailTemplate, EmailLog } from "./types";

const BADGE_MAP: Record<string, { label: string; icon: string; bg: string; text: string; desc: string }> = {
  welcome: { label: "Rookie", icon: "🌱", bg: "bg-slate-100 border-slate-200", text: "text-slate-700", desc: "Successfully registered on FirstAid.ly" },
  perfect_quiz: { label: "Quiz Wizard", icon: "🧠", bg: "bg-purple-50 border-purple-200", text: "text-purple-700", desc: "Scored 100% on any curriculum quiz" },
  perfect_sim: { label: "Elite Lifesaver", icon: "⭐", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", desc: "Scored 95%+ on any emergency simulation" },
  cpr_master: { label: "CPR Master", icon: "❤️", bg: "bg-rose-50 border-rose-200", text: "text-rose-700", desc: "Certified in CPR & AED response" },
  choking_master: { label: "Heimlich Hero", icon: "💨", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", desc: "Certified in Choking Relief maneuvers" },
  bleeding_master: { label: "Hemorrhage Halt", icon: "🩹", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", desc: "Certified in Severe Bleeding Control" },
  grand_master: { label: "First Aid Legend", icon: "👑", bg: "bg-indigo-100 border-indigo-250 animate-pulse", text: "text-indigo-800", desc: "Mastered all first-aid disciplines" }
};

const WELCOME_IMAGES = [
  {
    src: "/src/assets/images/first_aid_hero_1782836300067.jpg",
    title: "First-Responder Toolkit",
    desc: "Workplace emergency & safety compliance training"
  },
  {
    src: "/src/assets/images/cpr_guide_1782843315552.jpg",
    title: "Cardiopulmonary Resuscitation (CPR)",
    desc: "Hands-on clinical CPR manikin procedures"
  },
  {
    src: "/src/assets/images/tourniquet_guide_1782843341065.jpg",
    title: "Advanced Hemorrhage Control",
    desc: "Essential trauma, tourniquet, and wound care gear"
  },
  {
    src: "/src/assets/images/heimlich_guide_1782843327992.jpg",
    title: "Choking Relief & Teamwork",
    desc: "Cooperative peer-to-peer first aid maneuvers"
  }
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState<"student" | "instructor" | "admin">("student");
  const [loginPortalMode, setLoginPortalMode] = useState<"student" | "admin">("student");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [signupProfilePic, setSignupProfilePic] = useState("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80");
  const [activeWelcomeImgIndex, setActiveWelcomeImgIndex] = useState(0);

  // Common App-replicated Form States
  const [signupStep, setSignupStep] = useState<"role-select" | "form">("role-select");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupConfirmEmail, setSignupConfirmEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPhoneCode, setSignupPhoneCode] = useState("+237");
  const [signupDobMonth, setSignupDobMonth] = useState("");
  const [signupDobDay, setSignupDobDay] = useState("");
  const [signupDobYear, setSignupDobYear] = useState("");
  const [signupCountry, setSignupCountry] = useState("Cameroon");
  const [signupOptIn, setSignupOptIn] = useState(true);
  const [signupAgreeTerms, setSignupAgreeTerms] = useState(false);
  const [showSandboxBypass, setShowSandboxBypass] = useState(false);

  // Google custom Sign-In states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState("");
  const [googleNameInput, setGoogleNameInput] = useState("");
  const [googleSelectedAvatar, setGoogleSelectedAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80");
  const [googleMode, setGoogleMode] = useState<"chooser" | "form">("chooser");

  // Ref for student profile picture upload
  const studentProfilePicInputRef = React.useRef<HTMLInputElement>(null);

  // Interactive States for Vital Response High-Fidelity Landing Page
  const [landingSlide, setLandingSlide] = useState(0);
  const [emergencySearch, setEmergencySearch] = useState("");
  const [expandedReference, setExpandedReference] = useState<string | null>(null);
  const [aedQuery, setAedQuery] = useState("");
  const [isSearchingAed, setIsSearchingAed] = useState(false);
  const [aedResults, setAedResults] = useState<any[]>([]);

  // Tesla-style industrial interaction states
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [liveCounter, setLiveCounter] = useState(148290);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      setMouseOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const interval = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  // Persistent login state loader
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("firstaid_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      }
      
      const storedEmail = localStorage.getItem("firstaid_remembered_email");
      const storedPassword = localStorage.getItem("firstaid_remembered_password");
      if (storedEmail) {
        setAuthEmail(storedEmail);
        setRememberMe(true);
      }
      if (storedPassword) {
        setAuthPassword(storedPassword);
      }
    } catch (e) {
      console.error("Failed to load persistent auth state from localStorage", e);
    }
  }, []);

  // Localized AED database search
  const handleAedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aedQuery.trim()) return;
    setIsSearchingAed(true);
    setTimeout(() => {
      const query = aedQuery.toLowerCase();
      if (query.includes("yaounde") || query.includes("cameroon") || query.includes("yau")) {
        setAedResults([
          { name: "Yaoundé Central Hospital Trauma Hub", location: "Hospital Road, Ward 4", dist: "0.8 km", status: "Operational", number: "+237 222-1243" },
          { name: "Bastos Community First Response Station", location: "Rue de Bastos, Gate B", dist: "1.4 km", status: "Operational", number: "+237 222-9851" },
          { name: "Mvan Intercity Transport Public AED Cabinet", location: "Mvan Express Terminal Lobby", dist: "2.9 km", status: "Operational", number: "Public Access" }
        ]);
      } else if (query.includes("francisco") || query.includes("sf") || query.includes("soma")) {
        setAedResults([
          { name: "SOMA Public Health Center & AED Station", location: "501 Folsom St, SF", dist: "0.2 mi", status: "Operational", number: "+1 (415) 555-0199" },
          { name: "Financial District Emergency Compliance Locker", location: "100 Pine St, Floor 2", dist: "0.7 mi", status: "Operational", number: "+1 (415) 555-0245" }
        ]);
      } else {
        setAedResults([
          { name: "Universal First Responder AED Kit", location: "Mobile Unit / Patrol Dispatch", dist: "0.0 km", status: "Active Dispatch", number: "Call Emergency Dispatch" },
          { name: `${aedQuery} Municipal Center Training Vault`, location: "Central Registry Office", dist: "1.2 km", status: "Standby", number: "Emergency Service Unit" }
        ]);
      }
      setIsSearchingAed(false);
    }, 450);
  };

  const EMERGENCY_PROTOCOLS = [
    {
      id: "cpr",
      title: "CARDIAC ARREST (CPR)",
      actionLabel: "Arrest Trauma",
      spec: "30 chest compressions at 100-120 BPM followed immediately by 2 high-volume rescue breaths.",
      instructions: [
        "Position victim flat on hard surface. Confirm unconsciousness and agonal breathing.",
        "Place heel of one hand in center of chest, other hand interlaced on top.",
        "Compress strictly between 2 to 2.4 inches (5 to 6 cm) depth. Release fully after each stroke.",
        "Continue cyclical CPR compression blocks until formal AED arrival or paramedic transition."
      ]
    },
    {
      id: "bleeding",
      title: "SEVERE HEMORRHAGE TRAUMA",
      actionLabel: "Arterial Wound",
      spec: "Direct manual pressure block or high-tension arterial tourniquet deployment.",
      instructions: [
        "Apply direct steady bilateral manual pressure using sterile gauze directly inside bleeding void.",
        "If hemorrhaging is arterial, position windlass tourniquet 2 to 3 inches above wound site.",
        "Tighten tourniquet strictly until bleeding stops and distal arterial pulse is fully arrested.",
        "Secure the windlass and mark the precise timestamp 'T' clearly on the casualty's forehead."
      ]
    },
    {
      id: "choking",
      title: "AIRWAYS OBSTRUCTION (CHOKING)",
      actionLabel: "Heimlich Manifold",
      spec: "Alternating blocks of 5 interscapular back blows and 5 deep subdiaphragmatic abdominal thrusts.",
      instructions: [
        "Stand firmly behind the victim, wrapping your arms securely around the upper waistline.",
        "Make a tight fist with one hand and place it slightly above the navel, well below the breastbone.",
        "Grasp your fist with your other hand and press inward and upward with severe, sudden force.",
        "Repeat cycles continuously. If victim loses consciousness, immediately transition to standard flat CPR."
      ]
    },
    {
      id: "burns",
      title: "THERMAL & CHEMICAL CRITIC",
      actionLabel: "Epidermal Lesion",
      spec: "Continuous temperate water irrigation for 20 minutes minimum. Sterile cover.",
      instructions: [
        "Irrigate damaged skin tissue with clean, cool running water immediately to dissipate heat.",
        "Do NOT apply ice, ice-water, butter, oils, or adhesive ointments to the raw open wound surface.",
        "Remove constricting items such as rings or tight garments from affected extremities gently.",
        "Cover the open lesion loosely with a sterile, dry, non-adherent burn dressing to protect nerve ends."
      ]
    }
  ];

  // App Master Data & Progress States
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [systemLogs, setSystemLogs] = useState<{ timestamp: string; message: string }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Student Flow Navigation / Mobile View States
  const [studentTab, setStudentTab] = useState<"dashboard" | "courses" | "certificates" | "leaderboard" | "profile">("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [studentFlowStep, setStudentFlowStep] = useState<"catalog" | "lessons" | "quiz" | "simulation" | "certificate">("catalog");
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [countryContext, setCountryContext] = useState<string>("Cameroon");

  // Instructor/Admin Workspace Navigation
  const [workspaceTab, setWorkspaceTab] = useState<"compliance" | "courses" | "notifications" | "profile">("compliance");
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<string | null>(null);
  const [selectedCourseForCert, setSelectedCourseForCert] = useState<string | null>(null);
  const [durationForCert, setDurationForCert] = useState(12);

  // Expiry Scanner Demo state
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Curriculum Editor form state
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isEditingCourseNew, setIsEditingCourseNew] = useState(false);

  // Manual Test Email Preview Form state
  const [testEmailRecipient, setTestEmailRecipient] = useState("");
  const [testEmailTemplateId, setTestEmailTemplateId] = useState("");
  const [testEmailCourseTitle, setTestEmailCourseTitle] = useState("");
  const [testEmailSuccessMsg, setTestEmailSuccessMsg] = useState("");

  // Quick setup with preset credentials
  const handleQuickLogin = (role: "student" | "instructor" | "admin") => {
    if (role === "student") {
      setAuthEmail("student@firstaid.com");
      setAuthPassword("student");
    } else if (role === "instructor") {
      setAuthEmail("instructor@firstaid.com");
      setAuthPassword("instructor");
    } else {
      setAuthEmail("njapahalbright@gmail.com");
      setAuthPassword("admin");
    }
    setAuthRole(role);
    setAuthError("");
  };

  // Fetch all backend state
  const fetchBackendData = async () => {
    try {
      setIsLoadingData(true);
      const [coursesRes, progressRes, templatesRes, logsRes, sysRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/students/progress"),
        fetch("/api/emails/templates"),
        fetch("/api/emails/logs"),
        fetch("/api/system-logs")
      ]);

      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (progressRes.ok) setProgress(await progressRes.json());
      if (templatesRes.ok) setEmailTemplates(await templatesRes.json());
      if (logsRes.ok) setEmailLogs(await logsRes.json());
      if (sysRes.ok) setSystemLogs(await sysRes.json());
    } catch (e) {
      console.error("Error loading application data", e);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Poll for simulated "real-time progress tracking"
  useEffect(() => {
    if (currentUser && (currentUser.role === "instructor" || currentUser.role === "admin")) {
      const interval = setInterval(() => {
        fetch("/api/students/progress")
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setProgress(data))
          .catch((err) => console.error("Polling progress failed", err));
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Auth - Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Please fill out all credentials.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");

    try {
      // 1. Firebase Auth Attempt
      try {
        await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword.trim());
      } catch (fbErr: any) {
        console.warn("Firebase Auth sign-in log:", fbErr?.message);
      }

      // 2. Server API Verification with targetPortal check
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail.trim(),
          password: authPassword.trim(),
          targetPortal: loginPortalMode
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
      } else {
        setCurrentUser(data.user);
        try {
          localStorage.setItem("firstaid_user", JSON.stringify(data.user));
          if (rememberMe) {
            localStorage.setItem("firstaid_remembered_email", authEmail.trim());
            localStorage.setItem("firstaid_remembered_password", authPassword.trim());
          } else {
            localStorage.removeItem("firstaid_remembered_email");
            localStorage.removeItem("firstaid_remembered_password");
          }
        } catch (storageErr) {
          console.error("Storage save failed", storageErr);
        }
        // Reset navigation
        setStudentFlowStep("catalog");
        setSelectedCourse(null);
        setStudentTab("dashboard");
      }
    } catch (err) {
      setAuthError("Could not connect to the backend server.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth - SignUp Handler (Strictly Student Registration)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Validate name fields
    if (!signupFirstName.trim() || !signupLastName.trim()) {
      setAuthError("Please provide both your First Name and Last Name.");
      return;
    }

    // Validate email confirmation
    if (authEmail.trim().toLowerCase() !== signupConfirmEmail.trim().toLowerCase()) {
      setAuthError("Email addresses do not match.");
      return;
    }

    // Validate password strength
    const password = authPassword;
    const hasMinLen = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':",./<>?]/.test(password);
    const hasNoSpace = !/\s/.test(password);

    if (!hasMinLen || !hasLowercase || !hasUppercase || !hasNumber || !hasSpecial || !hasNoSpace) {
      setAuthError("Your password does not meet the compliance criteria shown below.");
      return;
    }

    // Validate DOB fields
    if (!signupDobMonth || !signupDobDay || !signupDobYear) {
      setAuthError("Please provide your full Date of Birth.");
      return;
    }

    // Validate terms agreement
    if (!signupAgreeTerms) {
      setAuthError("You must agree to the Terms of Service to continue.");
      return;
    }

    setAuthLoading(true);
    const fullCombinedName = `${signupFirstName.trim()} ${signupLastName.trim()}`;

    try {
      // 1. Firebase Auth User Creation & Email Verification dispatch
      try {
        const userCred = await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword.trim());
        if (userCred.user) {
          await sendEmailVerification(userCred.user);
        }
      } catch (fbErr: any) {
        console.warn("Firebase Auth sign-up notice:", fbErr?.message);
      }

      // 2. Server Account Registration (role is locked to student)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail.trim(),
          password: authPassword.trim(),
          name: fullCombinedName,
          role: "student",
          profilePic: signupProfilePic
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Registration failed.");
      } else {
        setCurrentUser(data.user);
        try {
          localStorage.setItem("firstaid_user", JSON.stringify(data.user));
          if (rememberMe) {
            localStorage.setItem("firstaid_remembered_email", authEmail.trim());
            localStorage.setItem("firstaid_remembered_password", authPassword.trim());
          } else {
            localStorage.removeItem("firstaid_remembered_email");
            localStorage.removeItem("firstaid_remembered_password");
          }
        } catch (storageErr) {
          console.error("Storage save failed", storageErr);
        }
        setStudentFlowStep("catalog");
        setSelectedCourse(null);
        setStudentTab("dashboard");
        fetchBackendData();
      }
    } catch (err) {
      setAuthError("Could not connect to the backend server.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth - Google Sign-In Handler (Trigger Modal)
  const handleGoogleSignIn = () => {
    setGoogleMode("chooser");
    setGoogleEmailInput("");
    setGoogleNameInput("");
    setShowGoogleModal(true);
  };

  // Actual backend execution of Google Sign-In with personal/custom account
  const executeGoogleSignIn = async (email: string, name: string, profilePic: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || "Google Responder",
          profilePic: profilePic
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Google Sign-In failed.");
      } else {
        setCurrentUser(data.user);
        try {
          localStorage.setItem("firstaid_user", JSON.stringify(data.user));
        } catch (storageErr) {
          console.error("Storage save failed", storageErr);
        }
        setStudentFlowStep("catalog");
        setSelectedCourse(null);
        setStudentTab("courses");
        setShowGoogleModal(false);
        fetchBackendData();
      }
    } catch (err) {
      setAuthError("Google authentication connection failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth - Apple Sign-In Handler
  const handleAppleSignIn = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const appleUser = {
        email: "apple.student@icloud.com",
        name: "Apple Trainee Responder",
        profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
      };

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appleUser)
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Apple Sign-In failed.");
      } else {
        setCurrentUser(data.user);
        try {
          localStorage.setItem("firstaid_user", JSON.stringify(data.user));
        } catch (storageErr) {
          console.error("Storage save failed", storageErr);
        }
        setStudentFlowStep("catalog");
        setSelectedCourse(null);
        setStudentTab("dashboard");
        fetchBackendData();
      }
    } catch (err) {
      setAuthError("Apple authentication connection failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Student profile picture manual file upload handler
  const handleStudentProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      if (!base64String) return;

      try {
        setAuthLoading(true);
        const res = await fetch("/api/students/update-profile-pic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            profilePic: base64String
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // Update local state
          const updatedUser = { ...currentUser, profilePic: base64String };
          setCurrentUser(updatedUser);
          localStorage.setItem("firstaid_user", JSON.stringify(updatedUser));
          
          // Update progress state
          setProgress((prev) =>
            prev.map((p) => (p.studentId === currentUser.id ? { ...p, profilePic: base64String } : p))
          );
        } else {
          console.error("Profile picture update failed on server", data.error);
        }
      } catch (err) {
        console.error("Profile picture update failed", err);
      } finally {
        setAuthLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("firstaid_user");
    } catch (storageErr) {
      console.error("Storage clear failed", storageErr);
    }
    if (!rememberMe) {
      setAuthEmail("");
      setAuthPassword("");
    }
    setAuthName("");
    setAuthError("");
    setIsSignUp(false);
  };

  // Student specific progress getter
  const getStudentProgress = () => {
    if (!currentUser) return undefined;
    return progress.find((p) => p.studentId === currentUser.id);
  };

  const myProgress = getStudentProgress();

  // Student Quiz Submission API handler
  const handleSubmitQuiz = async (score: number, maxScore: number) => {
    if (!currentUser || !selectedCourse) return;
    try {
      const response = await fetch("/api/students/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.id,
          courseId: selectedCourse.id,
          score,
          maxScore
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Update local progress states
        const updatedProgress = progress.map((p) =>
          p.studentId === currentUser.id ? result.progress : p
        );
        setProgress(updatedProgress);

        if (result.certified && result.cert) {
          setActiveCertificate(result.cert);
          setStudentFlowStep("certificate");
        } else {
          setStudentFlowStep("simulation");
        }
      }
    } catch (e) {
      console.error(e);
      setStudentFlowStep("simulation");
    }
  };

  // Student Simulation Submission API handler
  const handleCompleteSimulation = async (passed: boolean, score: number, feedback: string) => {
    if (!currentUser || !selectedCourse) return;
    try {
      const response = await fetch("/api/students/submit-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.id,
          courseId: selectedCourse.id,
          passed,
          score,
          feedback
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state
        const updatedProgress = progress.map((p) =>
          p.studentId === currentUser.id ? result.progress : p
        );
        setProgress(updatedProgress);

        if (result.certified && result.cert) {
          setActiveCertificate(result.cert);
          setStudentFlowStep("certificate");
        } else {
          // Finished but maybe didn't pass or quiz missing
          setStudentFlowStep("catalog");
          setSelectedCourse(null);
          setStudentTab("certificates");
        }
      }
    } catch (e) {
      console.error(e);
      setStudentFlowStep("catalog");
      setSelectedCourse(null);
    }
  };

  // Admin Action - Force Expiry Scan
  const handleTriggerScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/emails/trigger-scan", { method: "POST" });
      if (res.ok) {
        const result = await res.json();
        setScanResult(result);
        setProgress(result.progress);
        setEmailLogs(result.logs);
        // Refresh system logs
        const sysRes = await fetch("/api/system-logs");
        if (sysRes.ok) setSystemLogs(await sysRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  // Admin Action - Send Test Email
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient || !testEmailTemplateId) return;

    try {
      const res = await fetch("/api/emails/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: testEmailRecipient,
          courseTitle: testEmailCourseTitle || "Emergency Resuscitation (CPR)",
          templateId: testEmailTemplateId
        })
      });

      if (res.ok) {
        setTestEmailSuccessMsg("Manual alert triggered successfully! Added to dispatch logs.");
        const logsRes = await fetch("/api/emails/logs");
        if (logsRes.ok) setEmailLogs(await logsRes.json());
        
        const sysRes = await fetch("/api/system-logs");
        if (sysRes.ok) setSystemLogs(await sysRes.json());

        setTimeout(() => setTestEmailSuccessMsg(""), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Action - Manual Certificate Issue
  const handleManualCertify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForCert || !selectedCourseForCert) return;

    try {
      const res = await fetch("/api/students/certify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentForCert,
          courseId: selectedCourseForCert,
          durationMonths: durationForCert
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data);
        setSelectedStudentForCert(null);
        setSelectedCourseForCert(null);

        // Refresh lists
        const logsRes = await fetch("/api/emails/logs");
        if (logsRes.ok) setEmailLogs(await logsRes.json());

        const sysRes = await fetch("/api/system-logs");
        if (sysRes.ok) setSystemLogs(await sysRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Action - Save Curriculum edits
  const handleSaveCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title) return;

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCourse)
      });

      if (res.ok) {
        setCourses(await res.json());
        setEditingCourse(null);
        const sysRes = await fetch("/api/system-logs");
        if (sysRes.ok) setSystemLogs(await sysRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Action - Delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this course and all associated quiz materials?")) return;
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(await res.json());
        const sysRes = await fetch("/api/system-logs");
        if (sysRes.ok) setSystemLogs(await sysRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Inline update for email templates
  const handleUpdateTemplate = async (templateId: string, updatedFields: Partial<EmailTemplate>) => {
    const updated = emailTemplates.map((t) =>
      t.id === templateId ? { ...t, ...updatedFields } : t
    );
    try {
      const res = await fetch("/api/emails/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templates: updated })
      });
      if (res.ok) {
        setEmailTemplates(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0B0B0C] flex flex-col font-sans antialiased selection:bg-[#D7263D] selection:text-white">
      {/* Universal Top Nav Header — Pure Industrial Minimalist */}
      <header className="h-16 bg-[#FAFAF9] border-b border-[#0B0B0C]/10 flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[#D7263D] flex items-center justify-center text-white font-sans font-black text-sm shadow-sm select-none">
            +
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 font-sans flex items-center gap-2 leading-none">
              firstaid.ly
              <span className="text-[8px] bg-[#0B0B0C] text-white font-mono font-bold px-1.5 py-0.5 tracking-normal uppercase rounded-sm">
                ACADEMY
              </span>
            </h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-semibold mt-0.5">
              Emergency Compliance Portal
            </p>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-4">
            {/* Desktop Header Profile Picture */}
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-slate-250 text-rose-600 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0 shadow-sm">
              {currentUser.profilePic ? (
                <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-[#0B0B0C]">{currentUser.name}</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#D7263D] mt-0.5">
                {currentUser.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-[10px] font-mono uppercase tracking-wider border border-[#0B0B0C]/10 px-3 py-1.5 hover:border-[#D7263D] hover:text-[#D7263D] transition text-[#0B0B0C]"
              title="Logout Account"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="text-[9px] font-mono text-[#8E8E93] uppercase tracking-widest border border-[#0B0B0C]/10 px-3 py-1 bg-[#FAFAF9]">
            Regulatory Compliance Hub
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {!currentUser ? (
          /* High-fidelity storytelling page deck with Slidebean Presentation Deck & Tesla aesthetic */
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            
                        {/* LEFT PANEL: High-quality stock illustration / hero content with lots of negative space */}
            <div className="hidden lg:flex lg:flex-1 bg-slate-50 flex-col justify-between p-16 relative overflow-hidden">
              <div className="space-y-8 max-w-lg z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D7263D] flex items-center justify-center text-white font-sans font-black text-sm shadow-sm">
                    +
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-800 font-sans">firstaid.ly</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight">
                    Learn first aid.<br />
                    Save lives.
                  </h2>
                  <div className="w-12 h-[3px] bg-[#D7263D]"></div>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    Designed specifically for Cameroon and other African contexts. Master high-quality chest compressions (CPR [Cardiopulmonary Resuscitation]), choking relief, severe wound management, and snake bites in interactive diagnostic simulations.
                  </p>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-6 border-t border-slate-200">
                  <div className="space-y-1">
                    <span className="text-3xl font-light text-slate-900">140k+</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">
                      Responders Trained
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-3xl font-light text-[#D7263D]">100%</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">
                      Compliance Audited
                    </p>
                  </div>
                </div>
              </div>

              {/* High-quality Stock Image Container representing professional first-responder medical care */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100 mt-6 shrink-0 z-10 max-w-lg">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
                  alt="First-responder clinical medical training"
                  className="w-full h-full object-cover filter contrast-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-100 font-bold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded">
                    Clinical Skill Acquisition • Certified Responders
                  </span>
                </div>
              </div>

              {/* Ambient visual graphic accent */}
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-slate-200/50 blur-3xl pointer-events-none"></div>
            </div>

            {/* RIGHT SIDE: Dedicated Common App Replicated Login/Signup Panel */}
            <div className="w-full lg:w-[460px] bg-white flex flex-col justify-between overflow-y-auto shrink-0 border-l border-slate-100 shadow-2xl relative">
              
              {/* Header section with brand and clear toggle */}
              <div className="p-8 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#D7263D] flex items-center justify-center text-white font-sans font-black text-xs shadow-sm">
                      +
                    </div>
                    <span className="text-base font-bold tracking-tight text-slate-900 font-sans">firstaid.ly</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError("");
                      setSignupStep("role-select");
                    }}
                    className="text-xs font-semibold text-[#D7263D] hover:text-[#C21D32] transition"
                  >
                    {isSignUp ? "Sign In" : "Create Account"}
                  </button>
                </div>
              </div>

              {/* Core Form Area */}
              <div className="flex-1 px-8 py-4">
                
                {authError && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-start gap-2 animate-shake">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Error:</span> {authError}
                    </div>
                  </div>
                )}

                {/* SIGN IN FLOW */}
                {!isSignUp ? (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back!</h2>
                      <p className="text-xs text-slate-500">Sign in to resume your training and track compliance.</p>
                    </div>

                    {/* Portal Mode Switcher */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginPortalMode("student");
                          setAuthError("");
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          loginPortalMode === "student"
                            ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                        <span>Student Portal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginPortalMode("admin");
                          setAuthError("");
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          loginPortalMode === "admin"
                            ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Admin / Instructor</span>
                      </button>
                    </div>

                    {loginPortalMode === "admin" && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong>Admin Access Restricted:</strong> Public user registration creates Student accounts only. Access to the Admin/Instructor Portal requires verified administrator authorization.
                        </span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="e.g. name@workplace.com"
                          className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold text-slate-700 block">Password</label>
                          <a href="#forgot" className="text-xs text-slate-500 hover:text-slate-800 transition">Forgot password?</a>
                        </div>
                        <input
                          type="password"
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="remember_me"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-[#D7263D] border-slate-300 focus:ring-[#D7263D]"
                        />
                        <label htmlFor="remember_me" className="text-xs text-slate-600 select-none cursor-pointer">
                          Remember me on this device
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#D7263D] hover:bg-[#C21D32] text-white font-semibold text-xs py-3.5 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {authLoading ? "Signing in..." : `Sign In to ${loginPortalMode === "admin" ? "Admin Workspace" : "Student Portal"}`}
                      </button>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-3 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">or</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs py-2.5 px-2 rounded-xl border border-slate-200 font-semibold transition shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span className="truncate">Google</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleAppleSignIn}
                          className="flex items-center justify-center gap-2 bg-black hover:bg-slate-900 text-white text-xs py-2.5 px-2 rounded-xl font-semibold transition shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 170 170">
                            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03.12-9.95-1.99-14.75-6.35-3.35-2.87-7.27-7.66-11.75-14.38-6.15-9.35-11.05-19.8-14.71-31.35-3.66-11.55-5.49-22.38-5.49-32.48 0-14.88 3.73-27.18 11.19-36.9 7.46-9.72 17.06-14.68 28.8-14.88 5.15 0 10.66 1.25 16.54 3.75 5.88 2.5 9.95 3.75 12.21 3.75 1.9 0 5.88-1.2 11.95-3.6 6.07-2.4 11.36-3.52 15.87-3.36 12.02.48 21.6 4.88 28.75 13.2-10.7 6.48-15.93 15.35-15.7 26.6.24 8.8 3.57 16.27 10 22.42 6.43 6.15 14.15 9.77 23.16 10.86-2.5 7.45-5.95 14.82-10.35 22.12zM119.22 31.02c0-7.25 2.62-14.28 7.86-21.09 5.24-6.81 11.98-10.83 20.22-12.06.24 1.19.36 2.26.36 3.21 0 7.26-2.71 14.4-8.13 21.43-5.42 7.03-12.18 10.95-20.31 11.76-.12-.95-.24-2.02-.24-3.25z"/>
                          </svg>
                          <span className="truncate">Sign in with Apple</span>
                        </button>
                      </div>
                    </form>

                    <div className="text-center">
                      <p className="text-xs text-slate-500">
                        Don't have an account?{" "}
                        <button
                          onClick={() => {
                            setIsSignUp(true);
                            setSignupStep("role-select");
                            setAuthError("");
                          }}
                          className="font-bold text-[#D7263D] hover:underline"
                        >
                          Create an account
                        </button>
                      </p>
                    </div>
                  </div>
                ) : (
                  /* SIGN UP FLOW - STUDENT REGISTRATION ONLY */
                  <div className="space-y-5">
                    {signupStep === "role-select" ? (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Create Student Account</h2>
                          <p className="text-xs text-slate-500">Register as a responder trainee on the FirstAid.ly platform.</p>
                        </div>

                        <div className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/40 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-900">First Aid Student / Trainee</h4>
                              <p className="text-[11px] text-slate-500 leading-snug">
                                Acquire essential first aid skills, practice emergency simulations, and earn certified credentials.
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-white border border-rose-150 rounded-xl text-[11px] text-slate-600 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-rose-700">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              <span>Administrator Authorization Notice</span>
                            </div>
                            <p className="text-[10.5px] leading-relaxed text-slate-500">
                              Public self-registration is strictly restricted to Student accounts. Instructor and Administrator accounts cannot be self-created publicly and are provisioned exclusively by system administrators.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setAuthRole("student");
                              setSignupStep("form");
                            }}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                          >
                            <span>Proceed to Registration Form</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="relative flex py-1 items-center">
                          <div className="flex-grow border-t border-slate-100"></div>
                          <span className="flex-shrink mx-3 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">or</span>
                          <div className="flex-grow border-t border-slate-100"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs py-3 px-2 rounded-xl border border-slate-200 font-semibold transition shadow-sm hover:shadow-md"
                          >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                              />
                            </svg>
                            <span className="truncate">Google</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleAppleSignIn}
                            className="flex items-center justify-center gap-2 bg-black hover:bg-slate-900 text-white text-xs py-3 px-2 rounded-xl font-semibold transition shadow-sm hover:shadow-md"
                          >
                            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 170 170">
                              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03.12-9.95-1.99-14.75-6.35-3.35-2.87-7.27-7.66-11.75-14.38-6.15-9.35-11.05-19.8-14.71-31.35-3.66-11.55-5.49-22.38-5.49-32.48 0-14.88 3.73-27.18 11.19-36.9 7.46-9.72 17.06-14.68 28.8-14.88 5.15 0 10.66 1.25 16.54 3.75 5.88 2.5 9.95 3.75 12.21 3.75 1.9 0 5.88-1.2 11.95-3.6 6.07-2.4 11.36-3.52 15.87-3.36 12.02.48 21.6 4.88 28.75 13.2-10.7 6.48-15.93 15.35-15.7 26.6.24 8.8 3.57 16.27 10 22.42 6.43 6.15 14.15 9.77 23.16 10.86-2.5 7.45-5.95 14.82-10.35 22.12zM119.22 31.02c0-7.25 2.62-14.28 7.86-21.09 5.24-6.81 11.98-10.83 20.22-12.06.24 1.19.36 2.26.36 3.21 0 7.26-2.71 14.4-8.13 21.43-5.42 7.03-12.18 10.95-20.31 11.76-.12-.95-.24-2.02-.24-3.25z"/>
                            </svg>
                            <span className="truncate">Sign up with Apple</span>
                          </button>
                        </div>

                        <div className="text-center pt-2">
                          <p className="text-xs text-slate-500">
                            Already have an account?{" "}
                            <button
                              onClick={() => {
                                setIsSignUp(false);
                                setAuthError("");
                              }}
                              className="font-bold text-[#D7263D] hover:underline"
                            >
                              Sign In
                            </button>
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* STEP 2: Detailed Signup Form with Replicated Common App Fields */
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setSignupStep("role-select")}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#D7263D] transition"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back to path selection
                        </button>

                        <div className="pb-1 border-b border-slate-100 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Account Details</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold uppercase">
                            Role: {authRole}
                          </span>
                        </div>

                        {/* Avatar Picker */}
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-slate-700 block">Choose Your Training Avatar</span>
                          <div className="flex gap-2 items-center py-1 overflow-x-auto">
                            {[
                              { name: "Emma", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
                              { name: "James", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
                              { name: "Sophia", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" },
                              { name: "Lucas", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
                              { name: "Aria", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" },
                              { name: "Oliver", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80" }
                            ].map((avatar) => {
                              const isSelected = signupProfilePic === avatar.url;
                              return (
                                <button
                                  key={avatar.name}
                                  type="button"
                                  onClick={() => setSignupProfilePic(avatar.url)}
                                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition duration-200 shrink-0 ${
                                    isSelected ? "border-[#D7263D] scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                                  }`}
                                  title={`Choose avatar: ${avatar.name}`}
                                >
                                  <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <form onSubmit={handleSignUpSubmit} className="space-y-4">
                          {/* Name Fields */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 block">First Name</label>
                              <input
                                type="text"
                                required
                                value={signupFirstName}
                                onChange={(e) => setSignupFirstName(e.target.value)}
                                placeholder="e.g. Marie"
                                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 block">Last Name</label>
                              <input
                                type="text"
                                required
                                value={signupLastName}
                                onChange={(e) => setSignupLastName(e.target.value)}
                                placeholder="e.g. Fofana"
                                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition"
                              />
                            </div>
                          </div>

                          {/* Emails */}
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
                              <input
                                type="email"
                                required
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                placeholder="e.g. name@workplace.com"
                                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 block">Re-enter Email Address</label>
                              <input
                                type="email"
                                required
                                value={signupConfirmEmail}
                                onChange={(e) => setSignupConfirmEmail(e.target.value)}
                                placeholder="Re-enter to confirm"
                                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition"
                              />
                              {authEmail && signupConfirmEmail && authEmail.trim().toLowerCase() !== signupConfirmEmail.trim().toLowerCase() && (
                                <p className="text-[10px] text-red-600 font-medium">⚠️ Email addresses do not match yet.</p>
                              )}
                            </div>
                          </div>

                          {/* Password Field + Live Checklist */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 block">Create Password</label>
                            <input
                              type="password"
                              required
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              placeholder="Minimum 8 characters"
                              className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition"
                            />
                            {/* Live Password Checklist (Common App Style) */}
                            {authPassword && (
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 animate-fadeIn">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Password Requirements:</p>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                                  <div className="flex items-center gap-1.5">
                                    {authPassword.length >= 8 ? (
                                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1"></div>
                                    )}
                                    <span className={authPassword.length >= 8 ? "text-slate-600" : "text-slate-400"}>8-24 characters</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {/[A-Z]/.test(authPassword) ? (
                                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1"></div>
                                    )}
                                    <span className={/[A-Z]/.test(authPassword) ? "text-slate-600" : "text-slate-400"}>Uppercase letter</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {/[a-z]/.test(authPassword) ? (
                                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1"></div>
                                    )}
                                    <span className={/[a-z]/.test(authPassword) ? "text-slate-600" : "text-slate-400"}>Lowercase letter</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {/[0-9]/.test(authPassword) ? (
                                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1"></div>
                                    )}
                                    <span className={/[0-9]/.test(authPassword) ? "text-slate-600" : "text-slate-400"}>At least 1 number</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {/[!@#$%^&*()_+\-=\[\]{};':",./<>?]/.test(authPassword) ? (
                                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1"></div>
                                    )}
                                    <span className={/[!@#$%^&*()_+\-=\[\]{};':",./<>?]/.test(authPassword) ? "text-slate-600" : "text-slate-400"}>Special symbol</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {!/\s/.test(authPassword) ? (
                                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1"></div>
                                    )}
                                    <span className={!/\s/.test(authPassword) ? "text-slate-600" : "text-slate-400"}>No spaces</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Phone Number with country dropdown prefix */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 block">Phone Number</label>
                            <div className="flex gap-2">
                              <select
                                value={signupPhoneCode}
                                onChange={(e) => setSignupPhoneCode(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-xs px-2 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800"
                              >
                                <option value="+237">🇨🇲 +237</option>
                                <option value="+234">🇳🇬 +234</option>
                                <option value="+254">🇰🇪 +254</option>
                                <option value="+27">🇿🇦 +27</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+44">🇬🇧 +44</option>
                              </select>
                              <input
                                type="tel"
                                required
                                value={signupPhone}
                                onChange={(e) => setSignupPhone(e.target.value)}
                                placeholder="6xx xxx xxx"
                                className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition"
                              />
                            </div>
                          </div>

                          {/* Date of Birth Grid (Common App Style) */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 block">Date of Birth</label>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                required
                                value={signupDobMonth}
                                onChange={(e) => setSignupDobMonth(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-xs px-2 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800"
                              >
                                <option value="">Month</option>
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
                                  <option key={idx} value={m}>{m}</option>
                                ))}
                              </select>
                              <select
                                required
                                value={signupDobDay}
                                onChange={(e) => setSignupDobDay(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-xs px-2 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800"
                              >
                                <option value="">Day</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                              <select
                                required
                                value={signupDobYear}
                                onChange={(e) => setSignupDobYear(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-xs px-2 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800"
                              >
                                <option value="">Year</option>
                                {Array.from({ length: 61 }, (_, i) => 2010 - i).map((y) => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Geographic Country Dropdown */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 block">Country of Residence</label>
                            <select
                              required
                              value={signupCountry}
                              onChange={(e) => setSignupCountry(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800"
                            >
                              <option value="Cameroon">Cameroon</option>
                              <option value="Nigeria">Nigeria</option>
                              <option value="Ghana">Ghana</option>
                              <option value="Kenya">Kenya</option>
                              <option value="South Africa">South Africa</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          {/* Checkboxes */}
                          <div className="space-y-3 pt-1">
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                id="signup_optin"
                                checked={signupOptIn}
                                onChange={(e) => setSignupOptIn(e.target.checked)}
                                className="w-4 h-4 rounded text-[#D7263D] border-slate-300 focus:ring-[#D7263D] mt-0.5"
                              />
                              <label htmlFor="signup_optin" className="text-[11px] text-slate-500 select-none cursor-pointer leading-tight">
                                Send me essential first aid alerts, compliance tips, and news updates to stay prepared.
                              </label>
                            </div>

                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                id="signup_agree"
                                required
                                checked={signupAgreeTerms}
                                onChange={(e) => setSignupAgreeTerms(e.target.checked)}
                                className="w-4 h-4 rounded text-[#D7263D] border-slate-300 focus:ring-[#D7263D] mt-0.5"
                              />
                              <label htmlFor="signup_agree" className="text-[11px] text-slate-500 select-none cursor-pointer leading-tight font-medium">
                                I agree to the <span className="text-[#D7263D] font-bold">firstaid.ly</span> Terms of Service and Privacy Policy. *
                              </label>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full bg-[#D7263D] hover:bg-[#C21D32] text-white font-semibold text-xs py-3.5 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50"
                          >
                            {authLoading ? "Creating account..." : "Create Account"}
                          </button>
                        </form>

                        <div className="text-center pt-2 pb-4">
                          <p className="text-xs text-slate-500">
                            Already have an account?{" "}
                            <button
                              onClick={() => {
                                setIsSignUp(false);
                                setAuthError("");
                              }}
                              className="font-bold text-[#D7263D] hover:underline"
                            >
                              Sign In
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Collapsible Sandbox Bypass Drawer (Positioned nicely at bottom to avoid clutter but allow quick-login) */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-4 transition-all">
                <button
                  type="button"
                  onClick={() => setShowSandboxBypass(!showSandboxBypass)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-slate-900 transition font-mono uppercase tracking-wider"
                >
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    Developer Sandbox Quick-Bypass
                  </span>
                  <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                    {showSandboxBypass ? "HIDE" : "SHOW"}
                  </span>
                </button>

                {showSandboxBypass && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-200/60 animate-fadeIn">
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Choose an active user role below to bypass authentication and audit the platform immediately.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleQuickLogin("student")}
                        className="py-2 px-1 text-[9px] font-mono font-bold uppercase border border-slate-200 rounded-lg bg-white hover:border-[#D7263D] hover:text-[#D7263D] text-slate-600 transition truncate text-center"
                        title="Activate Student Profile"
                      >
                        🎓 Trainee
                      </button>
                      <button
                        onClick={() => handleQuickLogin("instructor")}
                        className="py-2 px-1 text-[9px] font-mono font-bold uppercase border border-slate-200 rounded-lg bg-white hover:border-[#D7263D] hover:text-[#D7263D] text-slate-600 transition truncate text-center"
                        title="Activate Instructor Profile"
                      >
                        🩺 Instructor
                      </button>
                      <button
                        onClick={() => handleQuickLogin("admin")}
                        className="py-2 px-1 text-[9px] font-mono font-bold uppercase border border-slate-200 rounded-lg bg-white hover:border-[#D7263D] hover:text-[#D7263D] text-slate-600 transition truncate text-center"
                        title="Activate Admin Console"
                      >
                        🛡️ Admin
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer text links */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center space-y-1">
                <p>© 2026 FIRSTAID.LY COMPLIANCE SYSTEMS INC.</p>
                <div className="flex gap-3 justify-center text-[9px] font-semibold text-slate-500">
                  <a href="#compliance" className="hover:text-slate-800 transition">SECURITY CODES</a>
                  <span>•</span>
                  <a href="#terms" className="hover:text-slate-800 transition">AUDIT CRITERIA</a>
                </div>
              </div>

            </div>

          </div>
        ) : currentUser.role === "student" ? (
          currentUser.isVerified === false ? (
            <div className="flex-1 overflow-y-auto">
              <StudentVerificationPage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                onVerifyComplete={() => {
                  setCurrentUser({ ...currentUser, isVerified: true });
                }}
              />
            </div>
          ) : (
            /* Student mobile phone simulator */
            <div className="flex-1 overflow-y-auto">
              <PhoneMockup>
              {/* Dynamic app content inside mockup */}
              {studentFlowStep === "catalog" && (
                <div className="flex flex-col h-full bg-slate-50">
                  {/* Top user bar */}
                  <div className="h-16 border-b border-slate-200 px-4 flex justify-between items-center shrink-0 bg-white">
                    <div className="flex items-center gap-2">
                      <div 
                        onClick={() => studentProfilePicInputRef.current?.click()}
                        className="relative group w-9 h-9 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0 shadow-sm cursor-pointer hover:border-rose-400 transition"
                        title="Upload Custom Profile Picture"
                      >
                        {currentUser.profilePic ? (
                          <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          currentUser.name.charAt(0)
                        )}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                          <Camera className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <input 
                        type="file"
                        ref={studentProfilePicInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleStudentProfilePicUpload}
                      />
                      <div>
                        <span className="text-[9px] uppercase font-mono text-slate-400 font-bold">Welcome Responder</span>
                        <h4 className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</h4>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setStudentTab("dashboard")}
                        className={`p-1.5 rounded-lg border text-xs transition flex items-center gap-1 ${
                          studentTab === "dashboard"
                            ? "bg-rose-600 border-rose-500 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm"
                        }`}
                        title="Responder Dashboard"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">Dashboard</span>
                      </button>
                      <button
                        onClick={() => setStudentTab("courses")}
                        className={`p-1.5 rounded-lg border text-xs transition flex items-center gap-1 ${
                          studentTab === "courses"
                            ? "bg-rose-600 border-rose-500 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm"
                        }`}
                        title="Course Decks"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">Courses</span>
                      </button>
                      <button
                        onClick={() => setStudentTab("certificates")}
                        className={`p-1.5 rounded-lg border text-xs transition relative ${
                          studentTab === "certificates"
                            ? "bg-rose-600 border-rose-500 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm"
                        }`}
                        title="My Certifications"
                      >
                        <Award className="w-3.5 h-3.5" />
                        {myProgress?.certificates && myProgress.certificates.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        )}
                      </button>
                      <button
                        onClick={() => setStudentTab("leaderboard")}
                        className={`p-1.5 rounded-lg border text-xs transition relative ${
                          studentTab === "leaderboard"
                            ? "bg-rose-600 border-rose-500 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm"
                        }`}
                        title="Academy Leaderboard"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setStudentTab("profile")}
                        className={`p-1.5 rounded-lg border text-xs transition relative ${
                          studentTab === "profile"
                            ? "bg-rose-600 border-rose-500 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm"
                        }`}
                        title="My Student Profile"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Gamification Stats Ribbon */}
                  <div className="bg-white border-b border-slate-200 p-4 shrink-0 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 font-bold">
                          <Zap className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-mono text-slate-450 font-black leading-none block mb-0.5">Total Experience</span>
                          <div className="flex items-baseline gap-0.5 leading-none">
                            <span className="text-sm font-black text-slate-800">{myProgress?.points ?? 0}</span>
                            <span className="text-[8px] text-slate-400 font-bold font-mono">XP</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] uppercase font-mono text-slate-450 font-black block leading-none mb-0.5">Compliance Grade</span>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-150 px-2 py-0.5 rounded-full uppercase leading-none">
                          Lvl {Math.floor((myProgress?.points ?? 0) / 1000) + 1}
                        </span>
                      </div>
                    </div>

                    {/* XP Progress Slider bar to next level */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-slate-400 font-mono font-bold leading-none">
                        <span>Lvl {Math.floor((myProgress?.points ?? 0) / 1000) + 1}</span>
                        <span>{((myProgress?.points ?? 0) % 1000)} / 1000 XP to Next Lvl</span>
                        <span>Lvl {Math.floor((myProgress?.points ?? 0) / 1000) + 2}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-500"
                          style={{ width: `${((myProgress?.points ?? 0) % 1000) / 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Earned Badges Carousel */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[9px] uppercase font-mono text-slate-450 font-black block mb-1.5 leading-none">Earned Skills & Badges</span>
                      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {(myProgress?.badges ?? ["welcome"]).map((badgeKey) => {
                          const detail = BADGE_MAP[badgeKey] || BADGE_MAP.welcome;
                          return (
                            <div
                              key={badgeKey}
                              title={detail.desc}
                              className={`flex items-center gap-1 shrink-0 text-[10px] font-black border px-2 py-1 rounded-lg ${detail.bg} ${detail.text} shadow-sm transition-transform hover:scale-105`}
                            >
                              <span>{detail.icon}</span>
                              <span>{detail.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {studentTab === "dashboard" ? (
                    /* KHAN ACADEMY STYLE LEARNER DASHBOARD */
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
                      {/* Khan Academy Header Banner */}
                      <div className="bg-[#0b2545] text-white p-4 rounded-2xl shadow-lg border border-slate-800 space-y-4 relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={currentUser.profilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                                alt={currentUser.name}
                                className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0b2545] rounded-full" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-950/80 border border-teal-700/50 px-2 py-0.5 rounded-md">
                                  Khan Learner Portal
                                </span>
                                <span className="text-[10px] text-slate-300 font-mono">ID: #{currentUser.id.substring(0, 6)}</span>
                              </div>
                              <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                                Welcome back, {currentUser.name}!
                              </h3>
                              <p className="text-[11px] text-slate-300">
                                First Aid Trainee • {countryContext} Regional Chapter
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setStudentTab("courses")}
                            className="bg-[#1865f2] hover:bg-[#1052ce] text-white text-xs font-bold py-2 px-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Resume Course</span>
                          </button>
                        </div>

                        {/* Khan Academy Gamification Ribbon */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-700/60 text-xs">
                          <div className="bg-slate-900/60 border border-slate-750 p-2.5 rounded-xl flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                              <Zap className="w-4 h-4 fill-current" />
                            </div>
                            <div>
                              <span className="text-[9px] uppercase text-slate-400 font-bold block leading-none">Energy Points</span>
                              <span className="text-xs font-black text-amber-300">{myProgress?.points ?? 1250} XP</span>
                            </div>
                          </div>

                          <div className="bg-slate-900/60 border border-slate-750 p-2.5 rounded-xl flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                              <Flame className="w-4 h-4 fill-current" />
                            </div>
                            <div>
                              <span className="text-[9px] uppercase text-slate-400 font-bold block leading-none">Learning Streak</span>
                              <span className="text-xs font-black text-rose-300">5 Days 🔥</span>
                            </div>
                          </div>

                          <div className="bg-slate-900/60 border border-slate-750 p-2.5 rounded-xl flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                              <Award className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] uppercase text-slate-400 font-bold block leading-none">Badges Earned</span>
                              <span className="text-xs font-black text-emerald-300">{myProgress?.badges?.length ?? 4} Badges</span>
                            </div>
                          </div>

                          <div className="bg-slate-900/60 border border-slate-750 p-2.5 rounded-xl flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                              <Trophy className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] uppercase text-slate-400 font-bold block leading-none">Mastery Level</span>
                              <span className="text-xs font-black text-indigo-300">Level {Math.floor((myProgress?.points ?? 0) / 1000) + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Dashboard Layout Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* LEFT / MAIN COLUMN (2 cols) */}
                        <div className="lg:col-span-2 space-y-4">
                          {/* My Courses / Active Learning Card */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm hover:border-[#1865f2]/40 transition">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">My Active Courses</h4>
                                  <p className="text-[10px] text-slate-500">Resume your emergency responder mastery curriculum</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setStudentTab("courses")}
                                className="text-[11px] font-bold text-[#1865f2] hover:underline"
                              >
                                View All ({courses.length}) →
                              </button>
                            </div>

                            {/* Enrolled Course Highlight */}
                            {courses.length > 0 && (
                              <div className="p-3.5 bg-gradient-to-r from-slate-50 to-teal-50/30 border border-slate-200 rounded-xl space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                                      Active Module
                                    </span>
                                    <h5 className="text-sm font-extrabold text-slate-900 mt-1">{courses[0].title}</h5>
                                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{courses[0].description}</p>
                                  </div>
                                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shrink-0">
                                    68% Mastered
                                  </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                    <span>Unit 2: CPR & Airway Management</span>
                                    <span>3 / 5 Lessons Done</span>
                                  </div>
                                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-600 rounded-full w-[68%] transition-all duration-500" />
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                  <button
                                    onClick={() => {
                                      setSelectedCourse(courses[0]);
                                      setStudentFlowStep("lessons");
                                      setStudentTab("courses");
                                    }}
                                    className="flex-1 bg-[#1865f2] hover:bg-[#1052ce] text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Resume Lesson 3: Adult CPR</span>
                                  </button>
                                  <button
                                    onClick={() => setStudentTab("courses")}
                                    className="px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition"
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Additional Enrolled Course Decks */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {courses.slice(1, 3).map((crs) => (
                                <div key={crs.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 hover:bg-white transition">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-mono text-slate-400 uppercase font-bold">{crs.category || "First Aid"}</span>
                                    <span className="font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Practicing</span>
                                  </div>
                                  <h6 className="text-xs font-bold text-slate-800 line-clamp-1">{crs.title}</h6>
                                  <button
                                    onClick={() => {
                                      setSelectedCourse(crs);
                                      setStudentFlowStep("lessons");
                                      setStudentTab("courses");
                                    }}
                                    className="text-[10.5px] font-bold text-[#1865f2] hover:underline block pt-1"
                                  >
                                    Start Module →
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Khan Academy Weekly Goal Tracker */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center">
                                  <Target className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Weekly Learning Goal</h4>
                                  <p className="text-[10px] text-slate-500">45 minutes target per week for skill retention</p>
                                </div>
                              </div>
                              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                35 / 45 Mins
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div className="h-full bg-indigo-600 rounded-full w-[78%] transition-all duration-500" />
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                                <span>78% completed this week</span>
                                <span>10 mins remaining</span>
                              </div>
                            </div>

                            {/* Daily Activity Calendar */}
                            <div className="grid grid-cols-7 gap-1 pt-1 text-center">
                              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                                const isDone = idx < 5;
                                return (
                                  <div key={day} className={`p-2 rounded-xl text-center border transition ${isDone ? "bg-teal-50 border-teal-200 text-teal-800" : "bg-slate-50 border-slate-150 text-slate-400"}`}>
                                    <span className="text-[9px] font-bold block uppercase">{day}</span>
                                    {isDone ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mx-auto mt-1" />
                                    ) : (
                                      <div className="w-2 h-2 rounded-full bg-slate-300 mx-auto mt-2" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Unit Mastery Breakdown */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                                <span>Unit Mastery Breakdown</span>
                              </h4>
                              <span className="text-[10px] text-slate-400 font-bold">4 Skills Measured</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-extrabold text-slate-800">🫀 Adult CPR</span>
                                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">100% Mastered</span>
                                </div>
                                <div className="h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-600 w-full" />
                                </div>
                              </div>

                              <div className="p-3 bg-teal-50/50 border border-teal-200/60 rounded-xl space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-extrabold text-slate-800">⚡ AED Operation</span>
                                  <span className="text-[9.5px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">80% Proficient</span>
                                </div>
                                <div className="h-1.5 bg-teal-200/60 rounded-full overflow-hidden">
                                  <div className="h-full bg-teal-600 w-[80%]" />
                                </div>
                              </div>

                              <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-extrabold text-slate-800">🩹 Hemorrhage Control</span>
                                  <span className="text-[9.5px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">50% Practicing</span>
                                </div>
                                <div className="h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500 w-[50%]" />
                                </div>
                              </div>

                              <div className="p-3 bg-indigo-50/50 border border-indigo-200/60 rounded-xl space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-extrabold text-slate-800">🫁 Choking & Airway</span>
                                  <span className="text-[9.5px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">40% Attempted</span>
                                </div>
                                <div className="h-1.5 bg-indigo-200/60 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 w-[40%]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN / SIDEBAR (1 col) */}
                        <div className="space-y-4">
                          {/* Badges & Achievements Shelf */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span>Badges Shelf</span>
                              </h4>
                              <button
                                onClick={() => setStudentTab("certificates")}
                                className="text-[10px] font-bold text-[#1865f2] hover:underline"
                              >
                                Certifications →
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {(myProgress?.badges ?? ["welcome", "cpr_starter", "quiz_master"]).map((badgeKey) => {
                                const detail = BADGE_MAP[badgeKey] || BADGE_MAP.welcome;
                                return (
                                  <div
                                    key={badgeKey}
                                    className={`p-2.5 rounded-xl border text-center space-y-1 transition hover:scale-102 ${detail.bg} ${detail.text}`}
                                  >
                                    <span className="text-lg block">{detail.icon}</span>
                                    <span className="text-[10.5px] font-extrabold block truncate">{detail.label}</span>
                                    <span className="text-[9px] opacity-80 block line-clamp-1">{detail.desc}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Quick Emergency Protocol Guides */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                                <Search className="w-3.5 h-3.5 text-[#1865f2]" />
                                <span>Quick Emergency Reference</span>
                              </h4>
                            </div>

                            <div className="space-y-1.5">
                              <button
                                onClick={() => setStudentTab("courses")}
                                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between transition group"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-base">🫀</span>
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#1865f2]">CPR Protocol Guide</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                              </button>

                              <button
                                onClick={() => setStudentTab("courses")}
                                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between transition group"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-base">🫁</span>
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#1865f2]">Choking Relief Protocol</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                              </button>

                              <button
                                onClick={() => setStudentTab("courses")}
                                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between transition group"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-base">🩹</span>
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#1865f2]">Bleeding & Tourniquet Guide</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                              </button>
                            </div>
                          </div>

                          {/* Emergency Contacts Box */}
                          <div className="bg-gradient-to-br from-rose-900 to-slate-900 text-white rounded-2xl p-4 space-y-2.5 shadow-md">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="flex items-center gap-1.5 text-rose-300">
                                <Phone className="w-3.5 h-3.5" />
                                <span>SAMU Dispatch ({countryContext})</span>
                              </span>
                              <span className="text-[9px] bg-rose-950 border border-rose-800 text-rose-300 px-1.5 py-0.5 rounded font-mono">24/7 ACTIVE</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-slate-950/80 border border-rose-900/60 p-2.5 rounded-xl font-mono">
                                <span className="text-[8.5px] text-slate-400 block font-sans font-bold">SAMU AMBULANCE</span>
                                <span className="text-rose-400 font-black text-sm">119</span>
                              </div>
                              <div className="bg-slate-950/80 border border-rose-900/60 p-2.5 rounded-xl font-mono">
                                <span className="text-[8.5px] text-slate-400 block font-sans font-bold">FIRE & RESCUE</span>
                                <span className="text-rose-400 font-black text-sm">118</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : studentTab === "courses" ? (
                    <div className="flex-1 overflow-hidden">
                      <CourseCatalog
                        courses={courses}
                        studentProgress={myProgress}
                        countryContext={countryContext}
                        setCountryContext={setCountryContext}
                        onSelectCourse={(course) => {
                          setSelectedCourse(course);
                          setStudentFlowStep("lessons");
                        }}
                      />
                    </div>
                  ) : studentTab === "certificates" ? (
                    /* My Digital Certificates mobile screen */
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 mb-0.5">My Credentials</h2>
                        <p className="text-[10px] text-slate-500 font-medium">Verifiable active certifications and regulatory proofs.</p>
                      </div>

                      {myProgress?.certificates && myProgress.certificates.length > 0 ? (
                        <div className="space-y-3">
                          {myProgress.certificates.map((cert) => {
                            const isCertExp = cert.status === "expired";
                            const isCertWarning = cert.status === "expiring";

                            return (
                              <div
                                key={cert.id}
                                className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 relative overflow-hidden shadow-sm"
                              >
                                <div className="flex justify-between items-start gap-1">
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-900">{cert.courseTitle}</h4>
                                    <span className="text-[9px] font-mono text-slate-400 font-semibold">Cred ID: {cert.id}</span>
                                  </div>
                                  <span
                                    className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                                      isCertExp
                                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                                        : isCertWarning
                                        ? "bg-amber-50 text-amber-600 border border-amber-250 animate-pulse"
                                        : "bg-emerald-50 text-emerald-600 border border-emerald-250"
                                    }`}
                                  >
                                    {cert.status}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-1.5 text-[9px] border-t border-slate-100 pt-2.5">
                                  <div>
                                    <span className="text-slate-400 block font-bold">ISSUED</span>
                                    <span className="text-slate-700 font-medium">{new Date(cert.issueDate).toLocaleDateString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-bold">EXPIRES</span>
                                    <span className={isCertExp ? "text-rose-600 font-bold" : isCertWarning ? "text-amber-600 font-bold" : "text-slate-700 font-medium"}>
                                      {new Date(cert.expiryDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    setActiveCertificate(cert);
                                    setStudentFlowStep("certificate");
                                  }}
                                  className="w-full text-center text-[10px] bg-rose-50 hover:bg-rose-100/80 text-rose-600 font-bold py-2 rounded-lg border border-rose-150 shadow-sm transition"
                                >
                                  View / Download Digital PDF Card
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="border border-dashed border-slate-200 bg-white rounded-2xl py-12 px-4 text-center shadow-sm">
                          <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <h4 className="text-xs font-semibold text-slate-700">No Certificates Earned Yet</h4>
                          <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto mt-1 leading-relaxed">
                            Complete curriculum lessons, score over 70% in the quiz, and pass the emergency simulation.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : studentTab === "leaderboard" ? (
                    /* Leaderboard Tab Screen */
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-bold text-slate-900 mb-0.5">Triage Leaderboard</h2>
                          <p className="text-[10px] text-slate-500 font-medium">Friendly workspace competition driving compliance.</p>
                        </div>
                        <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                      </div>

                      {/* Ranking list */}
                      <div className="space-y-2.5">
                        {(() => {
                          const sortedProgress = [...progress]
                            .map((p) => {
                              let pts = p.points ?? 0;
                              let bdgs = p.badges ?? ["welcome"];
                              if (pts === 0) {
                                // Fallback calculation
                                if (p.completedQuizzes) {
                                  Object.values(p.completedQuizzes).forEach((q: any) => { pts += q.score * 100; });
                                }
                                if (p.completedSimulations) {
                                  Object.values(p.completedSimulations).forEach((s: any) => { pts += s.score * 5; });
                                }
                                if (p.certificates) {
                                  p.certificates.forEach((c: any) => { if (c.status === "active") pts += 500; });
                                }
                              }
                              return { ...p, points: pts, badges: bdgs };
                            })
                            .sort((a, b) => b.points - a.points);

                          return sortedProgress.map((item, index) => {
                            const isMe = item.studentId === currentUser?.id;
                            const rank = index + 1;
                            const isTop3 = rank <= 3;
                            const rankColor = rank === 1 ? "bg-amber-100 text-amber-700 border-amber-300" : rank === 2 ? "bg-slate-100 text-slate-700 border-slate-300" : rank === 3 ? "bg-orange-100 text-orange-700 border-orange-300" : "bg-slate-50 text-slate-500 border-slate-200";
                            const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";

                            return (
                              <div
                                key={item.studentId}
                                className={`flex items-center justify-between border rounded-xl p-3 bg-white transition shadow-sm ${
                                  isMe ? "border-amber-400 bg-amber-50/20 shadow-md ring-1 ring-amber-400/30 animate-pulse" : "border-slate-200"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Rank Indicator */}
                                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold ${rankColor}`}>
                                    {medalEmoji ? medalEmoji : rank}
                                  </div>

                                  {/* Profile Picture */}
                                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-slate-200 text-rose-600 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0 shadow-sm">
                                    {item.profilePic ? (
                                      <img src={item.profilePic} alt={item.studentName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      item.studentName.charAt(0)
                                    )}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-800">{item.studentName}</span>
                                      {isMe && (
                                        <span className="text-[8px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded uppercase">You</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold mt-0.5 leading-none">
                                      <Zap className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                      <span>Grade {Math.floor(item.points / 1000) + 1}</span>
                                      <span className="text-slate-300">•</span>
                                      <span>{item.badges.length} Badges</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right font-mono">
                                  <span className="text-xs font-black text-slate-850 block leading-none">{item.points}</span>
                                  <span className="text-[8px] text-slate-400 uppercase tracking-wider font-bold leading-none block mt-0.5">XP Points</span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  ) : (
                    /* Profile Tab Screen */
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 mb-0.5">My Profile</h2>
                        <p className="text-[10px] text-slate-500 font-medium">Update your profile info and credential settings.</p>
                      </div>
                      
                      <UserProfileForm
                        currentUser={currentUser}
                        onUpdateUser={(updated) => {
                          setCurrentUser(updated);
                          localStorage.setItem("firstaid_user", JSON.stringify(updated));
                          // Update the student progress list in memory too
                          setProgress((prev) =>
                            prev.map((p) => (p.studentId === updated.id ? { ...p, studentName: updated.name, studentEmail: updated.email, profilePic: updated.profilePic } : p))
                          );
                        }}
                        isMobileMockup={true}
                      />
                    </div>
                  )}
                </div>
              )}

              {studentFlowStep === "lessons" && selectedCourse && (
                <LessonViewer
                  course={selectedCourse}
                  countryContext={countryContext}
                  onCompleteLessons={() => setStudentFlowStep("quiz")}
                  onBackToCatalog={() => {
                    setSelectedCourse(null);
                    setStudentFlowStep("catalog");
                  }}
                />
              )}

              {studentFlowStep === "quiz" && selectedCourse && (
                <QuizRunner
                  course={selectedCourse}
                  studentId={currentUser.id}
                  onSubmitQuiz={handleSubmitQuiz}
                  onBackToLessons={() => setStudentFlowStep("lessons")}
                />
              )}

              {studentFlowStep === "simulation" && selectedCourse && (
                <SimulationRunner
                  course={selectedCourse}
                  studentId={currentUser.id}
                  countryContext={countryContext}
                  onCompleteSimulation={handleCompleteSimulation}
                  onBackToQuiz={() => setStudentFlowStep("quiz")}
                />
              )}

              {studentFlowStep === "certificate" && activeCertificate && (
                <div className="flex flex-col h-full bg-slate-50 overflow-y-auto p-4">
                  <div className="h-10 flex items-center shrink-0 mb-4">
                    <button
                      onClick={() => {
                        setActiveCertificate(null);
                        setStudentFlowStep("catalog");
                        setStudentTab("certificates");
                      }}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to My Academy
                    </button>
                  </div>
                  <CertificateBadge
                    certificate={activeCertificate}
                    onClose={() => {
                      setActiveCertificate(null);
                      setStudentFlowStep("catalog");
                      setStudentTab("certificates");
                    }}
                  />
                </div>
              )}
            </PhoneMockup>
          </div>
          )
        ) : (
          /* Instructor/Admin Compliance & Control Center (Web Workspace) */
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar navigation */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex">
              <div className="p-4 space-y-6">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Instructor Workspace</span>
                  <div className="text-xs font-bold text-slate-850 mt-1">Triage Regulatory Admin</div>
                </div>

                <nav className="space-y-1 font-medium">
                  <button
                    onClick={() => setWorkspaceTab("compliance")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      workspaceTab === "compliance"
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Student Directory & Trackers
                  </button>

                  <button
                    onClick={() => setWorkspaceTab("courses")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      workspaceTab === "courses"
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Curriculum & Course Materials
                  </button>

                  <button
                    onClick={() => setWorkspaceTab("notifications")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      workspaceTab === "notifications"
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    Automated Alerts & Expiries
                  </button>

                  <button
                    onClick={() => setWorkspaceTab("profile")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      workspaceTab === "profile"
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    My Personal Profile
                  </button>
                </nav>
              </div>

              {/* Version details footer */}
              <div className="p-4 border-t border-slate-200 text-[10px] text-slate-400 font-bold font-mono flex items-center justify-between">
                <span>V1.4.2 Production</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  Connected
                </span>
              </div>
            </aside>

            {/* Main Content Workspace Panel */}
            <main className="flex-1 bg-slate-50 overflow-y-auto p-6 md:p-8">
              {/* Mobile Sidebar Replacement Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-4 mb-6 border-b border-slate-200 md:hidden">
                <button
                  onClick={() => setWorkspaceTab("compliance")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    workspaceTab === "compliance" ? "bg-rose-600 text-white" : "bg-white border border-slate-200 text-slate-500"
                  }`}
                >
                  Compliance Trackers
                </button>
                <button
                  onClick={() => setWorkspaceTab("courses")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    workspaceTab === "courses" ? "bg-rose-600 text-white" : "bg-white border border-slate-200 text-slate-500"
                  }`}
                >
                  Curriculum Editor
                </button>
                <button
                  onClick={() => setWorkspaceTab("notifications")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    workspaceTab === "notifications" ? "bg-rose-600 text-white" : "bg-white border border-slate-200 text-slate-500"
                  }`}
                >
                  Alerts Sandbox
                </button>
                <button
                  onClick={() => setWorkspaceTab("profile")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    workspaceTab === "profile" ? "bg-rose-600 text-white" : "bg-white border border-slate-200 text-slate-500"
                  }`}
                >
                  My Profile
                </button>
              </div>

              {/* ----------------- TAB 1: COMPLIANCE DIRECTORY ----------------- */}
              {workspaceTab === "compliance" && (
                <div className="space-y-6">
                  {/* Brief Header details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Compliance Directory</h2>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        Review real-time completed modules, scorecards, advisor evaluations, and active safety certificates.
                      </p>
                    </div>

                    {/* Quick Stat indicators */}
                    <div className="flex gap-2.5">
                      <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center min-w-[90px] shadow-sm">
                        <span className="text-[9px] uppercase font-mono text-slate-400 font-bold">Active</span>
                        <div className="text-sm font-bold text-emerald-600 mt-0.5">
                          {progress.reduce((acc, p) => acc + (p.certificates?.filter((c) => c.status === "active").length || 0), 0)}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center min-w-[90px] shadow-sm">
                        <span className="text-[9px] uppercase font-mono text-slate-400 font-bold">Expiring</span>
                        <div className="text-sm font-bold text-amber-600 mt-0.5">
                          {progress.reduce((acc, p) => acc + (p.certificates?.filter((c) => c.status === "expiring").length || 0), 0)}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center min-w-[90px] shadow-sm">
                        <span className="text-[9px] uppercase font-mono text-slate-400 font-bold">Expired</span>
                        <div className="text-sm font-bold text-rose-600 mt-0.5">
                          {progress.reduce((acc, p) => acc + (p.certificates?.filter((c) => c.status === "expired").length || 0), 0)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual Certificate Grant Trigger Area */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-rose-600 mb-3.5">
                      <UserCheck className="w-4 h-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Manual Safety Certifications Grant</h3>
                    </div>

                    <form onSubmit={handleManualCertify} className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 items-end">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Select Responder</label>
                        <select
                          required
                          value={selectedStudentForCert || ""}
                          onChange={(e) => setSelectedStudentForCert(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none shadow-sm font-semibold"
                        >
                          <option value="">-- Choose Student --</option>
                          {progress.map((p) => (
                            <option key={p.studentId} value={p.studentId}>
                              {p.studentName} ({p.studentEmail})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Select Discipline</label>
                        <select
                          required
                          value={selectedCourseForCert || ""}
                          onChange={(e) => setSelectedCourseForCert(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none shadow-sm font-semibold"
                        >
                          <option value="">-- Choose Course --</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Duration (Months)</label>
                        <select
                          value={durationForCert}
                          onChange={(e) => setDurationForCert(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none shadow-sm font-semibold"
                        >
                          <option value={6}>6 Months</option>
                          <option value={12}>1 Year</option>
                          <option value={24}>2 Years</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={!selectedStudentForCert || !selectedCourseForCert}
                        className="bg-rose-600 hover:bg-rose-500 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                      >
                        Grant Safety Credential
                      </button>
                    </form>
                  </div>

                  {/* Matrix table of Student progress */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Enrollment Matrix</span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">Updates automatically on progress save events</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="py-3.5 px-4 font-bold">Responder Name</th>
                            <th className="py-3.5 px-4 font-bold">Quizzes Completed</th>
                            <th className="py-3.5 px-4 font-bold">Practical Simulations</th>
                            <th className="py-3.5 px-4 font-bold">Current Certifications</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {progress.map((row) => (
                            <tr key={row.studentId} className="hover:bg-slate-50 transition">
                              <td className="py-4 px-4">
                                <span className="font-bold text-slate-800 block">{row.studentName}</span>
                                <span className="text-[10px] text-slate-400 font-bold">{row.studentEmail}</span>
                              </td>
                              
                              <td className="py-4 px-4 space-y-1 text-[11px]">
                                {Object.keys(row.completedQuizzes).length === 0 ? (
                                  <span className="text-slate-450 italic">None yet</span>
                                ) : (
                                  Object.entries(row.completedQuizzes).map(([courseId, val]: [string, any]) => {
                                    const c = courses.find((crs) => crs.id === courseId);
                                    return (
                                      <div key={courseId} className="flex items-center gap-1.5">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="font-bold text-slate-700">{c?.title ? c.title.substring(0, 20) + "..." : "Ref"}:</span>
                                        <span className="font-mono text-slate-500 font-bold">
                                          ({val.score}/{val.maxScore})
                                        </span>
                                      </div>
                                    );
                                  })
                                )}
                              </td>

                              <td className="py-4 px-4 space-y-1 text-[11px]">
                                {Object.keys(row.completedSimulations).length === 0 ? (
                                  <span className="text-slate-450 italic">None yet</span>
                                ) : (
                                  Object.entries(row.completedSimulations).map(([courseId, val]: [string, any]) => {
                                    const c = courses.find((crs) => crs.id === courseId);
                                    return (
                                      <div key={courseId} className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                          {val.passed ? (
                                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                          ) : (
                                            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
                                          )}
                                          <span className="font-bold text-slate-700">{c?.title ? c.title.substring(0, 16) + "..." : "Ref"}:</span>
                                          <span className="font-mono text-slate-500 font-bold">Score: {val.score}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 italic pl-3 truncate max-w-[200px]" title={val.feedback}>
                                          "{val.feedback}"
                                        </p>
                                      </div>
                                    );
                                  })
                                )}
                              </td>

                              <td className="py-4 px-4 space-y-1 text-[11px]">
                                {(!row.certificates || row.certificates.length === 0) ? (
                                  <span className="text-rose-600 font-mono text-[10px] uppercase font-bold bg-rose-50 px-2 py-1 rounded border border-rose-200">NOT COMPLIANT</span>
                                ) : (
                                  row.certificates.map((cert) => {
                                    const isExp = cert.status === "expired";
                                    const isWarn = cert.status === "expiring";

                                    return (
                                      <div key={cert.id} className="flex items-center justify-between border border-slate-200 p-1.5 rounded-lg bg-slate-50 max-w-[240px] shadow-sm">
                                        <div>
                                          <span className="font-bold text-[10px] text-slate-800 block truncate max-w-[140px]">{cert.courseTitle}</span>
                                          <span className="text-[8px] text-slate-400 font-bold">Exp: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                        <span className={`text-[8px] font-bold uppercase px-1 py-0.5 rounded border ${
                                          isExp ? "bg-rose-50 text-rose-600 border-rose-200" : isWarn ? "bg-amber-50 text-amber-600 border-amber-250 animate-pulse" : "bg-emerald-50 text-emerald-600 border-emerald-250"
                                        }`}>
                                          {cert.status}
                                        </span>
                                      </div>
                                    );
                                  })
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- TAB 2: CURRICULUM EDITOR ----------------- */}
              {workspaceTab === "courses" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Curriculum & Course Materials</h2>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        Authors and admins can add or alter training slides, video demonstrators, quiz questions, and critical simulation steps.
                      </p>
                    </div>

                    {!editingCourse && (
                      <button
                        onClick={() => {
                          setIsEditingCourseNew(true);
                          setEditingCourse({
                            title: "",
                            description: "",
                            category: "CPR",
                            lessons: [{ title: "First aid introduction", content: "Details here..." }],
                            videoUrl: "https://www.youtube.com/embed/O_49wMboL8g",
                            quizQuestions: [
                              { id: `q-${Date.now()}`, question: "Sample question?", options: ["Opt 1", "Opt 2", "Correct Opt", "Opt 4"], correctAnswerIndex: 2, explanation: "Clinical justification here." }
                            ],
                            simulationScenario: {
                              title: "Emergency Crisis Simulation",
                              description: "Scenario description details...",
                              initialState: "First person perspective on findings...",
                              criticalSteps: ["Check the scene for hazards", "Assess the breathing", "Notify dispatch early"]
                            }
                          });
                        }}
                        className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition shadow-lg shadow-rose-600/10"
                      >
                        <Plus className="w-4 h-4" /> Add Training Module
                      </button>
                    )}
                  </div>

                  {/* Dynamic Form Editor */}
                  {editingCourse ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => setEditingCourse(null)}
                          className="bg-white hover:bg-slate-50 text-slate-500 text-xs py-1.5 px-3 rounded-lg border border-slate-200 shadow-sm font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>

                      <h3 className="text-sm font-black uppercase tracking-widest text-rose-600 mb-6">
                        {isEditingCourseNew ? "Design Brand New Course Material" : `Alter details: ${editingCourse.title}`}
                      </h3>

                      <form onSubmit={handleSaveCurriculum} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Course Title</label>
                            <input
                              type="text"
                              required
                              value={editingCourse.title || ""}
                              onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                              placeholder="e.g. Advanced Pediatric CPR & Choking Rescue"
                              className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-3 text-slate-800 focus:outline-none shadow-sm font-medium"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Triage Category</label>
                            <select
                              value={editingCourse.category || "CPR"}
                              onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value as any })}
                              className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-3 text-slate-800 focus:outline-none shadow-sm font-semibold"
                            >
                              <option value="CPR">CPR / AED</option>
                              <option value="Choking">Choking Rescue</option>
                              <option value="Bleeding">Severe Bleeding</option>
                              <option value="Other">Other First-Aid</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Brief Course Description</label>
                          <textarea
                            required
                            rows={2}
                            value={editingCourse.description || ""}
                            onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                            placeholder="Provide details for target compliance certification..."
                            className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-3 text-slate-800 focus:outline-none placeholder-slate-400 shadow-sm font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-500 font-bold font-mono">Demo Video Stream URL (Embeddable YouTube)</label>
                          <input
                            type="url"
                            value={editingCourse.videoUrl || ""}
                            onChange={(e) => setEditingCourse({ ...editingCourse, videoUrl: e.target.value })}
                            placeholder="e.g. https://www.youtube.com/embed/O_49wMboL8g"
                            className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-3 text-slate-800 focus:outline-none font-mono shadow-sm"
                          />
                        </div>

                        {/* Lessons text slider inline setup */}
                        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block">Lesson Notes & Slides ({editingCourse.lessons?.length || 0})</span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextLessons = [...(editingCourse.lessons || [])];
                                nextLessons.push({ title: `Lesson Note / Simulation Example ${nextLessons.length + 1}`, content: "Enter slide content or simulation example here..." });
                                setEditingCourse({ ...editingCourse, lessons: nextLessons });
                              }}
                              className="text-[10px] text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 transition"
                            >
                              + Add Note/Example Slide
                            </button>
                          </div>
                          
                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {(editingCourse.lessons || []).map((lesson, index) => (
                              <div key={index} className="bg-white p-3.5 rounded-xl border border-slate-150 space-y-3 shadow-sm relative">
                                <div className="absolute top-2.5 right-2.5">
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextLessons = [...(editingCourse.lessons || [])];
                                        nextLessons.splice(index, 1);
                                        setEditingCourse({ ...editingCourse, lessons: nextLessons });
                                      }}
                                      className="text-[10px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-1 rounded font-bold animate-pulse"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[9px] uppercase font-mono text-slate-400 font-bold">Slide/Note Heading {index + 1}</label>
                                  <input
                                    type="text"
                                    required
                                    value={lesson.title || ""}
                                    onChange={(e) => {
                                      const nextLessons = [...(editingCourse.lessons || [])];
                                      nextLessons[index].title = e.target.value;
                                      setEditingCourse({ ...editingCourse, lessons: nextLessons });
                                    }}
                                    className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none shadow-sm font-medium"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[9px] uppercase font-mono text-slate-400 font-bold">Lesson Theory Content / Notes</label>
                                  <textarea
                                    required
                                    rows={3}
                                    value={lesson.content || ""}
                                    onChange={(e) => {
                                      const nextLessons = [...(editingCourse.lessons || [])];
                                      nextLessons[index].content = e.target.value;
                                      setEditingCourse({ ...editingCourse, lessons: nextLessons });
                                    }}
                                    className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none leading-relaxed shadow-sm font-medium"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Simulation configuration */}
                        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3 shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block">Practical Simulation Scenario</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase font-mono text-slate-400 font-bold">Scenario Dispatch Title</label>
                              <input
                                type="text"
                                required
                                value={editingCourse.simulationScenario?.title || ""}
                                onChange={(e) => {
                                  const sim = { ...(editingCourse.simulationScenario || { title: "", description: "", initialState: "", criticalSteps: [] }) };
                                  sim.title = e.target.value;
                                  setEditingCourse({ ...editingCourse, simulationScenario: sim });
                                }}
                                className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none shadow-sm font-medium"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase font-mono text-slate-400 font-bold">First-hand Findings / Atmosphere</label>
                              <input
                                type="text"
                                required
                                value={editingCourse.simulationScenario?.initialState || ""}
                                onChange={(e) => {
                                  const sim = { ...(editingCourse.simulationScenario || { title: "", description: "", initialState: "", criticalSteps: [] }) };
                                  sim.initialState = e.target.value;
                                  setEditingCourse({ ...editingCourse, simulationScenario: sim });
                                }}
                                className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none shadow-sm font-medium"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase font-mono text-slate-400 font-bold">Scenario Description Context</label>
                            <textarea
                                                    required
                              value={editingCourse.simulationScenario?.description || ""}
                              onChange={(e) => {
                                const sim = { ...(editingCourse.simulationScenario || { title: "", description: "", initialState: "", criticalSteps: [] }) };
                                sim.description = e.target.value;
                                setEditingCourse({ ...editingCourse, simulationScenario: sim });
                              }}
                              className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none shadow-sm font-medium"
                            />
                          </div>
                        </div>

                        {/* Course Uploaded Files & Materials (Instructor Feature) */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Course Reference Materials & Documents</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                              Upload PDFs, clinical guidelines, manuals, or worksheets for students to access directly inside the Lesson Viewer.
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <label className="flex-1 w-full border border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-rose-500 hover:bg-rose-50/20 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                +
                              </span>
                              <span className="text-xs font-semibold text-slate-700">Choose a file to attach</span>
                              <span className="text-[10px] text-slate-400 font-medium">Supports PDF, DOCX, TXT, PNG, JPG (Max 5MB)</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64String = reader.result as string;
                                    if (!base64String) return;

                                    const newFile = {
                                      name: file.name,
                                      size: (file.size / 1024).toFixed(1) + " KB",
                                      type: file.type || "application/octet-stream",
                                      data: base64String
                                    };

                                    const currentFiles = editingCourse.uploadedFiles || [];
                                    setEditingCourse({
                                      ...editingCourse,
                                      uploadedFiles: [...currentFiles, newFile]
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>
                          </div>

                          {editingCourse.uploadedFiles && editingCourse.uploadedFiles.length > 0 ? (
                            <div className="space-y-2 pt-1 border-t border-slate-200/60">
                              <span className="text-[9px] uppercase font-mono text-slate-400 font-black block mb-2 leading-none">
                                Attached Materials ({editingCourse.uploadedFiles.length}):
                              </span>
                              <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                                {editingCourse.uploadedFiles.map((file, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <span className="text-xs">📄</span>
                                      <span className="text-slate-800 truncate" title={file.name}>{file.name}</span>
                                      <span className="text-[9px] text-slate-400 font-mono">({file.size})</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = editingCourse.uploadedFiles?.filter((_, i) => i !== idx) || [];
                                        setEditingCourse({ ...editingCourse, uploadedFiles: updated });
                                      }}
                                      className="text-rose-600 hover:text-rose-500 p-1 font-bold text-[10px] uppercase tracking-wider transition"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-2 text-[11px] text-slate-400 italic font-semibold">
                              No reference documents attached to this course.
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold py-3.5 rounded-xl transition shadow-lg"
                        >
                          Save Modules & Update Academy Curriculum
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* General Grid of Courses list for authors to manage */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-350 transition flex flex-col justify-between shadow-sm"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[9px] font-mono bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-rose-600 font-bold uppercase">
                                {course.category}
                              </span>
                              
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => {
                                    setIsEditingCourseNew(false);
                                    setEditingCourse(course);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                                  title="Edit curriculum details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                                  title="Delete curriculum module"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 leading-snug">{course.title}</h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 line-clamp-2 font-medium">
                              {course.description}
                            </p>

                            <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 font-mono">
                              <div>
                                <span className="block text-slate-400 text-[8px] uppercase font-bold">Lessons</span>
                                <span className="text-slate-800 font-bold">{course.lessons.length}</span>
                              </div>
                              <div>
                                <span className="block text-slate-400 text-[8px] uppercase font-bold">Quizzes</span>
                                <span className="text-slate-800 font-bold">{course.quizQuestions.length}</span>
                              </div>
                              <div>
                                <span className="block text-slate-400 text-[8px] uppercase font-bold">Sim Steps</span>
                                <span className="text-slate-800 font-bold">
                                  {course.simulationScenario?.criticalSteps?.length || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------- TAB 3: EXPIRY & AUTOMATED ALERTS ----------------- */}
              {workspaceTab === "notifications" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Automated Expiry & Dispatch Alerts</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Setup templates and trigger sandboxed scan routines to automatically verify responder statuses.
                    </p>
                  </div>

                  {/* Top: Force certification scan Sandbox trigger */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                          <Activity className="w-4 h-4" />
                          Automated Daily Certificate Scan Simulation
                        </h3>
                        <p className="text-[11px] text-slate-550 leading-normal mt-1 font-medium">
                          Executes a backend sweep to analyze all student certificates. It recalculates statuses (Expired/Expiring soon) and immediately triggers automated warning emails according to the regulatory templates.
                        </p>
                      </div>

                      <button
                        onClick={handleTriggerScan}
                        disabled={isScanning}
                        className="bg-rose-600 hover:bg-rose-500 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-semibold py-3 px-5 rounded-xl transition shadow-lg shadow-rose-600/10 shrink-0 self-start sm:self-center"
                      >
                        {isScanning ? "Running sweep..." : "Force Background Expiry Scan"}
                      </button>
                    </div>

                    {scanResult && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2.5 shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <CheckCircle className="w-4 h-4" />
                          <span>Scan Sweep Completed Successfully</span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Certificates Scanned</span>
                            <span className="text-sm font-bold text-slate-800">{scanResult.scannedCount}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Expiring Warning Sent</span>
                            <span className="text-sm font-bold text-amber-650">{scanResult.expiringAlertsSent}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Expired Alert Sent</span>
                            <span className="text-sm font-bold text-rose-600">{scanResult.expiredAlertsSent}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Total Dispatches</span>
                            <span className="text-sm font-bold text-rose-600">{scanResult.totalSent}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-450 italic font-semibold">
                          *The backend system updated certificate states based on real-time comparative epoch time, logged entries in dispatch history, and pushed actions into the security journal.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Side-by-side Configuration and Test Area */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Inline Template Editor */}
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Regulatory Email Templates
                      </h3>

                      <div className="space-y-4">
                        {emailTemplates.map((template) => (
                          <div
                            key={template.id}
                            className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm"
                          >
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                              <span className="text-xs font-bold text-slate-800">{template.name}</span>
                              <span className="text-[9px] font-mono text-slate-400 font-bold">ID: {template.id}</span>
                            </div>

                            <div className="space-y-2">
                              <div className="space-y-1">
                                <span className="text-[8px] uppercase font-mono text-slate-450 font-bold">Subject Title Line</span>
                                <input
                                  type="text"
                                  value={template.subject}
                                  onChange={(e) => handleUpdateTemplate(template.id, { subject: e.target.value })}
                                  className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none shadow-sm font-semibold"
                                />
                              </div>

                              <div className="space-y-1">
                                <span className="text-[8px] uppercase font-mono text-slate-450 font-bold">Notification Email Body (Supports Placeholder variables)</span>
                                <textarea
                                  rows={4}
                                  value={template.body}
                                  onChange={(e) => handleUpdateTemplate(template.id, { body: e.target.value })}
                                  className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none font-sans text-slate-600 leading-relaxed shadow-sm font-medium"
                                />
                                <span className="text-[8px] text-slate-400 font-semibold block">
                                  Available: {"{{student_name}}"}, {"{{course_title}}"}, {"{{expiry_date}}"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Manual Test Dispatch Column */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Manual Dispatch Simulator
                      </h3>

                      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <form onSubmit={handleSendTestEmail} className="space-y-4">
                          <p className="text-[11px] text-slate-600 leading-normal font-medium">
                            Manually send any template to a registered student email to inspect and verify dynamic rendering of placeholders.
                          </p>

                          {testEmailSuccessMsg && (
                            <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-700 text-[11px] rounded-lg font-bold">
                              {testEmailSuccessMsg}
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Target Email</label>
                            <select
                              required
                              value={testEmailRecipient}
                              onChange={(e) => setTestEmailRecipient(e.target.value)}
                              className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2.5 text-slate-800 font-semibold focus:outline-none shadow-sm"
                            >
                              <option value="">-- Choose student email --</option>
                              {progress.map((p) => (
                                <option key={p.studentId} value={p.studentEmail}>
                                  {p.studentEmail} ({p.studentName})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Discipline Field</label>
                            <input
                              type="text"
                              value={testEmailCourseTitle}
                              onChange={(e) => setTestEmailCourseTitle(e.target.value)}
                              placeholder="e.g. Cardiopulmonary Resuscitation (CPR)"
                              className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2.5 text-slate-800 font-semibold focus:outline-none shadow-sm"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Template Type</label>
                            <select
                              required
                              value={testEmailTemplateId}
                              onChange={(e) => setTestEmailTemplateId(e.target.value)}
                              className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-2.5 text-slate-800 font-semibold focus:outline-none shadow-sm"
                            >
                              <option value="">-- Choose template --</option>
                              {emailTemplates.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold py-2.5 rounded-lg transition shadow-md shadow-rose-600/10"
                          >
                            <Send className="w-3.5 h-3.5" /> Dispatch Test Email Alert
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Bottom History Log Matrix */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    {/* Live Email Dispatch Logs */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:col-span-2 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 bg-white">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Email Dispatch Logs</span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold">Simulated email dispatch outputs</span>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {emailLogs.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 text-[11px] italic font-semibold">No emails dispatched yet.</div>
                        ) : (
                          [...emailLogs].reverse().map((log) => (
                            <div
                              key={log.id}
                              className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2 text-[11px] shadow-sm"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-bold text-slate-800">{log.recipientName}</span>
                                  <span className="text-slate-400 font-bold font-mono text-[10px] ml-1">({log.recipientEmail})</span>
                                </div>
                                <span className="text-[9px] bg-emerald-50 border border-emerald-250 text-emerald-700 py-0.5 px-1.5 rounded uppercase font-bold">
                                  {log.status}
                                </span>
                              </div>

                              <div>
                                <span className="text-slate-600 font-bold font-mono text-[10px]">Subject: {log.subject}</span>
                                <p className="text-[10px] text-slate-600 whitespace-pre-wrap mt-1 leading-normal border-t border-slate-150 pt-1 font-medium">
                                  {log.body}
                                </p>
                              </div>

                              <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold pt-1">
                                <span>Trigger: {log.triggerType}</span>
                                <span>{new Date(log.sentAt).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Live System Activity Journal */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 bg-white">
                        <span className="text-xs font-bold text-slate-850 uppercase tracking-wider">Triage Audit Logs</span>
                        <span className="text-[9px] text-slate-450 font-mono font-bold">Security Journal</span>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-[10px] pr-1">
                        {systemLogs.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 italic font-semibold">No events logged.</div>
                        ) : (
                          [...systemLogs].reverse().map((log, idx) => (
                            <div key={idx} className="border-b border-slate-100 pb-2 last:border-0">
                              <span className="text-rose-600 font-bold block">
                                {new Date(log.timestamp).toLocaleTimeString()}:
                              </span>
                              <span className="text-slate-650 font-medium">{log.message}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- TAB 4: PERSONAL INSTRUCTOR PROFILE ----------------- */}
              {workspaceTab === "profile" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personal Instructor Profile</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Manage your instructor call-sign, authentication credentials, and secure workstation settings.
                    </p>
                  </div>

                  <div className="flex justify-center md:justify-start">
                    <UserProfileForm
                      currentUser={currentUser}
                      onUpdateUser={(updated) => {
                        setCurrentUser(updated);
                        localStorage.setItem("firstaid_user", JSON.stringify(updated));
                      }}
                      isMobileMockup={false}
                    />
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
        {/* Dynamic, Highly-Polished Google Sign-In Modal (Allows login with actual personal Google accounts) */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-[390px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col p-8 font-sans">
              {/* Google Logo Header */}
              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold font-sans tracking-tight text-slate-800">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight leading-tight">
                  {googleMode === "chooser" ? "Choose an account" : "Sign in with Google"}
                </h3>
                <p className="text-xs text-slate-500">
                  to continue to <span className="font-bold text-rose-600">firstaid.ly</span>
                </p>
              </div>

              {googleMode === "chooser" ? (
                <div className="space-y-3 flex-1">
                  {/* 1. Log in with detected personal account */}
                  <button
                    onClick={() =>
                      executeGoogleSignIn(
                        "njapahalbright@gmail.com",
                        "Njapah Albright",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
                      )
                    }
                    className="w-full flex items-center gap-3.5 p-3 hover:bg-slate-50 border border-slate-250 rounded-xl transition text-left focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-850 leading-snug">Njapah Albright</h4>
                      <p className="text-[10px] text-slate-500 truncate leading-none">njapahalbright@gmail.com</p>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold uppercase">
                      Signed In
                    </span>
                  </button>

                  {/* 2. Choose/Use another account option */}
                  <button
                    onClick={() => setGoogleMode("form")}
                    className="w-full flex items-center gap-3.5 p-3 hover:bg-slate-50 border border-slate-250 rounded-xl transition text-left focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-700 leading-snug">Use another personal account</h4>
                      <p className="text-[10px] text-slate-400">Log in with a different Gmail address</p>
                    </div>
                  </button>

                  <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                    <span>English (United States)</span>
                    <button onClick={() => setShowGoogleModal(false)} className="text-[#1a73e8] hover:underline font-bold">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeGoogleSignIn(googleEmailInput, googleNameInput, googleSelectedAvatar);
                  }}
                  className="space-y-4 flex-1"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Google Email Address</label>
                    <input
                      type="email"
                      required
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="e.g. personal.name@gmail.com"
                      className="w-full bg-white border border-slate-200 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] text-slate-800 font-medium shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white border border-slate-200 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] text-slate-800 font-medium shadow-sm"
                    />
                  </div>

                  {/* Avatar selection for the custom Google sign in */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Choose Google Avatar Photo</label>
                    <div className="flex gap-2 items-center py-1 overflow-x-auto justify-center">
                      {[
                        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
                        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80"
                      ].map((url, index) => {
                        const isSelected = googleSelectedAvatar === url;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setGoogleSelectedAvatar(url)}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition duration-200 shrink-0 ${
                              isSelected ? "border-[#4285F4] scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                            }`}
                          >
                            <img src={url} alt={`avatar-${index}`} className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setGoogleMode("chooser")}
                      className="text-xs text-[#1a73e8] font-bold hover:underline"
                    >
                      Back to Choose Account
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-md"
                    >
                      Next / Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
