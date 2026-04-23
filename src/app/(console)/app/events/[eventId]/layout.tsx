import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { EventNavTabs } from './event-nav-tabs';

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
        <EventNavTabs eventId={eventId} />
      </div>

      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
