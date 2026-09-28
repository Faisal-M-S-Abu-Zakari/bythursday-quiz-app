"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Plus,
  Users,
  TrendingUp,
} from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";
import { useAuth } from "@/context/AuthContext";
import { mockData } from "@/data/mockData";
import { calculateScore } from "@/lib/scoring";
import type { Quiz, StudentQuizAttempt } from "@/types/quiz";
import type { ClassCode } from "@/types/user";

const classes: Array<"all" | ClassCode> = ["all", "10A", "10B", "11A"];
const pageSize = 10;

export function StaffDashboard({ mode }: { mode: "teacher" | "admin" }) {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const [classFilter, setClassFilter] = useState<"all" | ClassCode>("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [attempts, setAttempts] = useState<StudentQuizAttempt[]>([]);
  const isAdmin = mode === "admin";
  const teacher = user?.role === "teacher" ? user : null;
  const permitted = isAdmin ? user?.role === "admin" : Boolean(teacher);
  const allowedClasses = isAdmin
    ? classes.slice(1)
    : (teacher?.assignedClasses ?? []);

  useEffect(() => {
    if (isAuthReady && !permitted) router.replace("/login");
  }, [isAuthReady, permitted, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const found: StudentQuizAttempt[] = [];
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);
      if (!key?.startsWith("attempt_")) continue;
      try {
        const attempt = JSON.parse(
          sessionStorage.getItem(key) ?? "null",
        ) as StudentQuizAttempt | null;
        if (attempt?.hasSubmitted) found.push(attempt);
      } catch {
        /* Ignore invalid local demo records. */
      }
    }
    setAttempts(found);
  }, []);

  const allQuizzes = useMemo(() => [...mockData.quizzes], []);
  const students = useMemo(
    () =>
      mockData.students.filter((student) =>
        allowedClasses.includes(student.classCode),
      ),
    [allowedClasses],
  );
  const filteredStudents = students.filter(
    (student) => classFilter === "all" || student.classCode === classFilter,
  );
  const rows = filteredStudents.map((student) => {
    const submission = attempts
      .filter((attempt) => attempt.studentId === student.id)
      .map((attempt) => ({
        attempt,
        quiz: allQuizzes.find((quiz) => quiz.id === attempt.quizId),
      }))
      .filter((item): item is { attempt: StudentQuizAttempt; quiz: Quiz } =>
        Boolean(item.quiz),
      )
      .sort(
        (a, b) =>
          new Date(b.attempt.completedAt ?? b.attempt.startedAt).getTime() -
          new Date(a.attempt.completedAt ?? a.attempt.startedAt).getTime(),
      )[0];
    const result = submission
      ? calculateScore(submission.attempt, submission.quiz)
      : null;
    return {
      student,
      submission,
      score: result?.score ?? null,
      percentage: result?.percentage ?? null,
    };
  });
  const visibleRows = rows.slice(0, visibleCount);
  const percentages = attempts
    .map((attempt) => {
      const quiz = allQuizzes.find((item) => item.id === attempt.quizId);
      return quiz ? calculateScore(attempt, quiz).percentage : null;
    })
    .filter((value): value is number => value !== null);
  const average = percentages.length
    ? percentages.reduce((sum, value) => sum + value, 0) / percentages.length
    : 0;
  const activeQuizzes = allQuizzes.filter((quiz) => quiz.isActive).length;

  if (!isAuthReady || !permitted) return null;
  const displayName =
    isAdmin && user?.role === "admin" ? user.name : teacher?.name;

  return (
    <div className="bg-slate-50 min-h-screen">
      <LMSHeader />
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-7 max-w-7xl">
        <section className="flex sm:flex-row flex-col justify-between sm:items-end gap-4 mb-7">
          <div>
            <p className="font-bold text-indigo-600 text-xs uppercase tracking-[0.18em]">
              {isAdmin ? "Administration" : "Learning analytics"}
            </p>
            <h1 className="mt-1 font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight">
              {isAdmin ? "Academy overview" : `Welcome, ${displayName}`}
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              Monitor learner progress and keep assessments moving.
            </p>
          </div>
          <Link
            href="/teacher/dashboard/create-quiz"
            className="inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm px-5 rounded-xl min-h-11 font-semibold text-white transition"
          >
            <Plus size={18} />
            Create new quiz
          </Link>
        </section>
        <section className="gap-4 grid sm:grid-cols-2 xl:grid-cols-3 mb-8">
          {[
            {
              title: "Total students",
              value: students.length,
              caption: isAdmin
                ? "Across all classes"
                : "In your assigned classes",
              icon: Users,
              tone: "bg-blue-50 text-blue-700",
            },
            {
              title: "Active quizzes",
              value: activeQuizzes,
              caption: "Ready for learners",
              icon: ClipboardList,
              tone: "bg-emerald-50 text-emerald-700",
            },
            {
              title: "Class average",
              value: `${average.toFixed(1)}%`,
              caption: percentages.length
                ? "From completed submissions"
                : "Awaiting first submissions",
              icon: TrendingUp,
              tone: "bg-violet-50 text-violet-700",
            },
          ].map(({ title, value, caption, icon: Icon, tone }) => (
            <article
              key={title}
              className="flex justify-between items-center bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl"
            >
              <div>
                <p className="font-medium text-slate-500 text-sm">{title}</p>
                <p className="mt-2 font-bold text-slate-900 text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-slate-500 text-xs">{caption}</p>
              </div>
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}
              >
                <Icon size={23} />
              </span>
            </article>
          ))}
        </section>

        <section className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
          <div className="p-5 sm:px-6 border-slate-100 border-b">
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  Student submissions
                </h2>
                <p className="mt-1 text-slate-500 text-sm">
                  Review recent performance and outstanding work.
                </p>
              </div>
              <span className="text-slate-500 text-xs">
                {rows.length} students
              </span>
            </div>
            <div
              role="tablist"
              aria-label="Filter students by class"
              className="flex gap-2 mt-5 pb-1 overflow-x-auto"
            >
              {classes
                .filter(
                  (code) => code === "all" || allowedClasses.includes(code),
                )
                .map((code) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={classFilter === code}
                    key={code}
                    onClick={() => {
                      setClassFilter(code);
                      setVisibleCount(pageSize);
                    }}
                    className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-semibold transition ${classFilter === code ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"}`}
                  >
                    {code === "all" ? "All classes" : code}
                  </button>
                ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Class</th>
                  <th className="px-5 py-3">Submission date/time</th>
                  <th className="px-5 py-3">Raw score</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(
                  ({ student, submission, score, percentage }) => {
                    const passed = (percentage ?? 0) >= 60;
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/80 border-slate-100 border-t transition"
                      >
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-800">
                            {student.name}
                          </span>
                          <span className="block mt-0.5 text-slate-400 text-xs">
                            {student.id}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="bg-indigo-50 px-2.5 py-1 rounded-lg font-bold text-indigo-700 text-xs">
                            {student.classCode}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-sm">
                          {submission
                            ? new Date(
                                submission.attempt.completedAt ??
                                  submission.attempt.startedAt,
                              ).toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-700 text-sm">
                          {submission
                            ? `${score} / ${submission.quiz.totalPoints}`
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          {submission ? (
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-bold ${passed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                            >
                              {passed ? "Passed" : "Failed"}
                            </span>
                          ) : (
                            <span className="bg-amber-50 px-3 py-1.5 rounded-full font-bold text-amber-700 text-xs">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 px-5 sm:px-6 py-4 border-slate-100 border-t">
            <p className="text-slate-500 text-sm">
              Showing {visibleRows.length} of {rows.length} students
            </p>
            {visibleCount < rows.length && (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + pageSize)}
                className="hover:bg-indigo-50 px-4 border border-slate-200 hover:border-indigo-300 rounded-xl min-h-11 font-semibold text-slate-700 hover:text-indigo-700 text-sm transition"
              >
                Load more / عرض المزيد
              </button>
            )}
          </div>
        </section>

        <section className="gap-4 grid lg:grid-cols-2 mt-7">
          <article className="bg-white shadow-sm p-5 border border-slate-200/80 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="place-items-center grid bg-indigo-50 rounded-xl w-10 h-10 text-indigo-700">
                <BarChart3 size={20} />
              </span>
              <div>
                <h2 className="font-bold text-slate-900">
                  Assessment overview
                </h2>
                <p className="text-slate-500 text-sm">
                  Current learning resources
                </p>
              </div>
            </div>
            <div className="space-y-3 mt-5">
              {allQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex justify-between items-center gap-3 bg-slate-50 p-3 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{quiz.title}</p>
                    <p className="mt-1 text-slate-500 text-xs">
                      Class {quiz.classCode} · {quiz.config.durationMinutes} min
                      · {quiz.totalPoints} points
                    </p>
                  </div>
                  <span className="bg-emerald-50 px-3 py-1 rounded-full font-bold text-emerald-700 text-xs">
                    {quiz.isActive ? "Active" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="bg-gradient-to-br from-indigo-700 to-blue-600 shadow-md p-6 rounded-2xl text-white">
            <p className="font-semibold text-indigo-100 text-sm">
              A small step makes a big difference
            </p>
            <h2 className="mt-2 font-bold text-2xl">
              Create your next assessment
            </h2>
            <p className="mt-2 max-w-md text-indigo-100 text-sm leading-6">
              Set dates, timing, and scoring rules to give learners a clear path
              forward.
            </p>
            <Link
              href="/teacher/dashboard/create-quiz"
              className="inline-flex items-center gap-2 bg-white hover:bg-indigo-50 mt-5 px-4 rounded-xl min-h-11 font-semibold text-indigo-800 transition"
            >
              Create a quiz <Plus size={17} />
            </Link>
          </article>
        </section>
      </main>
    </div>
  );
}
