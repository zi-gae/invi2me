import { Layout, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { eventTemplates } from '@/db/schema/themes';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';
import { eq } from 'drizzle-orm';

interface TemplatesPageProps {
  params: Promise<{ workspaceSlug: string }>;
}

export default async function TemplatesPage({ params }: TemplatesPageProps) {
  const { workspaceSlug } = await params;
  const { workspace } = await getWorkspaceBySlug(workspaceSlug);

  const templates = await db
    .select()
    .from(eventTemplates)
    .where(eq(eventTemplates.workspaceId, workspace.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">템플릿 관리</h1>
        <Button disabled>
          <Plus className="size-4" />
          템플릿 만들기
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Layout className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 템플릿이 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            템플릿을 만들어 이벤트 제작을 빠르게 시작하세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <Badge variant="outline">{template.category}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {template.description ?? '설명 없음'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
