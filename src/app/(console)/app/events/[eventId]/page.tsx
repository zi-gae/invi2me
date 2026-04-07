import Link from 'next/link';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAdminEventById } from '@/features/events/queries/event.queries';
import { getGuestCount } from '@/features/guests/queries/guest.queries';
import { getRsvpSummary } from '@/features/rsvp/queries/rsvp.queries';
import { EventNotFoundError } from '@/shared/lib/errors';
import { EventPublicUrlBar } from '@/features/events/components/event-public-url-bar';

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  draft: 'secondary',
  scheduled: 'outline',
  published: 'default',
  archived: 'destructive',
};

const STATUS_LABEL: Record<string, string> = {
  draft: '초안',
  scheduled: '예약됨',
  published: '공개됨',
  archived: '보관됨',
};

const VISIBILITY_LABEL: Record<string, string> = {
  public: '공개',
  private: '비공개',
  unlisted: '링크 공개',
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  wedding: '결혼식',
  reception: '피로연',
  seminar: '세미나',
  party: '파티',
  conference: '컨퍼런스',
};

const NAV_TABS = [
  { label: '편집기', href: 'editor' },
  { label: '게스트', href: 'guests' },
  { label: 'RSVP', href: 'rsvps' },
  { label: '체크인', href: 'checkin' },
  { label: '리포트', href: 'reports' },
  { label: '설정', href: 'settings' },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;

  let event;
  try {
    event = await getAdminEventById(eventId);
  } catch (error) {
    if (error instanceof EventNotFoundError) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold text-muted-foreground">
            이벤트를 찾을 수 없습니다
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            이벤트가 삭제되었거나 접근 권한이 없습니다.
          </p>
          <Link
            href="/app/events"
            className="mt-4 text-sm text-primary underline underline-offset-4"
          >
            이벤트 목록으로 돌아가기
          </Link>
        </div>
      );
    }
    throw error;
  }

  const [guestCount, rsvpSummary] = await Promise.all([
    getGuestCount(eventId),
    getRsvpSummary(eventId),
  ]);

  const stats = [
    {
      label: '총 게스트',
      value: guestCount,
      icon: Users,
    },
    {
      label: 'RSVP 참석',
      value: rsvpSummary.attending,
      icon: UserCheck,
    },
    {
      label: 'RSVP 불참',
      value: rsvpSummary.notAttending,
      icon: UserX,
    },
    {
      label: 'RSVP 미정',
      value: rsvpSummary.maybe,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <Badge variant={STATUS_VARIANT[event.status] ?? 'secondary'}>
            {STATUS_LABEL[event.status] ?? event.status}
          </Badge>
        </div>
        <EventPublicUrlBar slug={event.slug} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border bg-muted p-1">
        {NAV_TABS.map((tab) => (
          <Link
            key={tab.href}
            href={`/app/events/${eventId}/${tab.href}`}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <Separator />

      {/* Event Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">이벤트 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">유형</dt>
              <dd className="mt-1 text-sm">
                {EVENT_TYPE_LABEL[event.eventType] ?? event.eventType}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">공개 설정</dt>
              <dd className="mt-1 text-sm">
                {VISIBILITY_LABEL[event.visibility] ?? event.visibility}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <CalendarDays className="size-3.5" />
                시작일
              </dt>
              <dd className="mt-1 text-sm">{formatDate(event.startsAt)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <CalendarDays className="size-3.5" />
                종료일
              </dt>
              <dd className="mt-1 text-sm">{formatDate(event.endsAt)}</dd>
            </div>
            {event.subtitle && (
              <div className="sm:col-span-2 lg:col-span-3">
                <dt className="text-sm font-medium text-muted-foreground">부제</dt>
                <dd className="mt-1 text-sm">{event.subtitle}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
