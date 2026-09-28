"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Bell,
  BookOpen,
  LogOut,
  Mail,
  CheckCheck,
  Send,
  Calendar,
  X,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCommunication } from "@/context/CommunicationContext";
import { getDashboardPath } from "@/lib/auth";
import { MessageComposeModal } from "@/components/MessageComposeModal";
import { TeacherMessage } from "@/types/communication";

interface LMSHeaderProps {
  role?: "student" | "teacher" | "admin" | "nour";
  name?: string;
  detail?: string;
  onLogout?: () => void;
}

export function LMSHeader({ name, detail, onLogout }: LMSHeaderProps) {
  const { user, logout } = useAuth();
  const {
    getStudentNotifications,
    getStudentMessages,
    getTeacherSentMessages,
    getUnreadNotificationsCount,
    getUnreadMessagesCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    markMessageAsRead,
  } = useCommunication();

  const [openMenu, setOpenMenu] = useState<"notifications" | "messages" | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<TeacherMessage | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  const studentId = isStudent ? user.id : "";
  const studentClass = isStudent ? user.classCode : "";
  const teacherId = isTeacher ? user.id : "";

  const unreadNotifs = isStudent ? getUnreadNotificationsCount(studentId) : 0;
  const unreadMsgs = isStudent ? getUnreadMessagesCount(studentId, studentClass) : 0;

  const notifications = isStudent ? getStudentNotifications(studentId) : [];
  const studentMessages = isStudent ? getStudentMessages(studentId, studentClass) : [];
  const teacherSentMessages = isTeacher ? getTeacherSentMessages(teacherId) : [];

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeName = name ?? user?.name;
  const activeDetail =
    detail ??
    (isStudent
      ? `Class ${user.classCode} · الصف ${user.classCode}`
      : isTeacher
        ? user.subjects.join(" · ")
        : isAdmin
          ? "Center Administration · الإدارة"
          : "");

  const handleLogout = () => {
    logout();
    onLogout?.();
    window.location.assign("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo & Brand */}
          <Link
            href={user ? getDashboardPath(user) : "/"}
            className="flex items-center gap-3 min-w-0 group"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-200 transition group-hover:scale-105">
              <BookOpen size={22} strokeWidth={2.3} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                Amman Learning Centre
              </span>
              <span
                className="block truncate text-xs font-semibold text-indigo-600"
                lang="ar"
                dir="rtl"
              >
                مركز عمّان التعليمي
              </span>
            </span>
          </Link>

          {/* Right Actions & Menus */}
          <div ref={containerRef} className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Portal Switcher / Navigation if logged in */}
            {user && (
              <div className="hidden md:flex items-center gap-1.5 mr-2">
                <Link
                  href={getDashboardPath(user)}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>
                {isStudent && (
                  <Link
                    href="/quizzes"
                    className="rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition"
                  >
                    Quizzes
                  </Link>
                )}
                {(isTeacher || isAdmin) && (
                  <Link
                    href="/teacher/dashboard/create-quiz"
                    className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    + New Quiz
                  </Link>
                )}
              </div>
            )}

            {/* Notifications Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                onClick={() =>
                  setOpenMenu(openMenu === "notifications" ? null : "notifications")
                }
                className={`relative grid h-10 w-10 place-items-center rounded-xl transition ${
                  openMenu === "notifications"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700"
                }`}
              >
                <Bell size={19} />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {openMenu === "notifications" && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <p className="font-bold text-slate-900">
                        Notifications{" "}
                        <span className="text-slate-400 font-normal" lang="ar">
                          · الإشعارات
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {unreadNotifs > 0 ? `${unreadNotifs} new notification(s)` : "Up to date"}
                      </p>
                    </div>
                    {unreadNotifs > 0 && isStudent && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead(studentId)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 max-h-80 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        No notifications at the moment.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) {
                              setOpenMenu(null);
                              window.location.href = n.link;
                            }
                          }}
                          className={`group cursor-pointer rounded-xl p-3 transition ${
                            !n.isRead
                              ? "bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100/70"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs ${
                                n.type === "exam_window"
                                  ? "bg-amber-100 text-amber-700"
                                  : n.priority === "urgent"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {n.type === "exam_window" ? <Calendar size={14} /> : <Mail size={14} />}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                                {n.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-600 leading-snug line-clamp-2">
                                {n.message}
                              </p>
                              <p className="mt-1 text-[10px] text-slate-400">
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {!n.isRead && (
                              <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-label="Messages"
                onClick={() =>
                  setOpenMenu(openMenu === "messages" ? null : "messages")
                }
                className={`relative grid h-10 w-10 place-items-center rounded-xl transition ${
                  openMenu === "messages"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700"
                }`}
              >
                <Mail size={19} />
                {unreadMsgs > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadMsgs}
                  </span>
                )}
              </button>

              {openMenu === "messages" && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <p className="font-bold text-slate-900">
                        {isTeacher ? "Teacher Messaging" : "Teacher Messages"}{" "}
                        <span className="text-slate-400 font-normal" lang="ar">
                          · الرسائل
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {isTeacher
                          ? "Direct guidance & announcements"
                          : unreadMsgs > 0
                          ? `${unreadMsgs} unread message(s)`
                          : "All caught up"}
                      </p>
                    </div>
                    {isTeacher && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          setIsComposeOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition"
                      >
                        <Send size={13} /> Compose
                      </button>
                    )}
                  </div>

                  <div className="mt-3 max-h-80 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-50">
                    {isStudent ? (
                      studentMessages.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-sm">
                          No messages from your teachers yet.
                        </div>
                      ) : (
                        studentMessages.map((msg) => {
                          const isRead = msg.readByStudentIds.includes(studentId);
                          return (
                            <div
                              key={msg.id}
                              onClick={() => {
                                markMessageAsRead(msg.id, studentId);
                                setSelectedMessage(msg);
                                setOpenMenu(null);
                              }}
                              className={`group cursor-pointer rounded-xl p-3 transition ${
                                !isRead
                                  ? "bg-indigo-50/80 hover:bg-indigo-50 border border-indigo-200"
                                  : "hover:bg-slate-50 border border-slate-100"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition">
                                  {msg.teacherName}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    msg.priority === "urgent"
                                      ? "bg-rose-100 text-rose-700"
                                      : msg.priority === "important"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {msg.priority}
                                </span>
                              </div>
                              <p className="mt-1 text-xs font-semibold text-slate-800 line-clamp-1">
                                {msg.subject}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                {msg.content}
                              </p>
                              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                                <span>
                                  {new Date(msg.createdAt).toLocaleDateString()} ·{" "}
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <span className="font-semibold text-indigo-600 group-hover:underline">
                                  Read full &rarr;
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )
                    ) : isTeacher ? (
                      teacherSentMessages.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-sm">
                          <p>You haven&apos;t sent any messages yet.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenu(null);
                              setIsComposeOpen(true);
                            }}
                            className="mt-3 text-xs font-bold text-indigo-600 underline"
                          >
                            Send your first message
                          </button>
                        </div>
                      ) : (
                        teacherSentMessages.slice(0, 5).map((msg) => (
                          <div
                            key={msg.id}
                            className="rounded-xl p-3 border border-slate-100 bg-slate-50/70"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-800">
                                To: {msg.recipientName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-1 font-semibold text-xs text-indigo-950 truncate">
                              {msg.subject}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                              {msg.content}
                            </p>
                          </div>
                        ))
                      )
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-500">
                        Admin view · Center communications active
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Auth Button */}
            {activeName ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="max-w-40 truncate text-xs font-bold text-slate-900">
                    {activeName}
                  </p>
                  <p className="max-w-48 truncate text-[11px] font-medium text-slate-500">
                    {activeDetail}
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-100 ring-2 ring-indigo-50 font-bold text-indigo-700 text-sm shadow-xs">
                  {activeName.trim().charAt(0)}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="inline-flex items-center gap-1.5 rounded-xl hover:bg-rose-50 px-2 sm:px-2.5 py-2 font-semibold text-slate-600 hover:text-rose-600 text-xs transition"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 font-semibold text-white text-xs sm:text-sm shadow-md shadow-indigo-100 transition"
              >
                Sign in / تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Message View Modal for Students */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                  <MessageSquare size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    Teacher Message / رسالة المعلم
                  </h3>
                  <p className="text-xs text-indigo-100">
                    From: {selectedMessage.teacherName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-white/80 hover:bg-white/20 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    selectedMessage.priority === "urgent"
                      ? "bg-rose-100 text-rose-700"
                      : selectedMessage.priority === "important"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Priority: {selectedMessage.priority.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {selectedMessage.subject}
                </h4>
                <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-line">
                  {selectedMessage.content}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                >
                  Close / تم الاطلاع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Compose Modal for Teachers */}
      {isTeacher && user && (
        <MessageComposeModal
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          teacherId={user.id}
          teacherName={user.name}
          assignedClasses={user.assignedClasses}
        />
      )}
    </>
  );
}
