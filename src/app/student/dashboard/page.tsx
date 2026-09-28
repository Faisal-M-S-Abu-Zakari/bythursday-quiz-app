"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, CheckCircle2, Clock3, ShieldAlert, Sparkles, Trophy } from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";
import { useAuth } from "@/context/AuthContext";
import { mockData } from "@/data/mockData";
import { isQuizAvailable } from "@/lib/utils";
import type { StudentQuizAttempt } from "@/types/quiz";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
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
        const attempt = JSON.parse(sessionStorage.getItem(key) ?? "null") as StudentQuizAttempt | null;
        if (attempt?.studentId === student.id && attempt.hasSubmitted) saved.push(attempt);
      } catch { /* Ignore malformed local demo records. */ }
    }
    setAttempts(saved);
  }, [student]);

  const quizzes = useMemo(() => mockData.quizzes.filter((quiz) => quiz.classCode === student?.classCode), [student]);
  if (!student) return null;

  return (
    <div className="min-h-screen bg-slate-50"><LMSHeader />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-600 p-6 text-white shadow-lg shadow-indigo-200 sm:p-8"><div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" /><div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-sm font-medium text-indigo-100">Your learning space · مساحتك التعليمية</p><h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {student.name}</h1><p className="mt-2 text-indigo-100">Class {student.classCode} · Ready for your next milestone?</p></div><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15"><Sparkles size={27} /></span></div><div className="relative mt-6 flex flex-wrap gap-2"><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">{quizzes.length} assessments for your class</span><span className="rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-50">Learning on track</span></div></section>

        <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Up next</p><h2 className="mt-1 text-xl font-bold text-slate-900">Upcoming & active quizzes</h2></div><span className="hidden text-sm text-slate-500 sm:block">Choose an assessment to begin</span></div>
          {quizzes.length ? <div className="grid gap-4 lg:grid-cols-2">{quizzes.map((quiz) => { const available = isQuizAvailable(quiz); return <article key={quiz.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{available ? "Available now" : "Scheduled"}</span><h3 className="mt-3 text-lg font-bold text-slate-900">{quiz.title}</h3><p className="mt-1 text-sm text-slate-500">{quiz.description}</p></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><BookOpen size={21} /></span></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Duration</p><p className="mt-1 font-bold text-slate-800">{quiz.config.durationMinutes} min</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Total points</p><p className="mt-1 font-bold text-slate-800">{quiz.totalPoints} pts</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Questions</p><p className="mt-1 font-bold text-slate-800">{quiz.questions.length}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Language</p><p className="mt-1 font-bold text-slate-800">{quiz.language === "ar" ? "العربية" : "English"}</p></div></div><div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-800"><ShieldAlert size={14} />{quiz.config.negativeMarking ? `−${quiz.config.negativeMarksPerQuestion} point for wrong answers` : "No negative marking"}</span><span className="inline-flex items-center gap-1"><CalendarDays size={14} />Open until {quiz.closeDate.toLocaleDateString()}</span></div>{available ? <Link href={`/quizzes/${quiz.id}`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white transition hover:bg-indigo-700">Start quiz <ArrowUpRight size={17} /></Link> : <button disabled className="mt-5 min-h-11 w-full rounded-xl bg-slate-100 px-4 font-semibold text-slate-400">Quiz not available yet</button>}</article>; })}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No quizzes are scheduled for this class yet.</div>}
        </section>

        <section className="mt-9"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Your progress</p><h2 className="mt-1 text-xl font-bold text-slate-900">Recent results</h2></div><span className="text-sm text-slate-500">{attempts.length} completed</span></div><div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">{attempts.length ? <div className="divide-y divide-slate-100">{attempts.slice(-5).reverse().map((attempt) => { const quiz = mockData.quizzes.find((item) => item.id === attempt.quizId); const percent = attempt.percentage ?? 0; return <div key={attempt.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={20} /></span><div><p className="font-semibold text-slate-900">{quiz?.title ?? "Assessment"}</p><p className="mt-1 text-xs text-slate-500">{attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : "Recently completed"} · {attempt.score ?? 0}/{quiz?.totalPoints ?? 0} points</p></div></div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className={`rounded-full px-3 py-1.5 text-sm font-bold ${percent >= 60 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}><Trophy size={14} className="mr-1 inline" />{percent.toFixed(0)}%</span><Link href={`/results/${attempt.id}`} className="inline-flex min-h-10 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">Review <ArrowUpRight size={15} /></Link></div></div>; })}</div> : <div className="p-7 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><Clock3 size={20} /></span><p className="mt-3 font-semibold text-slate-800">Your results will appear here</p><p className="mt-1 text-sm text-slate-500">Complete your first quiz to start tracking progress.</p></div>}</div></section>
      </main>
    </div>
  );
}
