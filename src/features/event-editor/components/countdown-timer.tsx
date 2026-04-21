'use client';

import { useState, useEffect, Fragment } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  completedMessage?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, isPast: false };
}

export function CountdownTimer({ targetDate, completedMessage }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // SSR placeholder — prevents hydration mismatch
  if (!timeLeft) {
    return <div className="h-14" aria-hidden="true" />;
  }

  if (timeLeft.isPast) {
    return (
      <p className="text-base text-stone-500">
        {completedMessage ?? '행복한 결혼 생활을 시작했습니다 💕'}
      </p>
    );
  }

  const units: { label: string; value: number }[] = [
    { label: '일', value: timeLeft.days },
    { label: '시간', value: timeLeft.hours },
    { label: '분', value: timeLeft.minutes },
    { label: '초', value: timeLeft.seconds },
  ];

  return (
    <div
      className="flex items-end justify-center gap-3 sm:gap-5"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {units.map(({ label, value }, i) => (
        <Fragment key={label}>
          {i > 0 && (
            <span
              className="mb-5 select-none text-2xl font-thin text-stone-300"
              aria-hidden="true"
            >
              :
            </span>
          )}
          <div className="flex flex-col items-center">
            <span className="tabular-nums text-4xl font-light tracking-tight text-stone-800 sm:text-5xl">
              {String(value).padStart(2, '0')}
            </span>
            <span className="mt-1.5 text-xs tracking-[0.2em] text-stone-400">{label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
