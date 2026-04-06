import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getAdminEventById } from '@/features/events/queries/event.queries';
import { EventNotFoundError } from '@/shared/lib/errors';
import Link from 'next/link';

interface SettingsPageProps {
  params: Promise<{ eventId: string }>;
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  wedding: '결혼식',
  reception: '피로연',
  seminar: '세미나',
  party: '파티',
  conference: '컨퍼런스',
};

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

export default async function SettingsPage({ params }: SettingsPageProps) {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">이벤트 설정</h1>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>이벤트 제목</Label>
              <Input value={event.title} disabled />
            </div>
            <div className="space-y-2">
              <Label>부제</Label>
              <Input value={event.subtitle ?? ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>슬러그</Label>
              <Input value={event.slug} disabled />
            </div>
            <div className="space-y-2">
              <Label>이벤트 유형</Label>
              <Input value={EVENT_TYPE_LABEL[event.eventType] ?? event.eventType} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 일정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">일정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>시작일</Label>
              <Input value={formatDate(event.startsAt)} disabled />
            </div>
            <div className="space-y-2">
              <Label>종료일</Label>
              <Input value={formatDate(event.endsAt)} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RSVP */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">RSVP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>RSVP 오픈일</Label>
              <Input value={formatDate(event.rsvpOpensAt)} disabled />
            </div>
            <div className="space-y-2">
              <Label>RSVP 마감일</Label>
              <Input value={formatDate(event.rsvpClosesAt)} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 기능 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기능 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">체크인</span>
              <Badge variant={event.checkinEnabled ? 'default' : 'secondary'}>
                {event.checkinEnabled ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">메시징</span>
              <Badge variant={event.messagingEnabled ? 'default' : 'secondary'}>
                {event.messagingEnabled ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">분석</span>
              <Badge variant={event.analyticsEnabled ? 'default' : 'secondary'}>
                {event.analyticsEnabled ? 'ON' : 'OFF'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SEO 제목</Label>
            <Input value={event.seoTitle ?? ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>SEO 설명</Label>
            <Input value={event.seoDescription ?? ''} disabled />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* 위험 구역 */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">위험 구역</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            이벤트를 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <Button variant="destructive" disabled>
            이벤트 삭제
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
