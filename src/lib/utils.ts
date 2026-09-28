/**
 * Utility functions for the quiz platform
 */

import { StudentQuizAttempt, Quiz } from "@/types/quiz";
import { Student } from "@/types/user";

/**
 * Get student by ID from mock data
 */
export function getStudentById(studentId: string): Student | undefined {
  // This will be replaced with API call in Phase 3
  const { mockStudents } = require("@/data/mockData");
  return mockStudents.find((s: Student) => s.id === studentId);
}

/**
 * Check if a quiz is currently available (between open and close dates)
 */
export function isQuizAvailable(quiz: Quiz): boolean {
  const now = new Date();
  return now >= quiz.openDate && now <= quiz.closeDate && quiz.isActive;
}

/**
 * Get time remaining for a quiz in minutes
 */
export function getQuizTimeRemaining(openDate: Date, closeDate: Date): number {
  const now = new Date();
  if (now < openDate || now > closeDate) return 0;
  return Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60));
}

/**
 * Format remaining time as MM:SS
 */
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Check if student has already submitted this quiz
 */
export function hasStudentSubmitted(
  studentId: string,
  quizId: string,
  attempts: StudentQuizAttempt[],
): boolean {
  return attempts.some(
    (a) => a.studentId === studentId && a.quizId === quizId && a.hasSubmitted,
  );
}

/**
 * Get student's attempt for a quiz
 */
export function getStudentQuizAttempt(
  studentId: string,
  quizId: string,
  attempts: StudentQuizAttempt[],
): StudentQuizAttempt | undefined {
  return attempts.find((a) => a.studentId === studentId && a.quizId === quizId);
}

/**
 * Determine text direction based on language
 */
export function getTextDirection(language: "ar" | "en"): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr";
}

/**
 * Get CSS classes for RTL support
 */
export function getRTLClasses(language: "ar" | "en"): {
  textAlign: string;
  marginLeft?: string;
  marginRight?: string;
  paddingLeft?: string;
  paddingRight?: string;
} {
  if (language === "ar") {
    return {
      textAlign: "text-right",
      marginRight: "mr-4",
      marginLeft: undefined,
      paddingRight: "pr-4",
      paddingLeft: undefined,
    };
  }
  return {
    textAlign: "text-left",
    marginLeft: "ml-4",
    marginRight: undefined,
    paddingLeft: "pl-4",
    paddingRight: undefined,
  };
}

/**
 * Generate unique ID for quiz attempts
 */
export function generateAttemptId(): string {
  return `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate student ID format
 */
export function isValidStudentId(id: string): boolean {
  return /^student_\d{3}$/.test(id) || /^student_\d+$/.test(id);
}
