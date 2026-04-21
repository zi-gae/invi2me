import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Utensils,
  BarChart3,
  Globe,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRsvpSummary } from '@/features/rsvp/queries/rsvp.queries';
import { getGuestCount } from '@/features/guests/queries/guest.queries';

interface ReportsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { eventId } = await params;

  const [rsvpSummary, guestCount] = await Promise.all([
    getRsvpSummary(eventId),
    getGuestCount(eventId),
  ]);

  const attendanceRate =
    rsvpSummary.total > 0
      ? Math.round((rsvpSummary.attending / rsvpSummary.total) * 100)
      : 0;

  const overviewCards = [
    { label: '총 게스트', value: guestCount, icon: Users },
    { label: '총 RSVP 응답', value: rsvpSummary.total, icon: BarChart3 },
    { label: '참석 확정', value: rsvpSummary.attending, icon: UserCheck },
    { label: '불참', value: rsvpSummary.notAttending, icon: UserX },
    { label: '미정', value: rsvpSummary.maybe, icon: Clock },
    { label: '총 예상 인원', value: rsvpSummary.totalPartySize, icon: Users },
    { label: '총 식수', value: rsvpSummary.totalMealCount, icon: Utensils },
    { label: '참석률', value: `${attendanceRate}%`, icon: UserCheck },
  ];

  return (
    <div className="h-full overflow-y-auto space-y-6 px-8 pb-8">
      {/* Header */}
      <h1 className="text-2xl font-bold">리포트</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Globe className="size-5 text-muted-foreground" />
          <CardTitle className="text-lg">페이지 방문 분석</CardTitle>
          <Badge variant="secondary">Coming Soon</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            페이지 방문 통계, 유입 채널, 디바이스 분석 등을 확인할 수 있습니다.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Send className="size-5 text-muted-foreground" />
          <CardTitle className="text-lg">공유 링크 성과</CardTitle>
          <Badge variant="secondary">Coming Soon</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            공유 링크별 클릭 수, 전환율, UTM 파라미터 분석을 확인할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
