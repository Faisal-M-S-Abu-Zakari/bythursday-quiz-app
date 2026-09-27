/**
 * Teacher Context - Manages teacher state, quizzes, and submissions
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Teacher } from '@/types/user';
import { Quiz, StudentQuizAttempt } from '@/types/quiz';

interface TeacherContextType {
  currentTeacher: Teacher | null;
  setCurrentTeacher: (teacher: Teacher | null) => void;
  allQuizzes: Quiz[];
  allAttempts: StudentQuizAttempt[];
  addQuiz: (quiz: Quiz) => void;
  addAttempt: (attempt: StudentQuizAttempt) => void;
  logout: () => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [allAttempts, setAllAttempts] = useState<StudentQuizAttempt[]>([]);

  const addQuiz = (quiz: Quiz) => {
    setAllQuizzes([...allQuizzes, quiz]);
  };

  const addAttempt = (attempt: StudentQuizAttempt) => {
    setAllAttempts([...allAttempts, attempt]);
  };

  const logout = () => {
    setCurrentTeacher(null);
  };

  return (
    <TeacherContext.Provider
      value={{
        currentTeacher,
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
    throw new Error('useTeacher must be used within TeacherProvider');
  }
  return context;
}
