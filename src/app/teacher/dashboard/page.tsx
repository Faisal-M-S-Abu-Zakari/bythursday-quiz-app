/**
 * Teacher Dashboard - Shows quiz performance analytics and student results
 */

'use client';

import { useEffect, useState } from 'react';
import { useTeacher } from '@/context/TeacherContext';
import { mockData } from '@/data/mockData';
import { calculateQuizAnalytics } from '@/lib/scoring';
import { Quiz, StudentQuizAttempt } from '@/types/quiz';
import { BarChart3, Users, TrendingUp, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';

interface ClassStats {
  classCode: '10A' | '10B' | '11A';
  studentCount: number;
  totalAttempts: number;
  averageScore: number;
  averagePercentage: number;
  passRate: number;
}

export default function TeacherDashboard() {
  const { currentTeacher, logout, allQuizzes, allAttempts } = useTeacher();
  const [classStats, setClassStats] = useState<ClassStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTeacher) {
      window.location.href = '/teacher/login';
      return;
    }

    // Calculate stats for assigned classes
    const stats = (currentTeacher.assignedClasses as ('10A' | '10B' | '11A')[]).map(
      (classCode) => {
        const studentsInClass = mockData.students.filter(
          (s) => s.classCode === classCode
        );
        const quizzesForClass = mockData.quizzes.filter(
          (q) => q.classCode === classCode
        );
        const attemptsForClass = allAttempts.filter((a) =>
          quizzesForClass.some((q) => q.id === a.quizId)
        );

        const scores = attemptsForClass
          .filter((a) => a.score !== undefined && a.hasSubmitted)
          .map((a) => a.score!);

        const passCount = scores.filter((s) => s >= scores.length * 0.6).length;
        const passRate =
          scores.length > 0 ? (passCount / scores.length) * 100 : 0;

        return {
          classCode,
          studentCount: studentsInClass.length,
          totalAttempts: attemptsForClass.length,
          averageScore:
            scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
          averagePercentage:
            scores.length > 0
              ? (scores.reduce((a, b) => a + b, 0) / (scores.length * 75)) * 100
              : 0,
          passRate,
        };
      }
    );

    setClassStats(stats);
    setLoading(false);
  }, [currentTeacher, allAttempts, allQuizzes]);

  const handleLogout = () => {
    logout();
    window.location.href = '/teacher/login';
  };

  if (!currentTeacher) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 size={32} className="text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">byThursday</h1>
              <p className="text-xs text-gray-500">Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {currentTeacher.name}
              </p>
              <p className="text-xs text-gray-500">{currentTeacher.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Assigned Classes:{' '}
              <span className="font-semibold">
                {currentTeacher.assignedClasses.join(', ')}
              </span>
            </p>
          </div>
          <Link
            href="/teacher/dashboard/create-quiz"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Create Quiz
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-4">
              <BarChart3 size={32} className="text-indigo-600" />
            </div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Class Performance Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {classStats.map((stats) => (
                <div
                  key={stats.classCode}
                  className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Class {stats.classCode}
                    </h3>
                    <Users size={24} className="text-indigo-600" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Students</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.studentCount}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-600 mb-1">Submissions</p>
                      <p className="text-lg font-bold text-gray-900">
                        {stats.totalAttempts}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-600 mb-1">
                        Average Score
                      </p>
                      <p className="text-lg font-bold text-indigo-600">
                        {stats.averagePercentage.toFixed(1)}%
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-600 mb-1">Pass Rate</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-green-600">
                          {stats.passRate.toFixed(0)}%
                        </p>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
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
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <p className="text-xs text-gray-600 mb-1">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allQuizzes.length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <p className="text-xs text-gray-600 mb-1">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allAttempts.filter((a) => a.hasSubmitted).length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                <p className="text-xs text-gray-600 mb-1">Active Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentTeacher.assignedClasses.length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                <p className="text-xs text-gray-600 mb-1">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classStats.length > 0
                    ? (
                        classStats.reduce(
                          (sum, s) =>
                            sum +
                            (s.totalAttempts / (s.studentCount * allQuizzes.length) || 0),
                          0
                        ) / classStats.length
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Recent Quizzes */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-600" />
                  Recent Quizzes
                </h3>
              </div>
              <div className="divide-y">
                {allQuizzes.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">
                    No quizzes created yet.{' '}
                    <Link
                      href="/teacher/dashboard/create-quiz"
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Create one now
                    </Link>
                  </div>
                ) : (
                  allQuizzes.slice(-5).map((quiz) => {
                    const quizAttempts = allAttempts.filter(
                      (a) => a.quizId === quiz.id
                    );
                    return (
                      <div
                        key={quiz.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {quiz.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {quiz.description}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {quizAttempts.length} submissions
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-3">
                          <span>📝 {quiz.questions.length} questions</span>
                          <span>⏱️ {quiz.config.durationMinutes} min</span>
                          <span>🎯 {quiz.totalPoints} points</span>
                          <span className="capitalize">
                            {quiz.language === 'ar' ? '🇸🇦 Arabic' : '🇬🇧 English'}
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
