"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  Repeat,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { mockTeachers, mockAdmin, mockStudents } from "@/data/mockData";
import { getDashboardPath } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const { setUser } = useAuth();

  // Interactive Live Scoring Test-Drive widget state
  const [demoSelectedOption, setDemoSelectedOption] = useState<number | null>(null);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Fast demo account login helper
  const handleQuickLogin = (role: "student" | "teacher" | "admin") => {
    if (role === "student") {
      const student = mockStudents.find((s) => s.id === "student_001") || mockStudents[0];
      setUser(student);
      router.push(getDashboardPath(student));
    } else if (role === "teacher") {
      const teacher = mockTeachers[0];
      setUser(teacher);
      router.push(getDashboardPath(teacher));
    } else {
      setUser(mockAdmin);
      router.push(getDashboardPath(mockAdmin));
    }
  };

  const sampleQuestion = {
    title: "Arabic Literature Sample / نموذج اختبار الأدب",
    text: "ما هو البحر الشعري الذي نظمت عليه أشهر المعلقات العربية كمعلقة امرئ القيس وطرفة بن العبد؟",
    options: [
      { text: "بحر الطويل (Tawil Metre)", isCorrect: true, points: 5 },
      { text: "بحر الرجز (Rajaz Metre)", isCorrect: false, points: -1 },
      { text: "بحر المتدارك (Mutadarik Metre)", isCorrect: false, points: -1 },
      { text: "بحر الخفيف (Khafif Metre)", isCorrect: false, points: -1 },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <LMSHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-12 pb-24 text-white lg:pt-20 lg:pb-32">
        {/* Ambient Gradient Mesh Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(67,56,202,0.6),rgba(255,255,255,0))]" />
        <div className="absolute top-1/4 -right-20 -z-10 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 -left-20 -z-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Term 1 Examinations · Same-Day Windows Active (08:00 – 20:00)</span>
              </div>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15]">
                Empowering Amman&apos;s Scholars Through{" "}
                <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-teal-200 bg-clip-text text-transparent">
                  Precision Assessment
                </span>
              </h1>

              <p
                className="mt-4 text-xl sm:text-2xl font-bold text-indigo-200 leading-snug"
                lang="ar"
                dir="rtl"
              >
                مركز عمّان التعليمي | منظومة التقييم الأكاديمي والتعليم الذكي
              </p>

              <p className="mt-5 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                A disciplined educational platform designed for Nour Tutoring Centre. Features controlled same-day exam windows (~12h), configurable attempt limits (1–3 attempts), transparent negative marking safeguards, and direct faculty guidance.
              </p>

              {/* Portal Access Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-600/40 transition duration-150"
                >
                  <span>Student & Teacher Login</span>
                  <ArrowRight size={17} />
                </Link>

                <a
                  href="#test-drive"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 backdrop-blur-sm transition"
                >
                  <span>Try Scoring Engine</span>
                  <Sparkles size={16} className="text-amber-300" />
                </a>
              </div>

              {/* Quick Demo 1-Click Launchers */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Quick Demo Access (1-Click Tester) · تجربة المنصة بضغطة زر
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("student")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-700/80 hover:border-indigo-500 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
                  >
                    <GraduationCap size={14} className="text-blue-400" />
                    <span>Student: محمد (10A)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("teacher")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-700/80 hover:border-indigo-500 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
                  >
                    <Users size={14} className="text-emerald-400" />
                    <span>Teacher: أ.د محمود علي</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-700/80 hover:border-indigo-500 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
                  >
                    <Award size={14} className="text-amber-400" />
                    <span>Admin: نور (Center Manager)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Interactive Live Radar Card */}
            <div className="relative">
              <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                {/* Header of radar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                      <Clock size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        Live Exam Window Tracker
                      </p>
                      <h3 className="text-sm font-bold text-white">Amman Centre Active Radar</h3>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Same-Day Active
                  </span>
                </div>

                {/* Active Exam Card in Preview */}
                <div className="mt-4 rounded-2xl bg-slate-950/60 p-4 border border-slate-800/90">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/70 border border-indigo-800/60 px-2 py-0.5 rounded-md">
                        Class 10A · الصف العاشر أ
                      </span>
                      <h4 className="mt-2 font-bold text-white text-base">
                        أدب الجاهلية - اختبار شامل
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Supervised by: أ.د محمود علي
                      </p>
                    </div>
                    <span className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-300 border border-indigo-500/20">
                      <BookOpen size={20} />
                    </span>
                  </div>

                  {/* Window metrics */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Window Hours</span>
                      <span className="font-bold text-slate-200">08:00 – 20:00</span>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Attempt Limit</span>
                      <span className="font-bold text-amber-400">2 Attempts</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded-xl bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Negative Mark</span>
                      <span className="font-bold text-rose-400">−1 penalty</span>
                    </div>
                  </div>
                </div>

                {/* Direct Teacher Guidance Preview */}
                <div className="mt-4 rounded-2xl bg-indigo-950/40 p-3.5 border border-indigo-900/60">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-indigo-400 shrink-0" />
                    <span className="text-xs font-bold text-indigo-300">
                      Teacher Message to Class 10A:
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    &quot;أعزائي الطلبة، نافذة الاختبار متاحة اليوم حتى الساعة 20:00. تذكروا أن لديكم محاولتين لاحتساب العلامة الأعلى، والخصم السالب مفعل.&quot;
                  </p>
                </div>

                {/* Bottom Trust Row */}
                <div className="mt-5 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Anti-Guessing Engine</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Repeat size={14} className="text-indigo-400" />
                    <span>Auto-Retake Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-widest">
              Platform Architecture
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Four Pillars of Academic Excellence
            </h2>
            <p className="mt-3 text-slate-600 text-base leading-relaxed">
              Designed specifically around the rigors of high school and secondary education at the Nour tutoring center in Amman.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                title: "Strict ~12h Exam Windows",
                titleAr: "نوافذ امتحانية محكمة (12 ساعة)",
                desc: "Assessments open at scheduled start times and close strictly on the same day. Builds genuine exam readiness.",
                color: "bg-blue-50 text-blue-700 border-blue-100",
              },
              {
                icon: Repeat,
                title: "1–3 Configurable Attempts",
                titleAr: "تحديد دقيق للمحاولات (1-3)",
                desc: "Teachers choose strict single submission, 2-attempt retake, or 3-attempt diagnostic practice with best score kept.",
                color: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                icon: ShieldAlert,
                title: "Fair Negative Marking",
                titleAr: "نظام خصم العلامات العادل",
                desc: "Discourages blind guessing with customizable penalty deduction and zero-flooring guarantee (never negative).",
                color: "bg-amber-50 text-amber-700 border-amber-100",
              },
              {
                icon: Mail,
                title: "Direct Teacher Guidance",
                titleAr: "تواصل مباشر وإشعارات فورية",
                desc: "Teachers broadcast exam reminders to whole classes or individual students with instant inbox notification alerts.",
                color: "bg-indigo-50 text-indigo-700 border-indigo-100",
              },
            ].map(({ icon: Icon, title, titleAr, desc, color }) => (
              <article
                key={title}
                className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl border ${color} mb-5`}>
                  <Icon size={24} />
                </span>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">
                  {title}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5" lang="ar">
                  {titleAr}
                </p>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  {desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Scoring Engine Test-Drive Widget */}
      <section id="test-drive" className="py-20 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-6 sm:p-10 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800">
                  <Sparkles size={13} /> Interactive Simulator / تجربة حية
                </span>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Test the Negative Marking Scoring Engine
                </h2>
                <p className="mt-1 text-slate-500 text-xs sm:text-sm">
                  Click an option below to test instant score calculation and error penalty deduction:
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-xs text-right">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Rule Scheme</span>
                <span className="text-xs font-bold text-emerald-700 block">+5 Correct</span>
                <span className="text-xs font-bold text-rose-700 block">−1 Wrong penalty</span>
              </div>
            </div>

            {/* The Question */}
            <div className="mt-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                {sampleQuestion.title}
              </span>
              <h3 className="mt-2 text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                {sampleQuestion.text}
              </h3>

              {/* Options */}
              <div className="mt-5 space-y-3">
                {sampleQuestion.options.map((option, idx) => {
                  const isSelected = demoSelectedOption === idx;
                  const isCorrect = option.isCorrect;

                  let optionStyle = "border-slate-200 bg-white hover:border-indigo-300";
                  if (demoSubmitted && isSelected) {
                    optionStyle = isCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20"
                      : "border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20";
                  } else if (demoSubmitted && isCorrect) {
                    optionStyle = "border-emerald-400 bg-emerald-50/70 text-emerald-950";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDemoSelectedOption(idx);
                        setDemoSubmitted(true);
                      }}
                      className={`w-full rounded-2xl border p-4 text-left font-medium text-sm transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <span className="font-semibold text-slate-900">{option.text}</span>
                      {demoSubmitted && isSelected && (
                        <span className="shrink-0 flex items-center gap-1 font-bold text-xs">
                          {isCorrect ? (
                            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                              <CheckCircle2 size={14} /> Correct (+5 pts)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                              <XCircle size={14} /> Deducted (−1 pt penalty)
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Simulation Result feedback */}
              {demoSubmitted && demoSelectedOption !== null && (
                <div className="mt-6 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                        sampleQuestion.options[demoSelectedOption].isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {sampleQuestion.options[demoSelectedOption].isCorrect ? (
                        <CheckCircle2 size={26} />
                      ) : (
                        <ShieldAlert size={26} />
                      )}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {sampleQuestion.options[demoSelectedOption].isCorrect
                          ? "Mastery Demonstrated! / إجابة صحيحة نموذجية"
                          : "Negative Marking Triggered / تطبيق خصم العلامة السالبة"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {sampleQuestion.options[demoSelectedOption].isCorrect
                          ? "Points: +5 earned. No deduction applied."
                          : "Score reduced by 1 point for incorrect attempt, zero-floored."}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDemoSelectedOption(null);
                      setDemoSubmitted(false);
                    }}
                    className="shrink-0 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition"
                  >
                    Reset Simulator
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Class Curriculum Tracks */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-widest">
              Curriculum Tracks
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Classes & Active Assessment Streams
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Classes 10A, 10B, and 11A with tailored subjects, teachers, and student cohorts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                classCode: "10A",
                name: "Class 10A (العاشر أ)",
                studentsCount: "22 Scholars",
                teachers: ["أ.د محمود علي", "أ.د فاطمة إسماعيل"],
                subjectFocus: "Arabic Literature & Grammar",
                activeExam: "أدب الجاهلية - اختبار شامل",
                examWindow: "Same-Day (08:00 – 20:00)",
                attempts: "2 Attempts Permitted",
                tone: "border-indigo-200 bg-white",
              },
              {
                classCode: "10B",
                name: "Class 10B (العاشر ب)",
                studentsCount: "19 Scholars",
                teachers: ["أ.د محمود علي", "أ.د خالد محمد"],
                subjectFocus: "English Grammar & Structural Syntax",
                activeExam: "English Grammar Fundamentals",
                examWindow: "Same-Day (09:00 – 21:00)",
                attempts: "3 Attempts Permitted",
                tone: "border-blue-200 bg-white",
              },
              {
                classCode: "11A",
                name: "Class 11A (الحادي عشر أ)",
                studentsCount: "21 Scholars",
                teachers: ["أ.د فاطمة إسماعيل", "أ.د ليلى أحمد", "أ.د خالد محمد"],
                subjectFocus: "Advanced Physics & Sciences",
                activeExam: "الفيزياء والعلوم العامة (Mechanical Energy)",
                examWindow: "Scheduled Tomorrow (08:00 – 20:00)",
                attempts: "1 Strict Attempt",
                tone: "border-emerald-200 bg-white",
              },
            ].map((track) => (
              <div
                key={track.classCode}
                className={`rounded-3xl border ${track.tone} p-6 sm:p-7 shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1 font-bold text-xs text-indigo-700">
                      {track.classCode} Cohort
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {track.studentsCount}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xl">{track.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    {track.subjectFocus}
                  </p>

                  <div className="mt-5 space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-indigo-600 shrink-0" />
                      <span>Faculty: {track.teachers.join(" · ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-indigo-600 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {track.activeExam}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-emerald-600 shrink-0" />
                      <span>{track.examWindow}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Repeat size={14} className="text-amber-600 shrink-0" />
                      <span className="font-semibold text-amber-800">
                        {track.attempts}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-slate-100">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition w-full shadow-xs"
                  >
                    <span>View Class Assessments</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Esteemed Faculty Spotlight */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-widest">
              Distinguished Faculty
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Guided by Jordan&apos;s Leading Educators
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Our faculty members directly author assessment questions, configure same-day windows, and provide individual student messaging.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockTeachers.map((t) => (
              <div
                key={t.id}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-xs hover:shadow-md transition text-center flex flex-col justify-between"
              >
                <div>
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-700 to-blue-600 font-extrabold text-white text-xl shadow-md shadow-indigo-100 mb-4">
                    {t.name.split(" ")[1]?.charAt(0) || "أ"}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {t.subjects.join(" & ")}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Classes: {t.assignedClasses.map((c) => `Class ${c}`).join(", ")}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/70 text-[11px] text-slate-400">
                  <span>Tutoring Centre Staff · عمان، الأردن</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer & Accreditation */}
      <footer className="bg-slate-950 text-white pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-4">
              <BrandLogo variant="white" size="md" href="/" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Mobile-first, production-ready assessment and learning platform for Nour Tutoring Centre in Amman, Jordan.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Assessment System
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Same-Day Windows (~12 Hours)</li>
                <li>Attempt Limits (1 to 3 Attempts)</li>
                <li>Negative Marking Safeguards</li>
                <li>Immediate Score Breakdown</li>
                <li>Teacher-to-Student Messaging</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Portal Access
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/login" className="hover:text-white transition">Student Portal (student_001)</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Teacher Portal (mahmoud.ali)</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Admin Panel (nour)</Link></li>
                <li><Link href="/quizzes" className="hover:text-white transition">Class Quizzes</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Location & Support
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Amman, Jordan<br />
                Nour Tutoring Centre<br />
                support@nourtutor.jo<br />
                +962 7 9123 4567
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>&copy; {new Date().getFullYear()} Amman Tutoring Centre (byThursday). All rights reserved.</p>
            <p className="text-indigo-400">Amman, Jordan · مركز عمّان التعليمي</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
