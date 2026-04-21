import { Users, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listGuestsByEvent } from '@/features/guests/queries/guest.queries';

interface GuestsPageProps {
  params: Promise<{ eventId: string }>;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  invited: { label: '초대됨', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  responded: { label: '응답함', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  checked_in: { label: '체크인', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  declined: { label: '불참', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

const GUEST_TYPE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  primary: 'default',
  companion: 'secondary',
  child: 'outline',
  vip: 'destructive',
};

const GUEST_TYPE_LABEL: Record<string, string> = {
  primary: '본인',
  companion: '동반인',
  child: '아동',
  vip: 'VIP',
};

const SIDE_LABEL: Record<string, string> = {
  groom: '신랑측',
  bride: '신부측',
  mutual: '공통',
};

const CHANNEL_LABEL: Record<string, string> = {
  sms: 'SMS',
  email: '이메일',
  kakao: '카카오톡',
  link: '링크',
  manual: '직접입력',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default async function GuestsPage({ params }: GuestsPageProps) {
  const { eventId } = await params;
  const guests = await listGuestsByEvent(eventId);

  return (
    <div className="h-full overflow-y-auto space-y-6 px-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">게스트 관리</h1>
          <Badge variant="secondary">총 {guests.length}명</Badge>
        </div>
        <Button disabled>
          <Plus className="size-4" />
          게스트 추가
        </Button>
      </div>

      {/* Guest Table */}
      {guests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Users className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 등록된 게스트가 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            게스트를 추가하여 초대를 시작하세요.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>측</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>초대 채널</TableHead>
                <TableHead>등록일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => {
                const statusCfg = STATUS_CONFIG[guest.status];
                return (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">
                      {guest.fullName}
                    </TableCell>
                    <TableCell>
                      <Badge variant={GUEST_TYPE_VARIANT[guest.guestType] ?? 'secondary'}>
                        {GUEST_TYPE_LABEL[guest.guestType] ?? guest.guestType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {guest.sideType
                        ? (SIDE_LABEL[guest.sideType] ?? guest.sideType)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {statusCfg ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {guest.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {guest.invitationChannel
                        ? (CHANNEL_LABEL[guest.invitationChannel] ?? guest.invitationChannel)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(guest.createdAt)}
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
