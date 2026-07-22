import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Video, FileText, ArrowRight, Play, BookOpen, Zap, List, Sparkles, AlertTriangle } from "lucide-react";
import { Course, COUNTRY_PROFILES } from "../types";

interface LessonViewerProps {
  course: Course;
  onCompleteLessons: () => void;
  onBackToCatalog: () => void;
  countryContext: string;
}

export default function LessonViewer({ course, onCompleteLessons, onBackToCatalog, countryContext }: LessonViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"slides" | "notes" | "files">("slides");

  const lessons = course.lessons;
  const hasVideo = !!course.videoUrl;
  const totalSlides = lessons.length + (hasVideo ? 1 : 0);

  const profile = COUNTRY_PROFILES[countryContext] || COUNTRY_PROFILES.Cameroon;

  const personalizeText = (text: string | undefined): string => {
    if (!text) return "";
    let result = text;
    result = result.replace(/112 \(Cameroon National Emergency Number\)/gi, `${profile.primaryNumber} (${profile.name} National Emergency Number)`);
    result = result.replace(/119 \(SAMU \[Service d'Aide Médicale Urgente\] Medical Emergency\)/gi, `${profile.ambulance} (${profile.name} Medical Response)`);
    result = result.replace(/119 \(SAMU Medical Emergency\)/gi, `${profile.ambulance} (${profile.name} Medical Response)`);
    result = result.replace(/112 \/ 119/g, `${profile.primaryNumber} / ${profile.ambulance}`);
    result = result.replace(/112 or 119/g, `${profile.primaryNumber} or ${profile.ambulance}`);
    result = result.replace(/Call 112 \/ 119/gi, `Call ${profile.primaryNumber} / ${profile.ambulance}`);
    result = result.replace(/Cameroon/g, profile.name);
    return result;
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onCompleteLessons();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Check if current slide is the video guide slide
  const isVideoSlide = hasVideo && currentSlide === lessons.length;

  if (showIntro) {
    return (
      <div className="flex flex-col h-full bg-slate-50 text-slate-800">
        {/* Slidebean Header */}
        <div className="h-16 bg-slate-100 border-b border-slate-200/60 flex items-center px-6 shrink-0 justify-between">
          <button 
            onClick={onBackToCatalog} 
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-600 transition duration-150 uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4 text-rose-600" />
            Exit Deck
          </button>
          <span className="text-[10px] uppercase font-black tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-150/40 shadow-sm flex items-center gap-1.5 animate-pulse">
            <Zap className="w-3 h-3 fill-current" /> Project Blueprint Introduction
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 flex flex-col justify-between max-w-4xl mx-auto w-full space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="inline-flex text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-150 px-3 py-1 rounded-full shadow-sm">
                📌 Category: {course.category} Certification
              </span>
              <h1 className="text-3xl sm:text-4.5xl font-black tracking-tight text-slate-900 leading-none font-display">
                Welcome to: <span className="text-[#D7263D]">{course.title}</span>
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl font-medium">
                {course.description}
              </p>
            </div>

            {/* Presentation Outline Board */}
            <div className="bg-slate-100 border border-slate-150 rounded-2xl p-6 shadow-md space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 border-b border-slate-150 pb-3">
                <List className="w-4 h-4 text-rose-600" /> Training Deck Agenda & Slide Outlines
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3.5 bg-slate-50 border border-slate-150/50 p-3.5 rounded-xl transition hover:border-rose-150 hover:bg-slate-100/50">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-black text-xs shrink-0">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Theory Refresher</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1 font-medium">
                      Review detailed guidelines, responder instructions, and sequential slide steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-slate-50 border border-slate-150/50 p-3.5 rounded-xl transition hover:border-rose-150 hover:bg-slate-100/50">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-black text-xs shrink-0">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Video Demonstration</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1 font-medium">
                      Watch procedural demonstrations to master physical compression depth & hand placements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-slate-50 border border-slate-150/50 p-3.5 rounded-xl transition hover:border-rose-150 hover:bg-slate-100/50">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-black text-xs shrink-0">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Compliance Shuffled Quiz</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1 font-medium">
                      Recall theoretical protocols. Shuffled answers ensure rigid medical understanding.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-slate-50 border border-slate-150/50 p-3.5 rounded-xl transition hover:border-rose-150 hover:bg-slate-100/50">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-black text-xs shrink-0">
                    04
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Gemini Practical Simulation</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1 font-medium">
                      Roleplay real crises. Input step choices and get instant clinician scoring reviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-50/40 border border-rose-150/50 rounded-xl p-4 flex gap-3 text-xs text-rose-700 leading-relaxed shadow-sm">
              <span className="text-base">💡</span>
              <div className="font-medium">
                <strong className="font-black uppercase tracking-wider text-rose-700 block mb-0.5">Presentation Rescuer Insight:</strong>
                Repetitive visual training builds procedural memory. Focus on exact steps, physical ratios, and emergency numbers during this slide sequence.
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-150 flex justify-end">
            <button
              onClick={() => setShowIntro(false)}
              className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-rose-600/20 hover:scale-102 active:scale-98 transition duration-200 cursor-pointer"
            >
              Start Slide Deck
              <ArrowRight className="w-4.5 h-4.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* LEFT OUTLINE PANEL: Slides index mapping Slidebean workspace */}
      <div className="w-full lg:w-72 bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
          <button 
            onClick={onBackToCatalog} 
            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-450 hover:text-rose-600 transition tracking-wider"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Close Editor
          </button>
          <span className="text-[9px] font-mono font-black text-rose-600 uppercase border border-rose-150 bg-rose-50 px-2 py-0.5 rounded-full">
            Active Mode
          </span>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex border-b border-slate-200 shrink-0">
          <button
            onClick={() => setActiveSidebarTab("slides")}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider border-b-2 text-center transition ${
              activeSidebarTab === "slides"
                ? "border-rose-600 text-rose-600 bg-slate-50"
                : "border-transparent text-slate-450 hover:text-slate-700"
            }`}
          >
            📋 Slides
          </button>
          <button
            onClick={() => setActiveSidebarTab("notes")}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider border-b-2 text-center transition ${
              activeSidebarTab === "notes"
                ? "border-rose-600 text-rose-600 bg-slate-50"
                : "border-transparent text-slate-450 hover:text-slate-700"
            }`}
          >
            💡 Guide
          </button>
          <button
            onClick={() => setActiveSidebarTab("files")}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider border-b-2 text-center transition ${
              activeSidebarTab === "files"
                ? "border-rose-600 text-rose-600 bg-slate-50"
                : "border-transparent text-slate-450 hover:text-slate-700"
            }`}
          >
            📁 Files ({course.uploadedFiles?.length || 0})
          </button>
        </div>

        {/* Outline Content list with progress details */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {activeSidebarTab === "slides" ? (
            <>
              {lessons.map((lesson, idx) => {
                const isActive = currentSlide === idx;
                const isPassed = idx < currentSlide;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentSlide(idx);
                      setIsPlayingVideo(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex gap-3 items-start cursor-pointer ${
                      isActive
                        ? "bg-rose-50/50 border-rose-150/70 shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className={`text-[10px] font-mono font-black w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      isActive 
                        ? "bg-rose-600 text-white border-rose-600" 
                        : isPassed 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5 overflow-hidden">
                      <span className="text-[10.5px] font-black text-slate-800 block truncate leading-tight">
                        {personalizeText(lesson.title)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium block truncate">
                        {personalizeText(lesson.subtitle) || "Theory Blueprint Step"}
                      </span>
                    </div>
                  </button>
                );
              })}

              {hasVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSlide(lessons.length);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition flex gap-3 items-start cursor-pointer ${
                    currentSlide === lessons.length
                      ? "bg-rose-50/50 border-rose-150/70 shadow-sm"
                      : "bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <span className={`text-[10px] font-mono font-black w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                    currentSlide === lessons.length
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}>
                    <Video className="w-3 h-3" />
                  </span>
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-[10.5px] font-black text-slate-800 block truncate leading-tight">
                      Video Demonstration
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block truncate">
                      Practical Clinical Walkthrough
                    </span>
                  </div>
                </button>
              )}
            </>
          ) : activeSidebarTab === "notes" ? (
            <div className="space-y-3 p-1">
              {/* Emergency response guideline quick-notes */}
              <div className="bg-rose-50/30 border border-rose-150 p-3 rounded-xl space-y-1.5 shadow-sm">
                <span className="text-[9px] font-black uppercase text-rose-600 tracking-wider flex items-center gap-1.5">
                  🌍 Emergency Dial ({profile.name})
                </span>
                <p className="text-[10.5px] leading-relaxed text-slate-700 font-medium">
                  Direct bystanders or dial emergency responders instantly. Note that decentralization slows clinical access.
                </p>
                <div className="space-y-1 pt-1.5 border-t border-rose-100/40 text-[10px] font-black text-rose-700 uppercase">
                  <div>📞 Mobile: {profile.primaryNumber}</div>
                  <div>🚑 Ambulance: {profile.ambulance}</div>
                  <div>🚒 Fire Station: {profile.fire}</div>
                  {profile.gendarmerie && <div>👮 Gendarmerie: {profile.gendarmerie}</div>}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1 text-[10px] text-slate-400 font-medium">
                <strong className="text-slate-800 font-bold block text-[10.5px]">Rescuer Protocol:</strong>
                Always verify bystander safety, introduce credentials, request consent, and immediately assign someone to call responders before initiating physical care.
              </div>
            </div>
          ) : (
            /* Reference Files Attachment Tab Screen */
            <div className="space-y-3 p-1">
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-[10px]">
                <h4 className="font-bold text-slate-850 uppercase tracking-wider leading-none">Course Materials</h4>
                <p className="text-slate-450 font-medium mt-1 leading-normal">Download attachments and files loaded by the training instructor.</p>
              </div>

              {!course.uploadedFiles || course.uploadedFiles.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-[10.5px] italic font-semibold border border-dashed border-slate-200 rounded-xl bg-white shadow-inner">
                  No reference materials attached.
                </div>
              ) : (
                <div className="space-y-2">
                  {course.uploadedFiles.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.data}
                      download={file.name}
                      className="flex items-center justify-between border border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50/10 p-2 rounded-xl transition shadow-sm text-left group shrink-0"
                      title={`Download ${file.name}`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden flex-1 pr-1.5">
                        <span className="text-xs shrink-0">📄</span>
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-black text-slate-800 block truncate group-hover:text-rose-600 transition leading-tight">{file.name}</span>
                          <span className="text-[8.5px] text-slate-400 font-semibold font-mono block leading-none mt-0.5">{file.size}</span>
                        </div>
                      </div>
                      <span className="text-[8.5px] font-black text-rose-600 uppercase tracking-wider shrink-0 bg-rose-50 border border-rose-150 py-1 px-1.5 rounded-lg group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition">
                        Get
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Presentation Progress display */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-450 tracking-wider mb-1">
            <span>Slide Deck Progress</span>
            <span>{Math.round(((currentSlide + 1) / totalSlides) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden border border-slate-150 shadow-inner">
            <div
              className="h-full bg-rose-600 transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* CENTRAL AREA: 16:9 Presentation Slide Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
        
        {/* Slide Deck Stage Box */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col justify-center">
          
          <div className="max-w-4xl w-full mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-black/10 flex flex-col justify-between aspect-video relative group slidebean-slide-animation">
            
            {/* Top Slide Header */}
            <div className="h-12 border-b border-slate-150 px-6 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow shadow-rose-600/30"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-450">
                  Slide {currentSlide + 1} of {totalSlides} • {course.category} Certification
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 font-bold">
                {course.title}
              </div>
            </div>

            {/* Slide Body Stage Content */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center overflow-y-auto">
              {isVideoSlide ? (
                /* Video Demonstration Slide */
                <div className="space-y-4 h-full flex flex-col justify-center max-w-2xl mx-auto w-full">
                  <div className="space-y-1 shrink-0">
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                      <Video className="w-4 h-4 text-rose-600" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Step-by-Step Practical Demonstration</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Visual Walkthrough & Positioning
                    </h2>
                  </div>

                  <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-video max-h-[220px]">
                    {!isPlayingVideo ? (
                      <div
                        onClick={() => setIsPlayingVideo(true)}
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900/50 transition duration-200 group"
                      >
                        <div className="w-11 h-11 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform duration-200">
                          <Play className="w-5.5 h-5.5 fill-current pl-0.5" />
                        </div>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-2.5">
                          Launch Demo Playback
                        </span>
                      </div>
                    ) : (
                      <iframe
                        src={`${course.videoUrl}?autoplay=1`}
                        title="First aid instruction video"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* Standard Text/Image Theory Slide */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center">
                  
                  {/* Left Column: Image (if exists) */}
                  {lessons[currentSlide]?.image ? (
                    <>
                      <div className="md:col-span-5 h-full max-h-[180px] md:max-h-none flex items-center">
                        <div className="relative w-full aspect-video md:aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow shadow-black/5">
                          <img
                            src={lessons[currentSlide].image}
                            alt={lessons[currentSlide].title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-7 space-y-3.5">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full tracking-wider">
                            Lesson {currentSlide + 1}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none font-display">
                            {personalizeText(lessons[currentSlide]?.title)}
                          </h2>
                          {lessons[currentSlide]?.subtitle && (
                            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                              {personalizeText(lessons[currentSlide].subtitle)}
                            </p>
                          )}
                        </div>

                        <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl max-h-[140px] overflow-y-auto">
                          <p className="text-[11.5px] text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                            {personalizeText(lessons[currentSlide]?.content)}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Content centered when no image exists */
                    <div className="md:col-span-12 space-y-4 max-w-2xl mx-auto w-full text-center py-4">
                      <div className="space-y-1.5">
                        <span className="inline-flex text-[9px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full tracking-wider">
                          Module Slide {currentSlide + 1}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none font-display">
                          {personalizeText(lessons[currentSlide]?.title)}
                        </h2>
                        {lessons[currentSlide]?.subtitle && (
                          <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                            {personalizeText(lessons[currentSlide].subtitle)}
                          </p>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-left shadow-inner">
                        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                          {personalizeText(lessons[currentSlide]?.content)}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Slide Footer: Action Deck controls mimicking Slidebean remote */}
            <div className="h-14 border-t border-slate-150 bg-slate-100 px-6 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-mono text-slate-450 font-bold">
                Slidebean Pro Player • Live Environment
              </span>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentSlide === 0}
                  className={`px-4 py-2 border rounded-xl text-[10.5px] font-black uppercase tracking-wider transition duration-150 flex items-center gap-1 cursor-pointer ${
                    currentSlide === 0
                      ? "border-slate-200 text-slate-300 bg-transparent cursor-not-allowed"
                      : "border-slate-200 text-slate-650 hover:bg-slate-50 bg-white"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider transition duration-150 flex items-center gap-1 shadow-md shadow-rose-600/15 cursor-pointer hover:scale-102 active:scale-98"
                >
                  {currentSlide === totalSlides - 1 ? (
                    <>
                      Go to Quiz <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Dynamic Emergency Dial Translucency Bar for rapid lookup */}
          <div className="max-w-4xl w-full mx-auto mt-4 bg-rose-50/20 border border-rose-150/40 p-3 rounded-2xl flex flex-wrap gap-x-4 gap-y-1.5 items-center justify-between text-[10px] font-black text-rose-700 uppercase shadow-sm">
            <span className="flex items-center gap-1.5 shrink-0 text-slate-500 font-semibold tracking-wide">
              🌍 Active responders ({profile.name}):
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white border border-rose-100 px-2 py-0.5 rounded shadow-sm">📱 Mobile: {profile.primaryNumber}</span>
              <span className="bg-white border border-rose-100 px-2 py-0.5 rounded shadow-sm">🚑 SAMU: {profile.ambulance}</span>
              <span className="bg-white border border-rose-100 px-2 py-0.5 rounded shadow-sm">🚒 Sapeurs: {profile.fire}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
