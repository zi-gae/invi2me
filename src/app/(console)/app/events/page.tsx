import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentWorkspace } from '@/features/auth/utils/get-current-workspace';
import { listEventsByWorkspace } from '@/features/events/queries/event.queries';
import { EventPublicUrlBar } from '@/features/events/components/event-public-url-bar';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  published: 'default',
  scheduled: 'outline',
  draft: 'secondary',
  archived: 'secondary',
};

const STATUS_LABEL: Record<string, string> = {
  draft: '초안',
  scheduled: '예약됨',
  published: '게시됨',
  archived: '보관됨',
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function EventsListPage() {
  let workspace;
  try {
    workspace = await getCurrentWorkspace();
  } catch {
    redirect('/login');
  }

  const events = await listEventsByWorkspace(workspace.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">내 이벤트</h1>
        <Button render={<Link href="/app/events/new" />}>
          <Plus className="mr-1.5 size-4" />
          새 이벤트 만들기
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <CalendarDays className="mb-3 size-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">아직 이벤트가 없습니다</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            첫 번째 이벤트를 만들어 보세요.
          </p>
          <Button render={<Link href="/app/events/new" />} className="mt-4" size="sm">
            <Plus className="mr-1.5 size-4" />
            새 이벤트 만들기
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="transition-shadow hover:shadow-md">
              <Link href={`/app/events/${event.id}`} className="block">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1">
                      {event.title}
                    </CardTitle>
                    <Badge variant={STATUS_VARIANT[event.status] ?? 'secondary'}>
                      {STATUS_LABEL[event.status] ?? event.status}
                    </Badge>
                  </div>
                  <CardDescription>{event.eventType}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {event.startsAt ? (
                      <span>
                        {formatDate(event.startsAt)}
                        {event.endsAt && ` ~ ${formatDate(event.endsAt)}`}
                      </span>
                    ) : (
                      <span>날짜 미정</span>
                    )}
                  </div>
                </CardContent>
              </Link>
              <div className="px-6 pb-4">
                <EventPublicUrlBar slug={event.slug} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
