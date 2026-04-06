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
import { db } from '@/db';
import { workspaceMemberships, users } from '@/db/schema/identity';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';
import { eq } from 'drizzle-orm';

interface MembersPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

const ROLE_LABEL: Record<string, string> = {
  owner: '소유자',
  admin: '관리자',
  editor: '편집자',
  viewer: '뷰어',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  active: 'default',
  invited: 'secondary',
  suspended: 'destructive',
};

const STATUS_LABEL: Record<string, string> = {
  active: '활성',
  invited: '초대됨',
  suspended: '정지',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { workspaceSlug } = await params;
  const { workspace } = await getWorkspaceBySlug(workspaceSlug);

  const members = await db
    .select({
      membership: workspaceMemberships,
      user: users,
    })
    .from(workspaceMemberships)
    .innerJoin(users, eq(workspaceMemberships.userId, users.id))
    .where(eq(workspaceMemberships.workspaceId, workspace.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">멤버 관리</h1>
          <Badge variant="secondary">총 {members.length}명</Badge>
        </div>
        <Button disabled>
          <Plus className="size-4" />
          멤버 초대
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Users className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 멤버가 없습니다
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>참여일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map(({ membership, user }) => (
                <TableRow key={membership.id}>
                  <TableCell className="font-medium">
                    {user.name ?? '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ROLE_LABEL[membership.role] ?? membership.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[membership.status] ?? 'secondary'}>
                      {STATUS_LABEL[membership.status] ?? membership.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(membership.createdAt)}
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
