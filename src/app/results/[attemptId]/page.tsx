/**
 * Quiz Results Page - Shows score breakdown, correct/wrong answers, and negative penalties
 */

'use client';

import { useEffect, useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { mockData } from '@/data/mockData';
import { StudentQuizAttempt, Quiz } from '@/types/quiz';
import { calculateScore, getCorrectAnswersCount } from '@/lib/scoring';
import { getTextDirection } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  BarChart3,
  Trophy,
  AlertCircle,
  Home,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export default function ResultsPage({ params }: PageProps) {
  const { currentStudent } = useStudent();
  const [resolvedParams, setResolvedParams] = useState<{ attemptId: string } | null>(null);
  const [attempt, setAttempt] = useState<StudentQuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Load attempt and quiz data
  useEffect(() => {
    if (!resolvedParams) return;

    const attemptData = sessionStorage.getItem(`attempt_${resolvedParams.attemptId}`);
    if (!attemptData) {
      window.location.href = '/quizzes';
      return;
    }

    const parsedAttempt: StudentQuizAttempt = JSON.parse(attemptData);
    setAttempt(parsedAttempt);

    const foundQuiz = mockData.quizzes.find((q) => q.id === parsedAttempt.quizId);
    if (foundQuiz) {
      setQuiz(foundQuiz);
    }

    setLoading(false);
  }, [resolvedParams]);

  if (loading || !attempt || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const { score, percentage, negativeMarksDeducted } = calculateScore(attempt, quiz);
  const correctAnswers = getCorrectAnswersCount(attempt, quiz);
  const wrongAnswers = quiz.questions.length - correctAnswers;
  const textDir = getTextDirection(quiz.language);
  const isArabic = quiz.language === 'ar';

  // Determine performance level
  let performanceLevel: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
  if (percentage >= 90) performanceLevel = 'excellent';
  else if (percentage >= 75) performanceLevel = 'good';
  else if (percentage >= 60) performanceLevel = 'fair';

  const performanceColors = {
    excellent: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    good: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    fair: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    poor: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };

  const colors = performanceColors[performanceLevel];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-6 px-4"
      dir={textDir}
    >
      <div className="max-w-2xl mx-auto">
        {/* Results Card */}
        <div
          className={`${colors.bg} border-2 ${colors.border} rounded-2xl overflow-hidden shadow-xl mb-6`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-white text-center">
            <Trophy size={48} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">
              {isArabic ? 'تم إرسال الاختبار' : 'Quiz Submitted'}
            </h1>
            <p className="text-indigo-100">
              {isArabic ? 'تم حفظ إجاباتك بنجاح' : 'Your answers have been saved successfully'}
            </p>
          </div>

          {/* Main Score Display */}
          <div className="px-6 py-8 text-center">
            <div className="text-6xl font-bold text-indigo-600 mb-2">{score}</div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {isArabic ? 'من' : 'out of'} {quiz.totalPoints}
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {percentage.toFixed(1)}%
            </div>

            {/* Performance Message */}
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-gray-200">
              <p className={`text-lg font-semibold ${colors.text}`}>
                {isArabic
                  ? performanceLevel === 'excellent'
                    ? '🎉 أداء ممتاز جداً!'
                    : performanceLevel === 'good'
                    ? '👏 أداء جيد جداً!'
                    : performanceLevel === 'fair'
                    ? '📚 أداء مقبول'
                    : '⚠️ اجتهد أكثر'
                  : performanceLevel === 'excellent'
                  ? '🎉 Excellent performance!'
                  : performanceLevel === 'good'
                  ? '👏 Great job!'
                  : performanceLevel === 'fair'
                  ? '📚 Fair performance'
                  : '⚠️ Keep practicing'}
              </p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Correct Answers */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle size={24} className="text-green-600" />
              <h3 className="font-bold text-gray-900 text-lg">
                {isArabic ? 'إجابات صحيحة' : 'Correct Answers'}
              </h3>
            </div>
            <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
            <p className="text-sm text-gray-600 mt-1">
              {isArabic ? `${correctAnswers} إجابات صحيحة من ${quiz.questions.length}` : `${correctAnswers} out of ${quiz.questions.length}`}
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(correctAnswers / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Wrong Answers */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-3">
              <XCircle size={24} className="text-red-600" />
              <h3 className="font-bold text-gray-900 text-lg">
                {isArabic ? 'إجابات خاطئة' : 'Wrong Answers'}
              </h3>
            </div>
            <div className="text-3xl font-bold text-red-600">{wrongAnswers}</div>
            <p className="text-sm text-gray-600 mt-1">
              {isArabic ? `${wrongAnswers} إجابات خاطئة من ${quiz.questions.length}` : `${wrongAnswers} out of ${quiz.questions.length}`}
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${(wrongAnswers / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Negative Marking (if applicable) */}
        {quiz.config.negativeMarking && negativeMarksDeducted > 0 && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {isArabic ? 'خصم العلامات' : 'Negative Marking'}
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

        {/* Detailed Statistics */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={24} className="text-indigo-600" />
            {isArabic ? 'الإحصائيات التفصيلية' : 'Detailed Statistics'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">
                {isArabic ? 'إجمالي الأسئلة' : 'Total Questions'}
              </p>
              <p className="text-2xl font-bold text-indigo-600">{quiz.questions.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">
                {isArabic ? 'النقاط الكاملة' : 'Total Points'}
              </p>
              <p className="text-2xl font-bold text-blue-600">{quiz.totalPoints}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">
                {isArabic ? 'المدة المسموحة' : 'Duration'}
              </p>
              <p className="text-2xl font-bold text-purple-600">{quiz.config.durationMinutes}m</p>
            </div>
            {quiz.config.negativeMarking && (
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">
                  {isArabic ? 'العلامة السالبة' : 'Negative Mark'}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  -{quiz.config.negativeMarksPerQuestion}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 sm:flex-row flex-col">
          <Link
            href="/quizzes"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            {isArabic ? 'العودة للاختبارات' : 'Back to Quizzes'}
          </Link>
        </div>

        {/* Quiz Info */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <h3 className="font-bold text-gray-900 mb-2">{quiz.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              {quiz.language === 'ar' ? 'العربية' : 'English'}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {quiz.subject}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Class {quiz.classCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
