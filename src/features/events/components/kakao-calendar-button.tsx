'use client';

import { useEffect, useRef } from 'react';
import type { KakaoCalendarIntegration } from '../types/event.dto';

interface KakaoCalendarButtonProps {
  eventSlug: string;
  startsAt: string | null;
  endsAt: string | null;
  title: string;
  imageUrl?: string | null;
  integration: KakaoCalendarIntegration;
}

declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        createDefaultButton: (options: Record<string, unknown>) => void;
      };
    };
  }
}

export function KakaoCalendarButton({
  eventSlug,
  integration,
  title,
  imageUrl,
}: KakaoCalendarButtonProps) {
  const btnId = `kakao-calendar-btn-${eventSlug}`;
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!integration.eventId) return;

    const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${eventSlug}`;

    // SDK 로드 및 초기화를 폴링으로 대기 (layout의 Script onLoad 대신)
    const interval = setInterval(() => {
      if (!window.Kakao) return;

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);
      }

      window.Kakao.Share.createDefaultButton({
        container: `#${btnId}`,
        objectType: 'calendar',
        idType: 'event',
        id: integration.eventId,
        content: {
          title,
          ...(imageUrl ? { imageUrl } : {}),
          link: {
            webUrl: pageUrl,
            mobileWebUrl: pageUrl,
          },
        },
      });

      initialized.current = true;
      clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [integration.eventId, title, imageUrl, eventSlug, btnId]);

  if (!integration.eventId) return null;

  return (
    <div
      id={btnId}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#FEE500] px-5 py-2.5 text-sm font-medium text-[#191919] transition-opacity hover:opacity-90"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3C6.48 3 2 6.48 2 12c0 2.76 1.12 5.26 2.93 7.07L3 21l2.07-.93C6.74 21.3 9.28 22 12 22c5.52 0 10-3.48 10-10S17.52 3 12 3z" />
      </svg>
      {integration.buttonLabel}
    </div>
  );
}
