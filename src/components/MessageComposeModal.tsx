"use client";

import React, { useState } from "react";
import { X, Send, Users, User, CheckCircle2 } from "lucide-react";
import { useCommunication } from "@/context/CommunicationContext";
import { mockData } from "@/data/mockData";
import { ClassCode } from "@/types/user";
import { MessagePriority } from "@/types/communication";

interface MessageComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  teacherName: string;
  defaultRecipientType?: "student" | "class";
  defaultRecipientId?: string;
  assignedClasses?: ClassCode[];
}

export function MessageComposeModal({
  isOpen,
  onClose,
  teacherId,
  teacherName,
  defaultRecipientType = "class",
  defaultRecipientId = "10A",
  assignedClasses = ["10A", "10B", "11A"],
}: MessageComposeModalProps) {
  const { sendMessage } = useCommunication();

  const [recipientType, setRecipientType] = useState<"student" | "class">(defaultRecipientType);
  const [selectedClass, setSelectedClass] = useState<ClassCode>((defaultRecipientId as ClassCode) || "10A");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    defaultRecipientType === "student" ? defaultRecipientId : "student_001"
  );
  const [priority, setPriority] = useState<MessagePriority>("normal");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter students based on teacher's classes
  const availableStudents = mockData.students.filter(
    (s) => assignedClasses.length === 0 || assignedClasses.includes(s.classCode)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    let recipientId = "";
    let recipientName = "";

    if (recipientType === "class") {
      recipientId = selectedClass;
      recipientName = `Class ${selectedClass} (الصف ${selectedClass})`;
    } else {
      const student = mockData.students.find((s) => s.id === selectedStudentId);
      recipientId = selectedStudentId;
      recipientName = student ? `${student.name} (${student.id})` : selectedStudentId;
    }

    sendMessage({
      teacherId,
      teacherName,
      recipientType,
      recipientId,
      recipientName,
      subject: subject.trim(),
      content: content.trim(),
      priority,
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setSubject("");
      setContent("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
              <Send size={18} />
            </span>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                Send Message / إرسال رسالة توجيهية
              </h3>
              <p className="text-xs text-indigo-100">
                From: {teacherName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/80 hover:bg-white/20 transition"
          >
            <X size={18} />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-10 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={36} />
            </span>
            <h4 className="mt-4 font-bold text-slate-900 text-xl">
              Message Delivered! / تم إرسال الرسالة بنجاح
            </h4>
            <p className="mt-2 text-slate-500 text-sm">
              The student(s) will receive an instant notification in their learning portal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Recipient Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Recipient Type / نوع المستلم
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRecipientType("class")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition ${
                    recipientType === "class"
                      ? "border-indigo-600 bg-indigo-50/80 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Users size={17} /> Entire Class / الصف بأكمله
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientType("student")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition ${
                    recipientType === "student"
                      ? "border-indigo-600 bg-indigo-50/80 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <User size={17} /> Individual Student / طالب محدد
                </button>
              </div>
            </div>

            {/* Recipient Dropdown */}
            {recipientType === "class" ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Class / اختر الصف
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value as ClassCode)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium focus:border-indigo-500 focus:outline-none"
                >
                  {assignedClasses.map((code) => (
                    <option key={code} value={code}>
                      Class {code} · الصف {code}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Student / اختر الطالب
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium focus:border-indigo-500 focus:outline-none"
                >
                  {availableStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id}) · Class {s.classCode}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Priority / درجة الأهمية
              </label>
              <div className="flex gap-2">
                {[
                  { id: "normal", label: "Normal (عادية)", tone: "hover:bg-slate-50 border-slate-200 text-slate-700" },
                  { id: "important", label: "Important (هامة)", tone: "hover:bg-amber-50 border-amber-200 text-amber-800" },
                  { id: "urgent", label: "Urgent (عاجلة)", tone: "hover:bg-rose-50 border-rose-200 text-rose-800" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPriority(id as MessagePriority)}
                    className={`flex-1 rounded-xl border py-2 px-3 text-xs font-bold transition ${
                      priority === id
                        ? id === "urgent"
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : id === "important"
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Subject / عنوان الرسالة *
              </label>
              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Exam window reminder / تذكير بنافذة الاختبار"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Message Content / نص الرسالة *
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your guidance, instructions, or exam tips here..."
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel / إلغاء
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition"
              >
                <Send size={16} /> Send Message / إرسال
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
