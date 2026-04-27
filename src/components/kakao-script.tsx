'use client';

import Script from 'next/script';

export function KakaoScript() {
  return (
    <Script
      src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services&autoload=false`}
      strategy="afterInteractive"
      onLoad={() => {
        if (window.kakao?.maps) {
          window.kakao.maps.load(() => {});
        }
      }}
    />
  );
}
