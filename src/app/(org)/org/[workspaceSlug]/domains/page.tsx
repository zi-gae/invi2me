import { Globe, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { customDomains } from '@/db/schema/themes';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';
import { eq } from 'drizzle-orm';

interface DomainsPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

const DOMAIN_STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  verified: 'default',
  pending: 'secondary',
  failed: 'destructive',
};

const DOMAIN_STATUS_LABEL: Record<string, string> = {
  verified: '확인됨',
  pending: '대기중',
  failed: '실패',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default async function DomainsPage({ params }: DomainsPageProps) {
  const { workspaceSlug } = await params;
  const { workspace } = await getWorkspaceBySlug(workspaceSlug);

  const domains = await db
    .select()
    .from(customDomains)
    .where(eq(customDomains.workspaceId, workspace.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">도메인 관리</h1>
        <Button disabled>
          <Plus className="size-4" />
          도메인 추가
        </Button>
      </div>

      {domains.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Globe className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            등록된 도메인이 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            커스텀 도메인을 추가하여 브랜드를 강화하세요.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>도메인</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>SSL</TableHead>
                <TableHead>등록일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.domain}</TableCell>
                  <TableCell>
                    <Badge variant={DOMAIN_STATUS_VARIANT[domain.status] ?? 'secondary'}>
                      {DOMAIN_STATUS_LABEL[domain.status] ?? domain.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={domain.sslStatus === 'active' ? 'default' : 'secondary'}>
                      {domain.sslStatus === 'active' ? 'SSL 활성' : domain.sslStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(domain.createdAt)}
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
