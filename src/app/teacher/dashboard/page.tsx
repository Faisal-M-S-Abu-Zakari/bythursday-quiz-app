/**
 * Teacher Dashboard - Shows quiz performance analytics and student results
 */

"use client";

import { useEffect, useState } from "react";
import { useTeacher } from "@/context/TeacherContext";
import { mockData } from "@/data/mockData";
import { calculateScore } from "@/lib/scoring";
import { Quiz, StudentQuizAttempt } from "@/types/quiz";
import {
  BarChart3,
  Users,
  TrendingUp,
  Plus,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { LMSHeader } from "@/components/LMSHeader";

interface ClassStats {
  classCode: "10A" | "10B" | "11A";
  studentCount: number;
  totalAttempts: number;
  averageScore: number;
  averagePercentage: number;
  passRate: number;
}

export default function TeacherDashboard() {
  const { currentTeacher, isTeacherReady, logout, allQuizzes, allAttempts } =
    useTeacher();
  const [classStats, setClassStats] = useState<ClassStats[]>([]);
  const [classFilter, setClassFilter] = useState<"all" | "10A" | "10B" | "11A">(
    "all",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isTeacherReady) return;
    if (!currentTeacher) {
      window.location.href = "/teacher/login";
      return;
    }

    // Calculate stats for assigned classes
    const stats = (
      currentTeacher.assignedClasses as ("10A" | "10B" | "11A")[]
    ).map((classCode) => {
      const studentsInClass = mockData.students.filter(
        (s) => s.classCode === classCode,
      );
      const quizzesForClass = mockData.quizzes.filter(
        (q) => q.classCode === classCode,
      );
      const attemptsForClass = allAttempts.filter((a) =>
        quizzesForClass.some((q) => q.id === a.quizId),
      );

      const scores = attemptsForClass
        .filter((attempt) => attempt.hasSubmitted)
        .map((attempt) => {
          const quiz = quizzesForClass.find(
            (item) => item.id === attempt.quizId,
          );
          return quiz ? calculateScore(attempt, quiz) : null;
        })
        .filter((score): score is NonNullable<typeof score> => score !== null);

      const passCount = scores.filter(
        (result) => result.percentage >= 60,
      ).length;
      const passRate =
        scores.length > 0 ? (passCount / scores.length) * 100 : 0;

      return {
        classCode,
        studentCount: studentsInClass.length,
        totalAttempts: attemptsForClass.length,
        averageScore: scores.length
          ? scores.reduce((sum, result) => sum + result.score, 0) /
            scores.length
          : 0,
        averagePercentage:
          scores.length > 0
            ? scores.reduce((sum, result) => sum + result.percentage, 0) /
              scores.length
            : 0,
        passRate,
      };
    });

    setClassStats(stats);
    setLoading(false);
  }, [currentTeacher, isTeacherReady, allAttempts, allQuizzes]);

  const handleLogout = () => {
    logout();
    window.location.href = "/teacher/login";
  };

  if (!isTeacherReady || !currentTeacher) {
    return null;
  }

  const assignedStudents = mockData.students.filter((student) =>
    currentTeacher.assignedClasses.includes(student.classCode),
  );
  const visibleStudents = assignedStudents.filter(
    (student) => classFilter === "all" || student.classCode === classFilter,
  );
  const dashboardQuizzes = [
    ...mockData.quizzes,
    ...allQuizzes.filter(
      (quiz) => !mockData.quizzes.some((mockQuiz) => mockQuiz.id === quiz.id),
    ),
  ];
  const activeQuizzes = dashboardQuizzes.filter((quiz) => quiz.isActive).length;
  const centreScores = allAttempts
    .filter((attempt) => attempt.hasSubmitted)
    .map((attempt) => {
      const quiz = dashboardQuizzes.find((item) => item.id === attempt.quizId);
      return quiz ? calculateScore(attempt, quiz).percentage : null;
    })
    .filter((score): score is number => score !== null);
  const centreAverage = centreScores.length
    ? centreScores.reduce((sum, score) => sum + score, 0) / centreScores.length
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <LMSHeader
        role="teacher"
        name={currentTeacher.name}
        detail="Teacher dashboard"
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="mb-2 font-bold text-indigo-600 text-xs uppercase tracking-[0.18em]">
              Learning analytics
            </p>
            <h2 className="mb-2 font-bold text-slate-900 text-3xl tracking-tight">
              Centre overview
            </h2>
            <p className="text-gray-600">
              Assigned Classes:{" "}
              <span className="font-semibold">
                {currentTeacher.assignedClasses.join(", ")}
              </span>
            </p>
          </div>
          <Link
            href="/teacher/dashboard/create-quiz"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold text-white transition-colors"
          >
            <Plus size={20} />
            Create Quiz
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block mb-4 animate-spin">
              <BarChart3 size={32} className="text-indigo-600" />
            </div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="gap-4 grid sm:grid-cols-2 xl:grid-cols-3 mb-8">
              <div className="flex justify-between items-center gap-4 lms-stat-card">
                <div>
                  <p className="font-medium text-slate-500 text-sm">
                    Total students
                  </p>
                  <p className="mt-2 font-bold text-slate-900 text-3xl">
                    {assignedStudents.length}
                  </p>
                  <p className="mt-1 text-slate-500 text-xs">
                    Across your assigned classes
                  </p>
                </div>
                <span className="place-items-center grid bg-blue-50 rounded-2xl w-12 h-12 text-blue-600">
                  <Users size={23} />
                </span>
              </div>
              <div className="flex justify-between items-center gap-4 lms-stat-card">
                <div>
                  <p className="font-medium text-slate-500 text-sm">
                    Active quizzes
                  </p>
                  <p className="mt-2 font-bold text-slate-900 text-3xl">
                    {activeQuizzes}
                  </p>
                  <p className="mt-1 text-slate-500 text-xs">
                    Ready for learners
                  </p>
                </div>
                <span className="place-items-center grid bg-emerald-50 rounded-2xl w-12 h-12 text-emerald-600">
                  <ClipboardList size={23} />
                </span>
              </div>
              <div className="flex justify-between items-center gap-4 lms-stat-card">
                <div>
                  <p className="font-medium text-slate-500 text-sm">
                    Average centre score
                  </p>
                  <p className="mt-2 font-bold text-slate-900 text-3xl">
                    {centreAverage.toFixed(1)}%
                  </p>
                  <p className="mt-1 text-slate-500 text-xs">
                    Across submitted assessments
                  </p>
                </div>
                <span className="place-items-center grid bg-violet-50 rounded-2xl w-12 h-12 text-violet-600">
                  <TrendingUp size={23} />
                </span>
              </div>
            </div>

            <section className="mb-8 overflow-hidden lms-card">
              <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 px-5 sm:px-6 py-5 border-slate-100 border-b">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Student submissions
                  </h3>
                  <p className="mt-1 text-slate-500 text-sm">
                    Review learner activity and recent results by class.
                  </p>
                </div>
                <label className="flex items-center gap-2 font-medium text-slate-600 text-sm">
                  Class
                  <select
                    value={classFilter}
                    onChange={(event) =>
                      setClassFilter(event.target.value as typeof classFilter)
                    }
                    className="bg-white px-3 py-2 border border-slate-200 focus:border-indigo-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 text-slate-800 text-sm"
                  >
                    <option value="all">All classes</option>
                    {currentTeacher.assignedClasses.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="overflow-x-auto">
                <table className="lms-table w-full min-w-[680px]">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Assessment</th>
                      <th>Submitted</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((student) => {
                      const submission = allAttempts
                        .filter(
                          (attempt) =>
                            attempt.studentId === student.id &&
                            attempt.hasSubmitted,
                        )
                        .map((attempt) => ({
                          attempt,
                          quiz: dashboardQuizzes.find(
                            (quiz) => quiz.id === attempt.quizId,
                          ),
                        }))
                        .filter(
                          (
                            item,
                          ): item is {
                            attempt: StudentQuizAttempt;
                            quiz: Quiz;
                          } => Boolean(item.quiz),
                        )
                        .sort(
                          (a, b) =>
                            new Date(
                              b.attempt.completedAt || b.attempt.startedAt,
                            ).getTime() -
                            new Date(
                              a.attempt.completedAt || a.attempt.startedAt,
                            ).getTime(),
                        )[0];
                      const scorePercentage = submission
                        ? calculateScore(submission.attempt, submission.quiz)
                            .percentage
                        : 0;
                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td>
                            <span className="font-semibold text-slate-800">
                              {student.name}
                            </span>
                            <span className="block mt-0.5 text-slate-400 text-xs">
                              {student.id}
                            </span>
                          </td>
                          <td>
                            <span className="bg-indigo-50 px-2.5 py-1 rounded-lg font-bold text-indigo-700 text-xs">
                              {student.classCode}
                            </span>
                          </td>
                          <td className="text-slate-600">
                            {submission?.quiz.title ?? "No submission yet"}
                          </td>
                          <td className="text-slate-500">
                            {submission
                              ? new Date(
                                  submission.attempt.completedAt ||
                                    submission.attempt.startedAt,
                                ).toLocaleString()
                              : "—"}
                          </td>
                          <td>
                            {submission ? (
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${scorePercentage >= 60 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                              >
                                {scorePercentage.toFixed(0)}% ·{" "}
                                {scorePercentage >= 60
                                  ? "Passed"
                                  : "Needs support"}
                              </span>
                            ) : (
                              <span className="bg-amber-50 px-3 py-1 rounded-full font-bold text-amber-700 text-xs">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Class Performance Cards */}
            <div className="gap-6 grid md:grid-cols-3 mb-8">
              {classStats.map((stats) => (
                <div
                  key={stats.classCode}
                  className="bg-white shadow-md p-6 border-indigo-500 border-l-4 rounded-xl"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-xl">
                      Class {stats.classCode}
                    </h3>
                    <Users size={24} className="text-indigo-600" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="mb-1 text-gray-600 text-xs">Students</p>
                      <p className="font-bold text-gray-900 text-2xl">
                        {stats.studentCount}
                      </p>
                    </div>

                    <div className="pt-3 border-gray-200 border-t">
                      <p className="mb-1 text-gray-600 text-xs">Submissions</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {stats.totalAttempts}
                      </p>
                    </div>

                    <div className="pt-3 border-gray-200 border-t">
                      <p className="mb-1 text-gray-600 text-xs">
                        Average Score
                      </p>
                      <p className="font-bold text-indigo-600 text-lg">
                        {stats.averagePercentage.toFixed(1)}%
                      </p>
                    </div>

                    <div className="pt-3 border-gray-200 border-t">
                      <p className="mb-1 text-gray-600 text-xs">Pass Rate</p>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-green-600 text-lg">
                          {stats.passRate.toFixed(0)}%
                        </p>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-green-500 h-full transition-all"
                            style={{ width: `${stats.passRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="gap-4 grid md:grid-cols-4 mb-8">
              <div className="bg-white shadow p-4 border-blue-500 border-l-4 rounded-lg">
                <p className="mb-1 text-gray-600 text-xs">Total Quizzes</p>
                <p className="font-bold text-gray-900 text-2xl">
                  {allQuizzes.length}
                </p>
              </div>
              <div className="bg-white shadow p-4 border-green-500 border-l-4 rounded-lg">
                <p className="mb-1 text-gray-600 text-xs">Total Submissions</p>
                <p className="font-bold text-gray-900 text-2xl">
                  {allAttempts.filter((a) => a.hasSubmitted).length}
                </p>
              </div>
              <div className="bg-white shadow p-4 border-purple-500 border-l-4 rounded-lg">
                <p className="mb-1 text-gray-600 text-xs">Active Classes</p>
                <p className="font-bold text-gray-900 text-2xl">
                  {currentTeacher.assignedClasses.length}
                </p>
              </div>
              <div className="bg-white shadow p-4 border-orange-500 border-l-4 rounded-lg">
                <p className="mb-1 text-gray-600 text-xs">Avg Completion</p>
                <p className="font-bold text-gray-900 text-2xl">
                  {classStats.length > 0
                    ? (
                        classStats.reduce(
                          (sum, s) =>
                            sum +
                            (s.totalAttempts /
                              (s.studentCount * allQuizzes.length) || 0),
                          0,
                        ) / classStats.length
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Recent Quizzes */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-gray-200 border-b">
                <h3 className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                  <TrendingUp size={20} className="text-indigo-600" />
                  Recent Quizzes
                </h3>
              </div>
              <div className="divide-y">
                {allQuizzes.length === 0 ? (
                  <div className="p-6 text-gray-600 text-center">
                    No quizzes created yet.{" "}
                    <Link
                      href="/teacher/dashboard/create-quiz"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Create one now
                    </Link>
                  </div>
                ) : (
                  allQuizzes.slice(-5).map((quiz) => {
                    const quizAttempts = allAttempts.filter(
                      (a) => a.quizId === quiz.id,
                    );
                    return (
                      <div
                        key={quiz.id}
                        className="hover:bg-gray-50 p-6 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {quiz.title}
                            </h4>
                            <p className="mt-1 text-gray-600 text-sm">
                              {quiz.description}
                            </p>
                          </div>
                          <span className="bg-indigo-100 px-3 py-1 rounded-full font-medium text-indigo-700 text-xs">
                            {quizAttempts.length} submissions
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3 text-gray-600 text-xs">
                          <span>📝 {quiz.questions.length} questions</span>
                          <span>⏱️ {quiz.config.durationMinutes} min</span>
                          <span>🎯 {quiz.totalPoints} points</span>
                          <span className="capitalize">
                            {quiz.language === "ar"
                              ? "🇸🇦 Arabic"
                              : "🇬🇧 English"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
