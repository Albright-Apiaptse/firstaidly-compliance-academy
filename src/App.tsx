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
  Zap
} from "lucide-react";

import PhoneMockup from "./components/PhoneMockup";
import CourseCatalog from "./components/CourseCatalog";
import LessonViewer from "./components/LessonViewer";
import QuizRunner from "./components/QuizRunner";
import SimulationRunner from "./components/SimulationRunner";
import CertificateBadge from "./components/CertificateBadge";
import StudentVerificationPage from "./components/StudentVerificationPage";
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [signupProfilePic, setSignupProfilePic] = useState("https://api.dicebear.com/7.x/adventurer/svg?seed=Emma");
  const [activeWelcomeImgIndex, setActiveWelcomeImgIndex] = useState(0);

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
  const [studentTab, setStudentTab] = useState<"courses" | "certificates" | "leaderboard">("courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [studentFlowStep, setStudentFlowStep] = useState<"catalog" | "lessons" | "quiz" | "simulation" | "certificate">("catalog");
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [countryContext, setCountryContext] = useState<string>("Cameroon");

  // Instructor/Admin Workspace Navigation
  const [workspaceTab, setWorkspaceTab] = useState<"compliance" | "courses" | "notifications">("compliance");
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
      } else {
        setCurrentUser(data.user);
        // Reset navigation
        setStudentFlowStep("catalog");
        setSelectedCourse(null);
        setStudentTab("courses");
      }
    } catch (err) {
      setAuthError("Could not connect to the backend server.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth - SignUp Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authName) {
      setAuthError("Please provide all fields.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
          name: authName,
          role: authRole,
          profilePic: signupProfilePic
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Registration failed.");
      } else {
        setCurrentUser(data.user);
        setStudentFlowStep("catalog");
        setSelectedCourse(null);
        setStudentTab("courses");
        fetchBackendData();
      }
    } catch (err) {
      setAuthError("Could not connect to the backend server.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth - Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "google.responder@firstaid.ly",
          name: "Dr. Alex Google",
          profilePic: signupProfilePic || "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Google Sign-In failed.");
      } else {
        setCurrentUser(data.user);
        setStudentFlowStep("catalog");
        setSelectedCourse(null);
        setStudentTab("courses");
        fetchBackendData();
      }
    } catch (err) {
      setAuthError("Google authentication connection failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthEmail("");
    setAuthPassword("");
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
          <div className="w-8 h-8 bg-[#D7263D] flex items-center justify-center text-white font-mono font-black text-xs select-none">
            FA
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-[#0B0B0C] uppercase flex items-center gap-2 font-display">
              First Aidly.compliance.training
              <span className="text-[8px] bg-[#0B0B0C] text-white font-mono font-bold px-1.5 py-0.5 tracking-normal">
                ACADEMY
              </span>
            </h1>
            <p className="text-[9px] text-[#8E8E93] uppercase tracking-widest font-mono font-semibold">
              Emergency Compliance Portal
            </p>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-6">
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
            
            {/* LEFT SIDE: Slidebean-inspired Storytelling Presentation Canvas */}
            <div className="flex-1 bg-[#FAFAF9] border-r border-[#0B0B0C]/10 flex flex-col h-full overflow-hidden relative">
              
              {/* Deck Presentation slide navigation menu bar */}
              <div className="h-12 border-b border-[#0B0B0C]/10 px-6 flex items-center justify-between shrink-0 bg-[#FAFAF9]">
                <div className="flex gap-4">
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const labelMap = ["Hero", "Stakes", "Process", "Reference", "AED Map", "Corporate"];
                    const isActive = landingSlide === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setLandingSlide(idx)}
                        className={`text-[9px] uppercase tracking-widest font-mono font-bold border-b-2 py-3 transition ${
                          isActive
                             ? "border-[#D7263D] text-[#0B0B0C]"
                             : "border-transparent text-[#8E8E93] hover:text-[#0B0B0C]"
                        }`}
                      >
                        {labelMap[idx]}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[9px] font-mono text-[#8E8E93]">
                  Section 0{landingSlide + 1} / 06
                </div>
              </div>

              {/* Dynamic Presentation Window */}
              <div className="flex-1 overflow-y-auto p-8 lg:p-14 flex flex-col justify-between">
                
                {/* SLIDE CONTENT AREA */}
                <div className="max-w-xl w-full my-auto space-y-8">
                  {landingSlide === 0 && (
                    <div className="space-y-6 animate-fadeIn">
                      <span className="vital-micro-label text-[#8E8E93] block">
                        FIRST AIDLY.COMPLIANCE.TRAINING — CERTIFIED FIRST AID TRAINING
                      </span>
                      <h1 className="vital-hero-heading text-5xl lg:text-7xl text-[#0B0B0C] tracking-tight font-light">
                        Know what to do before it matters.
                      </h1>
                      <div className="w-12 h-[2px] bg-[#D7263D]"></div>
                      
                      <div className="text-xs text-[#0B0B0C] leading-relaxed max-w-md font-normal space-y-2">
                        <p>
                          First aid training requires absolute clarity and technical authority. We deploy clinical presentation decks paired with real-time diagnostic crisis simulations.
                        </p>
                        <div className="text-[10px] font-mono text-[#8E8E93] flex items-center gap-2 pt-2">
                          <span className="w-2 h-2 rounded-full bg-[#D7263D] animate-ping"></span>
                          <span>ACTIVE COMPLIANCE RECORDS: <strong className="text-[#0B0B0C]">{liveCounter.toLocaleString()}</strong></span>
                        </div>
                      </div>

                      {/* Main Interactive Documentary Visual with Parallax Shift */}
                      <div className="border border-[#0B0B0C]/10 relative group overflow-hidden bg-[#FAFAF9] aspect-video">
                        <img
                          src="/src/assets/images/first_aid_hero_1782836300067.jpg"
                          alt="First Responder Clinical Operations"
                          style={{
                            transform: `translate(${mouseOffset.x * 12}px, ${mouseOffset.y * 12}px) scale(1.04)`,
                            transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
                          }}
                          className="w-full h-full object-cover filter contrast-105"
                        />
                        <div className="absolute bottom-3 left-3 bg-[#FAFAF9] border border-[#0B0B0C]/10 px-2.5 py-1">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-[#0B0B0C] font-semibold">
                            CPR Manikin Training Module • Active Clinical Workspace
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {landingSlide === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                      <span className="vital-micro-label text-[#D7263D] block">
                        CLINICAL REALITY & SURVIVAL STATISTICS
                      </span>
                      <h2 className="text-4xl font-light text-[#0B0B0C] tracking-tight font-display">
                        The stakes of response delay.
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="border-l border-[#0B0B0C] pl-4 space-y-1">
                          <span className="text-6xl font-light font-display text-[#0B0B0C] leading-none block">08%</span>
                          <p className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-semibold">
                            Average survival rate of out-of-hospital cardiac arrest without immediate bystander chest compressions.
                          </p>
                        </div>
                        <div className="border-l border-[#D7263D] pl-4 space-y-1">
                          <span className="text-6xl font-light font-display text-[#D7263D] leading-none block">3x</span>
                          <p className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-semibold">
                            Increase in casualty survival likelihood when bystander CPR is initiated within the first 120 seconds.
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-[#0B0B0C] leading-relaxed max-w-md font-normal">
                        Every minute of delay reduces survival outcomes by 10%. Professional-grade training ensures direct response under intense physical stress conditions.
                      </p>

                      <div className="border border-[#0B0B0C]/10 relative overflow-hidden bg-[#FAFAF9] h-48">
                        <img
                          src="/src/assets/images/first_aid_hero_1782843292024.jpg"
                          alt="First-Aid Trauma Equipment"
                          className="w-full h-full object-cover filter contrast-105"
                        />
                        <div className="absolute bottom-3 left-3 bg-[#FAFAF9] border border-[#0B0B0C]/10 px-2.5 py-1">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-[#0B0B0C] font-semibold">
                            Equipment Spec: Direct Wound Care Supplies
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {landingSlide === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                      <span className="vital-micro-label text-[#8E8E93] block">
                        COMPLIANCE CERTIFICATION PROCESS
                      </span>
                      <h2 className="text-4xl font-light text-[#0B0B0C] tracking-tight font-display">
                        Three steps to compliance.
                      </h2>
                      
                      <div className="space-y-4 pt-2">
                        {[
                          { num: "01", title: "Study clinical curriculum outlines", desc: "Absorb high-resolution, interactive lessons built with certified critical care professionals." },
                          { num: "02", title: "Complete theoretical evaluations", desc: "Pass Randomized Multiple-Choice block evaluations with a strict 70% grading threshold." },
                          { num: "03", title: "Interact with AI emergency simulators", desc: "Execute step-by-step physical crisis responses in live-graded stress scenarios." }
                        ].map((step, idx) => (
                          <div key={idx} className="flex gap-4 border-b border-[#0B0B0C]/10 pb-3 last:border-0">
                            <span className="text-lg font-mono text-[#D7263D] font-bold">{step.num}</span>
                            <div>
                              <h4 className="text-xs uppercase font-mono tracking-wider text-[#0B0B0C] font-bold">{step.title}</h4>
                              <p className="text-[11px] text-[#8E8E93] mt-0.5 leading-relaxed font-normal">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border border-[#0B0B0C]/10 relative overflow-hidden h-40">
                        <img
                          src="/src/assets/images/cpr_guide_1782843315552.jpg"
                          alt="Emergency Clinical Instruction"
                          className="w-full h-full object-cover filter contrast-105"
                        />
                        <div className="absolute bottom-3 left-3 bg-[#FAFAF9] border border-[#0B0B0C]/10 px-2.5 py-1">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-[#0B0B0C] font-semibold">
                            Classroom Compliance: Group First Responder Drills
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {landingSlide === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
                        <div>
                          <span className="vital-micro-label text-[#8E8E93] block">
                            CRITICAL EMERGENCY REFERENCE INDEX
                          </span>
                          <h2 className="text-3xl font-light text-[#0B0B0C] tracking-tight font-display mt-1">
                            Emergency index logs.
                          </h2>
                        </div>
                        {/* Interactive Protocol Search Bar */}
                        <input
                          type="text"
                          value={emergencySearch}
                          onChange={(e) => setEmergencySearch(e.target.value)}
                          placeholder="Filter medical index..."
                          className="bg-white border border-[#0B0B0C]/10 px-3 py-1.5 text-xs w-full md:w-44 focus:outline-none focus:border-[#D7263D] text-[#0B0B0C]"
                        />
                      </div>

                      <div className="border border-[#0B0B0C]/10 divide-y divide-[#0B0B0C]/10 bg-white">
                        {EMERGENCY_PROTOCOLS.filter(p => p.title.toLowerCase().includes(emergencySearch.toLowerCase()) || p.spec.toLowerCase().includes(emergencySearch.toLowerCase()))
                          .map((proto) => {
                            const isExpanded = expandedReference === proto.id;
                            return (
                              <div key={proto.id} className="p-3.5">
                                <button
                                  type="button"
                                  onClick={() => setExpandedReference(isExpanded ? null : proto.id)}
                                  className="w-full text-left flex justify-between items-center"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8px] bg-[#0B0B0C] text-white font-mono px-1.5 py-0.5 uppercase tracking-wider">
                                      {proto.actionLabel}
                                    </span>
                                    <span className="text-xs font-bold tracking-wide text-[#0B0B0C] uppercase font-mono">
                                      {proto.title}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-[#D7263D] font-mono font-bold">
                                    {isExpanded ? "[ CLOSE SPEC ]" : "[ DETAILED SPEC ]"}
                                  </span>
                                </button>
                                
                                {isExpanded && (
                                  <div className="mt-3 pt-3 border-t border-[#0B0B0C]/10 space-y-2 animate-slideIn">
                                    <p className="text-[10.5px] text-[#0B0B0C] bg-[#FAFAF9] p-3 border-l-2 border-[#D7263D] font-mono">
                                      {proto.spec}
                                    </p>
                                    <ul className="space-y-1.5 pl-4 list-decimal text-[11px] text-[#8E8E93] leading-relaxed">
                                      {proto.instructions.map((inst, i) => (
                                        <li key={i}>{inst}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {landingSlide === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      <span className="vital-micro-label text-[#8E8E93] block">
                        DYNAMIC DEPLOYMENT REGISTRY
                      </span>
                      <h2 className="text-4xl font-light text-[#0B0B0C] tracking-tight font-display">
                        Find an AED station.
                      </h2>
                      <p className="text-[11px] text-[#8E8E93] leading-relaxed max-w-md">
                        Enter territory keywords to query regional public access defibrillators (AED) or local regulatory compliance centers.
                      </p>

                      <form onSubmit={handleAedSearch} className="flex gap-1.5">
                        <input
                          type="text"
                          value={aedQuery}
                          onChange={(e) => setAedQuery(e.target.value)}
                          placeholder="e.g. Yaoundé or San Francisco..."
                          className="flex-1 bg-white border border-[#0B0B0C]/10 px-3.5 py-2 text-xs focus:outline-none focus:border-[#D7263D] text-[#0B0B0C]"
                        />
                        <button
                          type="submit"
                          className="bg-[#0B0B0C] hover:bg-[#D7263D] text-white px-5 py-2 text-xs uppercase font-mono tracking-wider font-bold transition duration-150"
                        >
                          {isSearchingAed ? "Querying..." : "Locate"}
                        </button>
                      </form>

                      <div className="space-y-2 max-h-[180px] overflow-y-auto">
                        {aedResults.length > 0 ? (
                          aedResults.map((res, idx) => (
                            <div key={idx} className="bg-white border border-[#0B0B0C]/10 p-3 flex justify-between items-center text-xs">
                              <div className="space-y-0.5">
                                <h4 className="font-mono text-[#0B0B0C] font-bold uppercase text-[10.5px]">{res.name}</h4>
                                <p className="text-[10px] text-[#8E8E93]">{res.location} • <strong className="text-[#D7263D]">{res.dist}</strong></p>
                              </div>
                              <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 uppercase tracking-wide font-mono shrink-0">
                                {res.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="border border-dashed border-[#0B0B0C]/10 p-6 text-center text-[10.5px] text-[#8E8E93]">
                            Enter a region above to query localized compliance databases. Try "Yaoundé" or "San Francisco".
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {landingSlide === 5 && (
                    <div className="space-y-6 animate-fadeIn">
                      <span className="vital-micro-label text-[#D7263D] block">
                        REGULATORY STANDARDS COMPLIANCE
                      </span>
                      <h2 className="text-4xl font-light text-[#0B0B0C] tracking-tight font-display">
                        B2B & Enterprise.
                      </h2>
                      <p className="text-xs text-[#0B0B0C] leading-relaxed font-normal max-w-md">
                        First Aidly.compliance.training fulfills first aid preparedness requirements in strict accordance with OSHA Standard 1910.151, MENT, and AHA/ILCOR emergency consensus reviews.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="bg-white p-3.5 border border-[#0B0B0C]/10 space-y-1">
                          <span className="text-[10px] font-mono text-[#D7263D] font-bold block">OSHA COMPLIANT</span>
                          <p className="text-[10px] text-[#8E8E93]">Satisfies workplace first-aid responder certification protocols.</p>
                        </div>
                        <div className="bg-white p-3.5 border border-[#0B0B0C]/10 space-y-1">
                          <span className="text-[10px] font-mono text-[#0B0B0C] font-bold block">AUTOMATED ALERTS</span>
                          <p className="text-[10px] text-[#8E8E93]">Integrates with HR software to alert before credentials expire.</p>
                        </div>
                      </div>

                      <div className="border border-[#0B0B0C]/10 relative overflow-hidden h-40">
                        <img
                          src="/src/assets/images/tourniquet_guide_1782843341065.jpg"
                          alt="First Responder Clinical Operations"
                          className="w-full h-full object-cover filter contrast-105"
                        />
                        <div className="absolute bottom-3 left-3 bg-[#FAFAF9] border border-[#0B0B0C]/10 px-2.5 py-1">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-[#0B0B0C] font-semibold">
                            Trauma Drill Spec: Tourniquet Compression Layout
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTTOM BRAND FOOTER (Deck view selectors) */}
                <div className="border-t border-[#0B0B0C]/10 pt-6 flex justify-between items-center shrink-0">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <span
                        key={idx}
                        className={`w-4 h-[2px] transition-all duration-200 ${
                          landingSlide === idx ? "bg-[#D7263D] w-8" : "bg-[#0B0B0C]/10"
                        }`}
                      ></span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      disabled={landingSlide === 0}
                      onClick={() => setLandingSlide(prev => prev - 1)}
                      className={`text-[10px] font-mono uppercase tracking-wider transition ${
                        landingSlide === 0 ? "text-[#E5E5EA] cursor-not-allowed" : "text-[#0B0B0C] hover:text-[#D7263D]"
                      }`}
                    >
                      [ PREV SLIDE ]
                    </button>
                    <button
                      type="button"
                      disabled={landingSlide === 5}
                      onClick={() => setLandingSlide(prev => prev + 1)}
                      className={`text-[10px] font-mono uppercase tracking-wider transition ${
                        landingSlide === 5 ? "text-[#E5E5EA] cursor-not-allowed" : "text-[#0B0B0C] hover:text-[#D7263D]"
                      }`}
                    >
                      [ NEXT SLIDE ]
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT SIDE: Dedicated industrial login form & live Sandbox dispatcher */}
            <div className="w-full lg:w-[420px] bg-[#FAFAF9] flex flex-col justify-between overflow-y-auto shrink-0 divide-y divide-[#0B0B0C]/10">
              
              {/* Sandbox Control Console Header */}
              <div className="p-6 space-y-4 bg-white">
                <div className="space-y-1.5">
                  <span className="text-[8px] bg-[#D7263D] text-white px-2 py-0.5 tracking-widest font-mono font-bold uppercase inline-block">
                    DEVELOPER DEMO SYSTEM ACCESS
                  </span>
                  <h3 className="text-xs font-bold text-[#0B0B0C] uppercase tracking-wider font-mono">
                    Sandbox Bypass Portal
                  </h3>
                  <p className="text-[10.5px] leading-relaxed text-[#8E8E93]">
                    This compliance suite features 3 integrated role-based modules. Choose an active user role below to bypass authentication and audit the platform immediately.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleQuickLogin("student")}
                    className="w-full text-left bg-[#FAFAF9] border border-[#0B0B0C]/10 hover:border-[#D7263D] p-3.5 transition flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-[#D7263D] block font-bold">ROLE 01</span>
                      <span className="text-[11px] text-[#0B0B0C] uppercase tracking-wide font-bold">STUDENT COMPLIANCE MODE</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8E8E93] hover:text-[#D7263D]">[ ACTIVATE ]</span>
                  </button>

                  <button
                    onClick={() => handleQuickLogin("instructor")}
                    className="w-full text-left bg-[#FAFAF9] border border-[#0B0B0C]/10 hover:border-[#D7263D] p-3.5 transition flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-[#D7263D] block font-bold">ROLE 02</span>
                      <span className="text-[11px] text-[#0B0B0C] uppercase tracking-wide font-bold">INSTRUCTOR AUDITOR WORKSPACE</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8E8E93] hover:text-[#D7263D]">[ ACTIVATE ]</span>
                  </button>

                  <button
                    onClick={() => handleQuickLogin("admin")}
                    className="w-full text-left bg-[#FAFAF9] border border-[#0B0B0C]/10 hover:border-[#D7263D] p-3.5 transition flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-[#D7263D] block font-bold">ROLE 03</span>
                      <span className="text-[11px] text-[#0B0B0C] uppercase tracking-wide font-bold">SYSTEM ADMINISTRATOR CONSOLE</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8E8E93] hover:text-[#D7263D]">[ ACTIVATE ]</span>
                  </button>
                </div>
              </div>

              {/* standard custom login/signup component */}
              <div className="p-6 space-y-5 bg-white">
                <div className="space-y-1">
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-[#0B0B0C]">
                    System Access Point
                  </h3>
                  <p className="text-[10.5px] text-slate-500 leading-snug">
                    Toggle or fill below to authorize your regulatory-compliant credentials.
                  </p>
                </div>

                {/* Highly interactive segment slider switch */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setAuthError("");
                    }}
                    className={`py-2 text-[10px] font-mono font-bold uppercase rounded-md transition duration-200 ${
                      !isSignUp
                        ? "bg-[#0B0B0C] text-white shadow-sm"
                        : "text-slate-500 hover:text-[#0B0B0C]"
                    }`}
                  >
                    Secure Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setAuthError("");
                    }}
                    className={`py-2 text-[10px] font-mono font-bold uppercase rounded-md transition duration-200 ${
                      isSignUp
                        ? "bg-[#0B0B0C] text-white shadow-sm"
                        : "text-slate-500 hover:text-[#0B0B0C]"
                    }`}
                  >
                    Register Profile
                  </button>
                </div>

                {authError && (
                  <div className="p-3 bg-red-50 border border-[#D7263D] text-[#D7263D] text-[10.5px] font-mono">
                    [ EXCEPTION ]: {authError}
                  </div>
                )}

                {/* Live Real-time Identity Badge Preview */}
                {isSignUp && (
                  <div className="border border-slate-200 bg-slate-50/50 p-3 rounded-xl space-y-2 text-left relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-[#D7263D]"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] bg-slate-200 text-slate-700 px-1.5 py-0.5 font-mono font-black rounded uppercase tracking-wider">
                        Verifiable Credential Card
                      </span>
                      <span className="text-[8px] font-mono text-emerald-600 animate-pulse font-bold">● IN DRAFT</span>
                    </div>
                    <div className="flex gap-2.5 items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                        {signupProfilePic ? (
                          <img src={signupProfilePic} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="avatar" />
                        ) : (
                          <span className="text-slate-400 text-xs font-mono font-bold">FA</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11px] font-bold text-[#0B0B0C] truncate uppercase font-mono leading-tight">
                          {authName.trim() || "Anonymous Trainee"}
                        </h4>
                        <p className="text-[9px] text-slate-500 truncate font-mono leading-none mt-0.5">
                          {authEmail.trim() || "awaiting_workplace_email@..."}
                        </p>
                        <span className="inline-flex mt-1 text-[8px] font-mono font-black uppercase text-[#D7263D] bg-rose-50 border border-[#D7263D]/20 px-1 py-0.25">
                          CLEARED FOR: {authRole.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={isSignUp ? handleSignUpSubmit : handleLoginSubmit} className="space-y-3.5">
                  {isSignUp && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Full Name</label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Dr. John Doe"
                          className="w-full bg-white border border-slate-200 text-xs px-3 py-2.5 focus:outline-none focus:border-[#D7263D] text-[#0B0B0C]"
                        />
                      </div>

                      {/* Profile avatar choices */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Select Custom Persona Avatar</label>
                        <div className="flex gap-2 items-center py-1 overflow-x-auto">
                          {[
                            "Emma", "James", "Sophia", "Lucas", "Aria", "Oliver"
                          ].map((seedName) => {
                            const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seedName}`;
                            const isSelected = signupProfilePic === url;
                            return (
                              <button
                                key={seedName}
                                type="button"
                                onClick={() => setSignupProfilePic(url)}
                                className={`w-9 h-9 rounded-full overflow-hidden border-2 transition duration-200 shrink-0 ${
                                  isSelected ? "border-[#D7263D] scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                                }`}
                                title={`Choose avatar: ${seedName}`}
                              >
                                <img src={url} alt={seedName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Workplace Email</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@workplace.com"
                      className="w-full bg-white border border-slate-200 text-xs px-3 py-2.5 focus:outline-none focus:border-[#D7263D] text-[#0B0B0C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Security Password</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 text-xs px-3 py-2.5 focus:outline-none focus:border-[#D7263D] text-[#0B0B0C]"
                    />

                    {/* Interactive Real-Time Password Strength Meter */}
                    {authPassword && (
                      <div className="mt-1.5 space-y-1 animate-fadeIn">
                        <div className="flex justify-between items-center text-[8px] font-mono font-bold uppercase">
                          <span className="text-slate-400">Clearance Strength:</span>
                          <span className={
                            authPassword.length < 5 ? "text-red-600" :
                            authPassword.length < 8 ? "text-amber-600" :
                            "text-emerald-600"
                          }>
                            {authPassword.length < 5 ? "⚠️ INSUFFICIENT" :
                             authPassword.length < 8 ? "⚡ COMPLIANT" :
                             "🛡️ ULTRA-SECURE"}
                          </span>
                        </div>
                        <div className="h-[3px] bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                          <div className={`h-full flex-1 transition-all duration-300 ${authPassword.length > 0 ? (authPassword.length < 5 ? 'bg-red-500' : authPassword.length < 8 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`}></div>
                          <div className={`h-full flex-1 transition-all duration-300 ${authPassword.length >= 5 ? (authPassword.length < 8 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'}`}></div>
                          <div className={`h-full flex-1 transition-all duration-300 ${authPassword.length >= 8 ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {isSignUp && (
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Workspace Role Access</label>
                      <div className="grid grid-cols-3 gap-1">
                        {(["student", "instructor", "admin"] as const).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setAuthRole(role)}
                            className={`py-2 text-[9px] font-mono uppercase font-black border transition-all duration-200 rounded-md ${
                              authRole === role
                                ? "bg-[#0B0B0C] border-[#0B0B0C] text-white shadow-sm"
                                : "bg-white border-slate-200 text-slate-500 hover:text-[#0B0B0C] hover:border-slate-300"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-[#D7263D] hover:bg-[#C21D32] text-white uppercase font-mono font-bold text-xs py-3 tracking-widest transition shadow-sm hover:shadow-md active:scale-99"
                  >
                    {authLoading ? "VERIFYING AUTHORIZATION..." : isSignUp ? "CREATE NEW IDENTITY" : "SIGN IN TO SYSTEM"}
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-3 text-[8px] font-mono text-slate-400 uppercase font-bold">Or</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>

                  {/* Clean white Google login button with official Google colored logo & no dark-on-dark text */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-[#0B0B0C] text-xs py-3 border border-slate-200 font-mono uppercase tracking-wider font-bold transition shadow-sm rounded-lg hover:shadow-md active:scale-98"
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
                    Continue with Google
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError("");
                    }}
                    className="text-[10px] text-[#D7263D] hover:underline uppercase font-mono tracking-wider font-bold"
                  >
                    {isSignUp ? "Already registered? Sign In" : "Register a Custom Profile"}
                  </button>
                </div>
              </div>

              {/* Clean dense footer links */}
              <div className="p-6 bg-white text-[9px] font-mono text-[#8E8E93] leading-relaxed space-y-1">
                <p>© 2026 FIRST AIDLY.COMPLIANCE.TRAINING SYSTEMS INC.</p>
                <p>REGULATORY COMPLIANCE SYSTEM ONLINE.</p>
                <div className="flex gap-3 pt-1 text-[8.5px] font-bold">
                  <a href="#compliance" className="hover:text-[#0B0B0C] uppercase">[ SECURITY CODES ]</a>
                  <a href="#terms" className="hover:text-[#0B0B0C] uppercase">[ AUDIT CRITERIA ]</a>
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
                      <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0 shadow-sm">
                        {currentUser.profilePic ? (
                          <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          currentUser.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-mono text-slate-400 font-bold">Welcome Responder</span>
                        <h4 className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</h4>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setStudentTab("courses")}
                        className={`p-1.5 rounded-lg border text-xs transition ${
                          studentTab === "courses"
                            ? "bg-rose-600 border-rose-500 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm"
                        }`}
                        title="Course Modules"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
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

                  {studentTab === "courses" ? (
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
                  ) : (
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
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
