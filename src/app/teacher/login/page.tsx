/**
 * Teacher Login Page - Select or search for teacher account
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeacher } from "@/context/TeacherContext";
import { mockTeachers } from "@/data/mockData";
import { BookOpen, LogIn } from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";

export default function TeacherLoginPage() {
  const router = useRouter();
  const { setCurrentTeacher } = useTeacher();
  const [teacherId, setTeacherId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuickSelect = (teacher: (typeof mockTeachers)[0]) => {
    setCurrentTeacher(teacher);
    router.push("/teacher/dashboard");
  };

  const handleIdSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const teacher = mockTeachers.find((t) => t.id === teacherId);
      if (!teacher) {
        setError("Teacher ID not found. Please try again.");
        setLoading(false);
        return;
      }

      setCurrentTeacher(teacher);
      router.push("/teacher/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-50 px-4 pt-24 pb-4 min-h-screen">
      <div className="top-0 z-50 fixed inset-x-0">
        <LMSHeader role="teacher" />
      </div>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <BookOpen size={40} className="text-indigo-600" />
          <h1 className="font-bold text-slate-900 text-4xl tracking-tight">
            Welcome, educator
          </h1>
        </div>
        <p className="text-slate-600 text-lg">
          Insights to help every learner thrive.
        </p>
        <p className="mt-2 text-slate-500 text-sm">
          Choose your educator account to continue
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)] p-6 border border-slate-200 rounded-2xl w-full max-w-md">
        {/* Teacher List */}
        <div className="mb-6">
          <h2 className="mb-3 font-semibold text-gray-700 text-sm">
            Select Teacher
          </h2>
          <div className="space-y-2 bg-gray-50 p-3 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {mockTeachers.map((teacher) => (
              <button
                key={teacher.id}
                onClick={() => handleQuickSelect(teacher)}
                className="hover:bg-indigo-50 p-3 border border-transparent hover:border-indigo-200 rounded-lg w-full text-left transition-colors"
              >
                <p className="font-medium text-gray-800">{teacher.name}</p>
                <p className="text-gray-500 text-xs">{teacher.id}</p>
                <p className="mt-1 text-gray-600 text-xs">
                  Classes: {teacher.assignedClasses.join(", ")}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="border-gray-300 border-t w-full"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        {/* Manual ID Search */}
        <form onSubmit={handleIdSearch} className="space-y-4">
          <div>
            <label
              htmlFor="teacherId"
              className="block mb-2 font-semibold text-gray-700 text-sm"
            >
              Enter Teacher ID
            </label>
            <input
              id="teacherId"
              type="text"
              placeholder="e.g., teacher_001"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-lg focus:outline-none w-full transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 p-3 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 px-4 py-3 rounded-lg w-full font-semibold text-white transition-colors"
          >
            <LogIn size={20} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <p className="mt-8 max-w-md text-gray-600 text-xs text-center">
        This is a demo platform. Select a teacher to access the dashboard and
        manage quizzes.
      </p>
    </div>
  );
}
