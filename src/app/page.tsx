/**
 * Login/User Selection Page - Select or enter student ID
 */

'use client';

import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { mockStudents } from '@/data/mockData';
import { BookOpen, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { setCurrentStudent } = useStudent();
  const [selectedClass, setSelectedClass] = useState<'10A' | '10B' | '11A'>('10A');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const classStudents = mockStudents.filter((s) => s.classCode === selectedClass);

  const handleQuickSelect = (studentId: string) => {
    const student = mockStudents.find((s) => s.id === studentId);
    if (student) {
      setCurrentStudent(student);
      window.location.href = '/quizzes';
    }
  };

  const handleIdSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const student = mockStudents.find((s) => s.id === studentId);
      if (!student) {
        setError('Student ID not found. Please try again.');
        setLoading(false);
        return;
      }

      setCurrentStudent(student);
      window.location.href = '/quizzes';
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen size={40} className="text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-800">byThursday</h1>
        </div>
        <p className="text-gray-600 text-lg">Quiz Assessment Platform</p>
        <p className="text-gray-500 text-sm mt-2">Nour Tutoring Centre - Amman</p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        {/* Class Selector */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Your Class</h2>
          <div className="grid grid-cols-3 gap-2">
            {(['10A', '10B', '11A'] as const).map((classCode) => (
              <button
                key={classCode}
                onClick={() => {
                  setSelectedClass(classCode);
                  setStudentId('');
                  setError('');
                }}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  selectedClass === classCode
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {classCode}
              </button>
            ))}
          </div>
        </div>

        {/* Student List */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Students in {selectedClass} ({classStudents.length})
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
            {classStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => handleQuickSelect(student.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-200"
              >
                <p className="font-medium text-gray-800">{student.name}</p>
                <p className="text-xs text-gray-500">{student.id}</p>
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
            <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Student ID
            </label>
            <input
              id="studentId"
              type="text"
              placeholder="e.g., student_001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
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
        This is a demo platform. Select a student to access available quizzes for your class.
      </p>
    </div>
  );
}
