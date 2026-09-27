/**
 * Quiz Taking Interface - Main quiz experience with timer, questions, and RTL support
 */

'use client';

import { useEffect, useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { mockData } from '@/data/mockData';
import { QuizTimer } from '@/components/QuizTimer';
import { generateAttemptId, hasStudentSubmitted, getTextDirection } from '@/lib/utils';
import { calculateScore } from '@/lib/scoring';
import { StudentQuizAttempt, Quiz } from '@/types/quiz';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: PageProps) {
  const { currentStudent } = useStudent();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeExpired, setTimeExpired] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Load quiz
  useEffect(() => {
    if (!resolvedParams || !currentStudent) return;

    const foundQuiz = mockData.quizzes.find((q) => q.id === resolvedParams.id);
    if (!foundQuiz) {
      window.location.href = '/quizzes';
      return;
    }

    // Check if already submitted
    if (hasStudentSubmitted(currentStudent.id, foundQuiz.id, [])) {
      window.location.href = `/results/${currentStudent.id}_${foundQuiz.id}`;
      return;
    }

    setQuiz(foundQuiz);
    setLoading(false);
  }, [resolvedParams, currentStudent]);

  if (!currentStudent || !resolvedParams || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const textDir = getTextDirection(quiz.language);
  const isArabic = quiz.language === 'ar';

  const handleAnswerSelect = (optionId: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId,
    });
  };

  const handleTimeExpired = () => {
    setTimeExpired(true);
    handleSubmit();
  };

  const handleSubmit = async () => {
    const attempt: StudentQuizAttempt = {
      id: generateAttemptId(),
      studentId: currentStudent.id,
      quizId: quiz.id,
      startedAt: new Date(),
      completedAt: new Date(),
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || '',
        timeSpentSeconds: 0,
      })),
      hasSubmitted: true,
    };

    const { score, percentage, negativeMarksDeducted } = calculateScore(attempt, quiz);
    attempt.score = score;
    attempt.percentage = percentage;

    // Save attempt and redirect to results
    sessionStorage.setItem(`attempt_${attempt.id}`, JSON.stringify(attempt));
    window.location.href = `/results/${attempt.id}`;
  };

  const canGoNext = currentQuestionIndex < quiz.questions.length - 1;
  const canGoPrev = currentQuestionIndex > 0;
  const allAnswered = quiz.questions.every((q) => answers[q.id]);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50"
      dir={textDir}
    >
      {/* Header with Timer */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-indigo-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/quizzes"
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
            >
              {isArabic ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              {isArabic ? 'العودة' : 'Back'}
            </Link>
            <div className="flex-1 text-center">
              <h1 className="font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            <QuizTimer
              durationMinutes={quiz.config.durationMinutes}
              onTimeExpired={handleTimeExpired}
              language={quiz.language}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Question Progress Bar */}
          <div className="h-2 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Question Content */}
          <div className="p-6 sm:p-8">
            {/* Question Text */}
            <div className={`mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {currentQuestion.text}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  {currentQuestion.points} points
                </span>
                {currentQuestion.negativeMarks && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                    -{currentQuestion.negativeMarks} wrong
                  </span>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left sm:text-base text-sm ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                  dir={textDir}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        answers[currentQuestion.id] === option.id
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[currentQuestion.id] === option.id && (
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </span>
                    <span className="font-medium text-gray-900">{option.text}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={!canGoPrev}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  canGoPrev
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isArabic ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                {isArabic ? 'السابق' : 'Previous'}
              </button>

              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    allAnswered
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} />
                  {isArabic ? 'إرسال' : 'Submit'}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))
                  }
                  disabled={!canGoNext}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    canGoNext
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isArabic ? 'التالي' : 'Next'}
                  {isArabic ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Indicator - Mobile */}
        <div className="mt-6 md:hidden">
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {quiz.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                    idx === currentQuestionIndex
                      ? 'bg-indigo-600 text-white'
                      : answers[quiz.questions[idx].id]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
