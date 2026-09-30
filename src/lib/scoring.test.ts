import {
  calculateScore,
  getCorrectAnswersCount,
  generateQuizResult,
  isAnswerCorrect,
  calculateQuizAnalytics,
} from '../lib/scoring';
import { StudentQuizAttempt, Quiz, Question, QuizOption } from '../types/quiz';

// Mock data
const createMockOption = (id: string, text: string, isCorrect: boolean): QuizOption => ({
  id,
  text,
  isCorrect,
});

const createMockQuestion = (id: string, points: number = 5, negativeMarks?: number): Question => ({
  id,
  text: `Question ${id}`,
  language: 'en',
  type: 'multiple_choice',
  options: [
    createMockOption(`${id}-opt1`, 'Correct Answer', true),
    createMockOption(`${id}-opt2`, 'Wrong Answer 1', false),
    createMockOption(`${id}-opt3`, 'Wrong Answer 2', false),
    createMockOption(`${id}-opt4`, 'Wrong Answer 3', false),
  ],
  correctOptionId: `${id}-opt1`,
  points,
  negativeMarks,
});

const createMockQuiz = (
  questions: Question[],
  negativeMarking: boolean = false,
  negativeMarksPerQuestion: number = 1
): Quiz => ({
  id: 'quiz_test_001',
  title: 'Test Quiz',
  description: 'Test quiz for scoring',
  subject: 'Test Subject',
  language: 'en',
  classCode: '10A',
  questions,
  config: {
    durationMinutes: 20,
    negativeMarking,
    negativeMarksPerQuestion,
    singleSubmission: true,
  },
  createdBy: 'teacher_001',
  createdAt: new Date(),
  openDate: new Date(),
  closeDate: new Date(Date.now() + 86400000),
  totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
  isActive: true,
});

const createMockAttempt = (answers: { questionId: string; selectedOptionId: string }[]): StudentQuizAttempt => ({
  id: 'attempt_test_001',
  studentId: 'student_001',
  quizId: 'quiz_test_001',
  startedAt: new Date(),
  completedAt: new Date(),
  answers: answers.map((a) => ({
    ...a,
    timeSpentSeconds: 30,
  })),
  score: undefined,
  percentage: undefined,
  hasSubmitted: true,
});

describe('Scoring Engine', () => {
  describe('calculateScore - Positive Marking Only', () => {
    it('should calculate correct score with all correct answers', () => {
      const questions = [
        createMockQuestion('q1', 5),
        createMockQuestion('q2', 10),
        createMockQuestion('q3', 5),
      ];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt1' },
        { questionId: 'q2', selectedOptionId: 'q2-opt1' },
        { questionId: 'q3', selectedOptionId: 'q3-opt1' },
      ]);

      const { score, percentage, negativeMarksDeducted } = calculateScore(attempt, quiz);

      expect(score).toBe(20); // 5 + 10 + 5
      expect(percentage).toBe(100); // 20/20 * 100
      expect(negativeMarksDeducted).toBe(0);
    });

    it('should calculate correct score with mixed correct and wrong answers', () => {
      const questions = [
        createMockQuestion('q1', 5),
        createMockQuestion('q2', 10),
        createMockQuestion('q3', 5),
      ];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt1' }, // Correct
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong
        { questionId: 'q3', selectedOptionId: 'q3-opt1' }, // Correct
      ]);

      const { score, percentage, negativeMarksDeducted } = calculateScore(attempt, quiz);

      expect(score).toBe(10); // 5 + 0 + 5
      expect(percentage).toBe(50); // 10/20 * 100
      expect(negativeMarksDeducted).toBe(0);
    });

    it('should calculate zero score with all wrong answers', () => {
      const questions = [
        createMockQuestion('q1', 5),
        createMockQuestion('q2', 10),
      ];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt2' }, // Wrong
        { questionId: 'q2', selectedOptionId: 'q2-opt3' }, // Wrong
      ]);

      const { score, percentage } = calculateScore(attempt, quiz);

      expect(score).toBe(0);
      expect(percentage).toBe(0);
    });

    it('should handle variable points per question', () => {
      const questions = [
        createMockQuestion('q1', 3),
        createMockQuestion('q2', 7),
        createMockQuestion('q3', 15),
      ];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt1' }, // Correct: 3
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong: 0
        { questionId: 'q3', selectedOptionId: 'q3-opt1' }, // Correct: 15
      ]);

      const { score, percentage } = calculateScore(attempt, quiz);

      expect(score).toBe(18); // 3 + 0 + 15
      expect(percentage).toBe(72); // 18/25 * 100
    });
  });

  describe('calculateScore - Negative Marking', () => {
    it('should deduct points for wrong answers with negative marking', () => {
      const questions = [
        createMockQuestion('q1', 5, 1),
        createMockQuestion('q2', 5, 1),
        createMockQuestion('q3', 5, 1),
      ];
      const quiz = createMockQuiz(questions, true, 1);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt1' }, // Correct: +5
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong: -1
        { questionId: 'q3', selectedOptionId: 'q3-opt1' }, // Correct: +5
      ]);

      const { score, percentage, negativeMarksDeducted } = calculateScore(attempt, quiz);

      expect(score).toBe(9); // 5 - 1 + 5
      expect(percentage).toBe(60); // 9/15 * 100
      expect(negativeMarksDeducted).toBe(1);
    });

    it('should apply variable negative marks per question', () => {
      const q1 = createMockQuestion('q1', 5, 1);
      const q2 = createMockQuestion('q2', 5, 2);
      const q3 = createMockQuestion('q3', 5, 0.5);
      const questions = [q1, q2, q3];
      const quiz = createMockQuiz(questions, true, 2);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt2' }, // Wrong: -1
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong: -2
        { questionId: 'q3', selectedOptionId: 'q3-opt2' }, // Wrong: -0.5
      ]);

      const { score, negativeMarksDeducted } = calculateScore(attempt, quiz);

      expect(negativeMarksDeducted).toBe(3.5); // 1 + 2 + 0.5
      expect(score).toBe(0); // 0 - 3.5 = -3.5, floored to 0
    });

    it('should apply multiple negative marks correctly', () => {
      const questions = [
        createMockQuestion('q1', 10, 2),
        createMockQuestion('q2', 10, 2),
        createMockQuestion('q3', 10, 2),
      ];
      const quiz = createMockQuiz(questions, true, 2);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt2' }, // Wrong: -2
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong: -2
        { questionId: 'q3', selectedOptionId: 'q3-opt1' }, // Correct: +10
      ]);

      const { score, percentage, negativeMarksDeducted } = calculateScore(attempt, quiz);

      expect(negativeMarksDeducted).toBe(4); // 2 + 2
      expect(score).toBe(6); // 10 - 4
      expect(percentage).toBe(20); // 6/30 * 100
    });
  });

  describe('calculateScore - Zero Floor Check', () => {
    it('should never return negative score (floor to zero)', () => {
      const questions = [
        createMockQuestion('q1', 5, 10),
        createMockQuestion('q2', 5, 10),
      ];
      const quiz = createMockQuiz(questions, true, 10);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt2' }, // Wrong: -10
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong: -10
      ]);

      const { score, percentage } = calculateScore(attempt, quiz);

      expect(score).toBe(0); // Should not be negative
      expect(percentage).toBe(0);
    });

    it('should floor score to zero even with correct answer + large deduction', () => {
      const questions = [
        createMockQuestion('q1', 2, 5),
        createMockQuestion('q2', 2, 5),
      ];
      const quiz = createMockQuiz(questions, true, 5);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt1' }, // Correct: +2
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong: -5
      ]);

      const { score, percentage } = calculateScore(attempt, quiz);

      expect(score).toBe(0); // 2 - 5 = -3, floored to 0
      expect(percentage).toBe(0);
    });
  });

  describe('getCorrectAnswersCount', () => {
    it('should count correct answers accurately', () => {
      const questions = [
        createMockQuestion('q1', 5),
        createMockQuestion('q2', 5),
        createMockQuestion('q3', 5),
      ];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt1' }, // Correct
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong
        { questionId: 'q3', selectedOptionId: 'q3-opt1' }, // Correct
      ]);

      const correctCount = getCorrectAnswersCount(attempt, quiz);

      expect(correctCount).toBe(2);
    });

    it('should return 0 when no answers are correct', () => {
      const questions = [
        createMockQuestion('q1', 5),
        createMockQuestion('q2', 5),
      ];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt2' }, // Wrong
        { questionId: 'q2', selectedOptionId: 'q2-opt3' }, // Wrong
      ]);

      const correctCount = getCorrectAnswersCount(attempt, quiz);

      expect(correctCount).toBe(0);
    });

    it('should return total questions when all correct', () => {
      const questions = [
        createMockQuestion('q1', 5),
        createMockQuestion('q2', 5),
        createMockQuestion('q3', 5),
      ];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt1' }, // Correct
        { questionId: 'q2', selectedOptionId: 'q2-opt1' }, // Correct
        { questionId: 'q3', selectedOptionId: 'q3-opt1' }, // Correct
      ]);

      const correctCount = getCorrectAnswersCount(attempt, quiz);

      expect(correctCount).toBe(3);
    });
  });

  describe('Percentage Calculation', () => {
    it('should round percentage to 2 decimal places', () => {
      const questions = [createMockQuestion('q1', 3)];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([{ questionId: 'q1', selectedOptionId: 'q1-opt1' }]);

      const { percentage } = calculateScore(attempt, quiz);

      // 3/3 * 100 = 100
      expect(percentage).toBe(100);
    });

    it('should handle fractional percentages correctly', () => {
      const questions = [
        createMockQuestion('q1', 5),
        createMockQuestion('q2', 5),
        createMockQuestion('q3', 5),
      ];
      const quiz = createMockQuiz(questions, false);
      const attempt = createMockAttempt([
        { questionId: 'q1', selectedOptionId: 'q1-opt1' }, // Correct
        { questionId: 'q2', selectedOptionId: 'q2-opt2' }, // Wrong
        { questionId: 'q3', selectedOptionId: 'q3-opt2' }, // Wrong
      ]);

      const { percentage } = calculateScore(attempt, quiz);

      // 5/15 * 100 = 33.33...
      expect(percentage).toBe(33.33);
    });
  });

  describe('isAnswerCorrect', () => {
    const questions = [createMockQuestion('q1', 5)];
    const quiz = createMockQuiz(questions, false);

    it('should return true for correct answer option', () => {
      expect(isAnswerCorrect('q1', 'q1-opt1', quiz)).toBe(true);
    });

    it('should return false for incorrect answer option', () => {
      expect(isAnswerCorrect('q1', 'q1-opt2', quiz)).toBe(false);
    });

    it('should return false for nonexistent question', () => {
      expect(isAnswerCorrect('q999', 'q1-opt1', quiz)).toBe(false);
    });

    it('should return false for nonexistent option', () => {
      expect(isAnswerCorrect('q1', 'opt_does_not_exist', quiz)).toBe(false);
    });
  });

  describe('generateQuizResult', () => {
    it('should construct a complete QuizResult object with calculated metrics', () => {
      const questions = [
        createMockQuestion('q1', 10, 2),
        createMockQuestion('q2', 10, 2),
      ];
      const quiz = createMockQuiz(questions, true, 2);
      const startTime = new Date(Date.now() - 120000); // 2 minutes ago
      const endTime = new Date();
      const attempt: StudentQuizAttempt = {
        id: 'att_001',
        studentId: 'student_123',
        quizId: quiz.id,
        startedAt: startTime,
        completedAt: endTime,
        answers: [
          { questionId: 'q1', selectedOptionId: 'q1-opt1', timeSpentSeconds: 45 },
          { questionId: 'q2', selectedOptionId: 'q2-opt2', timeSpentSeconds: 75 },
        ],
        score: undefined,
        percentage: undefined,
        hasSubmitted: true,
      };

      const result = generateQuizResult(attempt, quiz, 'Zaid Al-Harbi');

      expect(result.attemptId).toBe('att_001');
      expect(result.studentId).toBe('student_123');
      expect(result.studentName).toBe('Zaid Al-Harbi');
      expect(result.quizId).toBe(quiz.id);
      expect(result.quizTitle).toBe(quiz.title);
      expect(result.totalPoints).toBe(20);
      expect(result.totalQuestions).toBe(2);
      expect(result.correctAnswers).toBe(1);
      expect(result.negativeMarksDeducted).toBe(2);
      expect(result.score).toBe(8); // 10 - 2
      expect(result.percentage).toBe(40); // 8/20 * 100
      expect(result.timeTakenSeconds).toBeGreaterThanOrEqual(119);
    });
  });

  describe('calculateQuizAnalytics', () => {
    it('should aggregate statistics across submitted attempts correctly', () => {
      const questions = [
        createMockQuestion('q1', 10),
        createMockQuestion('q2', 10),
      ];
      const quiz = createMockQuiz(questions, false);

      const attempts: StudentQuizAttempt[] = [
        {
          id: 'att_1',
          studentId: 'student_001',
          quizId: quiz.id,
          startedAt: new Date(),
          completedAt: new Date(),
          hasSubmitted: true,
          answers: [
            { questionId: 'q1', selectedOptionId: 'q1-opt1', timeSpentSeconds: 20 },
            { questionId: 'q2', selectedOptionId: 'q2-opt1', timeSpentSeconds: 30 },
          ],
        },
        {
          id: 'att_2',
          studentId: 'student_002',
          quizId: quiz.id,
          startedAt: new Date(),
          completedAt: new Date(),
          hasSubmitted: true,
          answers: [
            { questionId: 'q1', selectedOptionId: 'q1-opt1', timeSpentSeconds: 25 },
            { questionId: 'q2', selectedOptionId: 'q2-opt2', timeSpentSeconds: 35 },
          ],
        },
      ];

      const analytics = calculateQuizAnalytics(attempts, quiz);

      expect(analytics.totalAttempts).toBe(2);
      expect(analytics.totalSubmissions).toBe(2);
      expect(analytics.highestScore).toBe(20);
      expect(analytics.lowestScore).toBe(10);
      expect(analytics.averageScore).toBe(15);
      expect(analytics.averagePercentage).toBe(75);
      expect(analytics.completionRate).toBe(100);

      const q1Stats = analytics.questionAnalysis.find(q => q.questionId === 'q1');
      expect(q1Stats?.correctCount).toBe(2);
      expect(q1Stats?.incorrectCount).toBe(0);

      const q2Stats = analytics.questionAnalysis.find(q => q.questionId === 'q2');
      expect(q2Stats?.correctCount).toBe(1);
      expect(q2Stats?.incorrectCount).toBe(1);
    });

    it('should handle empty attempts gracefully', () => {
      const quiz = createMockQuiz([createMockQuestion('q1', 10)], false);
      const analytics = calculateQuizAnalytics([], quiz);

      expect(analytics.totalAttempts).toBe(0);
      expect(analytics.totalSubmissions).toBe(0);
      expect(analytics.averageScore).toBe(0);
      expect(analytics.completionRate).toBe(0);
    });
  });
});

