import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Utensils,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRsvpSummary, listRsvpResponses } from '@/features/rsvp/queries/rsvp.queries';

interface RsvpsPageProps {
  params: Promise<{ eventId: string }>;
}

const ATTENDANCE_CONFIG: Record<string, { label: string; className: string }> = {
  attending: { label: '참석', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  not_attending: { label: '불참', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  maybe: { label: '미정', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function RsvpsPage({ params }: RsvpsPageProps) {
  const { eventId } = await params;

  const [summary, responses] = await Promise.all([
    getRsvpSummary(eventId),
    listRsvpResponses(eventId),
  ]);

  const summaryCards = [
    { label: '총 응답', value: summary.total, icon: MessageSquare },
    { label: '참석', value: summary.attending, icon: UserCheck },
    { label: '불참', value: summary.notAttending, icon: UserX },
    { label: '미정', value: summary.maybe, icon: Clock },
    { label: '총 인원', value: summary.totalPartySize, icon: Users },
    { label: '총 식수', value: summary.totalMealCount, icon: Utensils },
  ];

  return (
    <div className="h-full overflow-y-auto space-y-6 px-8 pb-8">
      {/* Header */}
      <h1 className="text-2xl font-bold">RSVP 응답 현황</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
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

      {/* Responses Table */}
      {responses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <MessageSquare className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 RSVP 응답이 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            게스트가 응답하면 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>게스트명</TableHead>
                <TableHead>참석 여부</TableHead>
                <TableHead className="text-right">인원수</TableHead>
                <TableHead className="text-right">식수</TableHead>
                <TableHead>메시지</TableHead>
                <TableHead>응답일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => {
                const attendanceCfg = ATTENDANCE_CONFIG[response.attendanceStatus];
                return (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">
                      {response.guestName}
                    </TableCell>
                    <TableCell>
                      {attendanceCfg ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${attendanceCfg.className}`}
                        >
                          {attendanceCfg.label}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {response.attendanceStatus}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {response.partySize}
                    </TableCell>
                    <TableCell className="text-right">
                      {response.mealCount}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {response.messageToCouple ?? '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(response.submittedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
