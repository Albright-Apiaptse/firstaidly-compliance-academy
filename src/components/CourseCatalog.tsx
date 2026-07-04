import React, { useState } from "react";
import { Search, ChevronRight, Play, BookOpen, AlertCircle, CheckCircle2, Award, Zap, Shield, HelpCircle } from "lucide-react";
import { Course, StudentProgress, COUNTRY_PROFILES } from "../types";

interface CourseCatalogProps {
  courses: Course[];
  studentProgress?: StudentProgress;
  onSelectCourse: (course: Course) => void;
  countryContext: string;
  setCountryContext: (country: string) => void;
}

export default function CourseCatalog({ courses, studentProgress, onSelectCourse, countryContext, setCountryContext }: CourseCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "CPR" | "Choking" | "Bleeding">("all");

  const countryProfile = COUNTRY_PROFILES[countryContext] || COUNTRY_PROFILES.Cameroon;

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
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto px-6 py-6 space-y-6">
      
      {/* Slidebean Header Brand */}
      <div className="flex justify-between items-start border-b border-slate-150 pb-5 shrink-0">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full font-black border border-rose-150">
            📊 Academy Course Decks
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-2 font-display">
            Interactive Learning Blueprints
          </h2>
          <p className="text-xs text-slate-450 mt-1 font-semibold">
            Deploy compliance-certified emergency responses local to your active country.
          </p>
        </div>
      </div>

      {/* Regional Emergency Context Switcher styled as a Slidebean Editor Preset */}
      <div className="bg-slate-100 border border-slate-150 p-4 rounded-2xl shadow-md space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 tracking-wider">
            <span>🌍 Dynamic Territory Context</span>
          </div>
          <span className="text-[10.5px] bg-rose-600 text-white font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md shadow-rose-600/10">
            <span>{countryProfile.name}</span>
            <span>{countryProfile.flag}</span>
          </span>
        </div>
        
        <div className="space-y-2">
          <label className="block text-[9px] font-black text-slate-450 uppercase tracking-widest leading-none">
            Choose localized compliance rules:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {Object.keys(COUNTRY_PROFILES).map((key) => {
              const item = COUNTRY_PROFILES[key];
              const isSelected = countryContext === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCountryContext(key)}
                  className={`px-3.5 py-2 rounded-xl border text-[10px] font-black shrink-0 transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/10"
                      : "bg-white text-slate-650 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-3.5 rounded-xl text-xs leading-relaxed text-slate-600 font-medium">
          <strong className="text-slate-900 font-black block mb-1 uppercase tracking-wide text-[10px]">
            🚨 Regional Protocol Blueprint:
          </strong>
          <p className="text-[10.5px] leading-relaxed text-slate-450 font-semibold mb-2.5">
            {countryProfile.desc}
          </p>
          <div className="flex flex-wrap gap-2 text-[9px] font-black text-rose-700 uppercase border-t border-slate-100 pt-2.5">
            <span className="bg-rose-50 border border-rose-100 px-2 py-1 rounded shadow-sm">📱 general call: {countryProfile.primaryNumber}</span>
            <span className="bg-rose-50 border border-rose-100 px-2 py-1 rounded shadow-sm">🚑 ambulance: {countryProfile.ambulance}</span>
            <span className="bg-rose-50 border border-rose-100 px-2 py-1 rounded shadow-sm">🚒 fire brigade: {countryProfile.fire}</span>
            {countryProfile.gendarmerie && (
              <span className="bg-rose-50 border border-rose-100 px-2 py-1 rounded shadow-sm">👮 police force: {countryProfile.gendarmerie}</span>
            )}
          </div>
        </div>
      </div>

      {/* Slidebean Concept Banner */}
      <div className="bg-gradient-to-br from-rose-50/75 to-red-50/20 border border-rose-150 rounded-2xl p-5 shadow-md space-y-4 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-rose-600 to-pink-500 opacity-10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
        <div className="flex gap-4 items-start relative z-10">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-600/10">
            <Shield className="w-5 h-5 text-white stroke-2" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide font-display">Clinical First-Response Protocol</h3>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold">
              Emergency assistance provides <strong className="text-rose-600 font-extrabold">immediate lifesaver care</strong> to bridge the vital gap before formal EMS arrival. These presentation outlines focus on high-stress bleed staunching, airway clearance, and CPR procedures.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5 border-t border-rose-150/40 relative z-10">
          <div className="bg-white rounded-xl p-3 border border-rose-100/40 space-y-1 shadow-sm hover:border-rose-200 transition">
            <span className="text-[9px] font-black uppercase text-rose-700 tracking-wider block">🛡️ 1. PRESERVE LIFE</span>
            <p className="text-[10px] text-slate-400 leading-normal font-semibold">
              Halt major hemorrhage trauma and perform active physical chest compressions immediately.
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-rose-100/40 space-y-1 shadow-sm hover:border-rose-200 transition">
            <span className="text-[9px] font-black uppercase text-rose-700 tracking-wider block">⚠️ 2. PREVENT CRISIS</span>
            <p className="text-[10px] text-slate-400 leading-normal font-semibold">
              Stabilize patient airways, dress deep burn lesions, and position fractures securely.
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-rose-100/40 space-y-1 shadow-sm hover:border-rose-200 transition">
            <span className="text-[9px] font-black uppercase text-rose-700 tracking-wider block">🌱 3. PROMOTE RECOVERY</span>
            <p className="text-[10px] text-slate-400 leading-normal font-semibold">
              Avoid sepsis, mitigate psychological shock trauma, and comfort victims until rescue.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shrink-0">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search learning blueprints & slides..."
            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm transition"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {(["all", "CPR", "Choking", "Bleeding"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap cursor-pointer border ${
                activeTab === tab
                  ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/10"
                  : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab === "all" ? "All Blueprints" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Course Decks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const status = getCourseStatus(course.id);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-rose-150/80 hover:shadow-lg transition duration-200 cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm border-l-4 border-l-rose-600"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-150">
                      {course.category} Module
                    </span>
                    <div className="flex gap-1">
                      {status.quiz && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded font-black uppercase tracking-wide">
                          Quiz Pass
                        </span>
                      )}
                      {status.simulation && (
                        <span className="text-[9px] bg-sky-50 text-sky-700 border border-sky-150 px-1.5 py-0.5 rounded font-black uppercase tracking-wide">
                          Sim Passed
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-rose-600 transition leading-tight font-display">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-450 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {course.description}
                  </p>
                </div>

                {/* Footer specs of the Deck */}
                <div className="mt-6 pt-4 border-t border-slate-150 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {status.certified ? (
                      <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded-full">
                        <Award className="w-3.5 h-3.5" /> Certified active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-black uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-rose-600" /> {course.lessons.length + (course.videoUrl ? 1 : 0)} Slide Outline
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 group-hover:translate-x-1.5 transition flex items-center gap-0.5">
                    Launch Slides
                    <ChevronRight className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-md">
            <AlertCircle className="w-9 h-9 text-rose-600 mb-2.5 animate-bounce" />
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">No blueprints deployed</h4>
            <p className="text-[11px] text-slate-400 max-w-[280px] mt-1 font-semibold">
              Try modifying search terms or choose another academy category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
