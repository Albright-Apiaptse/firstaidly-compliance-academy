import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Video, FileText, ArrowRight, Play, BookOpen } from "lucide-react";
import { Course } from "../types";

interface LessonViewerProps {
  course: Course;
  onCompleteLessons: () => void;
  onBackToCatalog: () => void;
}

export default function LessonViewer({ course, onCompleteLessons, onBackToCatalog }: LessonViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const lessons = course.lessons;
  const hasVideo = !!course.videoUrl;
  const totalSlides = lessons.length + (hasVideo ? 1 : 0);

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
      <div className="flex flex-col h-full bg-slate-50 text-slate-900">
        <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 shrink-0 justify-between">
          <button onClick={onBackToCatalog} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to Catalog
          </button>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Course Introduction</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between max-w-3xl mx-auto w-full">
          <div className="space-y-6 pt-2">
            <div className="space-y-2">
              <span className="inline-flex text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-150 px-2.5 py-1 rounded-full">
                {course.category} Certification Module
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                Welcome to: {course.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                {course.description}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Academy Training Agenda & Curriculum
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Theory Refresher Slides</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                      Review detailed medical guidelines, first-responder notes, and visual diagrams guiding each life-saving skill.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Video Demonstration</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                      Watch step-by-step physical procedures demonstrated clearly to master positioning and force.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Compliance Shuffled Quiz</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                      Test your theoretical recall with shuffled choices. Requires 70%+ score to progress.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Emergency Simulation & Practical Video</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                      Act as direct dispatch, select actions in sequence, and receive AI review. Option to upload physical performance video.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex gap-3 text-xs text-amber-900 leading-relaxed">
              <span className="text-base">💡</span>
              <div>
                <strong className="font-bold">Pro-tip</strong>: Take detailed mental notes of hand positions and sequence steps. Professional rescuers rely heavily on repetitive procedural memory under high-stress cardiac or hemorrhage scenarios.
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button
              onClick={() => setShowIntro(false)}
              className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/15 transition duration-150"
            >
              Start Course Lessons
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
        <button onClick={onBackToCatalog} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium">
          <ChevronLeft className="w-4 h-4" />
          Catalog
        </button>
        <span className="text-xs font-bold max-w-[180px] truncate text-slate-800 text-center">
          {course.title}
        </span>
        <span className="text-[10px] font-mono text-slate-450">
          Slide {currentSlide + 1} of {totalSlides}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-200 w-full shrink-0">
        <div
          className="h-full bg-rose-600 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Content Area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center">
          {isVideoSlide ? (
            /* Video Guide Slide */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-600 mb-1">
                <Video className="w-5 h-5" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Step-by-Step Video Walkthrough</h3>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Visual Practical Guide</h2>
              <p className="text-xs text-slate-650 leading-relaxed mb-4">
                Watch this professional first aid demonstration. Pay absolute attention to compressions depth, hand positions, or tourniquet techniques before entering the interactive emergency simulator.
              </p>

              {/* Video Player Box */}
              <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                {!isPlayingVideo ? (
                  <div
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200/50 transition group"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/20 group-hover:scale-105 transition duration-300">
                      <Play className="w-6 h-6 fill-current pl-0.5" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-3 uppercase tracking-widest">
                      Launch Demo Video
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
            /* Standard Text Lesson Slide */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-600 mb-1 font-semibold">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Lesson Step</h3>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {lessons[currentSlide]?.title}
                </h2>
                {lessons[currentSlide]?.subtitle && (
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    {lessons[currentSlide].subtitle}
                  </p>
                )}
              </div>

              {lessons[currentSlide]?.image && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm max-h-44 aspect-video bg-slate-50">
                  <img
                    src={lessons[currentSlide].image}
                    alt={lessons[currentSlide].title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-line">
                  {lessons[currentSlide]?.content}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 flex gap-3 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`flex-1 flex items-center justify-center gap-1 border py-3 rounded-xl text-xs font-semibold transition ${
              currentSlide === 0
                ? "border-slate-200 text-slate-300 cursor-not-allowed bg-transparent"
                : "border-slate-200 text-slate-600 hover:bg-slate-100 bg-white"
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-xs font-semibold transition shadow-lg shadow-rose-600/10"
          >
            {currentSlide === totalSlides - 1 ? (
              <>
                Continue to Quiz
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              "Next Step"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
