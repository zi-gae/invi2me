import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <footer className="border-t py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} invi2me
          </p>
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            이용약관
          </Link>
          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
          <a href="mailto:hello@invi2me.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            문의하기
          </a>
        </div>
      </footer>
    </div>
  );
}
