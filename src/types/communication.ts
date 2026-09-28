/**
 * Types for Teacher-to-Student Messaging and Notifications
 * Amman Tutoring Centre (byThursday)
 */

export type MessagePriority = 'normal' | 'important' | 'urgent';

export interface TeacherMessage {
  id: string;
  teacherId: string;
  teacherName: string;
  recipientType: 'student' | 'class' | 'all';
  recipientId: string; // studentId or ClassCode or 'all'
  recipientName: string; // Student name or e.g. "Class 10A"
  subject: string;
  content: string;
  priority: MessagePriority;
  createdAt: string; // ISO date string
  readByStudentIds: string[]; // List of student IDs who have read this message
}

export type NotificationType = 'message' | 'exam_window' | 'attempt_alert' | 'feedback';

export interface StudentNotification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  createdAt: string; // ISO date string
  isRead: boolean;
  priority?: MessagePriority;
}
