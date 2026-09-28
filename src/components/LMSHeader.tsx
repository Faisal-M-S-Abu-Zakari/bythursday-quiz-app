"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";

interface LMSHeaderProps {
  role: "student" | "teacher" | "nour";
  name?: string;
  detail?: string;
  onLogout?: () => void;
}

const roles = [
  { id: "student", label: "Student", href: "/", icon: GraduationCap },
  {
    id: "teacher",
    label: "Teacher",
    href: "/teacher/login",
    icon: LayoutDashboard,
  },
  { id: "nour", label: "Nour", href: "/teacher/login", icon: Sparkles },
] as const;

export function LMSHeader({ role, name, detail, onLogout }: LMSHeaderProps) {
  return (
    <header className="lms-topbar">
      <div className="flex justify-between items-center gap-4 mx-auto px-4 sm:px-6 py-3 max-w-7xl">
        <Link
          href={role === "student" ? "/quizzes" : "/teacher/dashboard"}
          className="flex items-center gap-3 min-w-0"
        >
          <span className="place-items-center grid bg-indigo-600 shadow-indigo-200 shadow-lg rounded-2xl w-11 h-11 text-white shrink-0">
            <BookOpen size={22} strokeWidth={2.3} />
          </span>
          <span className="min-w-0">
            <span className="block font-bold text-slate-900 text-sm sm:text-base truncate tracking-tight">
              Amman Tutoring Centre
            </span>
            <span
              className="block font-medium text-slate-500 text-xs truncate"
              lang="ar"
              dir="rtl"
            >
              مركز عمّان التعليمي
            </span>
          </span>
        </Link>

        <nav
          aria-label="Switch role"
          className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl"
        >
          {roles.map(({ id, label, href, icon: Icon }) => (
            <Link
              key={id}
              href={href}
              aria-current={id === role ? "page" : undefined}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                id === role
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {name && (
            <div className="hidden sm:block text-right">
              <p className="font-semibold text-slate-800 text-sm">{name}</p>
              {detail && <p className="text-slate-500 text-xs">{detail}</p>}
            </div>
          )}
          {name && (
            <span className="place-items-center grid bg-indigo-100 rounded-full ring-2 ring-white w-10 h-10 font-bold text-indigo-700 text-sm">
              {name.trim().charAt(0)}
            </span>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              aria-label="Log out"
              className="place-items-center grid hover:bg-rose-50 rounded-xl w-10 h-10 text-slate-500 hover:text-rose-600 transition"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
      <nav
        aria-label="Switch role"
        className="sm:hidden flex justify-center gap-2 px-4 py-2 border-slate-100 border-t"
      >
        {roles.map(({ id, label, href, icon: Icon }) => (
          <Link
            key={id}
            href={href}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${id === role ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
          >
            <Icon size={13} /> {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
