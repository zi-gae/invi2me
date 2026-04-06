import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';
import { listEventsByWorkspace } from '@/features/events/queries/event.queries';

interface OrgEventsPageProps {
  params: Promise<{ workspaceSlug: string }>;
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

const EVENT_TYPE_LABEL: Record<string, string> = {
  wedding: '결혼식',
  reception: '피로연',
  seminar: '세미나',
  party: '파티',
  conference: '컨퍼런스',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default async function OrgEventsPage({ params }: OrgEventsPageProps) {
  const { workspaceSlug } = await params;
  const { workspace } = await getWorkspaceBySlug(workspaceSlug);
  const events = await listEventsByWorkspace(workspace.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">조직 이벤트</h1>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <CalendarDays className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 이벤트가 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            이벤트를 생성하여 시작하세요.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이벤트명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>생성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/app/events/${event.id}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {event.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[event.status] ?? 'secondary'}>
                      {STATUS_LABEL[event.status] ?? event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {EVENT_TYPE_LABEL[event.eventType] ?? event.eventType}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(event.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
