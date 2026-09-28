/**
 * Teacher Context - Manages teacher state, quizzes, and submissions
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Teacher } from "@/types/user";
import { Quiz, StudentQuizAttempt } from "@/types/quiz";
import { useAuth } from "@/context/AuthContext";

interface TeacherContextType {
  currentTeacher: Teacher | null;
  isTeacherReady: boolean;
  setCurrentTeacher: (teacher: Teacher | null) => void;
  allQuizzes: Quiz[];
  allAttempts: StudentQuizAttempt[];
  addQuiz: (quiz: Quiz) => void;
  addAttempt: (attempt: StudentQuizAttempt) => void;
  logout: () => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const { user, isAuthReady, setUser, logout: logoutAuth } = useAuth();
  const [currentTeacher, setCurrentTeacherState] = useState<Teacher | null>(
    null,
  );
  const [isTeacherReady, setIsTeacherReady] = useState(false);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [allAttempts, setAllAttempts] = useState<StudentQuizAttempt[]>([]);

  useEffect(() => {
    if (isAuthReady && user?.role === "teacher") {
      setCurrentTeacherState(user);
      setIsTeacherReady(true);
      return;
    }
    try {
      const storedTeacher = window.sessionStorage.getItem("currentTeacher");
      if (storedTeacher) {
        setCurrentTeacherState(JSON.parse(storedTeacher) as Teacher);
      }
    } catch {
      window.sessionStorage.removeItem("currentTeacher");
    } finally {
      setIsTeacherReady(true);
    }
  }, [isAuthReady, user]);

  const setCurrentTeacher = (teacher: Teacher | null) => {
    setCurrentTeacherState(teacher);
    if (teacher) setUser(teacher);
    if (typeof window !== "undefined") {
      if (teacher) {
        window.sessionStorage.setItem(
          "currentTeacher",
          JSON.stringify(teacher),
        );
      } else {
        window.sessionStorage.removeItem("currentTeacher");
      }
    }
  };

  const addQuiz = (quiz: Quiz) => {
    setAllQuizzes([...allQuizzes, quiz]);
  };

  const addAttempt = (attempt: StudentQuizAttempt) => {
    setAllAttempts([...allAttempts, attempt]);
  };

  const logout = () => {
    setCurrentTeacher(null);
    logoutAuth();
  };

  return (
    <TeacherContext.Provider
      value={{
        currentTeacher,
        isTeacherReady,
        setCurrentTeacher,
        allQuizzes,
        allAttempts,
        addQuiz,
        addAttempt,
        logout,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error("useTeacher must be used within TeacherProvider");
  }
  return context;
}
