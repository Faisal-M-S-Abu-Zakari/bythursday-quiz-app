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
 * Get all attempts made by a student for a specific quiz
 */
export function getStudentAttempts(
  studentId: string,
  quizId: string,
  attempts: StudentQuizAttempt[],
): StudentQuizAttempt[] {
  return attempts
    .filter((a) => a.studentId === studentId && a.quizId === quizId && a.hasSubmitted)
    .sort(
      (a, b) =>
        new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
    );
}

/**
 * Get count of remaining attempts for a student on a quiz
 */
export function getRemainingAttempts(
  studentId: string,
  quiz: Quiz,
  attempts: StudentQuizAttempt[],
): number {
  const maxAttempts = quiz.config.maxAttempts ?? (quiz.config.singleSubmission ? 1 : 1);
  const used = getStudentAttempts(studentId, quiz.id, attempts).length;
  return Math.max(0, maxAttempts - used);
}

/**
 * Determine if a student can start an attempt on this quiz
 */
export function canStudentAttemptQuiz(
  studentId: string,
  quiz: Quiz,
  attempts: StudentQuizAttempt[],
): {
  allowed: boolean;
  reason?: string;
  attemptNumber: number;
  remainingAttempts: number;
  isWithinWindow: boolean;
} {
  const isAvailable = isQuizAvailable(quiz);
  const existing = getStudentAttempts(studentId, quiz.id, attempts);
  const maxAttempts = quiz.config.maxAttempts ?? (quiz.config.singleSubmission ? 1 : 1);
  const remaining = Math.max(0, maxAttempts - existing.length);
  const nextAttemptNum = existing.length + 1;

  if (!isAvailable) {
    const now = new Date();
    const open = new Date(quiz.openDate);
    const close = new Date(quiz.closeDate);
    let reason = "Exam window is currently closed.";
    if (now < open) reason = "Exam window has not opened yet.";
    else if (now > close) reason = "Exam window for today has closed.";
    return {
      allowed: false,
      reason,
      attemptNumber: nextAttemptNum,
      remainingAttempts: remaining,
      isWithinWindow: false,
    };
  }

  if (remaining <= 0) {
    return {
      allowed: false,
      reason: `Maximum attempts limit reached (${maxAttempts} of ${maxAttempts} used).`,
      attemptNumber: nextAttemptNum,
      remainingAttempts: 0,
      isWithinWindow: true,
    };
  }

  return {
    allowed: true,
    attemptNumber: nextAttemptNum,
    remainingAttempts: remaining,
    isWithinWindow: true,
  };
}

/**
 * Check if student has already submitted this quiz (or reached maximum allowed attempts)
 */
export function hasStudentSubmitted(
  studentId: string,
  quizId: string,
  attempts: StudentQuizAttempt[],
  quiz?: Quiz,
): boolean {
  const existing = getStudentAttempts(studentId, quizId, attempts);
  if (!quiz) return existing.length > 0;
  const maxAttempts = quiz.config.maxAttempts ?? (quiz.config.singleSubmission ? 1 : 1);
  return existing.length >= maxAttempts;
}

/**
 * Format exam window info for same-day window display
 */
export function getExamWindowStatus(
  openDate: Date | string,
  closeDate: Date | string,
): {
  status: "open" | "upcoming" | "closed";
  labelEn: string;
  labelAr: string;
  timeRemainingText: string;
} {
  const now = new Date();
  const open = new Date(openDate);
  const close = new Date(closeDate);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  const isToday =
    open.getDate() === now.getDate() &&
    open.getMonth() === now.getMonth() &&
    open.getFullYear() === now.getFullYear();

  const isTomorrow =
    open.getDate() === now.getDate() + 1 &&
    open.getMonth() === now.getMonth() &&
    open.getFullYear() === now.getFullYear();

  const dayLabelEn = isToday ? "Today" : isTomorrow ? "Tomorrow" : open.toLocaleDateString();
  const dayLabelAr = isToday ? "اليوم" : isTomorrow ? "غداً" : open.toLocaleDateString("ar-EG");

  if (now < open) {
    return {
      status: "upcoming",
      labelEn: `Opens ${dayLabelEn} (${formatTime(open)} – ${formatTime(close)})`,
      labelAr: `يبدأ ${dayLabelAr} (${formatTime(open)} – ${formatTime(close)})`,
      timeRemainingText: `Window opens in ${Math.ceil((open.getTime() - now.getTime()) / (1000 * 60 * 60))}h`,
    };
  }

  if (now > close) {
    return {
      status: "closed",
      labelEn: `Window closed ${dayLabelEn} at ${formatTime(close)}`,
      labelAr: `أغلقت النافذة ${dayLabelAr} الساعة ${formatTime(close)}`,
      timeRemainingText: "Closed",
    };
  }

  const remainingMinutes = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60));
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;
  const timeStr = remainingHours > 0 ? `${remainingHours}h ${remainingMins}m left` : `${remainingMins}m left`;

  return {
    status: "open",
    labelEn: `Open ${dayLabelEn} (${formatTime(open)} – ${formatTime(close)})`,
    labelAr: `متاح ${dayLabelAr} (${formatTime(open)} – ${formatTime(close)})`,
    timeRemainingText: timeStr,
  };
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
