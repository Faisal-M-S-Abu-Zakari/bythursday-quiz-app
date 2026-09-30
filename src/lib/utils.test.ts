import {
  isQuizAvailable,
  getQuizTimeRemaining,
  formatTimeRemaining,
  getStudentAttempts,
  getRemainingAttempts,
  canStudentAttemptQuiz,
  hasStudentSubmitted,
  getExamWindowStatus,
  getTextDirection,
  getRTLClasses,
  generateAttemptId,
  isValidStudentId,
  getStudentById,
} from './utils';
import { Quiz, StudentQuizAttempt } from '../types/quiz';

describe('Utility Functions (src/lib/utils.ts)', () => {
  describe('formatTimeRemaining', () => {
    it('formats seconds into MM:SS correctly', () => {
      expect(formatTimeRemaining(0)).toBe('00:00');
      expect(formatTimeRemaining(9)).toBe('00:09');
      expect(formatTimeRemaining(65)).toBe('01:05');
      expect(formatTimeRemaining(600)).toBe('10:00');
      expect(formatTimeRemaining(3599)).toBe('59:59');
    });
  });

  describe('isValidStudentId', () => {
    it('validates 3-digit student IDs', () => {
      expect(isValidStudentId('student_001')).toBe(true);
      expect(isValidStudentId('student_042')).toBe(true);
      expect(isValidStudentId('student_999')).toBe(true);
    });

    it('validates variable digit student IDs', () => {
      expect(isValidStudentId('student_1')).toBe(true);
      expect(isValidStudentId('student_12345')).toBe(true);
    });

    it('rejects invalid student ID formats', () => {
      expect(isValidStudentId('teacher_001')).toBe(false);
      expect(isValidStudentId('admin_001')).toBe(false);
      expect(isValidStudentId('student_abc')).toBe(false);
      expect(isValidStudentId('')).toBe(false);
      expect(isValidStudentId('student-001')).toBe(false);
    });
  });

  describe('getTextDirection & getRTLClasses', () => {
    it('returns rtl for Arabic and ltr for English', () => {
      expect(getTextDirection('ar')).toBe('rtl');
      expect(getTextDirection('en')).toBe('ltr');
    });

    it('returns proper RTL CSS class mappings', () => {
      const arClasses = getRTLClasses('ar');
      expect(arClasses.textAlign).toBe('text-right');
      expect(arClasses.marginRight).toBe('mr-4');
      expect(arClasses.marginLeft).toBeUndefined();

      const enClasses = getRTLClasses('en');
      expect(enClasses.textAlign).toBe('text-left');
      expect(enClasses.marginLeft).toBe('ml-4');
      expect(enClasses.marginRight).toBeUndefined();
    });
  });

  describe('generateAttemptId', () => {
    it('generates a unique attempt id prefixed with attempt_', () => {
      const id1 = generateAttemptId();
      const id2 = generateAttemptId();
      expect(id1.startsWith('attempt_')).toBe(true);
      expect(id2.startsWith('attempt_')).toBe(true);
      expect(id1).not.toBe(id2);
    });
  });

  describe('isQuizAvailable', () => {
    const createQuizWithDates = (openOffsetMs: number, closeOffsetMs: number, isActive = true): Quiz => ({
      id: 'quiz_avail_test',
      title: 'Availability Test Quiz',
      description: 'Testing availability',
      subject: 'Math',
      language: 'en',
      classCode: '10A',
      questions: [],
      config: {
        durationMinutes: 30,
        negativeMarking: false,
        singleSubmission: true,
      },
      createdBy: 'teacher_1',
      createdAt: new Date(),
      openDate: new Date(Date.now() + openOffsetMs),
      closeDate: new Date(Date.now() + closeOffsetMs),
      totalPoints: 10,
      isActive,
    });

    it('returns true when current time is between open and close dates and quiz is active', () => {
      const quiz = createQuizWithDates(-60000, 60000, true);
      expect(isQuizAvailable(quiz)).toBe(true);
    });

    it('returns false when quiz has not opened yet', () => {
      const quiz = createQuizWithDates(60000, 120000, true);
      expect(isQuizAvailable(quiz)).toBe(false);
    });

    it('returns false when quiz window has already passed', () => {
      const quiz = createQuizWithDates(-120000, -60000, true);
      expect(isQuizAvailable(quiz)).toBe(false);
    });

    it('returns false if quiz is deactivated (isActive = false)', () => {
      const quiz = createQuizWithDates(-60000, 60000, false);
      expect(isQuizAvailable(quiz)).toBe(false);
    });
  });

  describe('getQuizTimeRemaining', () => {
    it('returns remaining minutes when within window', () => {
      const open = new Date(Date.now() - 10000);
      const close = new Date(Date.now() + 120000); // 2 minutes from now
      const remaining = getQuizTimeRemaining(open, close);
      expect(remaining).toBeGreaterThanOrEqual(1);
      expect(remaining).toBeLessThanOrEqual(3);
    });

    it('returns 0 when already closed or not yet open', () => {
      const pastOpen = new Date(Date.now() - 60000);
      const pastClose = new Date(Date.now() - 30000);
      expect(getQuizTimeRemaining(pastOpen, pastClose)).toBe(0);

      const futureOpen = new Date(Date.now() + 30000);
      const futureClose = new Date(Date.now() + 60000);
      expect(getQuizTimeRemaining(futureOpen, futureClose)).toBe(0);
    });
  });

  describe('getStudentAttempts & getRemainingAttempts', () => {
    const mockQuiz: Quiz = {
      id: 'quiz_attempts_test',
      title: 'Attempts Test Quiz',
      description: 'Testing attempts',
      subject: 'Physics',
      language: 'en',
      classCode: '10A',
      questions: [],
      config: {
        durationMinutes: 30,
        negativeMarking: false,
        singleSubmission: true,
        maxAttempts: 2,
      },
      createdBy: 'teacher_1',
      createdAt: new Date(),
      openDate: new Date(Date.now() - 60000),
      closeDate: new Date(Date.now() + 60000),
      totalPoints: 10,
      isActive: true,
    };

    const attempts: StudentQuizAttempt[] = [
      {
        id: 'att_1',
        studentId: 'student_001',
        quizId: 'quiz_attempts_test',
        startedAt: new Date(Date.now() - 30000),
        completedAt: new Date(),
        answers: [],
        hasSubmitted: true,
      },
      {
        id: 'att_unsubmitted',
        studentId: 'student_001',
        quizId: 'quiz_attempts_test',
        startedAt: new Date(),
        answers: [],
        hasSubmitted: false,
      },
      {
        id: 'att_other_student',
        studentId: 'student_002',
        quizId: 'quiz_attempts_test',
        startedAt: new Date(),
        completedAt: new Date(),
        answers: [],
        hasSubmitted: true,
      },
    ];

    it('filters only submitted attempts for the matching student and quiz', () => {
      const studentAttempts = getStudentAttempts('student_001', 'quiz_attempts_test', attempts);
      expect(studentAttempts.length).toBe(1);
      expect(studentAttempts[0].id).toBe('att_1');
    });

    it('calculates remaining attempts based on maxAttempts', () => {
      const remaining = getRemainingAttempts('student_001', mockQuiz, attempts);
      expect(remaining).toBe(1); // 2 allowed - 1 submitted = 1 left
    });

    it('returns 0 remaining attempts when max attempts reached', () => {
      const quizSingle: Quiz = {
        ...mockQuiz,
        config: { ...mockQuiz.config, singleSubmission: true, maxAttempts: 1 },
      };
      const remaining = getRemainingAttempts('student_001', quizSingle, attempts);
      expect(remaining).toBe(0);
    });
  });

  describe('canStudentAttemptQuiz & hasStudentSubmitted', () => {
    const baseQuiz: Quiz = {
      id: 'quiz_can_attempt',
      title: 'Can Attempt Quiz',
      description: 'Testing canAttempt',
      subject: 'Chemistry',
      language: 'en',
      classCode: '10A',
      questions: [],
      config: {
        durationMinutes: 20,
        negativeMarking: false,
        singleSubmission: true,
        maxAttempts: 1,
      },
      createdBy: 'teacher_1',
      createdAt: new Date(),
      openDate: new Date(Date.now() - 60000),
      closeDate: new Date(Date.now() + 60000),
      totalPoints: 10,
      isActive: true,
    };

    it('allows student to attempt when within window and has remaining attempts', () => {
      const result = canStudentAttemptQuiz('student_001', baseQuiz, []);
      expect(result.allowed).toBe(true);
      expect(result.attemptNumber).toBe(1);
      expect(result.remainingAttempts).toBe(1);
      expect(result.isWithinWindow).toBe(true);
    });

    it('blocks student when max attempts exceeded', () => {
      const existingAttempts: StudentQuizAttempt[] = [
        {
          id: 'att_done',
          studentId: 'student_001',
          quizId: baseQuiz.id,
          startedAt: new Date(),
          completedAt: new Date(),
          answers: [],
          hasSubmitted: true,
        },
      ];

      const result = canStudentAttemptQuiz('student_001', baseQuiz, existingAttempts);
      expect(result.allowed).toBe(false);
      expect(result.remainingAttempts).toBe(0);
      expect(result.reason).toContain('Maximum attempts limit reached');
    });

    it('correctly reports hasStudentSubmitted', () => {
      const existingAttempts: StudentQuizAttempt[] = [
        {
          id: 'att_done',
          studentId: 'student_001',
          quizId: baseQuiz.id,
          startedAt: new Date(),
          completedAt: new Date(),
          answers: [],
          hasSubmitted: true,
        },
      ];

      expect(hasStudentSubmitted('student_001', baseQuiz.id, existingAttempts, baseQuiz)).toBe(true);
      expect(hasStudentSubmitted('student_002', baseQuiz.id, existingAttempts, baseQuiz)).toBe(false);
    });
  });

  describe('getExamWindowStatus', () => {
    it('returns open status when current time is within window', () => {
      const now = Date.now();
      const open = new Date(now - 30 * 60 * 1000);
      const close = new Date(now + 90 * 60 * 1000);

      const status = getExamWindowStatus(open, close);
      expect(status.status).toBe('open');
      expect(status.labelEn).toContain('Open');
      expect(status.timeRemainingText).toContain('left');
    });

    it('returns upcoming status when window is in future', () => {
      const now = Date.now();
      const open = new Date(now + 2 * 60 * 60 * 1000);
      const close = new Date(now + 4 * 60 * 60 * 1000);

      const status = getExamWindowStatus(open, close);
      expect(status.status).toBe('upcoming');
      expect(status.labelEn).toContain('Opens');
      expect(status.timeRemainingText).toContain('Window opens in');
    });

    it('returns closed status when window is past', () => {
      const now = Date.now();
      const open = new Date(now - 4 * 60 * 60 * 1000);
      const close = new Date(now - 2 * 60 * 60 * 1000);

      const status = getExamWindowStatus(open, close);
      expect(status.status).toBe('closed');
      expect(status.labelEn).toContain('Window closed');
      expect(status.timeRemainingText).toBe('Closed');
    });
  });

  describe('getStudentById', () => {
    it('finds student by ID from mock data', () => {
      const student = getStudentById('student_001');
      expect(student).toBeDefined();
      expect(student?.id).toBe('student_001');
      expect(student?.name).toBe('محمد الخطيب');
    });

    it('returns undefined for non-existent student', () => {
      const student = getStudentById('student_unknown_9999');
      expect(student).toBeUndefined();
    });
  });
});
