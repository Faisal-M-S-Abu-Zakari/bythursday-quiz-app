/**
 * Student Context - Manages current student state across the app
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Student } from '@/types/user';

interface StudentContextType {
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const logout = () => {
    setCurrentStudent(null);
  };

  return (
    <StudentContext.Provider value={{ currentStudent, setCurrentStudent, logout }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
}
