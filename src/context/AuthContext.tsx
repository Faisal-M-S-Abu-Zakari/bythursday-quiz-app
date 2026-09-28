"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("currentUser");
      if (savedUser) setUserState(JSON.parse(savedUser) as User);
    } catch {
      sessionStorage.removeItem("currentUser");
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const setUser = useCallback((nextUser: User | null) => {
    setUserState(nextUser);
    if (typeof window !== "undefined") {
      if (nextUser)
        sessionStorage.setItem("currentUser", JSON.stringify(nextUser));
      else sessionStorage.removeItem("currentUser");
    }
  }, []);

  const logout = useCallback(() => setUser(null), [setUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthReady, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
