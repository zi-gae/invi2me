'use client';

import Script from 'next/script';

declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Calendar: {
        createEvents: (events: KakaoCalendarEvent[]) => void;
      };
      Share: {
        createDefaultButton: (options: Record<string, unknown>) => void;
      };
    };
  }
}

export interface KakaoCalendarEvent {
  title: string;
  time: {
    start: string;
    end: string;
    allDay: boolean;
    lunar: boolean;
  };
  description?: string;
  location?: {
    name: string;
    address?: string;
  };
}

export function KakaoScript() {
  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => {
          if (window.kakao?.maps) {
            (window.kakao.maps as unknown as { load: (cb: () => void) => void }).load(() => {});
          }
        }}
      />
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY as string);
          }
        }}
      />
    </>
  );
}
