/**
 * Teacher Login Page - Select or search for teacher account
 */

'use client';

import { useState } from 'react';
import { useTeacher } from '@/context/TeacherContext';
import { mockTeachers } from '@/data/mockData';
import { BookOpen, LogIn } from 'lucide-react';

export default function TeacherLoginPage() {
  const { setCurrentTeacher } = useTeacher();
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickSelect = (teacher: typeof mockTeachers[0]) => {
    setCurrentTeacher(teacher);
    window.location.href = '/teacher/dashboard';
  };

  const handleIdSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const teacher = mockTeachers.find((t) => t.id === teacherId);
      if (!teacher) {
        setError('Teacher ID not found. Please try again.');
        setLoading(false);
        return;
      }

      setCurrentTeacher(teacher);
      window.location.href = '/teacher/dashboard';
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen size={40} className="text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-800">byThursday</h1>
        </div>
        <p className="text-gray-600 text-lg">Teacher Dashboard</p>
        <p className="text-gray-500 text-sm mt-2">Nour Tutoring Centre - Amman</p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        {/* Teacher List */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Select Teacher
          </h2>
          <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
            {mockTeachers.map((teacher) => (
              <button
                key={teacher.id}
                onClick={() => handleQuickSelect(teacher)}
                className="w-full text-left p-3 rounded-lg hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-200"
              >
                <p className="font-medium text-gray-800">{teacher.name}</p>
                <p className="text-xs text-gray-500">{teacher.id}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Classes: {teacher.assignedClasses.join(', ')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Manual ID Search */}
        <form onSubmit={handleIdSearch} className="space-y-4">
          <div>
            <label htmlFor="teacherId" className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Teacher ID
            </label>
            <input
              id="teacherId"
              type="text"
              placeholder="e.g., teacher_001"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <p className="text-gray-600 text-xs mt-8 max-w-md text-center">
        This is a demo platform. Select a teacher to access the dashboard and manage quizzes.
      </p>
    </div>
  );
}
