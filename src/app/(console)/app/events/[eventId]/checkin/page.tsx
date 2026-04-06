import { Users, UserCheck, Clock, QrCode } from 'lucide-react';
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
import {
  getCheckinSummary,
  listCheckinLogs,
  listCheckinSessions,
} from '@/features/checkin/queries/checkin.queries';

interface CheckinManagePageProps {
  params: Promise<{ eventId: string }>;
}

const METHOD_LABEL: Record<string, string> = {
  qr: 'QR 스캔',
  manual: '수동',
  link: '링크',
};

const SESSION_STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  active: 'default',
  paused: 'secondary',
  closed: 'destructive',
};

const SESSION_STATUS_LABEL: Record<string, string> = {
  active: '진행중',
  paused: '일시정지',
  closed: '종료',
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

export default async function CheckinManagePage({ params }: CheckinManagePageProps) {
  const { eventId } = await params;

  const [summary, logs, sessions] = await Promise.all([
    getCheckinSummary(eventId),
    listCheckinLogs(eventId),
    listCheckinSessions(eventId),
  ]);

  const summaryCards = [
    { label: '총 체크인', value: summary.checkedIn, icon: UserCheck },
    { label: '대기중', value: summary.pending, icon: Clock },
    { label: '총 게스트', value: summary.totalGuests, icon: Users },
    { label: '세션 수', value: sessions.length, icon: QrCode },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">체크인 관리</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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

      {/* Sessions */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">체크인 세션</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{session.name}</CardTitle>
                  <Badge variant={SESSION_STATUS_VARIANT[session.status] ?? 'secondary'}>
                    {SESSION_STATUS_LABEL[session.status] ?? session.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    체크인: {session.totalCheckins}명
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">체크인 기록</h2>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <QrCode className="size-10 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              아직 체크인 기록이 없습니다
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              게스트가 체크인하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>게스트명</TableHead>
                  <TableHead>체크인 방법</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>체크인 시간</TableHead>
                  <TableHead>체크인 담당</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.guestName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {METHOD_LABEL[log.method] ?? log.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'success' ? 'default' : 'secondary'}>
                        {log.status === 'success' ? '성공' : log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(log.checkedInAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.checkedInBy ?? '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
