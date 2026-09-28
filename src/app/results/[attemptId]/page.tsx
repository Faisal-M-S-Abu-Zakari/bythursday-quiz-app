/**
 * Quiz Results Page - Shows score breakdown, correct/wrong answers, and negative penalties
 */

"use client";

import { useEffect, useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { mockData } from "@/data/mockData";
import { StudentQuizAttempt, Quiz } from "@/types/quiz";
import { calculateScore, getCorrectAnswersCount } from "@/lib/scoring";
import { getTextDirection } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  BarChart3,
  Trophy,
  AlertCircle,
  Home,
  Repeat,
} from "lucide-react";
import Link from "next/link";
import { LMSHeader } from "@/components/LMSHeader";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export default function ResultsPage({ params }: PageProps) {
  const { currentStudent } = useStudent();
  const [resolvedParams, setResolvedParams] = useState<{
    attemptId: string;
  } | null>(null);
  const [attempt, setAttempt] = useState<StudentQuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [totalAttemptsCount, setTotalAttemptsCount] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Load attempt and quiz data
  useEffect(() => {
    if (!resolvedParams) return;

    const attemptData = sessionStorage.getItem(
      `attempt_${resolvedParams.attemptId}`,
    );
    if (!attemptData) {
      window.location.href = "/quizzes";
      return;
    }

    const parsedAttempt: StudentQuizAttempt = JSON.parse(attemptData);
    setAttempt(parsedAttempt);

    let count = 0;
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);
      if (!key?.startsWith("attempt_")) continue;
      try {
        const item = JSON.parse(sessionStorage.getItem(key) ?? "null");
        if (item?.studentId === parsedAttempt.studentId && item?.quizId === parsedAttempt.quizId && item?.hasSubmitted) {
          count++;
        }
      } catch { /* ignore */ }
    }
    setTotalAttemptsCount(Math.max(count, 1));

    const foundQuiz = mockData.quizzes.find(
      (q) => q.id === parsedAttempt.quizId,
    );
    if (foundQuiz) {
      setQuiz(foundQuiz);
    }

    setLoading(false);
  }, [resolvedParams]);

  if (loading || !attempt || !quiz) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="inline-block mb-4 animate-spin">
            <div className="border-4 border-indigo-600 border-t-transparent rounded-full w-8 h-8"></div>
          </div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const { score, percentage, negativeMarksDeducted } = calculateScore(
    attempt,
    quiz,
  );
  const correctAnswers = getCorrectAnswersCount(attempt, quiz);
  const correctPoints = quiz.questions.reduce((total, question) => {
    const answer = attempt.answers.find(
      (item) => item.questionId === question.id,
    );
    return answer?.selectedOptionId === question.correctOptionId
      ? total + question.points
      : total;
  }, 0);
  const wrongAnswers = quiz.questions.length - correctAnswers;
  const textDir = getTextDirection(quiz.language);
  const isArabic = quiz.language === "ar";

  // Determine performance level
  let performanceLevel: "excellent" | "good" | "fair" | "poor" = "poor";
  if (percentage >= 90) performanceLevel = "excellent";
  else if (percentage >= 75) performanceLevel = "good";
  else if (percentage >= 60) performanceLevel = "fair";

  const performanceColors = {
    excellent: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
    },
    good: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
    },
    fair: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
    },
    poor: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  };

  const colors = performanceColors[performanceLevel];

  return (
    <div
      className="bg-gradient-to-b from-blue-50 to-indigo-50 px-4 py-6 min-h-screen"
      dir={textDir}
    >
      <div className="-mx-4 -mt-6 mb-6">
        <LMSHeader
          role="student"
          name={currentStudent?.name}
          detail="Quiz results"
        />
      </div>
      <div className="mx-auto max-w-2xl">
        {/* Results Card */}
        <div
          className={`${colors.bg} border-2 ${colors.border} rounded-2xl overflow-hidden shadow-xl mb-6`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-white text-center">
            <Trophy size={48} className="mx-auto mb-3" />
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
              <span>Attempt #{attempt.attemptNumber ?? totalAttemptsCount} of {quiz.config.maxAttempts ?? 1}</span>
            </div>
            <h1 className="mb-2 font-bold text-3xl">
              {isArabic ? "تم إرسال الاختبار" : "Quiz Submitted"}
            </h1>
            <p className="text-indigo-100">
              {isArabic
                ? "تم حفظ إجاباتك بنجاح"
                : "Your answers have been saved successfully"}
            </p>
          </div>

          {/* Main Score Display */}
          <div className="px-6 py-8">
            <div className="flex sm:flex-row flex-col justify-center items-center gap-7">
              <div
                className="score-ring"
                style={{
                  background: `conic-gradient(#4f46e5 ${Math.min(Math.max(percentage, 0), 100)}%, #e2e8f0 0)`,
                }}
                role="img"
                aria-label={`${percentage.toFixed(1)} percent`}
              >
                <div className="score-ring__inner">
                  <span className="font-bold text-slate-900 text-3xl tracking-tight">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="mt-1 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Final score
                  </span>
                </div>
              </div>
              <div className="sm:text-left text-center">
                <p className="font-semibold text-indigo-600 text-sm uppercase tracking-wider">
                  Assessment complete
                </p>
                <p className="mt-2 font-bold text-slate-900 text-5xl tracking-tight">
                  {score}
                  <span className="font-semibold text-slate-400 text-2xl">
                    {" "}
                    / {quiz.totalPoints}
                  </span>
                </p>
                <p className="mt-2 text-slate-500 text-sm">
                  {isArabic ? "من" : "points earned"}
                </p>
              </div>
            </div>

            {/* Performance Message */}
            <div className="bg-white mt-6 p-4 border-2 border-gray-200 rounded-lg">
              <p className={`text-lg font-semibold ${colors.text}`}>
                {isArabic
                  ? performanceLevel === "excellent"
                    ? "🎉 أداء ممتاز جداً!"
                    : performanceLevel === "good"
                      ? "👏 أداء جيد جداً!"
                      : performanceLevel === "fair"
                        ? "📚 أداء مقبول"
                        : "⚠️ اجتهد أكثر"
                  : performanceLevel === "excellent"
                    ? "🎉 Excellent performance!"
                    : performanceLevel === "good"
                      ? "👏 Great job!"
                      : performanceLevel === "fair"
                        ? "📚 Fair performance"
                        : "⚠️ Keep practicing"}
              </p>
            </div>
          </div>
        </div>

        <div className="gap-3 grid sm:grid-cols-3 mb-6">
          <div className="bg-emerald-50/70 p-4 border border-emerald-100 rounded-2xl">
            <p className="font-semibold text-emerald-700 text-xs uppercase tracking-wider">
              Correct
            </p>
            <p className="mt-2 font-bold text-emerald-800 text-xl">
              {correctAnswers} correct{" "}
              <span className="font-semibold text-sm">
                (+{correctPoints} pts)
              </span>
            </p>
          </div>
          <div className="bg-rose-50/70 p-4 border border-rose-100 rounded-2xl">
            <p className="font-semibold text-rose-700 text-xs uppercase tracking-wider">
              Incorrect
            </p>
            <p className="mt-2 font-bold text-rose-800 text-xl">
              {wrongAnswers}{" "}
              <span className="font-semibold text-sm">
                (-{negativeMarksDeducted})
              </span>
            </p>
          </div>
          <div className="bg-indigo-50/70 p-4 border border-indigo-100 rounded-2xl">
            <p className="font-semibold text-indigo-700 text-xs uppercase tracking-wider">
              Total score
            </p>
            <p className="mt-2 font-bold text-indigo-800 text-xl">
              {score} / {quiz.totalPoints}
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="gap-4 grid md:grid-cols-2 mb-6">
          {/* Correct Answers */}
          <div className="bg-white shadow-md p-6 border-green-500 border-l-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle size={24} className="text-green-600" />
              <h3 className="font-bold text-gray-900 text-lg">
                {isArabic ? "إجابات صحيحة" : "Correct Answers"}
              </h3>
            </div>
            <div className="font-bold text-green-600 text-3xl">
              {correctAnswers}
            </div>
            <p className="mt-1 text-gray-600 text-sm">
              {isArabic
                ? `${correctAnswers} إجابات صحيحة من ${quiz.questions.length}`
                : `${correctAnswers} out of ${quiz.questions.length}`}
            </p>
            <div className="bg-gray-200 mt-3 rounded-full w-full h-2">
              <div
                className="bg-green-500 rounded-full h-2 transition-all"
                style={{
                  width: `${(correctAnswers / quiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Wrong Answers */}
          <div className="bg-white shadow-md p-6 border-red-500 border-l-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <XCircle size={24} className="text-red-600" />
              <h3 className="font-bold text-gray-900 text-lg">
                {isArabic ? "إجابات خاطئة" : "Wrong Answers"}
              </h3>
            </div>
            <div className="font-bold text-red-600 text-3xl">
              {wrongAnswers}
            </div>
            <p className="mt-1 text-gray-600 text-sm">
              {isArabic
                ? `${wrongAnswers} إجابات خاطئة من ${quiz.questions.length}`
                : `${wrongAnswers} out of ${quiz.questions.length}`}
            </p>
            <div className="bg-gray-200 mt-3 rounded-full w-full h-2">
              <div
                className="bg-red-500 rounded-full h-2 transition-all"
                style={{
                  width: `${(wrongAnswers / quiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Negative Marking (if applicable) */}
        {quiz.config.negativeMarking && negativeMarksDeducted > 0 && (
          <div className="bg-orange-50 mb-6 p-6 border-2 border-orange-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={24}
                className="flex-shrink-0 mt-1 text-orange-600"
              />
              <div>
                <h3 className="mb-1 font-bold text-gray-900">
                  {isArabic ? "خصم العلامات" : "Negative Marking"}
                </h3>
                <p className="text-gray-700">
                  {isArabic
                    ? `تم خصم ${negativeMarksDeducted} نقاط عن الإجابات الخاطئة`
                    : `${negativeMarksDeducted} points deducted for wrong answers`}
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="mb-6 overflow-hidden lms-card">
          <div className="px-6 py-5 border-slate-100 border-b">
            <h3 className="font-bold text-slate-900 text-lg">Answer review</h3>
            <p className="mt-1 text-slate-500 text-sm">
              Compare your response with the correct answer.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {quiz.questions.map((question, index) => {
              const answer = attempt.answers.find(
                (item) => item.questionId === question.id,
              );
              const selectedOption = question.options.find(
                (option) => option.id === answer?.selectedOptionId,
              );
              const correctOption = question.options.find(
                (option) => option.id === question.correctOptionId,
              );
              const isCorrect = selectedOption?.id === question.correctOptionId;
              return (
                <article key={question.id} className="p-5 sm:p-6">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h4 className="font-semibold text-slate-900 leading-relaxed">
                      {index + 1}. {question.text}
                    </h4>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                    >
                      {isCorrect ? "Correct" : "Review"}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">
                    <span className="font-semibold text-slate-700">
                      Your answer:{" "}
                    </span>
                    {selectedOption?.text ?? "Not answered"}
                  </p>
                  {!isCorrect && (
                    <p className="mt-2 text-emerald-700 text-sm">
                      <span className="font-semibold">Correct answer: </span>
                      {correctOption?.text ?? "—"}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Detailed Statistics */}
        <div className="bg-white shadow-md mb-6 p-6 rounded-xl">
          <h3 className="flex items-center gap-2 mb-4 font-bold text-gray-900 text-lg">
            <BarChart3 size={24} className="text-indigo-600" />
            {isArabic ? "الإحصائيات التفصيلية" : "Detailed Statistics"}
          </h3>
          <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="mb-1 text-gray-600 text-xs">
                {isArabic ? "إجمالي الأسئلة" : "Total Questions"}
              </p>
              <p className="font-bold text-indigo-600 text-2xl">
                {quiz.questions.length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="mb-1 text-gray-600 text-xs">
                {isArabic ? "النقاط الكاملة" : "Total Points"}
              </p>
              <p className="font-bold text-blue-600 text-2xl">
                {quiz.totalPoints}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="mb-1 text-gray-600 text-xs">
                {isArabic ? "المدة المسموحة" : "Duration"}
              </p>
              <p className="font-bold text-purple-600 text-2xl">
                {quiz.config.durationMinutes}m
              </p>
            </div>
            {quiz.config.negativeMarking && (
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="mb-1 text-gray-600 text-xs">
                  {isArabic ? "العلامة السالبة" : "Negative Mark"}
                </p>
                <p className="font-bold text-orange-600 text-2xl">
                  -{quiz.config.negativeMarksPerQuestion}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-row flex-col gap-4">
          <Link
            href="/quizzes"
            className="flex flex-1 justify-center items-center gap-2 bg-slate-800 hover:bg-slate-900 px-6 py-4 rounded-xl font-semibold text-white transition-colors"
          >
            <Home size={20} />
            {isArabic ? "العودة للاختبارات" : "Back to Quizzes"}
          </Link>
          {totalAttemptsCount < (quiz.config.maxAttempts ?? 1) && (
            <Link
              href={`/quizzes/${quiz.id}`}
              className="flex flex-1 justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-4 rounded-xl font-semibold text-white shadow-md transition-colors"
            >
              <Repeat size={20} />
              {isArabic
                ? `إعادة المحاولة (${(quiz.config.maxAttempts ?? 1) - totalAttemptsCount} متبقية)`
                : `Retake Assessment (${(quiz.config.maxAttempts ?? 1) - totalAttemptsCount} remaining)`}
            </Link>
          )}
        </div>

        {/* Quiz Info */}
        <div className="bg-white shadow-md mt-8 p-6 border-indigo-500 border-l-4 rounded-xl">
          <h3 className="mb-2 font-bold text-gray-900">{quiz.title}</h3>
          <p className="mb-3 text-gray-600 text-sm">{quiz.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-indigo-100 px-3 py-1 rounded-full font-medium text-indigo-700 text-xs">
              {quiz.language === "ar" ? "العربية" : "English"}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700 text-xs">
              {quiz.subject}
            </span>
            <span className="bg-blue-100 px-3 py-1 rounded-full font-medium text-blue-700 text-xs">
              Class {quiz.classCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
