/**
 * Student Results Table - Shows all submissions for a quiz
 */

'use client';

import { useEffect, useState } from 'react';
import { useTeacher } from '@/context/TeacherContext';
import { mockData } from '@/data/mockData';
import { StudentQuizAttempt, Quiz } from '@/types/quiz';
import { calculateScore } from '@/lib/scoring';
import { Download, Filter, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface ResultRow {
  studentId: string;
  studentName: string;
  score: number;
  percentage: number;
  status: 'pass' | 'fail' | 'pending';
  submittedAt: Date | null;
  timeTaken: number;
}

interface PageProps {
  params: Promise<{ quizId: string }>;
}

export default function QuizResultsPage({ params }: PageProps) {
  const { currentTeacher, allAttempts } = useTeacher();
  const [resolvedParams, setResolvedParams] = useState<{ quizId: string } | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [filteredResults, setFilteredResults] = useState<ResultRow[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pass' | 'fail' | 'pending'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'time'>('score');
  const [loading, setLoading] = useState(true);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Load quiz and calculate results
  useEffect(() => {
    if (!resolvedParams || !currentTeacher) return;

    const foundQuiz = mockData.quizzes.find((q) => q.id === resolvedParams.quizId);
    if (!foundQuiz) {
      window.location.href = '/teacher/dashboard';
      return;
    }

    setQuiz(foundQuiz);

    // Get all students in quiz's class
    const classStudents = mockData.students.filter(
      (s) => s.classCode === foundQuiz.classCode
    );

    // Build results table
    const resultsData: ResultRow[] = classStudents.map((student) => {
      const attempt = allAttempts.find(
        (a) => a.studentId === student.id && a.quizId === foundQuiz.id
      );

      if (!attempt || !attempt.hasSubmitted) {
        return {
          studentId: student.id,
          studentName: student.name,
          score: 0,
          percentage: 0,
          status: 'pending',
          submittedAt: null,
          timeTaken: 0,
        };
      }

      const { score, percentage } = calculateScore(attempt, foundQuiz);
      const passPercentage = 60; // 60% passing grade
      const status = percentage >= passPercentage ? 'pass' : 'fail';
      const timeTaken = attempt.completedAt
        ? Math.floor(
            (attempt.completedAt.getTime() - attempt.startedAt.getTime()) / 1000
          )
        : 0;

      return {
        studentId: student.id,
        studentName: student.name,
        score,
        percentage,
        status,
        submittedAt: attempt.completedAt || null,
        timeTaken,
      };
    });

    setResults(resultsData);
    setLoading(false);
  }, [resolvedParams, currentTeacher, allAttempts]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = results;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    // Sort
    if (sortBy === 'score') {
      filtered.sort((a, b) => b.percentage - a.percentage);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.studentName.localeCompare(b.studentName));
    } else if (sortBy === 'time') {
      filtered.sort((a, b) => b.timeTaken - a.timeTaken);
    }

    setFilteredResults(filtered);
  }, [results, filterStatus, sortBy]);

  if (!currentTeacher || !quiz || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const passCount = results.filter((r) => r.status === 'pass').length;
  const failCount = results.filter((r) => r.status === 'fail').length;
  const pendingCount = results.filter((r) => r.status === 'pending').length;
  const avgScore =
    results.filter((r) => r.status !== 'pending').length > 0
      ? results
          .filter((r) => r.status !== 'pending')
          .reduce((sum, r) => sum + r.percentage, 0) /
        results.filter((r) => r.status !== 'pending').length
      : 0;

  const formatTime = (seconds: number) => {
    if (seconds === 0) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/teacher/dashboard"
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 text-sm mt-1">Class {quiz.classCode}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-xs text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{results.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-xs text-gray-600 mb-1">Passed</p>
            <p className="text-2xl font-bold text-green-600">{passCount}</p>
            <p className="text-xs text-gray-600 mt-1">
              {results.length > 0 ? ((passCount / results.length) * 100).toFixed(0) : 0}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <p className="text-xs text-gray-600 mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-600">{failCount}</p>
            <p className="text-xs text-gray-600 mt-1">
              {results.length > 0 ? ((failCount / results.length) * 100).toFixed(0) : 0}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-xs text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <p className="text-xs text-gray-600 mb-1">Average Score</p>
            <p className="text-2xl font-bold text-purple-600">{avgScore.toFixed(1)}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="flex gap-2">
            {['all', 'pass', 'fail', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilterStatus(status as 'all' | 'pass' | 'fail' | 'pending')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'name' | 'time')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="score">Score (Highest)</option>
              <option value="name">Name (A-Z)</option>
              <option value="time">Time Taken</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Score
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      No results match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result) => (
                    <tr key={result.studentId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {result.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {result.studentId}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-indigo-600">
                        {result.status === 'pending' ? '—' : `${result.score}/${quiz.totalPoints}`}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            result.status === 'pass'
                              ? 'bg-green-100 text-green-800'
                              : result.status === 'fail'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {result.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            result.status === 'pass'
                              ? 'bg-green-100 text-green-800'
                              : result.status === 'fail'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {formatTime(result.timeTaken)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {result.submittedAt
                          ? new Date(result.submittedAt).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-900">
            <span className="font-semibold">Total Submissions:</span> {results.filter((r) => r.status !== 'pending').length} of {results.length} students
            ({((results.filter((r) => r.status !== 'pending').length / results.length) * 100).toFixed(0)}%)
          </p>
        </div>
      </main>
    </div>
  );
}
