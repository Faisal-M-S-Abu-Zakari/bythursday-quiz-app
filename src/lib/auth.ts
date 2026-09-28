import { mockAdmin, mockStudents, mockTeachers } from "@/data/mockData";
import type { User } from "@/types/user";

export const DEMO_CREDENTIALS = {
  student: { identifier: "student_001", password: "Student@123" },
  teacher: { identifier: "mahmoud.ali@nourtutor.jo", password: "Teacher@123" },
  admin: { identifier: "nour", password: "Nour@123" },
} as const;

/** Demo-only credential lookup. Replace with a server-side identity provider before production. */
export function authenticateDemoUser(
  identifier: string,
  password: string,
): User | null {
  const normalizedIdentifier = identifier.trim().toLocaleLowerCase();

  const student = mockStudents.find(
    (candidate) =>
      candidate.id.toLocaleLowerCase() === normalizedIdentifier ||
      candidate.email.toLocaleLowerCase() === normalizedIdentifier,
  );
  if (student && password === DEMO_CREDENTIALS.student.password) return student;

  const teacher = mockTeachers.find(
    (candidate) => candidate.email.toLocaleLowerCase() === normalizedIdentifier,
  );
  if (teacher && password === DEMO_CREDENTIALS.teacher.password) return teacher;

  const isAdminIdentifier = [
    mockAdmin.name,
    "nour",
    "admin_001",
    mockAdmin.email,
  ].some((value) => value.toLocaleLowerCase() === normalizedIdentifier);
  if (isAdminIdentifier && password === DEMO_CREDENTIALS.admin.password) {
    return mockAdmin;
  }

  return null;
}

export function getDashboardPath(user: User): string {
  if (user.role === "student") return "/student/dashboard";
  if (user.role === "admin") return "/admin/dashboard";
  return "/teacher/dashboard";
}
