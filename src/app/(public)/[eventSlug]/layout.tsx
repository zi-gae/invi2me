import Link from 'next/link';
import Script from 'next/script';

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js"
        integrity="sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {children}
      <footer className="border-t py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Powered by invi2me
          </Link>
          <span className="text-xs text-muted-foreground">·</span>
          <Link
            href="/terms"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            이용약관
          </Link>
          <span className="text-xs text-muted-foreground">·</span>
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            개인정보처리방침
          </Link>
        </div>
      </footer>
    </>
  );
}
