'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_TABS = [
  { label: '개요', href: '' },
  { label: '편집기', href: 'editor' },
  { label: '게스트', href: 'guests' },
  { label: 'RSVP', href: 'rsvps' },
  { label: '체크인', href: 'checkin' },
  { label: '리포트', href: 'reports' },
  { label: '설정', href: 'settings' },
];

interface EventNavTabsProps {
  eventId: string;
}

export function EventNavTabs({ eventId }: EventNavTabsProps) {
  const pathname = usePathname();
  const base = `/app/events/${eventId}`;

  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg border bg-muted p-1">
      {NAV_TABS.map((tab) => {
        const href = tab.href ? `${base}/${tab.href}` : base;
        const isActive = tab.href ? pathname.startsWith(href) : pathname === base;

        return (
          <Link
            key={tab.href || 'overview'}
            href={href}
            className={cn(
              'whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
