/**
 * Quiz Listing Page - Shows available quizzes for the student
 */

'use client';

import { useEffect, useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { mockData } from '@/data/mockData';
import { mockData as allMockData } from '@/data/mockData';
import { isQuizAvailable, getQuizTimeRemaining } from '@/lib/utils';
import { Clock, BookOpen, LogOut, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function QuizzesPage() {
  const { currentStudent, logout } = useStudent();
  const [quizzes, setQuizzes] = useState<typeof allMockData.quizzes>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentStudent) {
      window.location.href = '/';
      return;
    }

    // Filter quizzes for student's class
    const availableQuizzes = mockData.quizzes.filter(
      (quiz) => quiz.classCode === currentStudent.classCode
    );
    setQuizzes(availableQuizzes);
    setLoading(false);
  }, [currentStudent]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!currentStudent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={28} className="text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">byThursday</h1>
              <p className="text-xs text-gray-500">Class {currentStudent.classCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{currentStudent.name}</p>
              <p className="text-xs text-gray-500">{currentStudent.id}</p>
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
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Student Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 sm:hidden">
          <p className="font-medium text-gray-900">{currentStudent.name}</p>
          <p className="text-sm text-gray-500">{currentStudent.id}</p>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Quizzes
          </h2>
          <p className="text-gray-600">
            {quizzes.length === 0
              ? 'No quizzes available for your class at the moment.'
              : `You have ${quizzes.length} quiz${quizzes.length !== 1 ? 'zes' : ''} available.`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <BookOpen size={32} className="text-indigo-600" />
            </div>
            <p className="mt-4 text-gray-600">Loading quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">No quizzes available</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back later for new quizzes.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {quizzes.map((quiz) => {
              const isAvailable = isQuizAvailable(quiz);
              const timeRemaining = getQuizTimeRemaining(quiz.openDate, quiz.closeDate);

              return (
                <div
                  key={quiz.id}
                  className={`rounded-lg border-2 transition-all ${
                    isAvailable
                      ? 'border-indigo-200 bg-white hover:shadow-lg hover:border-indigo-400'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    {/* Quiz Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-gray-600">{quiz.description}</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {isAvailable ? 'Available' : 'Closed'}
                      </div>
                    </div>

                    {/* Quiz Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 py-3 border-y border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Questions</p>
                        <p className="text-lg font-bold text-gray-900">
                          {quiz.questions.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="text-lg font-bold text-gray-900">
                          {quiz.config.durationMinutes} min
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total Points</p>
                        <p className="text-lg font-bold text-gray-900">
                          {quiz.totalPoints}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Language</p>
                        <p className="text-lg font-bold text-gray-900">
                          {quiz.language === 'ar' ? 'العربية' : 'English'}
                        </p>
                      </div>
                    </div>

                    {/* Dates & Time Remaining */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>
                          Opens:{' '}
                          <span className="font-medium">
                            {quiz.openDate.toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>
                          Closes:{' '}
                          <span className="font-medium">
                            {quiz.closeDate.toLocaleDateString()}
                          </span>
                          {isAvailable && timeRemaining > 0 && (
                            <span className="ml-2 text-orange-600 font-medium">
                              ({timeRemaining} days left)
                            </span>
                          )}
                        </span>
                      </div>
                      {quiz.config.negativeMarking && (
                        <div className="text-amber-700 bg-amber-50 px-3 py-2 rounded-lg text-xs">
                          ⚠️ Negative marking: -{quiz.config.negativeMarksPerQuestion} points per wrong answer
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {isAvailable ? (
                      <Link
                        href={`/quizzes/${quiz.id}`}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        Start Quiz
                        <ArrowRight size={18} />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                      >
                        Quiz Not Available
                      </button>
                    )}
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
