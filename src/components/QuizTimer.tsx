/**
 * Quiz Timer Component - Live countdown timer with auto-submit
 */

"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatTimeRemaining } from "@/lib/utils";

interface QuizTimerProps {
  durationMinutes: number;
  onTimeExpired: () => void;
  language: "ar" | "en";
  isPaused?: boolean;
}

export function QuizTimer({
  durationMinutes,
  onTimeExpired,
  language,
  isPaused = false,
}: QuizTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    durationMinutes * 60,
  );
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (isPaused || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeExpired]);

  // Warn during the final three minutes.
  useEffect(() => {
    setIsWarning(secondsRemaining <= 180);
  }, [secondsRemaining]);

  const isCritical = secondsRemaining <= 60;
  const isLowTime = secondsRemaining <= 180;

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
        transition-all duration-300
        ${
          isCritical
            ? "bg-rose-50 text-rose-700 border border-rose-300 shadow-sm shadow-rose-100"
            : isLowTime
              ? "bg-amber-50 text-amber-800 border border-amber-300 shadow-sm shadow-amber-100"
              : "bg-indigo-50 text-indigo-700 border border-indigo-200"
        }
      `}
    >
      <Clock size={18} className={isCritical ? "animate-pulse" : ""} />
      <span className="tabular-nums text-base">
        {formatTimeRemaining(secondsRemaining)}
      </span>
      {isWarning && language === "ar" && (
        <span className="ml-auto text-sm">تنبيه: الوقت ينفد</span>
      )}
      {isWarning && language === "en" && (
        <span className="ml-auto text-sm">Warning: Time running out</span>
      )}
    </div>
  );
}
