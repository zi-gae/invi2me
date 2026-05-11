'use client';

import { CalendarPlus } from 'lucide-react';

interface Props {
  title: string;
  date: string;
  time: string;
  locationName?: string;
  locationAddress?: string;
}

function parseKoreanTime(date: string, time: string): { start: string; end: string } | null {
  const isPm = time.includes('오후');
  const isAm = time.includes('오전');
  if (!isPm && !isAm) return null;

  const hourMatch = time.match(/(\d+)시/);
  const minMatch = time.match(/(\d+)분/);
  if (!hourMatch) return null;

  let hours = parseInt(hourMatch[1]);
  const minutes = minMatch ? parseInt(minMatch[1]) : 0;

  if (isPm && hours !== 12) hours += 12;
  if (isAm && hours === 12) hours = 0;

  const pad = (n: number) => String(n).padStart(2, '0');
  const start = `${date}T${pad(hours)}:${pad(minutes)}:00+09:00`;
  const endHours = hours + 2;
  const end = `${date}T${pad(endHours)}:${pad(minutes)}:00+09:00`;

  return { start, end };
}

export function KakaoCalendarButton({ title, date, time, locationName, locationAddress }: Props) {
  const handleClick = () => {
    if (!window.Kakao?.Calendar) return;

    const parsed = parseKoreanTime(date, time);
    if (!parsed) return;

    window.Kakao.Calendar.createEvents([
      {
        title,
        time: {
          start: parsed.start,
          end: parsed.end,
          allDay: false,
          lunar: false,
        },
        ...(locationName && {
          location: {
            name: locationName,
            ...(locationAddress && { address: locationAddress }),
          },
        }),
      },
    ]);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm text-stone-600 transition-all hover:bg-stone-50 active:scale-95"
    >
      <CalendarPlus className="size-4 text-stone-400" aria-hidden="true" />
      카카오 캘린더에 추가
    </button>
  );
}
