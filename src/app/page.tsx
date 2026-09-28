/**
 * Login/User Selection Page - Select or enter student ID
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudent } from "@/context/StudentContext";
import { mockStudents } from "@/data/mockData";
import { BookOpen, LogIn } from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentStudent } = useStudent();
  const [selectedClass, setSelectedClass] = useState<"10A" | "10B" | "11A">(
    "10A",
  );
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const classStudents = mockStudents.filter(
    (s) => s.classCode === selectedClass,
  );

  const handleQuickSelect = (studentId: string) => {
    const student = mockStudents.find((s) => s.id === studentId);
    if (student) {
      setCurrentStudent(student);
      router.push("/quizzes");
    }
  };

  const handleIdSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const student = mockStudents.find((s) => s.id === studentId);
      if (!student) {
        setError("Student ID not found. Please try again.");
        setLoading(false);
        return;
      }

      setCurrentStudent(student);
      router.push("/quizzes");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-50 px-4 pt-24 pb-4 min-h-screen">
      <div className="top-0 z-50 fixed inset-x-0">
        <LMSHeader role="student" />
      </div>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <BookOpen size={40} className="text-indigo-600" />
          <h1 className="font-bold text-slate-900 text-4xl tracking-tight">
            Welcome back
          </h1>
        </div>
        <p className="text-slate-600 text-lg">
          Your next learning milestone starts here.
        </p>
        <p className="mt-2 text-slate-500 text-sm">
          Choose your class to continue
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)] p-6 border border-slate-200 rounded-2xl w-full max-w-md">
        {/* Class Selector */}
        <div className="mb-6">
          <h2 className="mb-3 font-semibold text-gray-700 text-sm">
            Select Your Class
          </h2>
          <div className="gap-2 grid grid-cols-3">
            {(["10A", "10B", "11A"] as const).map((classCode) => (
              <button
                key={classCode}
                onClick={() => {
                  setSelectedClass(classCode);
                  setStudentId("");
                  setError("");
                }}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  selectedClass === classCode
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {classCode}
              </button>
            ))}
          </div>
        </div>

        {/* Student List */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-gray-700 text-sm">
            Students in {selectedClass} ({classStudents.length})
          </h3>
          <div className="space-y-2 bg-gray-50 p-3 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {classStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => handleQuickSelect(student.id)}
                className="hover:bg-indigo-50 p-3 border border-transparent hover:border-indigo-200 rounded-lg w-full text-left transition-colors"
              >
                <p className="font-medium text-gray-800">{student.name}</p>
                <p className="text-gray-500 text-xs">{student.id}</p>
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
              htmlFor="studentId"
              className="block mb-2 font-semibold text-gray-700 text-sm"
            >
              Enter Student ID
            </label>
            <input
              id="studentId"
              type="text"
              placeholder="e.g., student_001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
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
        This is a demo platform. Select a student to access available quizzes
        for your class.
      </p>
    </div>
  );
}
