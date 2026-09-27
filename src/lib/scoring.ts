/**
 * Scoring Engine for byThursday Quiz Platform
 * Handles score calculation with support for positive and negative marking
 */

import { StudentQuizAttempt, Quiz, QuizResult } from '../types/quiz';

/**
 * Calculate the score for a quiz attempt
 * Supports negative marking based on quiz configuration
 */
export function calculateScore(
  attempt: StudentQuizAttempt,
  quiz: Quiz
): { score: number; percentage: number; negativeMarksDeducted: number } {
  let totalScore = 0;
  let negativeMarksDeducted = 0;
  const questionsById = new Map(quiz.questions.map(q => [q.id, q]));

  attempt.answers.forEach(answer => {
    const question = questionsById.get(answer.questionId);
    if (!question) return;

    const selectedOption = question.options.find(
      opt => opt.id === answer.selectedOptionId
    );

    if (selectedOption?.isCorrect) {
      totalScore += question.points;
    } else if (quiz.config.negativeMarking && question.negativeMarks) {
      const deduction = question.negativeMarks;
      totalScore -= deduction;
      negativeMarksDeducted += deduction;
    }
  });

  // Ensure score doesn't go below 0
  totalScore = Math.max(0, totalScore);

  const percentage = (totalScore / quiz.totalPoints) * 100;

  return {
    score: totalScore,
    percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
    negativeMarksDeducted,
  };
}

/**
 * Get correct answers count for an attempt
 */
export function getCorrectAnswersCount(
  attempt: StudentQuizAttempt,
  quiz: Quiz
): number {
  const questionsById = new Map(quiz.questions.map(q => [q.id, q]));
  let correctCount = 0;

  attempt.answers.forEach(answer => {
    const question = questionsById.get(answer.questionId);
    if (!question) return;

    const selectedOption = question.options.find(
      opt => opt.id === answer.selectedOptionId
    );

    if (selectedOption?.isCorrect) {
      correctCount++;
    }
  });

  return correctCount;
}

/**
 * Generate complete quiz result from an attempt
 */
export function generateQuizResult(
  attempt: StudentQuizAttempt,
  quiz: Quiz,
  studentName: string
): QuizResult {
  const { score, percentage, negativeMarksDeducted } = calculateScore(
    attempt,
    quiz
  );
  const correctAnswers = getCorrectAnswersCount(attempt, quiz);
  const timeTakenSeconds = attempt.completedAt
    ? Math.floor(
        (attempt.completedAt.getTime() - attempt.startedAt.getTime()) / 1000
      )
    : 0;

  return {
    attemptId: attempt.id,
    studentId: attempt.studentId,
    studentName,
    quizId: quiz.id,
    quizTitle: quiz.title,
    score,
    percentage,
    totalPoints: quiz.totalPoints,
    correctAnswers,
    totalQuestions: quiz.questions.length,
    completedAt: attempt.completedAt || new Date(),
    timeTakenSeconds,
    negativeMarksDeducted,
  };
}

/**
 * Validate if an answer is correct
 */
export function isAnswerCorrect(
  questionId: string,
  selectedOptionId: string,
  quiz: Quiz
): boolean {
  const question = quiz.questions.find(q => q.id === questionId);
  if (!question) return false;

  const selectedOption = question.options.find(
    opt => opt.id === selectedOptionId
  );
  return selectedOption?.isCorrect ?? false;
}

/**
 * Calculate analytics for a quiz based on multiple attempts
 */
export function calculateQuizAnalytics(attempts: StudentQuizAttempt[], quiz: Quiz) {
  const questionsById = new Map(quiz.questions.map(q => [q.id, q]));
  const scores = attempts
    .filter(a => a.hasSubmitted && a.completedAt)
    .map(a => {
      const { score, percentage } = calculateScore(a, quiz);
      return { score, percentage };
    });

  const questionStats = new Map<
    string,
    { correct: number; incorrect: number; totalTime: number; count: number }
  >();

  attempts.forEach(attempt => {
    attempt.answers.forEach(answer => {
      const question = questionsById.get(answer.questionId);
      if (!question) return;

      if (!questionStats.has(answer.questionId)) {
        questionStats.set(answer.questionId, {
          correct: 0,
          incorrect: 0,
          totalTime: 0,
          count: 0,
        });
      }

      const stats = questionStats.get(answer.questionId)!;
      const selectedOption = question.options.find(
        opt => opt.id === answer.selectedOptionId
      );

      if (selectedOption?.isCorrect) {
        stats.correct++;
      } else {
        stats.incorrect++;
      }

      stats.totalTime += answer.timeSpentSeconds;
      stats.count++;
    });
  });

  return {
    totalAttempts: attempts.length,
    totalSubmissions: scores.length,
    averageScore: scores.length ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length : 0,
    averagePercentage: scores.length ? scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length : 0,
    highestScore: scores.length ? Math.max(...scores.map(s => s.score)) : 0,
    lowestScore: scores.length ? Math.min(...scores.map(s => s.score)) : 0,
    completionRate: attempts.length ? (scores.length / attempts.length) * 100 : 0,
    questionAnalysis: Array.from(questionStats.entries()).map(
      ([questionId, stats]) => ({
        questionId,
        correctCount: stats.correct,
        incorrectCount: stats.incorrect,
        averageTimeSeconds: stats.count ? Math.round(stats.totalTime / stats.count) : 0,
      })
    ),
  };
}
