import Link from 'next/link';

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
