/**
 * Quiz Timer Component - Live countdown timer with auto-submit
 */

'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatTimeRemaining } from '@/lib/utils';

interface QuizTimerProps {
  durationMinutes: number;
  onTimeExpired: () => void;
  language: 'ar' | 'en';
  isPaused?: boolean;
}

export function QuizTimer({
  durationMinutes,
  onTimeExpired,
  language,
  isPaused = false,
}: QuizTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
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

  // Warn when less than 5 minutes remain
  useEffect(() => {
    setIsWarning(secondsRemaining < 300);
  }, [secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const isLowTime = minutes < 5;

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
        transition-all duration-300
        ${
          isLowTime
            ? 'bg-red-100 text-red-700 border-2 border-red-400'
            : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
        }
      `}
    >
      <Clock size={20} />
      <span className="text-lg">{formatTimeRemaining(secondsRemaining)}</span>
      {isWarning && language === 'ar' && (
        <span className="ml-auto text-sm">تنبيه: الوقت ينفد</span>
      )}
      {isWarning && language === 'en' && (
        <span className="ml-auto text-sm">Warning: Time running out</span>
      )}
    </div>
  );
}
