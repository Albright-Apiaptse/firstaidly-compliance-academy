import React, { useState } from "react";
import { ChevronLeft, HelpCircle, Check, X, AlertTriangle, ArrowRight, Award } from "lucide-react";
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
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0 font-medium">
        {!showResults && (
          <button onClick={onBackToLessons} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
            <ChevronLeft className="w-4 h-4" />
            Lessons
          </button>
        )}
        <span className="text-xs font-bold text-slate-800 max-w-[180px] truncate">
          {course.title} Quiz
        </span>
        <span className="text-[10px] font-mono text-slate-450">
          {!showResults ? `Q ${currentIndex + 1}/${questions.length}` : "Finished"}
        </span>
      </div>

      {/* Progress Line */}
      {!showResults && (
        <div className="h-1 bg-slate-200 w-full shrink-0">
          <div
            className="h-full bg-rose-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-between">
        {!showResults ? (
          /* Question View */
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-855 leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {shuffledOptions.map((item) => {
                  const idx = item.originalIndex;
                  const option = item.text;
                  let borderStyle = "border-slate-200 bg-white hover:border-slate-300 shadow-sm text-slate-700";
                  let checkIcon = null;

                  if (selectedOption === idx) {
                    borderStyle = "border-rose-500 bg-rose-50/20 text-rose-900 font-medium";
                  }

                  if (isAnswered) {
                    if (idx === currentQuestion.correctAnswerIndex) {
                      borderStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                      checkIcon = <Check className="w-4 h-4 text-emerald-650 font-bold" />;
                    } else if (selectedOption === idx) {
                      borderStyle = "border-rose-400 bg-rose-50 text-rose-900 font-semibold";
                      checkIcon = <X className="w-4 h-4 text-rose-650 font-bold" />;
                    } else {
                      borderStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-xs leading-relaxed transition cursor-pointer ${borderStyle}`}
                    >
                      <span className="flex-1 pr-2">{option}</span>
                      {checkIcon}
                    </div>
                  );
                })}
              </div>

              {/* Correct Explanation block */}
              {isAnswered && (
                <div className="mt-4 p-4 rounded-xl border bg-white border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-1">
                    Clinical Explanation
                  </h4>
                  <p className="text-[11px] text-slate-550 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-6">
              {!isAnswered ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedOption === null}
                  className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center transition shadow-lg ${
                    selectedOption === null
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-100"
                      : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10"
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full bg-white hover:bg-slate-100 border border-slate-200 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-700 shadow-sm transition"
                >
                  {currentIndex === questions.length - 1 ? "View Final Results" : "Next Question"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Complete View */
          <div className="flex-1 flex flex-col justify-between py-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-650 mb-2 shadow-sm">
                <Award className="w-8 h-8" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-tight">Quiz Complete!</h2>
              
              <div className="bg-white border border-slate-200 max-w-[260px] mx-auto p-4 rounded-2xl space-y-1.5 shadow-sm">
                <div className="text-3xl font-extrabold text-slate-900">{score} / {questions.length}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Correct Answers</div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center px-4">
                  <span className="text-xs text-slate-500">Score Percentage</span>
                  <span className={`text-xs font-extrabold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {percentScore}%
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                {isPassed
                  ? "Outstanding! You have met the 70% proficiency required for this theoretical module. Finish the Practical Simulation next to qualify for compliance certificate."
                  : "You didn't reach the passing threshold of 70%. We recommend reviewing the guide and attempting the quiz again."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-6">
              <button
                onClick={handleFinished}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition shadow-lg shadow-rose-600/10"
              >
                {isPassed ? "Proceed to Practical Simulation" : "Back to Module"}
              </button>
              
              {!isPassed && (
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setSelectedOption(null);
                    setIsAnswered(false);
                    setScore(0);
                    setShowResults(false);
                  }}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 py-3 rounded-xl text-xs font-semibold text-slate-600 shadow-sm transition"
                >
                  Retry Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
