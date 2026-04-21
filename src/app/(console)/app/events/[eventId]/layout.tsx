import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const NAV_TABS = [
  { label: '개요', href: '' },
  { label: '편집기', href: 'editor' },
  { label: '게스트', href: 'guests' },
  { label: 'RSVP', href: 'rsvps' },
  { label: '체크인', href: 'checkin' },
  { label: '리포트', href: 'reports' },
  { label: '설정', href: 'settings' },
];

interface EventDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailLayout({ children, params }: EventDetailLayoutProps) {
  const { eventId } = await params;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 px-8 pt-8 pb-4">
        {/* 뒤로가기 */}
        <Link
          href="/app/events"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          내 이벤트
        </Link>

        {/* 탭 네비게이션 */}
        <div className="flex gap-1 overflow-x-auto rounded-lg border bg-muted p-1">
          {NAV_TABS.map((tab) => (
            <Link
              key={tab.href || 'overview'}
              href={`/app/events/${eventId}${tab.href ? `/${tab.href}` : ''}`}
              className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
