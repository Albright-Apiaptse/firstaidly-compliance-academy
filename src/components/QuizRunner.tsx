import React, { useState } from "react";
import { ChevronLeft, HelpCircle, Check, X, AlertTriangle, ArrowRight, Award, Zap, RefreshCw, Layers } from "lucide-react";
import { Course, QuizQuestion } from "../types";

interface QuizRunnerProps {
  course: Course;
  studentId: string;
  onSubmitQuiz: (score: number, maxScore: number) => void;
  onBackToLessons: () => void;
}

export default function QuizRunner({ course, studentId, onSubmitQuiz, onBackToLessons }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const questions = course.quizQuestions;
  const currentQuestion = questions[currentIndex];

  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; originalIndex: number }[]>([]);

  React.useEffect(() => {
    if (!currentQuestion) return;
    const opts = currentQuestion.options.map((option, idx) => ({
      text: option,
      originalIndex: idx
    }));
    // Fisher-Yates shuffle
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = opts[i];
      opts[i] = opts[j];
      opts[j] = temp;
    }
    setShuffledOptions(opts);
  }, [currentIndex, course.id, currentQuestion]);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);

    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleFinished = () => {
    onSubmitQuiz(score, questions.length);
  };

  const percentScore = Math.round((score / questions.length) * 100);
  const isPassed = percentScore >= 70;

  return (
    <div className="flex flex-col lg:flex-row h-full bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR: Outlines for Shuffled Quiz progress */}
      <div className="w-full lg:w-72 bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
          <button 
            onClick={onBackToLessons} 
            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-450 hover:text-rose-600 transition tracking-wider"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Slides
          </button>
          <span className="text-[9px] font-mono font-black text-rose-600 uppercase border border-rose-150 bg-rose-50 px-2.5 py-0.5 rounded-full">
            Quiz Mode
          </span>
        </div>

        <div className="p-4 border-b border-slate-200 bg-slate-50/20 shrink-0">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5 leading-none">
            <Layers className="w-4 h-4 text-rose-600" /> Shuffled Evaluators
          </h3>
          <p className="text-[10px] text-slate-450 mt-1 font-semibold leading-relaxed">
            Choices are randomized for each attempt to maintain strict theoretical certification controls.
          </p>
        </div>

        {/* Sidebar Question outline index */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {!showResults ? (
            questions.map((q, idx) => {
              const isActive = currentIndex === idx;
              const isChecked = idx < currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (idx < currentIndex) {
                      // Allow backing up to review answered questions (optional)
                      setCurrentIndex(idx);
                      setSelectedOption(null);
                      setIsAnswered(true);
                    }
                  }}
                  disabled={idx > currentIndex}
                  className={`w-full text-left p-3 rounded-xl border transition flex gap-3 items-center ${
                    isActive
                      ? "bg-rose-50/50 border-rose-150/70 shadow-sm"
                      : idx > currentIndex
                      ? "bg-slate-50 border-slate-100 text-slate-300 opacity-60 cursor-not-allowed"
                      : "bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <span className={`text-[10px] font-mono font-black w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                    isActive
                      ? "bg-rose-600 text-white border-rose-600"
                      : isChecked
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-[10.5px] font-black text-slate-800 block truncate leading-tight">
                      Question {idx + 1}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block">
                      {idx === currentIndex ? "Evaluating Now" : idx < currentIndex ? "Answer Checked" : "Locked"}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-2 space-y-3">
              <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl text-center space-y-1">
                <span className="text-xl">🏆</span>
                <h4 className="text-[11px] font-black uppercase text-emerald-800">Quiz Completed</h4>
                <p className="text-[10px] text-emerald-600 font-semibold leading-relaxed">
                  Compliance review results prepared instantly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Shuffled Quiz Progress meter */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-450 tracking-wider mb-1">
            <span>Quiz Progression</span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden border border-slate-150 shadow-inner">
            <div
              className="h-full bg-rose-600 transition-all duration-300"
              style={{ width: `${((currentIndex + (showResults ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* CENTRAL STAGE CONTAINER: Beautiful Aspect-Video Slideboard */}
      <div className="flex-1 flex flex-col justify-center p-4 lg:p-8 overflow-y-auto">
        
        <div className="max-w-4xl w-full mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-black/10 flex flex-col justify-between aspect-video relative group slidebean-slide-animation">
          
          {/* Top Slide Header */}
          <div className="h-12 border-b border-slate-150 px-6 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow shadow-rose-600/30"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-450">
                {showResults ? "EVALUATION COMPLETE" : `QUESTION MODULE ${currentIndex + 1} OF ${questions.length}`}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 font-bold">
              {course.title}
            </div>
          </div>

          {/* Slide Stage Content Body */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center overflow-y-auto">
            {!showResults ? (
              /* Question Layout */
              <div className="space-y-4 max-w-2xl mx-auto w-full">
                
                {/* Question title display heading */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-150 flex items-center justify-center text-rose-600 font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    Q{currentIndex + 1}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-rose-600 tracking-wider">Shuffled Clinical Query</span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug font-display">
                      {currentQuestion.question}
                    </h2>
                  </div>
                </div>

                {/* Multiple Options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {shuffledOptions.map((item) => {
                    const idx = item.originalIndex;
                    const option = item.text;
                    let borderStyle = "border-slate-200 bg-white hover:border-slate-350 shadow-sm text-slate-700 hover:scale-101";
                    let checkIcon = null;

                    if (selectedOption === idx) {
                      borderStyle = "border-rose-500 bg-rose-50/20 text-rose-900 font-extrabold scale-101";
                    }

                    if (isAnswered) {
                      if (idx === currentQuestion.correctAnswerIndex) {
                        borderStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-black";
                        checkIcon = <Check className="w-4 h-4 text-emerald-650 font-bold shrink-0" />;
                      } else if (selectedOption === idx) {
                        borderStyle = "border-rose-400 bg-rose-50 text-rose-900 font-black";
                        checkIcon = <X className="w-4 h-4 text-rose-650 font-bold shrink-0" />;
                      } else {
                        borderStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswered}
                        className={`text-left p-4 rounded-2xl border text-xs leading-relaxed transition duration-150 flex items-center justify-between gap-2.5 cursor-pointer ${borderStyle}`}
                      >
                        <span className="flex-1 font-semibold">{option}</span>
                        {checkIcon}
                      </button>
                    );
                  })}
                </div>

                {/* Clinical description explanation display panel */}
                {isAnswered && (
                  <div className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50 shadow-inner text-left max-h-[110px] overflow-y-auto">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 block mb-0.5">
                      💡 Correct Clinical Rationale:
                    </span>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

              </div>
            ) : (
              /* Quiz Score Summary card screen */
              <div className="text-center max-w-md mx-auto space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mb-1 shadow-md">
                  <Award className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-150">
                    Compliance Verification Report
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none font-display">
                    Theoretical Evaluation Complete
                  </h2>
                </div>

                <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl space-y-1.5 shadow-md max-w-[280px] mx-auto">
                  <div className="text-3.5xl font-black text-slate-900 tracking-tight leading-none">
                    {score} / {questions.length}
                  </div>
                  <div className="text-[9.5px] text-slate-400 font-black uppercase tracking-widest font-mono">Answers Validated</div>
                  <div className="pt-2.5 border-t border-slate-150/80 flex justify-between items-center text-[10.5px]">
                    <span className="text-slate-500 font-bold uppercase font-mono">Required passing score:</span>
                    <span className={`font-black ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {percentScore}% / 70%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                  {isPassed
                    ? "Outstanding! You have met the 70% theoretical threshold required for emergency compliance. Proceed to the practical simulation next to complete authorization."
                    : "You didn't reach the required 70% passing threshold. We recommend backing up to review slide details and trying the evaluators again."}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Remote Control Panel Bar */}
          <div className="h-14 border-t border-slate-150 bg-slate-100 px-6 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-mono text-slate-450 font-bold">
              Slidebean Pro Player • Answer Shuffled Mode
            </span>
            
            <div className="flex gap-2.5">
              {!showResults ? (
                !isAnswered ? (
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={selectedOption === null}
                    className={`px-5 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition duration-150 cursor-pointer ${
                      selectedOption === null
                        ? "bg-slate-200 text-slate-400 border border-slate-100 cursor-not-allowed"
                        : "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/10 hover:scale-102 active:scale-98"
                    }`}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider transition duration-150 flex items-center gap-1.5 hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    {currentIndex === questions.length - 1 ? "Evaluate Score" : "Next Question"}
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                )
              ) : (
                <div className="flex gap-2">
                  {!isPassed && (
                    <button
                      onClick={() => {
                        setCurrentIndex(0);
                        setSelectedOption(null);
                        setIsAnswered(false);
                        setScore(0);
                        setShowResults(false);
                      }}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-rose-600" /> Reset Quiz
                    </button>
                  )}
                  
                  <button
                    onClick={handleFinished}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider transition duration-150 flex items-center gap-1 shadow-md hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    {isPassed ? "Enter Practical Simulation" : "Exit Evaluator"}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
