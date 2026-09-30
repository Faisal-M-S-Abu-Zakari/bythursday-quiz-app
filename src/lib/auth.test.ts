import { authenticateDemoUser, getDashboardPath, DEMO_CREDENTIALS } from './auth';
import { User } from '../types/user';

describe('Auth Helpers (src/lib/auth.ts)', () => {
  describe('authenticateDemoUser', () => {
    it('authenticates demo student with student_001 identifier and correct password', () => {
      const user = authenticateDemoUser(DEMO_CREDENTIALS.student.identifier, DEMO_CREDENTIALS.student.password);
      expect(user).not.toBeNull();
      expect(user?.role).toBe('student');
      expect(user?.id).toBe('student_001');
    });

    it('authenticates demo teacher with email and correct password', () => {
      const user = authenticateDemoUser(DEMO_CREDENTIALS.teacher.identifier, DEMO_CREDENTIALS.teacher.password);
      expect(user).not.toBeNull();
      expect(user?.role).toBe('teacher');
      expect(user?.email).toBe('mahmoud.ali@nourtutor.jo');
    });

    it('authenticates demo admin with "nour" and correct password', () => {
      const user = authenticateDemoUser(DEMO_CREDENTIALS.admin.identifier, DEMO_CREDENTIALS.admin.password);
      expect(user).not.toBeNull();
      expect(user?.role).toBe('admin');
    });

    it('authenticates demo admin with admin email and admin_001 ID', () => {
      const userById = authenticateDemoUser('admin_001', DEMO_CREDENTIALS.admin.password);
      expect(userById).not.toBeNull();
      expect(userById?.role).toBe('admin');
    });

    it('rejects incorrect passwords for existing user', () => {
      const user = authenticateDemoUser(DEMO_CREDENTIALS.student.identifier, 'WrongPassword123');
      expect(user).toBeNull();
    });

    it('rejects nonexistent user accounts', () => {
      const user = authenticateDemoUser('nonexistent_user', 'any_password');
      expect(user).toBeNull();
    });

    it('handles case-insensitivity and whitespace trimming', () => {
      const user = authenticateDemoUser('  STUDENT_001  ', DEMO_CREDENTIALS.student.password);
      expect(user).not.toBeNull();
      expect(user?.id).toBe('student_001');
    });
  });

  describe('getDashboardPath', () => {
    it('returns /student/dashboard for students', () => {
      const mockStudent: User = {
        id: 'student_001',
        name: 'Test Student',
        email: 'test@example.com',
        role: 'student',
      };
      expect(getDashboardPath(mockStudent)).toBe('/student/dashboard');
    });

    it('returns /admin/dashboard for admins', () => {
      const mockAdmin: User = {
        id: 'admin_001',
        name: 'Test Admin',
        email: 'admin@example.com',
        role: 'admin',
      };
      expect(getDashboardPath(mockAdmin)).toBe('/admin/dashboard');
    });

    it('returns /teacher/dashboard for teachers', () => {
      const mockTeacher: User = {
        id: 'teacher_001',
        name: 'Test Teacher',
        email: 'teacher@example.com',
        role: 'teacher',
      };
      expect(getDashboardPath(mockTeacher)).toBe('/teacher/dashboard');
    });
  });
});
