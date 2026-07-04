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
    src: "/src/assets/images/first_aid_hero_1782843292024.jpg",
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Universal Top Nav Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-rose-600 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20 transition-transform hover:rotate-12 duration-300">
            <svg className="w-5.5 h-5.5 text-white stroke-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-none flex items-center gap-1">FirstAid.ly<span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md">Academy</span></h1>
            <p className="text-[9px] text-slate-450 font-black uppercase tracking-widest mt-0.5">Emergency Compliance Audits</p>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                {currentUser.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
              title="Logout Account"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        ) : (
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Regulatory Compliance Portal
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {!currentUser ? (
          /* Staggering visual identity login & signup page */
          <div className="flex-1 flex flex-col lg:flex-row h-full">
            {/* Left side: Premium branding context */}
            <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-rose-50/30 p-8 lg:p-16 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6 max-w-lg">
                <span className="inline-flex text-[10px] font-bold uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-1 rounded-full">
                  Interactive Compliance Training
                </span>
                
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-none tracking-tight">
                  Empowering Instant Lifesaving Confidence.
                </h1>
                
                <p className="text-sm text-slate-650 leading-relaxed font-medium">
                  FirstAid.ly combines bite-sized guidelines, video demonstrations, and a Gemini AI Emergency Simulator to train, track, and dynamically certify compliant first aid responders.
                </p>

                 {/* Newly Added First Aid Hero Image with Interactive Slideshow */}
                <div className="space-y-3.5 my-4">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-video bg-slate-100 group">
                    <img
                      src={WELCOME_IMAGES[activeWelcomeImgIndex].src}
                      alt={WELCOME_IMAGES[activeWelcomeImgIndex].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent flex flex-col justify-end p-4">
                      <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                        {WELCOME_IMAGES[activeWelcomeImgIndex].title}
                      </span>
                      <span className="text-xs font-semibold text-white mt-0.5 leading-tight">
                        {WELCOME_IMAGES[activeWelcomeImgIndex].desc}
                      </span>
                    </div>

                    {/* Slideshow Arrow Toggles */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveWelcomeImgIndex((prev) => (prev === 0 ? WELCOME_IMAGES.length - 1 : prev - 1));
                        }}
                        className="w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-rose-600 pointer-events-auto transition active:scale-95 shadow border border-white/10"
                      >
                        <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveWelcomeImgIndex((prev) => (prev === WELCOME_IMAGES.length - 1 ? 0 : prev + 1));
                        }}
                        className="w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-rose-600 pointer-events-auto transition active:scale-95 shadow border border-white/10"
                      >
                        <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Thumbnails list for easy navigation */}
                  <div className="flex gap-2 items-center justify-start overflow-x-auto pb-1">
                    {WELCOME_IMAGES.map((img, idx) => {
                      const isActive = activeWelcomeImgIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveWelcomeImgIndex(idx)}
                          className={`relative w-12 h-8 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                            isActive
                              ? "border-rose-600 scale-105 shadow-sm"
                              : "border-slate-200/80 hover:border-slate-400"
                          }`}
                          title={img.title}
                        >
                          <img
                            src={img.src}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-2.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-850">AI-Driven Simulations</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">
                      Real-time interactive medical review from evaluators powered by Gemini.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600 mb-2.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-850">Automatic scan alerts</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">
                      Proactively scan and notify expiring compliance certifications automatically.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-250 flex items-center justify-center text-amber-600 mb-2.5">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-850">Academy Leaderboard</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">
                      Earn XP points, conquer challenges, and unlock premium skill badges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer Bypass options */}
              <div className="mt-8 border-t border-slate-200 pt-6">
                <span className="text-[10px] uppercase font-mono text-slate-450 block mb-3 font-bold">
                  Quick Access Sandbox Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickLogin("student")}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs py-2 px-3.5 rounded-xl text-slate-700 shadow-sm font-semibold transition"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                    Demo Student
                  </button>
                  <button
                    onClick={() => handleQuickLogin("instructor")}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs py-2 px-3.5 rounded-xl text-slate-700 shadow-sm font-semibold transition"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-600 font-bold" />
                    Demo Instructor
                  </button>
                  <button
                    onClick={() => handleQuickLogin("admin")}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs py-2 px-3.5 rounded-xl text-slate-700 shadow-sm font-semibold transition"
                  >
                    <Building className="w-3.5 h-3.5 text-rose-600 font-bold" />
                    Demo Administrator
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Login form card */}
            <div className="flex-1 bg-slate-50 flex items-center justify-center p-6 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto">
              <div className="w-full max-w-sm space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    {isSignUp ? "Create compliance account" : "Welcome back"}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {isSignUp
                      ? "Select your target workplace role below to sign up."
                      : "Login to review your training or compliance records."}
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={isSignUp ? handleSignUpSubmit : handleLoginSubmit} className="space-y-4">
                  {isSignUp && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-500 block font-bold">Full Name</label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Dr. John Doe"
                          className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-rose-500 placeholder-slate-400 shadow-sm transition"
                        />
                      </div>

                      {/* Custom Avatar Preset Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-500 block font-bold">Choose Profile Avatar</label>
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
                                className={`w-9 h-9 rounded-full overflow-hidden border-2 shrink-0 transition ${
                                  isSelected ? "border-rose-600 scale-105 shadow" : "border-transparent hover:scale-105"
                                }`}
                              >
                                <img src={url} alt={seedName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-slate-500 block font-bold">Workplace Email</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@workplace.com"
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-rose-500 placeholder-slate-400 shadow-sm transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-slate-500 block font-bold">Security Password</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-rose-500 placeholder-slate-400 shadow-sm transition"
                    />
                  </div>

                  {isSignUp && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono text-slate-500 block font-bold">Workspace Role</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["student", "instructor", "admin"] as const).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setAuthRole(role)}
                            className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border transition ${
                              authRole === role
                                ? "bg-rose-600 border-rose-500 text-white"
                                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
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
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs py-3.5 rounded-xl transition shadow-lg shadow-rose-600/15"
                  >
                    {authLoading ? "Verifying..." : isSignUp ? "Create Workspace Account" : "Access compliance records"}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-450 uppercase font-black">Or</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs py-3 rounded-xl border border-slate-200 font-bold shadow-sm transition"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError("");
                    }}
                    className="text-xs text-rose-600 hover:text-rose-750 font-bold transition"
                  >
                    {isSignUp ? "Already have a compliance login?" : "Need to register a new student/officer?"}
                  </button>
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
