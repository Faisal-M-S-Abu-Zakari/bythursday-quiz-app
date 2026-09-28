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

interface StudentContextType {
  currentStudent: Student | null;
  isStudentReady: boolean;
  setCurrentStudent: (student: Student | null) => void;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [currentStudent, setCurrentStudentState] = useState<Student | null>(
    null,
  );
  const [isStudentReady, setIsStudentReady] = useState(false);

  useEffect(() => {
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
  }, []);

  const setCurrentStudent = (student: Student | null) => {
    setCurrentStudentState(student);
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
