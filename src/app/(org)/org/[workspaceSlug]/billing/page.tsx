import { CreditCard, CalendarDays, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';
import { listEventsByWorkspace } from '@/features/events/queries/event.queries';
import { db } from '@/db';
import { guests } from '@/db/schema/guests';
import { eq, sql, inArray } from 'drizzle-orm';

interface BillingPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { workspaceSlug } = await params;
  const { workspace } = await getWorkspaceBySlug(workspaceSlug);

  const workspaceEvents = await listEventsByWorkspace(workspace.id);
  const eventCount = workspaceEvents.length;

  let guestCount = 0;
  if (eventCount > 0) {
    const eventIds = workspaceEvents.map((e) => e.id);
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(guests)
      .where(inArray(guests.eventId, eventIds));
    guestCount = result?.count ?? 0;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">청구/플랜 관리</h1>

      {/* Current Plan */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <CreditCard className="size-5 text-muted-foreground" />
          <CardTitle className="text-lg">현재 플랜</CardTitle>
          <Badge>Free Plan</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            무료 플랜을 사용 중입니다. 더 많은 기능이 필요하시면 플랜을 업그레이드하세요.
          </p>
          <Button disabled>플랜 업그레이드</Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Usage */}
      <h2 className="text-lg font-semibold">사용량</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              이벤트 수
            </CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              총 게스트 수
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guestCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
