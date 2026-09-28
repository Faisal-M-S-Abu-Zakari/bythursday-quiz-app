"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { TeacherMessage, StudentNotification, MessagePriority } from "@/types/communication";

interface SendMessageInput {
  teacherId: string;
  teacherName: string;
  recipientType: "student" | "class" | "all";
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  priority: MessagePriority;
}

interface CommunicationContextType {
  messages: TeacherMessage[];
  notifications: StudentNotification[];
  sendMessage: (input: SendMessageInput) => TeacherMessage;
  markMessageAsRead: (messageId: string, studentId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (studentId: string) => void;
  getStudentMessages: (studentId: string, classCode?: string) => TeacherMessage[];
  getStudentNotifications: (studentId: string) => StudentNotification[];
  getTeacherSentMessages: (teacherId: string) => TeacherMessage[];
  getUnreadNotificationsCount: (studentId: string) => number;
  getUnreadMessagesCount: (studentId: string, classCode?: string) => number;
}

const STORAGE_KEY_MESSAGES = "bythursday_lms_messages";
const STORAGE_KEY_NOTIFICATIONS = "bythursday_lms_notifications";

// Initial seed data for rich interactive demo
const INITIAL_MESSAGES: TeacherMessage[] = [
  {
    id: "msg_seed_001",
    teacherId: "teacher_001",
    teacherName: "أ.د محمود علي",
    recipientType: "class",
    recipientId: "10A",
    recipientName: "Class 10A (الصف العاشر أ)",
    subject: "تنبيه نافذة اختبار أدب الجاهلية / Arabic Literature Window Open",
    content:
      "أعزائي طلبة الصف 10A، نود تذكيركم بأن نافذة اختبار الأدب الجاهلي مفتوحة اليوم وتغلق هذا المساء عند الساعة 20:00 (نافذة 12 ساعة محكمة). تم تفعيل محاولتين (2 attempts) لاحتساب أعلى علامة. انتبهوا لخصم العلامات السالبة (-1) عند الإجابة الخاطئة. بالتوفيق للجميع!",
    priority: "urgent",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readByStudentIds: [],
  },
  {
    id: "msg_seed_002",
    teacherId: "teacher_002",
    teacherName: "أ.د فاطمة إسماعيل",
    recipientType: "student",
    recipientId: "student_001",
    recipientName: "محمد الخطيب (student_001)",
    subject: "ملاحظات وتوجيهات دراسية فردية / Academic Guidance",
    content:
      "أهلاً محمد، لاحظت التزامك العالي في حل الواجبات. بالنسبة لقواعد اللغة الإنجليزية، احرص على مراجعة الفرق بين Verb Phrases و Prepositional Phrases. إذا احتجت لأي مساعدة أو توضيح إضافي، أنا متواجدة لمساعدتك.",
    priority: "important",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    readByStudentIds: [],
  },
  {
    id: "msg_seed_003",
    teacherId: "teacher_002",
    teacherName: "أ.د فاطمة إسماعيل",
    recipientType: "class",
    recipientId: "10B",
    recipientName: "Class 10B (الصف العاشر ب)",
    subject: "تعليمات اختبار القواعد وتكرار المحاولات (3 Attempts)",
    content:
      "طلبة الصف 10B الكرام، اختبار قواعد اللغة الإنجليزية متاح اليوم بنافذة تمتد لـ 12 ساعة وبإمكانكم إجراء حتى 3 محاولات تدريبية لتحقيق العلامة الكاملة. لا يوجد خصم سالب في هذا الاختبار.",
    priority: "normal",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    readByStudentIds: [],
  },
];

const INITIAL_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "notif_seed_001",
    studentId: "student_001",
    title: "رسالة هامة من أ.د محمود علي",
    message: "تنبيه نافذة اختبار أدب الجاهلية اليوم (نافذة 12 ساعة ومحاولتان).",
    type: "message",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: "urgent",
  },
  {
    id: "notif_seed_002",
    studentId: "student_001",
    title: "نافذة الاختبار مفتوحة اليوم",
    message: "اختبار أدب الجاهلية متاح الآن وينتهي الساعة 8:00 مساءً.",
    type: "exam_window",
    link: "/quizzes/quiz_ar_001",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: "important",
  },
  {
    id: "notif_seed_003",
    studentId: "student_001",
    title: "رسالة توجيهية خاصة",
    message: "أرسلت أ.د فاطمة إسماعيل ملاحظات دراسية خاصة بك.",
    type: "message",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: "important",
  },
];

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export function CommunicationProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<TeacherMessage[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);

  // Initialize from storage or defaults
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedMsgs = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (storedMsgs) {
        setMessages(JSON.parse(storedMsgs));
      } else {
        setMessages(INITIAL_MESSAGES);
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(INITIAL_MESSAGES));
      }

      const storedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
    } catch {
      setMessages(INITIAL_MESSAGES);
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  // Save changes
  const saveMessages = useCallback((updated: TeacherMessage[]) => {
    setMessages(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save messages", e);
      }
    }
  }, []);

  const saveNotifications = useCallback((updated: StudentNotification[]) => {
    setNotifications(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save notifications", e);
      }
    }
  }, []);

  // Teacher sends a message
  const sendMessage = useCallback(
    (input: SendMessageInput): TeacherMessage => {
      const newMsg: TeacherMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        teacherId: input.teacherId,
        teacherName: input.teacherName,
        recipientType: input.recipientType,
        recipientId: input.recipientId,
        recipientName: input.recipientName,
        subject: input.subject,
        content: input.content,
        priority: input.priority,
        createdAt: new Date().toISOString(),
        readByStudentIds: [],
      };

      const updatedMessages = [newMsg, ...messages];
      saveMessages(updatedMessages);

      // Automatically generate corresponding notifications for recipient(s)
      const newNotifs: StudentNotification[] = [];
      if (input.recipientType === "student") {
        newNotifs.push({
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          studentId: input.recipientId,
          title: `رسالة جديدة من ${input.teacherName}`,
          message: input.subject,
          type: "message",
          createdAt: new Date().toISOString(),
          isRead: false,
          priority: input.priority,
        });
      } else if (input.recipientType === "class") {
        // Find mock students for this class or broadcast
        newNotifs.push({
          id: `notif_${Date.now()}_broadcast_${input.recipientId}`,
          studentId: `class_${input.recipientId}`, // will match students in that class
          title: `إعلان صفي من ${input.teacherName} (الصف ${input.recipientId})`,
          message: input.subject,
          type: "message",
          createdAt: new Date().toISOString(),
          isRead: false,
          priority: input.priority,
        });
      }

      if (newNotifs.length > 0) {
        saveNotifications([...newNotifs, ...notifications]);
      }

      return newMsg;
    },
    [messages, notifications, saveMessages, saveNotifications]
  );

  // Student marks message as read
  const markMessageAsRead = useCallback(
    (messageId: string, studentId: string) => {
      const updated = messages.map((msg) => {
        if (msg.id === messageId) {
          if (!msg.readByStudentIds.includes(studentId)) {
            return {
              ...msg,
              readByStudentIds: [...msg.readByStudentIds, studentId],
            };
          }
        }
        return msg;
      });
      saveMessages(updated);
    },
    [messages, saveMessages]
  );

  // Student marks notification as read
  const markNotificationAsRead = useCallback(
    (notificationId: string) => {
      const updated = notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n));
      saveNotifications(updated);
    },
    [notifications, saveNotifications]
  );

  // Student marks all notifications as read
  const markAllNotificationsAsRead = useCallback(
    (studentId: string) => {
      const updated = notifications.map((n) => {
        if (n.studentId === studentId || n.studentId.startsWith("class_")) {
          return { ...n, isRead: true };
        }
        return n;
      });
      saveNotifications(updated);
    },
    [notifications, saveNotifications]
  );

  // Get student relevant messages
  const getStudentMessages = useCallback(
    (studentId: string, classCode?: string): TeacherMessage[] => {
      return messages.filter((msg) => {
        if (msg.recipientType === "all") return true;
        if (msg.recipientType === "student" && msg.recipientId === studentId) return true;
        if (msg.recipientType === "class" && classCode && msg.recipientId === classCode) return true;
        return false;
      });
    },
    [messages]
  );

  // Get student notifications
  const getStudentNotifications = useCallback(
    (studentId: string): StudentNotification[] => {
      return notifications.filter(
        (n) => n.studentId === studentId || n.studentId.startsWith("class_")
      );
    },
    [notifications]
  );

  // Get teacher sent messages
  const getTeacherSentMessages = useCallback(
    (teacherId: string): TeacherMessage[] => {
      return messages.filter((m) => m.teacherId === teacherId);
    },
    [messages]
  );

  // Count unread notifications
  const getUnreadNotificationsCount = useCallback(
    (studentId: string): number => {
      return notifications.filter(
        (n) => !n.isRead && (n.studentId === studentId || n.studentId.startsWith("class_"))
      ).length;
    },
    [notifications]
  );

  // Count unread messages
  const getUnreadMessagesCount = useCallback(
    (studentId: string, classCode?: string): number => {
      const studentMsgs = getStudentMessages(studentId, classCode);
      return studentMsgs.filter((m) => !m.readByStudentIds.includes(studentId)).length;
    },
    [getStudentMessages]
  );

  return (
    <CommunicationContext.Provider
      value={{
        messages,
        notifications,
        sendMessage,
        markMessageAsRead,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getStudentMessages,
        getStudentNotifications,
        getTeacherSentMessages,
        getUnreadNotificationsCount,
        getUnreadMessagesCount,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunication() {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error("useCommunication must be used within a CommunicationProvider");
  }
  return context;
}
