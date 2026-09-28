/**
 * Quiz Listing Page - Shows available quizzes for the student
 */

"use client";

import { useEffect, useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { mockData } from "@/data/mockData";
import { mockData as allMockData } from "@/data/mockData";
import { isQuizAvailable, getQuizTimeRemaining } from "@/lib/utils";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LMSHeader } from "@/components/LMSHeader";

export default function QuizzesPage() {
  const { currentStudent, isStudentReady, logout } = useStudent();
  const [quizzes, setQuizzes] = useState<typeof allMockData.quizzes>([]);
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <LMSHeader
        role="student"
        name={currentStudent.name}
        detail={`Student · Class ${currentStudent.classCode}`}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* Student Info Card */}
        <div className="sm:hidden bg-white mb-6 p-4 border border-gray-200 rounded-lg">
          <p className="font-medium text-gray-900">{currentStudent.name}</p>
          <p className="text-gray-500 text-sm">{currentStudent.id}</p>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <p className="mb-2 font-bold text-indigo-600 text-xs uppercase tracking-[0.18em]">
            Your learning space
          </p>
          <h2 className="mb-2 font-bold text-slate-900 text-3xl tracking-tight">
            Available quizzes
          </h2>
          <p className="text-gray-600">
            {quizzes.length === 0
              ? "No quizzes available for your class at the moment."
              : `You have ${quizzes.length} quiz${quizzes.length !== 1 ? "zes" : ""} available.`}
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin">
              <BookOpen size={32} className="text-indigo-600" />
            </div>
            <p className="mt-4 text-gray-600">Loading quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white p-12 border-2 border-gray-300 border-dashed rounded-lg text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="font-medium text-gray-600">No quizzes available</p>
            <p className="mt-2 text-gray-500 text-sm">
              Check back later for new quizzes.
            </p>
          </div>
        ) : (
          <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-1">
            {quizzes.map((quiz) => {
              const isAvailable = isQuizAvailable(quiz);
              const timeRemaining = getQuizTimeRemaining(
                quiz.openDate,
                quiz.closeDate,
              );

              return (
                <div
                  key={quiz.id}
                  className={`rounded-lg border-2 transition-all ${
                    isAvailable
                      ? "border-indigo-200 bg-white hover:shadow-lg hover:border-indigo-400"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    {/* Quiz Header */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="mb-1 font-bold text-gray-900 text-lg">
                          {quiz.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {quiz.description}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {isAvailable ? "Available" : "Closed"}
                      </div>
                    </div>

                    {/* Quiz Details Grid */}
                    <div className="gap-3 grid grid-cols-2 sm:grid-cols-4 mb-4 py-3 border-gray-200 border-y">
                      <div>
                        <p className="mb-1 text-gray-500 text-xs">Questions</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {quiz.questions.length}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-500 text-xs">Duration</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {quiz.config.durationMinutes} min
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-500 text-xs">
                          Total Points
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          {quiz.totalPoints}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-500 text-xs">Language</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {quiz.language === "ar" ? "العربية" : "English"}
                        </p>
                      </div>
                    </div>

                    {/* Dates & Time Remaining */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>
                          Opens:{" "}
                          <span className="font-medium">
                            {quiz.openDate.toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>
                          Closes:{" "}
                          <span className="font-medium">
                            {quiz.closeDate.toLocaleDateString()}
                          </span>
                          {isAvailable && timeRemaining > 0 && (
                            <span className="ml-2 font-medium text-orange-600">
                              ({timeRemaining} days left)
                            </span>
                          )}
                        </span>
                      </div>
                      {quiz.config.negativeMarking && (
                        <div className="bg-amber-50 px-3 py-2 rounded-lg text-amber-700 text-xs">
                          ⚠️ Negative marking: -
                          {quiz.config.negativeMarksPerQuestion} points per
                          wrong answer
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {isAvailable ? (
                      <Link
                        href={`/quizzes/${quiz.id}`}
                        className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg w-full font-semibold text-white transition-colors"
                      >
                        Start Quiz
                        <ArrowRight size={18} />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 px-4 py-3 rounded-lg w-full font-semibold text-gray-600 cursor-not-allowed"
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
