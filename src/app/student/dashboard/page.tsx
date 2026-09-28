"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  Sparkles,
  Trophy,
  Repeat,
  Mail,
} from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";
import { useAuth } from "@/context/AuthContext";
import { useCommunication } from "@/context/CommunicationContext";
import { mockData } from "@/data/mockData";
import {
  getExamWindowStatus,
  getStudentAttempts,
  getRemainingAttempts,
  canStudentAttemptQuiz,
} from "@/lib/utils";
import type { StudentQuizAttempt } from "@/types/quiz";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const { getStudentMessages } = useCommunication();
  const [attempts, setAttempts] = useState<StudentQuizAttempt[]>([]);

  const student = user?.role === "student" ? user : null;

  useEffect(() => {
    if (!isAuthReady) return;
    if (!student) router.replace("/login");
  }, [isAuthReady, router, student]);

  useEffect(() => {
    if (!student || typeof window === "undefined") return;
    const saved: StudentQuizAttempt[] = [];
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);
      if (!key?.startsWith("attempt_")) continue;
      try {
        const attempt = JSON.parse(
          sessionStorage.getItem(key) ?? "null"
        ) as StudentQuizAttempt | null;
        if (attempt?.studentId === student.id && attempt.hasSubmitted) {
          saved.push(attempt);
        }
      } catch {
        /* Ignore malformed local demo records. */
      }
    }
    setAttempts(saved);
  }, [student]);

  const quizzes = useMemo(
    () => mockData.quizzes.filter((quiz) => quiz.classCode === student?.classCode),
    [student]
  );

  const teacherMessages = student
    ? getStudentMessages(student.id, student.classCode)
    : [];

  const urgentMessages = teacherMessages.filter(
    (m) => m.priority === "urgent" || m.priority === "important"
  );

  if (!student) return null;

  const averagePercentage = attempts.length
    ? Math.round(
        attempts.reduce((sum, a) => sum + (a.percentage ?? 0), 0) / attempts.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <LMSHeader />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* Welcome Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-700 to-blue-600 p-6 text-white shadow-xl shadow-indigo-200/50 sm:p-8">
          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <Sparkles size={14} className="text-amber-300" />
                  Amman Tutoring Centre · مركز عمّان التعليمي
                </span>
                <span className="rounded-full bg-emerald-400/25 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
                  Class {student.classCode}
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back, {student.name}
              </h1>
              <p className="mt-2 text-indigo-100 text-sm max-w-xl leading-relaxed">
                Stay updated with your daily assessment windows, review teacher messages, and track your milestones.
              </p>
            </div>
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur-md shadow-inner">
              <Trophy size={32} />
            </span>
          </div>

          <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-5 border-t border-white/15">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xs">
              <p className="text-xs text-indigo-200">Class Quizzes</p>
              <p className="mt-1 text-xl font-bold">{quizzes.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xs">
              <p className="text-xs text-indigo-200">Attempts Completed</p>
              <p className="mt-1 text-xl font-bold">{attempts.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xs">
              <p className="text-xs text-indigo-200">Average Score</p>
              <p className="mt-1 text-xl font-bold">{attempts.length ? `${averagePercentage}%` : "—"}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xs">
              <p className="text-xs text-indigo-200">Teacher Messages</p>
              <p className="mt-1 text-xl font-bold">{teacherMessages.length}</p>
            </div>
          </div>
        </section>

        {/* Teacher Urgent Announcements Notice */}
        {urgentMessages.length > 0 && (
          <section className="mt-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500 text-white">
                  <Mail size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-900 text-sm">
                      Teacher Notice / إشعار من المعلم
                    </span>
                    <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                      {urgentMessages[0].priority}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-amber-950 text-sm">
                    {urgentMessages[0].subject}
                  </p>
                  <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                    {urgentMessages[0].content}
                  </p>
                  <p className="mt-2 text-[10px] text-amber-700 font-medium">
                    From {urgentMessages[0].teacherName} · {new Date(urgentMessages[0].createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Available & Upcoming Quizzes with Attempt Limits and 12h Windows */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Active Assessments · الاختبارات المجدولة
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Same-Day Exam Windows & Attempt Policies
              </h2>
            </div>
            <Link
              href="/quizzes"
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              View all &rarr;
            </Link>
          </div>

          {quizzes.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {quizzes.map((quiz) => {
                const windowStatus = getExamWindowStatus(quiz.openDate, quiz.closeDate);
                const quizAttempts = getStudentAttempts(student.id, quiz.id, attempts);
                const attemptsUsed = quizAttempts.length;
                const maxAttempts = quiz.config.maxAttempts ?? (quiz.config.singleSubmission ? 1 : 1);
                const remaining = getRemainingAttempts(student.id, quiz, attempts);
                const attemptState = canStudentAttemptQuiz(student.id, quiz, attempts);
                const bestScore = quizAttempts.reduce(
                  (max, a) => Math.max(max, a.score ?? 0),
                  0
                );

                return (
                  <article
                    key={quiz.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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

                        {/* Attempt Badge */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                            remaining > 0
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <Repeat size={12} />
                          {attemptsUsed === 0
                            ? `${maxAttempts} ${maxAttempts === 1 ? "attempt" : "attempts"} allowed`
                            : `${attemptsUsed} of ${maxAttempts} used (${remaining} left)`}
                        </span>
                      </div>

                      {/* Title & Subject */}
                      <div className="flex items-start justify-between gap-3 mt-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 leading-snug">
                            {quiz.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                            {quiz.description}
                          </p>
                        </div>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
                          <BookOpen size={20} />
                        </span>
                      </div>

                      {/* Specs Grid */}
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                          <p className="text-[11px] text-slate-500">Duration</p>
                          <p className="mt-0.5 font-bold text-slate-800 text-sm">
                            {quiz.config.durationMinutes}m
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                          <p className="text-[11px] text-slate-500">Total Points</p>
                          <p className="mt-0.5 font-bold text-slate-800 text-sm">
                            {quiz.totalPoints} pts
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                          <p className="text-[11px] text-slate-500">Attempts Limit</p>
                          <p className="mt-0.5 font-bold text-indigo-700 text-sm">
                            {maxAttempts} max
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                          <p className="text-[11px] text-slate-500">Best Score</p>
                          <p className="mt-0.5 font-bold text-emerald-700 text-sm">
                            {attemptsUsed > 0 ? `${bestScore} pts` : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Negative Marking & Window Tags */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        {quiz.config.negativeMarking ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 font-semibold text-amber-800 border border-amber-200/60">
                            <ShieldAlert size={13} />
                            −{quiz.config.negativeMarksPerQuestion} point for wrong answers
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
                            No penalty marking
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2.5 py-1 text-slate-600 border border-slate-200">
                          <Clock3 size={13} className="text-indigo-600" />
                          {windowStatus.timeRemainingText}
                        </span>
                      </div>
                    </div>

                    {/* Action Button based on attempt allowance */}
                    <div className="mt-5 pt-3 border-t border-slate-100">
                      {attemptState.allowed ? (
                        <Link
                          href={`/quizzes/${quiz.id}`}
                          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
                        >
                          {attemptsUsed === 0 ? "Start Assessment" : `Retake Assessment (Attempt ${attemptState.attemptNumber} of ${maxAttempts})`}
                          <ArrowUpRight size={17} />
                        </Link>
                      ) : attemptsUsed >= maxAttempts ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">All {maxAttempts} attempts completed</span>
                          </div>
                          {quizAttempts.length > 0 && (
                            <Link
                              href={`/results/${quizAttempts[quizAttempts.length - 1].id}`}
                              className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-slate-100 px-3.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition"
                            >
                              Review Result <ArrowUpRight size={14} />
                            </Link>
                          )}
                        </div>
                      ) : (
                        <button
                          disabled
                          className="min-h-11 w-full rounded-xl bg-slate-100 px-4 font-semibold text-slate-400 cursor-not-allowed text-xs sm:text-sm"
                        >
                          {attemptState.reason || "Exam Window Closed"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No quizzes are scheduled for this class yet.
            </div>
          )}
        </section>

        {/* Progress & Submission History */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Performance Tracking
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Completed Attempt History
              </h2>
            </div>
            <span className="text-sm text-slate-500 font-semibold">
              {attempts.length} attempts recorded
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
            {attempts.length ? (
              <div className="divide-y divide-slate-100">
                {attempts
                  .slice(-5)
                  .reverse()
                  .map((attempt) => {
                    const quiz = mockData.quizzes.find(
                      (item) => item.id === attempt.quizId
                    );
                    const percent = attempt.percentage ?? 0;
                    const passed = percent >= 60;
                    const maxAttempts = quiz?.config.maxAttempts ?? 1;

                    return (
                      <div
                        key={attempt.id}
                        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 hover:bg-slate-50/70 transition"
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                              passed
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            <CheckCircle2 size={20} />
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 text-sm">
                                {quiz?.title ?? "Assessment"}
                              </p>
                              {attempt.attemptNumber && (
                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                  Attempt #{attempt.attemptNumber} of {maxAttempts}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {attempt.completedAt
                                ? new Date(attempt.completedAt).toLocaleString([], {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })
                                : "Completed"}{" "}
                              · {attempt.score ?? 0}/{quiz?.totalPoints ?? 0} points
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                              passed
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {percent.toFixed(0)}% · {passed ? "Passed" : "Review"}
                          </span>
                          <Link
                            href={`/results/${attempt.id}`}
                            className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-slate-100 hover:bg-indigo-50 px-3.5 text-xs font-bold text-indigo-700 transition"
                          >
                            Review breakdown &rarr;
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-10 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <Clock3 size={24} />
                </span>
                <p className="mt-3 font-bold text-slate-800 text-base">
                  No submissions recorded yet
                </p>
                <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                  Take your first timed assessment within the active exam window to start your learning progress record.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
