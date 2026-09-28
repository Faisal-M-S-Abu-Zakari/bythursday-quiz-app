"use client";

import { useEffect, useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { mockData } from "@/data/mockData";
import {
  isQuizAvailable,
  getExamWindowStatus,
  getStudentAttempts,
  getRemainingAttempts,
  canStudentAttemptQuiz,
} from "@/lib/utils";
import { Clock, BookOpen, ArrowRight, ShieldAlert, Repeat, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { LMSHeader } from "@/components/LMSHeader";
import type { StudentQuizAttempt } from "@/types/quiz";

export default function QuizzesPage() {
  const { currentStudent, isStudentReady, logout } = useStudent();
  const [quizzes, setQuizzes] = useState<typeof mockData.quizzes>([]);
  const [attempts, setAttempts] = useState<StudentQuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isStudentReady) return;
    if (!currentStudent) {
      window.location.href = "/";
      return;
    }

    // Filter quizzes for student's class
    const availableQuizzes = mockData.quizzes.filter(
      (quiz) => quiz.classCode === currentStudent.classCode,
    );
    setQuizzes(availableQuizzes);

    // Load attempts
    if (typeof window !== "undefined") {
      const saved: StudentQuizAttempt[] = [];
      for (let index = 0; index < sessionStorage.length; index += 1) {
        const key = sessionStorage.key(index);
        if (!key?.startsWith("attempt_")) continue;
        try {
          const attempt = JSON.parse(
            sessionStorage.getItem(key) ?? "null"
          ) as StudentQuizAttempt | null;
          if (attempt?.studentId === currentStudent.id && attempt.hasSubmitted) {
            saved.push(attempt);
          }
        } catch {
          /* Ignore */
        }
      }
      setAttempts(saved);
    }

    setLoading(false);
  }, [currentStudent, isStudentReady]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (!isStudentReady || !currentStudent) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <LMSHeader
        role="student"
        name={currentStudent.name}
        detail={`Student · Class ${currentStudent.classCode}`}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* Welcome Message */}
        <div className="mb-8">
          <p className="mb-2 font-bold text-indigo-600 text-xs uppercase tracking-[0.18em]">
            Amman Tutoring Centre Assessment Portal
          </p>
          <h1 className="mb-2 font-bold text-slate-900 text-3xl tracking-tight">
            Class {currentStudent.classCode} Assessments
          </h1>
          <p className="text-slate-600 text-sm">
            All quizzes have strictly controlled same-day exam windows (~12 hours) and configured attempt limits.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin">
              <BookOpen size={32} className="text-indigo-600" />
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading assessments...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white p-12 border-2 border-slate-200 border-dashed rounded-3xl text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="font-bold text-slate-800 text-lg">No quizzes available</p>
            <p className="mt-2 text-slate-500 text-sm">
              Check back later for newly scheduled exam windows.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {quizzes.map((quiz) => {
              const windowStatus = getExamWindowStatus(quiz.openDate, quiz.closeDate);
              const quizAttempts = getStudentAttempts(currentStudent.id, quiz.id, attempts);
              const attemptsUsed = quizAttempts.length;
              const maxAttempts = quiz.config.maxAttempts ?? (quiz.config.singleSubmission ? 1 : 1);
              const remaining = getRemainingAttempts(currentStudent.id, quiz, attempts);
              const attemptState = canStudentAttemptQuiz(currentStudent.id, quiz, attempts);
              const isAvailable = isQuizAvailable(quiz);

              return (
                <div
                  key={quiz.id}
                  className={`rounded-3xl border transition-all overflow-hidden ${
                    isAvailable
                      ? "border-indigo-200/90 bg-white hover:shadow-lg shadow-xs"
                      : "border-slate-200 bg-white/70"
                  }`}
                >
                  <div className="p-5 sm:p-7">
                    {/* Top Row: Window status and Attempt pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          windowStatus.status === "open"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : windowStatus.status === "upcoming"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            windowStatus.status === "open"
                              ? "bg-emerald-500 animate-pulse"
                              : windowStatus.status === "upcoming"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {windowStatus.labelEn}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          remaining > 0
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Repeat size={13} />
                        Attempt policy: {attemptsUsed} of {maxAttempts} used ({remaining} remaining)
                      </span>
                    </div>

                    {/* Quiz Title & Description */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h2 className="font-bold text-slate-900 text-xl leading-tight">
                          {quiz.title}
                        </h2>
                        <p className="mt-1 text-slate-600 text-sm leading-relaxed">
                          {quiz.description}
                        </p>
                      </div>
                      <span className="hidden sm:grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 shrink-0">
                        <BookOpen size={24} />
                      </span>
                    </div>

                    {/* Quiz Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 py-3 border-y border-slate-100 text-center">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <p className="text-slate-500 text-xs">Questions</p>
                        <p className="font-bold text-slate-900 text-lg mt-0.5">
                          {quiz.questions.length}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <p className="text-slate-500 text-xs">Duration</p>
                        <p className="font-bold text-slate-900 text-lg mt-0.5">
                          {quiz.config.durationMinutes} min
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <p className="text-slate-500 text-xs">Total Points</p>
                        <p className="font-bold text-slate-900 text-lg mt-0.5">
                          {quiz.totalPoints}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <p className="text-slate-500 text-xs">Language</p>
                        <p className="font-bold text-slate-900 text-lg mt-0.5">
                          {quiz.language === "ar" ? "العربية" : "English"}
                        </p>
                      </div>
                    </div>

                    {/* Negative Marking & Rules */}
                    <div className="flex flex-wrap items-center gap-3 mb-5 text-xs text-slate-600">
                      {quiz.config.negativeMarking ? (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-amber-800 font-semibold border border-amber-200">
                          <ShieldAlert size={14} />
                          Negative marking: −{quiz.config.negativeMarksPerQuestion} point for wrong answers
                        </div>
                      ) : (
                        <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-600 font-medium">
                          No negative marking penalty
                        </div>
                      )}

                      <div className="inline-flex items-center gap-1.5 text-slate-500">
                        <Clock size={14} className="text-indigo-600" />
                        <span>{windowStatus.timeRemainingText}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {attemptState.allowed ? (
                        <Link
                          href={`/quizzes/${quiz.id}`}
                          className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3.5 rounded-2xl w-full font-bold text-white shadow-md shadow-indigo-100 transition"
                        >
                          {attemptsUsed === 0
                            ? "Start Quiz"
                            : `Retake Quiz (Attempt ${attemptState.attemptNumber} of ${maxAttempts})`}
                          <ArrowRight size={18} />
                        </Link>
                      ) : attemptsUsed >= maxAttempts ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                            Attempt limit reached ({maxAttempts} of {maxAttempts} used)
                          </div>
                          {quizAttempts.length > 0 && (
                            <Link
                              href={`/results/${quizAttempts[quizAttempts.length - 1].id}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                            >
                              View Best Result &rarr;
                            </Link>
                          )}
                        </div>
                      ) : (
                        <button
                          disabled
                          className="bg-slate-200 px-4 py-3.5 rounded-2xl w-full font-bold text-slate-500 cursor-not-allowed text-sm"
                        >
                          {attemptState.reason || "Exam Window Closed"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
