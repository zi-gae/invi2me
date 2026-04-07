import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-sm font-semibold tracking-tight">invi2me</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              초대부터 체크인까지,
              <br />
              이벤트 운영을 하나로 연결합니다.
            </p>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              약관 및 정책
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              문의
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="mailto:hello@invi2me.com"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@invi2me.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@invi2me.com"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  고객 지원
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} invi2me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
