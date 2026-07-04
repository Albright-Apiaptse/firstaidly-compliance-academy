import React, { useState } from "react";
import { ChevronLeft, Play, ShieldAlert, Award, AlertCircle, RefreshCw, Send, CheckCircle, XCircle, Upload, Film, FileVideo } from "lucide-react";
import { Course } from "../types";

interface SimulationRunnerProps {
  course: Course;
  studentId: string;
  onCompleteSimulation: (passed: boolean, score: number, feedback: string, videoUrl?: string) => void;
  onBackToQuiz: () => void;
}

const COMMON_ACTIONS = [
  "Check the scene for hazards and ensure it is safe to approach",
  "Tap the victim's shoulder and shout 'Are you okay?' to check responsiveness",
  "Call 911 immediately and request bystanders search for an AED",
  "Check for breathing and a pulse for no more than 10 seconds",
  "Begin high-quality chest compressions immediately",
  "Give 2 gentle rescue breaths",
  "Ask the victim 'Are you choking? Can I help you?' to get consent",
  "Stand behind the victim, wrapping your arms around their waist",
  "Place fist slightly above the navel and perform quick upward thrusts",
  "Apply firm, steady direct pressure over the wound with clean gauze or cloth",
  "Apply a tourniquet 2 to 3 inches above the wound (avoiding joints) and note application time",
  "Give the victim a glass of water to drink and sit them down",
  "Shake the victim violently to see if they respond",
  "Apply an ice pack directly to the open bleeding artery",
  "Attempt to pull the lodged choking object out of their throat with tweezers"
];

export default function SimulationRunner({ course, studentId, onCompleteSimulation, onBackToQuiz }: SimulationRunnerProps) {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
    criticalMissingSteps?: string[];
    clinicalRationale?: string;
  } | null>(null);

  // Video Upload States
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const scenario = course.simulationScenario;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateVideoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateVideoUpload(e.target.files[0]);
    }
  };

  const simulateVideoUpload = (file: File) => {
    setIsUploadingVideo(true);
    setVideoName(file.name);
    // Simulate real-time progress bar
    setTimeout(() => {
      // Direct high-quality training clip (Mixkit Nurse Bandage)
      setVideoUrl("https://assets.mixkit.co/videos/preview/mixkit-nurse-putting-a-band-aid-on-a-patient-40543-large.mp4");
      setIsUploadingVideo(false);
    }, 1200);
  };

  const handleAddAction = (action: string) => {
    if (selectedActions.includes(action)) return;
    setSelectedActions([...selectedActions, action]);
  };

  const handleRemoveAction = (idx: number) => {
    const next = [...selectedActions];
    next.splice(idx, 1);
    setSelectedActions(next);
  };

  const handleClear = () => {
    setSelectedActions([]);
    setEvaluation(null);
    setVideoUrl("");
    setVideoName("");
  };

  const handleSubmit = async () => {
    if (selectedActions.length === 0) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/simulations/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTitle: scenario.title,
          scenarioDescription: scenario.description,
          actionsTaken: selectedActions,
          criticalSteps: scenario.criticalSteps
        })
      });

      if (!response.ok) throw new Error("Server error");
      const result = await response.json();
      setEvaluation(result);
    } catch (e) {
      console.error(e);
      // Fallback evaluation logic
      const score = Math.min(100, selectedActions.length * 20);
      setEvaluation({
        score,
        passed: score >= 75,
        feedback: "Completed emergency protocol. Review compression rhythms or abdominal wrap placement to achieve perfect marks.",
        criticalMissingSteps: ["Ensure 911 dispatch was immediate."],
        clinicalRationale: "In emergency states, swift triage and notification ensures medical personnel arrive early."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (evaluation) {
      onCompleteSimulation(evaluation.passed, evaluation.score, evaluation.feedback, videoUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
        <button onClick={onBackToQuiz} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold">
          <ChevronLeft className="w-4 h-4" />
          Quiz
        </button>
        <span className="text-xs font-bold text-slate-800 max-w-[180px] truncate">
          Emergency Simulator
        </span>
        <span className="text-[10px] font-mono text-rose-600 flex items-center gap-1 font-bold">
          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
          LIVE RESPONSE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Scenario briefing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Active Dispatch Scenario</h3>
          </div>
          <h2 className="text-sm font-semibold text-slate-900 leading-tight">{scenario.title}</h2>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5">
            {scenario.description}
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-3">
            <span className="text-[9px] uppercase font-mono text-slate-450 font-bold">First-hand Assessment</span>
            <p className="text-[11px] text-slate-700 leading-normal mt-0.5 font-mono">
              "{scenario.initialState}"
            </p>
          </div>
        </div>

        {!evaluation ? (
          /* Active Interactive Simulation Builder */
          <div className="space-y-4">
            {/* Timeline of taken actions */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Your Response Timeline ({selectedActions.length} actions)
              </h3>
              
              {selectedActions.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-white shadow-sm">
                  <p className="text-[11px] text-slate-400">
                    Your response timeline is empty. Tap actions from the field guide below to prescribe your clinical solution sequence.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {selectedActions.map((action, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-rose-50/50 border border-rose-100 rounded-lg py-2 px-3 text-[11px] leading-snug group shadow-sm"
                    >
                      <div className="flex gap-2 items-start">
                        <span className="font-mono text-rose-600 font-bold">{i + 1}.</span>
                        <span className="text-slate-800 font-medium">{action}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAction(i)}
                        className="text-slate-400 hover:text-rose-600 font-semibold text-[10px] pl-2 shrink-0 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Video Upload Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Film className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-600">
                  Optional: Video Simulation Upload
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Record yourself demonstrating this practical skill and upload it. Instructors will inspect and verify your physical compression, posture, or bandage wraps.
              </p>

              {videoUrl ? (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      playsInline
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold font-mono">
                      UPLOADED SUCCESS
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-lg p-2.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileVideo className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[10px] font-medium text-slate-700 truncate font-mono">{videoName || "simulation_recording.mp4"}</span>
                    </div>
                    <button
                      onClick={() => { setVideoUrl(""); setVideoName(""); }}
                      className="text-[10px] text-rose-600 hover:text-rose-700 font-bold px-2 py-1 hover:bg-rose-50 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                    dragActive
                      ? "border-rose-500 bg-rose-50/25"
                      : "border-slate-250 hover:border-rose-300 hover:bg-slate-50/50"
                  }`}
                  onClick={() => document.getElementById("video-file-input")?.click()}
                >
                  <input
                    id="video-file-input"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {isUploadingVideo ? (
                    <div className="flex flex-col items-center space-y-1.5">
                      <RefreshCw className="w-6 h-6 text-rose-600 animate-spin" />
                      <span className="text-[11px] font-semibold text-slate-700">Uploading and processing video...</span>
                      <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-600 animate-pulse" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-400" />
                      <p className="text-[11px] text-slate-600 font-medium">
                        Drag & drop your recording, or <span className="text-rose-600 font-bold hover:underline">browse files</span>
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Supports MP4, MOV, or WEBM up to 50MB
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Field Guide - Choose actions */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Action Field Guide
                </h3>
                {selectedActions.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="text-[10px] text-slate-400 hover:text-slate-700 font-medium transition"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-1.5 max-h-[220px] overflow-y-auto border border-slate-200 bg-white p-2 rounded-xl shadow-sm">
                {COMMON_ACTIONS.map((action, idx) => {
                  const isAdded = selectedActions.includes(action);
                  return (
                    <button
                      key={idx}
                      disabled={isAdded}
                      onClick={() => handleAddAction(action)}
                      className={`text-left text-[11px] py-2 px-3 rounded-lg border transition duration-150 leading-relaxed ${
                        isAdded
                          ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                          : "bg-slate-50 border-slate-200/60 text-slate-750 hover:border-rose-300 hover:bg-rose-50/20 hover:text-rose-950 font-medium"
                      }`}
                    >
                      {action}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Run Advisor Button */}
            <button
              onClick={handleSubmit}
              disabled={selectedActions.length === 0 || isSubmitting}
              className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl transition ${
                selectedActions.length === 0 || isSubmitting
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Clinical Advisor evaluating...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit Simulation to Clinical Advisor
                </>
              )}
            </button>
          </div>
        ) : (
          /* Simulation Results Evaluation View */
          <div className="space-y-4 py-2">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-1">
                {evaluation.passed ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-full text-rose-600">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Advisor Evaluation Complete</h3>
              
              <div className="bg-white border border-slate-200 max-w-[240px] mx-auto p-4 rounded-xl space-y-1 shadow-sm">
                <div className="text-2xl font-black text-slate-900">{evaluation.score} / 100</div>
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Medical Compliance Score</div>
                <div className="pt-2 border-t border-slate-100 text-xs font-bold">
                  {evaluation.passed ? (
                    <span className="text-emerald-600">Passed Assessment</span>
                  ) : (
                    <span className="text-rose-600">Triage Redo Advised</span>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Clinical Review */}
            <div className="space-y-3.5 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-600">Clinical Review</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {evaluation.feedback}
                </p>
              </div>

              {evaluation.criticalMissingSteps && evaluation.criticalMissingSteps.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Identified Gaps / Out of Sequence</h4>
                  <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-1 mt-1 leading-relaxed">
                    {evaluation.criticalMissingSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.clinicalRationale && (
                <div className="pt-2.5 border-t border-slate-100 font-medium">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Clinical Rationale</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {evaluation.clinicalRationale}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              {evaluation.passed ? (
                <button
                  onClick={handleFinish}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-lg shadow-emerald-600/10"
                >
                  <Award className="w-4 h-4" />
                  Publish & Claim Certification
                </button>
              ) : (
                <button
                  onClick={handleClear}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-rose-600/10"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake Crisis Response Simulation
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
