import React, { useState } from "react";
import { Search, ChevronRight, Play, BookOpen, AlertCircle, CheckCircle2, Award } from "lucide-react";
import { Course, StudentProgress } from "../types";

interface CourseCatalogProps {
  courses: Course[];
  studentProgress?: StudentProgress;
  onSelectCourse: (course: Course) => void;
}

export default function CourseCatalog({ courses, studentProgress, onSelectCourse }: CourseCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "CPR" | "Choking" | "Bleeding">("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || course.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getCourseStatus = (courseId: string) => {
    if (!studentProgress) return { quiz: false, simulation: false, certified: false };

    const quizDone = !!studentProgress.completedQuizzes[courseId];
    const simDone = !!studentProgress.completedSimulations[courseId]?.passed;
    const cert = studentProgress.certificates?.find((c) => c.courseId === courseId && c.status === "active");

    return {
      quiz: quizDone,
      simulation: simDone,
      certified: !!cert,
    };
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto px-4 py-5">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">First Aid Academy</h2>
        <p className="text-xs text-slate-500 font-semibold">Master emergency preparedness & secure your regulatory certification.</p>
      </div>

      {/* Generalized Welcome Page Banner */}
      <div className="bg-gradient-to-br from-rose-50/70 to-red-50/20 border border-rose-150 rounded-2xl p-5 mb-6 shadow-sm space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-600/10">
            <svg className="w-5 h-5 fill-current text-white stroke-2" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Understanding Clinical First Aid</h3>
            <p className="text-xs text-slate-650 leading-relaxed font-medium">
              First Aid refers to the <strong className="text-rose-700 font-bold">immediate, temporary assistance</strong> provided to an individual suffering from sudden trauma, cardiac arrest, or medical injury. It encompasses simple, physical lifesaver techniques that bridge the crucial temporal gap before emergency medical services (EMS) arrive.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-rose-100">
          <div className="bg-white/80 rounded-xl p-3 border border-rose-100/40 space-y-1 shadow-sm">
            <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">🛡️ Preserve Life</span>
            <p className="text-[10px] text-slate-550 leading-normal font-medium">
              Prevent immediate brain death or major trauma failure through physical CPR and bleed staunching.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-rose-100/40 space-y-1 shadow-sm">
            <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">⚠️ Prevent Deterioration</span>
            <p className="text-[10px] text-slate-550 leading-normal font-medium">
              Keep critical conditions stable by clearing airways, splinting fractures, and dressing major burns.
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-rose-150/40 space-y-1 shadow-sm">
            <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">🌱 Promote Recovery</span>
            <p className="text-[10px] text-slate-550 leading-normal font-medium">
              Reduce overall recovery duration, prevent infection sepsis, and reassure patients during crises.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5 shrink-0">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search first aid modules..."
          className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-3 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm transition"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none shrink-0">
        {(["all", "CPR", "Choking", "Bleeding"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === tab
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab === "all" ? "All Skills" : tab}
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="flex-1 space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const status = getCourseStatus(course.id);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group relative bg-white border border-slate-200 rounded-2xl p-4 hover:border-rose-250 hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm"
              >
                {/* Visual Accent bar depending on category */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    course.category === "CPR"
                      ? "bg-rose-500"
                      : course.category === "Choking"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                />

                <div className="pl-2">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {course.category}
                    </span>
                    <div className="flex gap-1">
                      {status.quiz && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                          Quiz Pass
                        </span>
                      )}
                      {status.simulation && (
                        <span className="text-[9px] bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded font-medium">
                          Sim Passed
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-rose-600 transition">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Badges and action bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 pl-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {status.certified ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <Award className="w-3.5 h-3.5" /> Certified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <BookOpen className="w-3.5 h-3.5" /> {course.lessons.length} Lessons
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-rose-600 group-hover:translate-x-1 transition flex items-center gap-0.5 font-semibold">
                    Start training
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
            <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
            <h4 className="text-xs font-semibold text-slate-700">No training modules found</h4>
            <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">
              Try modifying your search queries or tabs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
