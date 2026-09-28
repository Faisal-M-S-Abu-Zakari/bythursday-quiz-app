/**
 * Student Context - Manages current student state across the app
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Student } from "@/types/user";
import { useAuth } from "@/context/AuthContext";

interface StudentContextType {
  currentStudent: Student | null;
  isStudentReady: boolean;
  setCurrentStudent: (student: Student | null) => void;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const { user, isAuthReady, setUser, logout: logoutAuth } = useAuth();
  const [currentStudent, setCurrentStudentState] = useState<Student | null>(
    null,
  );
  const [isStudentReady, setIsStudentReady] = useState(false);

  useEffect(() => {
    if (isAuthReady && user?.role === "student") {
      setCurrentStudentState(user);
      setIsStudentReady(true);
      return;
    }
    try {
      const storedStudent = window.sessionStorage.getItem("currentStudent");
      if (storedStudent) {
        setCurrentStudentState(JSON.parse(storedStudent) as Student);
      }
    } catch {
      window.sessionStorage.removeItem("currentStudent");
    } finally {
      setIsStudentReady(true);
    }
  }, [isAuthReady, user]);

  const setCurrentStudent = (student: Student | null) => {
    setCurrentStudentState(student);
    if (student) setUser(student);
    if (typeof window !== "undefined") {
      if (student) {
        window.sessionStorage.setItem(
          "currentStudent",
          JSON.stringify(student),
        );
      } else {
        window.sessionStorage.removeItem("currentStudent");
      }
    }
  };

  const logout = () => {
    setCurrentStudent(null);
    logoutAuth();
  };

  return (
    <StudentContext.Provider
      value={{ currentStudent, isStudentReady, setCurrentStudent, logout }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within StudentProvider");
  }
  return context;
}
