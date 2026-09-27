/**
 * Quiz and Question types for byThursday Quiz Platform
 * Supports 15-question quizzes with configurable timing, scoring, and negative marking
 */

import { ClassCode } from './user';

export type Language = 'ar' | 'en';
export type QuestionType = 'multiple_choice';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  language: Language;
  type: QuestionType;
  options: QuizOption[];
  correctOptionId: string;
  points: number; // Positive points for correct answer
  negativeMarks?: number; // Points deducted for wrong answer (optional)
}

export interface QuizConfig {
  durationMinutes: number;
  negativeMarking: boolean;
  negativeMarksPerQuestion: number;
  singleSubmission: boolean; // Only one attempt allowed
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  language: Language;
  classCode: ClassCode;
  questions: Question[];
  config: QuizConfig;
  createdBy: string; // Teacher ID
  createdAt: Date;
  openDate: Date; // When quiz becomes available
  closeDate: Date; // When quiz closes
  totalPoints: number;
  isActive: boolean;
}

export interface StudentQuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: {
    questionId: string;
    selectedOptionId: string;
    timeSpentSeconds: number;
  }[];
  score?: number;
  percentage?: number;
  hasSubmitted: boolean;
}

export interface QuizResult {
  attemptId: string;
  studentId: string;
  studentName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  percentage: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: Date;
  timeTakenSeconds: number;
  negativeMarksDeducted: number;
}

export interface QuizAnalytics {
  quizId: string;
  totalAttempts: number;
  averageScore: number;
  averagePercentage: number;
  highestScore: number;
  lowestScore: number;
  totalSubmissions: number;
  completionRate: number;
  questionAnalysis: {
    questionId: string;
    correctCount: number;
    incorrectCount: number;
    averageTimeSeconds: number;
  }[];
}
