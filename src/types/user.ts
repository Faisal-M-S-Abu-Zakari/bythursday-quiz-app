/**
 * User types for byThursday Quiz Platform
 * Supports three distinct roles: Student, Teacher, Admin
 */

export type UserRole = 'student' | 'teacher' | 'admin';
export type ClassCode = '10A' | '10B' | '11A';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Student extends BaseUser {
  role: 'student';
  classCode: ClassCode;
  enrollmentDate: Date;
}

export interface Teacher extends BaseUser {
  role: 'teacher';
  assignedClasses: ClassCode[];
  subjects: string[];
  phoneNumber?: string;
}

export interface Admin extends BaseUser {
  role: 'admin';
  permissions: AdminPermission[];
}

export type AdminPermission =
  | 'manage_users'
  | 'manage_quizzes'
  | 'view_analytics'
  | 'manage_content'
  | 'manage_classes';

export type User = Student | Teacher | Admin;
