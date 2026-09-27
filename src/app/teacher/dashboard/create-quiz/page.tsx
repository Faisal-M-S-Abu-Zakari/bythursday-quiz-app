/**
 * Create Quiz Form - Allows teachers to create new quizzes
 */

'use client';

import { useState } from 'react';
import { useTeacher } from '@/context/TeacherContext';
import { Quiz, Question } from '@/types/quiz';
import { ClassCode } from '@/types/user';
import { Plus, Trash2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface QuestionForm {
  id: string;
  text: string;
  points: number;
  options: { id: string; text: string; isCorrect: boolean }[];
}

export default function CreateQuizPage() {
  const { currentTeacher, addQuiz } = useTeacher();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en'>('en');
  const [classCode, setClassCode] = useState<ClassCode>('10A');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [negativeMarksPerQuestion, setNegativeMarksPerQuestion] = useState(1);
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      id: '1',
      text: '',
      points: 5,
      options: [
        { id: '1a', text: '', isCorrect: true },
        { id: '1b', text: '', isCorrect: false },
        { id: '1c', text: '', isCorrect: false },
        { id: '1d', text: '', isCorrect: false },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!currentTeacher) {
    return null;
  }

  const addQuestion = () => {
    const newId = String(Math.max(...questions.map((q) => parseInt(q.id)), 0) + 1);
    setQuestions([
      ...questions,
      {
        id: newId,
        text: '',
        points: 5,
        options: [
          { id: `${newId}a`, text: '', isCorrect: true },
          { id: `${newId}b`, text: '', isCorrect: false },
          { id: `${newId}c`, text: '', isCorrect: false },
          { id: `${newId}d`, text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const updateOption = (questionId: string, optionId: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId
                  ? { ...o, [field]: value }
                  : field === 'isCorrect' && value
                  ? { ...o, isCorrect: false }
                  : o
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title || !description || !subject) {
      setError('Please fill in all required fields');
      return;
    }

    if (questions.length < 1) {
      setError('Quiz must have at least 1 question');
      return;
    }

    if (questions.some((q) => !q.text || q.options.some((o) => !o.text))) {
      setError('All questions and options must have text');
      return;
    }

    if (questions.some((q) => !q.options.some((o) => o.isCorrect))) {
      setError('Each question must have at least one correct answer');
      return;
    }

    if (!openDate || !closeDate) {
      setError('Please set open and close dates');
      return;
    }

    setLoading(true);

    try {
      // Convert form questions to Quiz questions
      const quizQuestions: Question[] = questions.map((q) => ({
        id: q.id,
        text: q.text,
        language,
        type: 'multiple_choice',
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
        correctOptionId: q.options.find((o) => o.isCorrect)?.id || '',
        points: q.points,
        negativeMarks: negativeMarking ? negativeMarksPerQuestion : undefined,
      }));

      const totalPoints = quizQuestions.reduce((sum, q) => sum + q.points, 0);

      const newQuiz: Quiz = {
        id: `quiz_${Date.now()}`,
        title,
        description,
        subject,
        language,
        classCode,
        questions: quizQuestions,
        config: {
          durationMinutes,
          negativeMarking,
          negativeMarksPerQuestion,
          singleSubmission: true,
        },
        createdBy: currentTeacher.id,
        createdAt: new Date(),
        openDate: new Date(openDate),
        closeDate: new Date(closeDate),
        totalPoints,
        isActive: true,
      };

      addQuiz(newQuiz);
      window.location.href = '/teacher/dashboard';
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/teacher/dashboard"
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Chapter 5 Assessment"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Arabic Literature"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the quiz"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="classCode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  id="classCode"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value as ClassCode)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="10A">10A</option>
                  <option value="10B">10B</option>
                  <option value="11A">11A</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ar' | 'en')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quiz Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quiz Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  max="180"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Negative Marking
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={negativeMarking}
                    onChange={(e) => setNegativeMarking(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700">Enable negative marking</span>
                </label>
              </div>

              {negativeMarking && (
                <div>
                  <label htmlFor="negativeMarks" className="block text-sm font-semibold text-gray-700 mb-2">
                    Negative Marks Per Wrong Answer
                  </label>
                  <input
                    id="negativeMarks"
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={negativeMarksPerQuestion}
                    onChange={(e) => setNegativeMarksPerQuestion(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label htmlFor="openDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Open Date *
                </label>
                <input
                  id="openDate"
                  type="date"
                  value={openDate}
                  onChange={(e) => setOpenDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="closeDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Close Date *
                </label>
                <input
                  id="closeDate"
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Questions ({questions.length})</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, idx) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Question {idx + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Question Text *
                      </label>
                      <textarea
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(question.id, 'text', e.target.value)
                        }
                        placeholder="Enter question text"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Points *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={question.points}
                        onChange={(e) =>
                          updateQuestion(question.id, 'points', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Options *</h4>
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct_${question.id}`}
                          checked={option.isCorrect}
                          onChange={(e) =>
                            updateOption(question.id, option.id, 'isCorrect', e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            updateOption(question.id, option.id, 'text', e.target.value)
                          }
                          placeholder="Enter option text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link
              href="/teacher/dashboard"
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
