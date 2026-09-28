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
  Mail,
  Send,
  Calendar,
  Sparkles,
  Repeat,
} from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";
import { MessageComposeModal } from "@/components/MessageComposeModal";
import { useAuth } from "@/context/AuthContext";
import { useCommunication } from "@/context/CommunicationContext";
import { mockData } from "@/data/mockData";
import { calculateScore } from "@/lib/scoring";
import { getExamWindowStatus } from "@/lib/utils";
import type { Quiz, StudentQuizAttempt } from "@/types/quiz";
import type { ClassCode } from "@/types/user";

const classes: Array<"all" | ClassCode> = ["all", "10A", "10B", "11A"];
const pageSize = 10;

export function StaffDashboard({ mode }: { mode: "teacher" | "admin" }) {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const { getTeacherSentMessages } = useCommunication();

  const [classFilter, setClassFilter] = useState<"all" | ClassCode>("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [attempts, setAttempts] = useState<StudentQuizAttempt[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<{ id: string; name: string } | null>(null);

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
    const studentAttempts = attempts.filter((attempt) => attempt.studentId === student.id);
    const submission = studentAttempts
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

    const maxAllowedAttempts = submission?.quiz?.config.maxAttempts ?? 1;

    return {
      student,
      submission,
      attemptsCount: studentAttempts.length,
      maxAllowedAttempts,
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
  const sentMessages = teacher ? getTeacherSentMessages(teacher.id) : [];

  if (!isAuthReady || !permitted) return null;
  const displayName =
    isAdmin && user?.role === "admin" ? user.name : teacher?.name;

  return (
    <div className="bg-slate-50 min-h-screen">
      <LMSHeader />
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-7 max-w-7xl">
        {/* Top Header & Fast Actions */}
        <section className="flex sm:flex-row flex-col justify-between sm:items-end gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                <Sparkles size={13} /> {isAdmin ? "Administration Panel" : "Faculty Portal · بوابة المعلم"}
              </span>
              <span className="text-xs text-slate-500">
                Same-Day Exam Windows & Attempt Limits Active
              </span>
            </div>
            <h1 className="mt-2 font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight">
              {isAdmin ? "Academy Overview & Management" : `Welcome, ${displayName}`}
            </h1>
            <p className="mt-1 text-slate-500 text-sm">
              Manage quizzes, monitor student attempts, and broadcast guidance messages.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => {
                setTargetStudent(null);
                setIsComposeOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-4 rounded-xl min-h-11 font-semibold text-slate-700 text-sm transition"
            >
              <Mail size={17} className="text-indigo-600" />
              Broadcast Message
            </button>
            <Link
              href="/teacher/dashboard/create-quiz"
              className="inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 px-5 rounded-xl min-h-11 font-semibold text-white transition"
            >
              <Plus size={18} />
              Create new quiz
            </Link>
          </div>
        </section>

        {/* Analytics Top Cards */}
        <section className="gap-4 grid sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {[
            {
              title: "Assigned Students",
              value: students.length,
              caption: isAdmin ? "Across all active classes" : "In your assigned classes",
              icon: Users,
              tone: "bg-blue-50 text-blue-700",
            },
            {
              title: "Controlled Quizzes",
              value: activeQuizzes,
              caption: "With same-day windows",
              icon: ClipboardList,
              tone: "bg-emerald-50 text-emerald-700",
            },
            {
              title: "Attempt Limit Settings",
              value: "1 – 3",
              caption: "Attempts configurable",
              icon: Repeat,
              tone: "bg-amber-50 text-amber-700",
            },
            {
              title: "Average Performance",
              value: `${average.toFixed(1)}%`,
              caption: percentages.length
                ? "Highest recorded scores"
                : "Awaiting student attempts",
              icon: TrendingUp,
              tone: "bg-violet-50 text-violet-700",
            },
          ].map(({ title, value, caption, icon: Icon, tone }) => (
            <article
              key={title}
              className="flex justify-between items-center bg-white shadow-xs p-5 border border-slate-200/80 rounded-2xl"
            >
              <div>
                <p className="font-medium text-slate-500 text-sm">{title}</p>
                <p className="mt-2 font-bold text-slate-900 text-3xl">{value}</p>
                <p className="mt-1 text-slate-500 text-xs">{caption}</p>
              </div>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
                <Icon size={23} />
              </span>
            </article>
          ))}
        </section>

        {/* Submissions & Student Progress Table */}
        <section className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden mb-8">
          <div className="p-5 sm:px-6 border-slate-100 border-b">
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  Student Assessment Submissions & Attempts
                </h2>
                <p className="mt-1 text-slate-500 text-sm">
                  Review student attempts, score breakdowns, and send direct teacher messages.
                </p>
              </div>
              <span className="text-slate-500 text-xs font-semibold">
                {rows.length} students enrolled
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
                    className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-semibold transition ${
                      classFilter === code
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {code === "all" ? "All Classes" : `Class ${code}`}
                  </button>
                ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-50 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Class</th>
                  <th className="px-5 py-3.5">Attempts</th>
                  <th className="px-5 py-3.5">Submission Time</th>
                  <th className="px-5 py-3.5">Best Score</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Direct Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map(
                  ({ student, submission, attemptsCount, maxAllowedAttempts, score, percentage }) => {
                    const passed = (percentage ?? 0) >= 60;
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/80 transition"
                      >
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-900 block">
                            {student.name}
                          </span>
                          <span className="block mt-0.5 text-slate-400 text-xs font-mono">
                            {student.id}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="bg-indigo-50 px-2.5 py-1 rounded-lg font-bold text-indigo-700 text-xs">
                            {student.classCode}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                            <Repeat size={12} className="text-indigo-600" />
                            {attemptsCount > 0 ? `${attemptsCount} / ${maxAllowedAttempts}` : `0 / ${maxAllowedAttempts}`}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-sm">
                          {submission
                            ? new Date(
                                submission.attempt.completedAt ??
                                  submission.attempt.startedAt,
                              ).toLocaleString([], {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "—"}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800 text-sm">
                          {submission
                            ? `${score} / ${submission.quiz.totalPoints} (${percentage?.toFixed(0)}%)`
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          {submission ? (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                passed
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {passed ? "Passed" : "Failed"}
                            </span>
                          ) : (
                            <span className="bg-amber-50 px-3 py-1 rounded-full font-bold text-amber-700 text-xs">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetStudent({ id: student.id, name: student.name });
                              setIsComposeOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-700 shadow-2xs transition"
                          >
                            <Mail size={13} className="text-indigo-600" />
                            <span>Message</span>
                          </button>
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

        {/* Quizzes Overview & Teacher Messages Card */}
        <section className="gap-6 grid lg:grid-cols-2">
          {/* Quizzes with same-day windows and attempt limits */}
          <article className="bg-white shadow-xs p-6 border border-slate-200/80 rounded-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="place-items-center grid bg-indigo-50 rounded-2xl w-11 h-11 text-indigo-700">
                  <BarChart3 size={22} />
                </span>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">
                    Quizzes & Same-Day Exam Windows
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Fixed ~12h windows and attempt restrictions
                  </p>
                </div>
              </div>
              <Link
                href="/teacher/dashboard/create-quiz"
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                + New Quiz
              </Link>
            </div>

            <div className="space-y-3.5 mt-5">
              {allQuizzes.map((quiz) => {
                const windowInfo = getExamWindowStatus(quiz.openDate, quiz.closeDate);
                return (
                  <div
                    key={quiz.id}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{quiz.title}</p>
                        <p className="mt-1 text-slate-500 text-xs">
                          Class {quiz.classCode} · {quiz.config.durationMinutes} min · {quiz.totalPoints} points
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          windowInfo.status === "open"
                            ? "bg-emerald-100 text-emerald-800"
                            : windowInfo.status === "upcoming"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {windowInfo.status === "open" ? "Window Open" : windowInfo.status === "upcoming" ? "Scheduled" : "Closed"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-medium text-slate-700 border border-slate-200">
                        <Calendar size={13} className="text-indigo-600" />
                        {windowInfo.labelEn}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-medium text-indigo-700 border border-indigo-100">
                        <Repeat size={13} />
                        Limit: {quiz.config.maxAttempts ?? 1} {quiz.config.maxAttempts === 1 ? "attempt" : "attempts"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Teacher Broadcasts & Messages Sent */}
          <article className="bg-white shadow-xs p-6 border border-slate-200/80 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="place-items-center grid bg-blue-50 rounded-2xl w-11 h-11 text-blue-700">
                    <Mail size={22} />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">
                      Recent Messages & Guidance
                    </h2>
                    <p className="text-slate-500 text-xs">
                      Teacher-to-student notifications log
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTargetStudent(null);
                    setIsComposeOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <Send size={12} /> New Message
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {sentMessages.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-sm">
                    No messages sent yet. Use the button above to broadcast exam reminders or send individual feedback.
                  </div>
                ) : (
                  sentMessages.slice(0, 4).map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          To: {msg.recipientName}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            msg.priority === "urgent"
                              ? "bg-rose-100 text-rose-700"
                              : msg.priority === "important"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {msg.priority}
                        </span>
                      </div>
                      <p className="mt-1 font-semibold text-xs text-indigo-900">
                        {msg.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {msg.content}
                      </p>
                      <p className="mt-1.5 text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 p-4 text-white flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Empower learners with active guidance</p>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Send notifications directly before exam windows close.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTargetStudent(null);
                  setIsComposeOpen(true);
                }}
                className="shrink-0 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-indigo-800 hover:bg-indigo-50 shadow-sm transition"
              >
                Send Notice
              </button>
            </div>
          </article>
        </section>
      </main>

      {/* Message Compose Modal */}
      {user && (
        <MessageComposeModal
          isOpen={isComposeOpen}
          onClose={() => {
            setIsComposeOpen(false);
            setTargetStudent(null);
          }}
          teacherId={user.id}
          teacherName={user.name}
          defaultRecipientType={targetStudent ? "student" : "class"}
          defaultRecipientId={targetStudent?.id || "10A"}
          assignedClasses={user.role === "teacher" ? user.assignedClasses : ["10A", "10B", "11A"]}
        />
      )}
    </div>
  );
}
