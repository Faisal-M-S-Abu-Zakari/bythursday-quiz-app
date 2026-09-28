import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  Clock3,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { LMSHeader } from "@/components/LMSHeader";

const features = [
  {
    icon: Clock3,
    title: "Timed tests",
    subtitle: "Focused assessments, wherever you learn.",
  },
  {
    icon: ShieldAlert,
    title: "Clear scoring",
    subtitle: "Know the marking rules before you begin.",
  },
  {
    icon: BookOpenCheck,
    title: "Mobile-first",
    subtitle: "A calm, easy-to-use learning experience.",
  },
  {
    icon: BarChart3,
    title: "Instant analytics",
    subtitle: "Understand progress as soon as you finish.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-slate-50 min-h-screen overflow-hidden">
      <LMSHeader />
      <section className="isolate relative">
        <div className="top-0 -z-10 absolute inset-x-0 bg-gradient-to-br from-indigo-950 via-indigo-800 to-blue-600 h-[34rem]" />
        <div className="top-24 -right-20 -z-10 absolute bg-blue-400/20 blur-3xl rounded-full w-72 h-72" />
        <div className="items-center gap-12 grid lg:grid-cols-[1.1fr_0.9fr] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24 lg:pb-32 max-w-7xl">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 border border-white/20 rounded-full font-medium text-indigo-100 text-sm">
              <Sparkles size={16} /> A smarter way to learn
            </span>
            <h1
              className="mt-7 max-w-2xl font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight"
              lang="ar"
              dir="rtl"
            >
              مركز عمّان التعليمي{" "}
              <span className="block mt-2 text-blue-200">
                منصة التقييم الذكية
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-indigo-100 text-base sm:text-lg leading-8">
              A supportive space for students, educators, and families to make
              every learning milestone count.
            </p>
            <div className="flex sm:flex-row flex-col gap-3 mt-8">
              <Link
                href="/login"
                className="inline-flex justify-center items-center gap-2 bg-white hover:bg-blue-50 shadow-lg px-6 rounded-xl min-h-12 font-bold text-indigo-800 transition"
              >
                Get started / تسجيل الدخول <ArrowUpRight size={18} />
              </Link>
              <a
                href="#features"
                className="inline-flex justify-center items-center hover:bg-white/10 px-6 border border-white/30 rounded-xl min-h-12 font-semibold text-white transition"
              >
                Explore the platform
              </a>
            </div>
          </div>
          <div className="relative bg-white/95 shadow-2xl shadow-indigo-950/20 backdrop-blur mx-auto p-5 sm:p-7 border border-white/50 rounded-3xl w-full max-w-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-indigo-600 text-sm">
                  LEARNING OVERVIEW
                </p>
                <p className="mt-1 font-bold text-slate-900 text-xl">
                  Progress, made clear
                </p>
              </div>
              <span className="place-items-center grid bg-indigo-50 rounded-2xl w-12 h-12 text-indigo-700">
                <BarChart3 size={23} />
              </span>
            </div>
            <div className="bg-slate-50 mt-7 p-5 rounded-2xl">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-slate-800">Weekly progress</p>
                <span className="bg-emerald-100 px-3 py-1 rounded-full font-bold text-emerald-700 text-xs">
                  +12%
                </span>
              </div>
              <div className="flex items-end gap-3 mt-5 h-32">
                {[40, 65, 52, 83, 62, 95, 74].map((height, index) => (
                  <span
                    key={index}
                    className={`flex-1 rounded-t-lg ${index === 5 ? "bg-indigo-600" : "bg-indigo-200"}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-slate-400 text-xs">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <div className="gap-3 grid grid-cols-2 mt-4">
              <div className="p-4 border border-slate-100 rounded-2xl">
                <p className="text-slate-500 text-xs">Assessments</p>
                <p className="mt-1 font-bold text-slate-900 text-xl">
                  On track
                </p>
              </div>
              <div className="p-4 border border-slate-100 rounded-2xl">
                <p className="text-slate-500 text-xs">Learning goal</p>
                <p className="mt-1 font-bold text-emerald-600 text-xl">
                  Achieved ✓
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="mx-auto -mt-10 px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl"
      >
        <div className="mb-7 text-center">
          <p className="font-bold text-indigo-600 text-sm uppercase tracking-widest">
            Everything in one place
          </p>
          <h2 className="mt-2 font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight">
            Built around better learning
          </h2>
        </div>
        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, subtitle }) => (
            <article
              key={title}
              className="bg-white shadow-sm hover:shadow-md p-5 border border-slate-200/80 rounded-2xl transition hover:-translate-y-1"
            >
              <span className="place-items-center grid bg-indigo-50 rounded-xl w-11 h-11 text-indigo-700">
                <Icon size={21} />
              </span>
              <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-slate-500 text-sm leading-6">
                {subtitle}
              </p>
            </article>
          ))}
        </div>
        <p
          className="mt-10 text-slate-500 text-sm text-center"
          lang="ar"
          dir="rtl"
        >
          نتعلم اليوم لنحقق إنجازات أكبر غداً.
        </p>
      </section>
    </main>
  );
}
