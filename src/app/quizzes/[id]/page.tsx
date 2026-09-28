/**
 * Quiz Taking Interface - Main quiz experience with timer, questions, and RTL support
 */

"use client";

import { useEffect, useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { mockData } from "@/data/mockData";
import { QuizTimer } from "@/components/QuizTimer";
import {
  generateAttemptId,
  getTextDirection,
} from "@/lib/utils";
import { calculateScore } from "@/lib/scoring";
import { StudentQuizAttempt, Quiz } from "@/types/quiz";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import Link from "next/link";
import { LMSHeader } from "@/components/LMSHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: PageProps) {
  const { currentStudent, isStudentReady } = useStudent();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null,
  );
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Load quiz
  useEffect(() => {
    if (!resolvedParams || !isStudentReady || !currentStudent) return;

    const foundQuiz = mockData.quizzes.find((q) => q.id === resolvedParams.id);
    if (!foundQuiz) {
      window.location.href = "/quizzes";
      return;
    }

    // Check attempts already completed
    const pastAttempts: StudentQuizAttempt[] = [];
    if (typeof window !== "undefined") {
      for (let index = 0; index < sessionStorage.length; index += 1) {
        const key = sessionStorage.key(index);
        if (!key?.startsWith("attempt_")) continue;
        try {
          const parsed = JSON.parse(sessionStorage.getItem(key) ?? "null");
          if (parsed?.studentId === currentStudent.id && parsed?.quizId === foundQuiz.id && parsed?.hasSubmitted) {
            pastAttempts.push(parsed);
          }
        } catch { /* ignore */ }
      }
    }

    const maxAttempts = foundQuiz.config.maxAttempts ?? (foundQuiz.config.singleSubmission ? 1 : 1);
    if (pastAttempts.length >= maxAttempts) {
      // Reached limit! Redirect to results
      const latest = pastAttempts[pastAttempts.length - 1];
      window.location.href = `/results/${latest.id}`;
      return;
    }

    setAttemptNumber(pastAttempts.length + 1);
    setQuiz(foundQuiz);
    setLoading(false);
  }, [resolvedParams, currentStudent, isStudentReady]);

  if (!isStudentReady || !currentStudent || !resolvedParams || loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="inline-block mb-4 animate-spin">
            <div className="border-4 border-indigo-600 border-t-transparent rounded-full w-8 h-8"></div>
          </div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const textDir = getTextDirection(quiz.language);
  const isArabic = quiz.language === "ar";

  const handleAnswerSelect = (optionId: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId,
    });
  };

  const handleTimeExpired = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    const attempt: StudentQuizAttempt = {
      id: generateAttemptId(),
      studentId: currentStudent.id,
      quizId: quiz.id,
      attemptNumber,
      startedAt: new Date(),
      completedAt: new Date(),
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || "",
        timeSpentSeconds: 0,
      })),
      hasSubmitted: true,
    };

    const { score, percentage } = calculateScore(attempt, quiz);
    attempt.score = score;
    attempt.percentage = percentage;

    // Save attempt and redirect to results
    sessionStorage.setItem(`attempt_${attempt.id}`, JSON.stringify(attempt));
    window.location.href = `/results/${attempt.id}`;
  };

  const canGoNext = currentQuestionIndex < quiz.questions.length - 1;
  const canGoPrev = currentQuestionIndex > 0;
  const allAnswered = quiz.questions.every((q) => answers[q.id]);

  return (
    <div className="bg-slate-50/80 min-h-screen" dir={textDir}>
      {/* Header with Timer */}
      <div className="top-0 z-40 sticky">
        <LMSHeader
          role="student"
          name={currentStudent.name}
          detail={`Class ${currentStudent.classCode}`}
        />
        <div className="bg-white/95 shadow-sm backdrop-blur-xl border-slate-200 border-b">
          <div className="flex items-center gap-3 mx-auto px-4 sm:px-6 py-3 max-w-4xl">
            <Link
              href="/quizzes"
              aria-label={isArabic ? "العودة" : "Back"}
              className="place-items-center grid bg-slate-100 hover:bg-indigo-50 rounded-xl w-10 h-10 text-slate-600 hover:text-indigo-700 transition shrink-0"
            >
              {isArabic ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                  {quiz.title}
                </h1>
                <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 shrink-0">
                  Attempt #{attemptNumber} of {quiz.config.maxAttempts ?? 1}
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                {isArabic ? "السؤال" : "Question"} {currentQuestionIndex + 1} of{" "}
                {quiz.questions.length}
              </p>
            </div>
            <QuizTimer
              durationMinutes={quiz.config.durationMinutes}
              onTimeExpired={handleTimeExpired}
              language={quiz.language}
            />
          </div>
          <div className="bg-slate-100 h-1">
            <div
              className="bg-indigo-600 rounded-r-full h-full transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 py-6 pb-24 max-w-4xl">
        <div className="lms-card">
          {/* Question Content */}
          <div className="p-5 sm:p-8">
            {/* Question Text */}
            <div className={`mb-8 ${isArabic ? "text-right" : "text-left"}`}>
              <p className="mb-3 font-bold text-indigo-600 text-xs uppercase tracking-[0.18em]">
                {isArabic
                  ? `السؤال ${currentQuestionIndex + 1}`
                  : `Question ${currentQuestionIndex + 1}`}
              </p>
              <h2 className="mb-4 font-bold text-slate-900 text-2xl sm:text-3xl leading-relaxed tracking-tight">
                {currentQuestion.text}
              </h2>
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <span className="bg-indigo-100 px-3 py-1 rounded-full font-medium text-indigo-700">
                  {currentQuestion.points} points
                </span>
                {currentQuestion.negativeMarks && (
                  <span className="bg-orange-100 px-3 py-1 rounded-full font-medium text-orange-700">
                    -{currentQuestion.negativeMarks} wrong
                  </span>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`quiz-option w-full rounded-xl border-2 p-4 text-left text-sm transition-all sm:p-5 sm:text-base ${
                    answers[currentQuestion.id] === option.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-indigo-300"
                  }`}
                  dir={textDir}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        answers[currentQuestion.id] === option.id
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestion.id] === option.id && (
                        <span className="bg-white rounded-full w-2 h-2"></span>
                      )}
                    </span>
                    <span className="font-medium text-gray-900">
                      {option.text}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center gap-3 quiz-action-bar">
              <button
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                }
                disabled={!canGoPrev}
                className={`flex min-h-12 items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all sm:px-6 ${
                  canGoPrev
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isArabic ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
                {isArabic ? "السابق" : "Previous"}
              </button>

              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`flex min-h-12 items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all sm:px-6 ${
                    allAnswered
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <Send size={20} />
                  {isArabic ? "إرسال" : "Submit"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.min(
                        quiz.questions.length - 1,
                        currentQuestionIndex + 1,
                      ),
                    )
                  }
                  disabled={!canGoNext}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    canGoNext
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isArabic ? "التالي" : "Next"}
                  {isArabic ? (
                    <ChevronLeft size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Indicator - Mobile */}
        <div className="md:hidden mt-6">
          <div className="bg-white p-4 rounded-lg">
            <div className="gap-2 grid grid-cols-6 sm:grid-cols-8">
              {quiz.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                    idx === currentQuestionIndex
                      ? "bg-indigo-600 text-white"
                      : answers[quiz.questions[idx].id]
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
