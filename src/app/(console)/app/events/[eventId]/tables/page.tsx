import { Table2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { seatingAreas, tables } from '@/db/schema/seating';
import { eq, sql } from 'drizzle-orm';

interface TablesPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function TablesPage({ params }: TablesPageProps) {
  const { eventId } = await params;

  const areas = await db
    .select({
      area: seatingAreas,
      tableCount: sql<number>`count(${tables.id})::int`,
      totalCapacity: sql<number>`coalesce(sum(${tables.capacity}), 0)::int`,
    })
    .from(seatingAreas)
    .leftJoin(tables, eq(tables.seatingAreaId, seatingAreas.id))
    .where(eq(seatingAreas.eventId, eventId))
    .groupBy(seatingAreas.id)
    .orderBy(seatingAreas.sortOrder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">좌석/테이블 관리</h1>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Plus className="size-4" />
            구역 추가
          </Button>
          <Button disabled>
            <Plus className="size-4" />
            테이블 추가
          </Button>
        </div>
      </div>

      {/* Seating Areas */}
      {areas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Table2 className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            좌석 배치를 시작하세요
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            구역과 테이블을 추가하여 좌석을 관리하세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {areas.map(({ area, tableCount, totalCapacity }) => (
            <Card key={area.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{area.name}</CardTitle>
                <Badge variant="outline">구역</Badge>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">테이블</dt>
                    <dd className="font-medium">{tableCount}개</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">총 수용</dt>
                    <dd className="font-medium">{totalCapacity}명</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
