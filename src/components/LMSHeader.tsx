"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, BookOpen, LogOut, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPath } from "@/lib/auth";

interface LMSHeaderProps {
  role?: "student" | "teacher" | "admin" | "nour";
  name?: string;
  detail?: string;
  onLogout?: () => void;
}

export function LMSHeader({ name, detail, onLogout }: LMSHeaderProps) {
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState<"notifications" | "messages" | null>(
    null,
  );
  const activeName = name ?? user?.name;
  const activeDetail =
    detail ??
    (user?.role === "student"
      ? `Class ${user.classCode}`
      : user?.role === "teacher"
        ? user.subjects.join(" · ")
        : user?.role === "admin"
          ? "Platform administrator"
          : "");

  const handleLogout = () => {
    logout();
    onLogout?.();
    window.location.assign("/login");
  };

  return (
    <header className="lms-topbar">
      <div className="flex justify-between items-center gap-3 mx-auto px-4 sm:px-6 py-3 max-w-7xl">
        <Link
          href={user ? getDashboardPath(user) : "/"}
          className="flex items-center gap-3 min-w-0"
        >
          <span className="place-items-center grid bg-gradient-to-br from-indigo-700 to-blue-600 shadow-indigo-200 shadow-md rounded-2xl w-11 h-11 text-white shrink-0">
            <BookOpen size={22} strokeWidth={2.3} />
          </span>
          <span className="min-w-0">
            <span className="block font-bold text-slate-900 text-sm sm:text-base truncate tracking-tight">
              Amman Learning Centre
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

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() =>
                setOpenMenu(
                  openMenu === "notifications" ? null : "notifications",
                )
              }
              className="relative place-items-center grid hover:bg-indigo-50 rounded-xl w-11 h-11 text-slate-600 hover:text-indigo-700 transition"
            >
              <Bell size={19} />
              <span className="top-2 right-2 absolute bg-rose-500 rounded-full ring-2 ring-white w-2 h-2" />
            </button>
            {openMenu === "notifications" && (
              <div className="right-0 z-50 absolute bg-white shadow-xl mt-2 p-4 border border-slate-200 rounded-2xl w-72 text-left">
                <p className="font-bold text-slate-900">
                  Notifications{" "}
                  <span className="text-slate-400" lang="ar">
                    · الإشعارات
                  </span>
                </p>
                <p className="bg-amber-50 mt-3 p-3 rounded-xl text-amber-800 text-sm">
                  A new assessment is ready to review.
                </p>
                <p className="mt-2 text-slate-500 text-xs">Today · 9:30 AM</p>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="Messages"
              onClick={() =>
                setOpenMenu(openMenu === "messages" ? null : "messages")
              }
              className="place-items-center grid hover:bg-indigo-50 rounded-xl w-11 h-11 text-slate-600 hover:text-indigo-700 transition"
            >
              <Mail size={19} />
            </button>
            {openMenu === "messages" && (
              <div className="right-0 z-50 absolute bg-white shadow-xl mt-2 p-4 border border-slate-200 rounded-2xl w-72 text-left">
                <p className="font-bold text-slate-900">
                  Messages{" "}
                  <span className="text-slate-400" lang="ar">
                    · الرسائل
                  </span>
                </p>
                <p className="bg-indigo-50 mt-3 p-3 rounded-xl text-indigo-800 text-sm">
                  Welcome! Your learning team is here to help.
                </p>
                <p className="mt-2 text-slate-500 text-xs">
                  Academic support · Today
                </p>
              </div>
            )}
          </div>
          {activeName ? (
            <>
              <div className="hidden sm:block text-right">
                <p className="max-w-40 font-semibold text-slate-800 text-sm truncate">
                  {activeName}
                </p>
                <p className="max-w-48 text-slate-500 text-xs truncate">
                  {activeDetail}
                </p>
              </div>
              <span className="place-items-center grid bg-indigo-100 rounded-full ring-2 ring-white w-10 h-10 font-bold text-indigo-700 text-sm">
                {activeName.trim().charAt(0)}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 hover:bg-rose-50 px-2 sm:px-3 rounded-xl min-h-11 font-semibold text-slate-600 hover:text-rose-600 text-xs transition"
              >
                <LogOut size={17} />
                <span className="hidden sm:inline">Logout / تسجيل خروج</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 rounded-xl min-h-11 font-semibold text-white text-sm transition"
            >
              Sign in / تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
