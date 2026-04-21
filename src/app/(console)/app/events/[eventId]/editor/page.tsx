import { Layout } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { db } from '@/db';
import { eventPages, eventSections } from '@/db/schema/content';
import { eq } from 'drizzle-orm';
import { CreatePageButton } from '@/features/event-editor/components/create-page-button';
import { PublishButton } from '@/features/event-editor/components/publish-button';
import { AddSectionDialog } from '@/features/event-editor/components/add-section-dialog';
import { SortableSectionList } from '@/features/event-editor/components/sortable-section-list';
import { EditorPreviewPanel } from '@/features/event-editor/components/editor-preview-panel';
import { EditorLayoutTabs } from '@/features/event-editor/components/editor-layout-tabs';
import type { SectionBlockDto } from '@/features/event-editor/types/editor.dto';

interface EditorPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { eventId } = await params;

  const pages = await db
    .select()
    .from(eventPages)
    .where(eq(eventPages.eventId, eventId))
    .orderBy(eventPages.createdAt);

  if (pages.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">페이지 편집기</h1>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Layout className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 생성된 페이지가 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            페이지를 생성하면 기본 섹션이 자동으로 추가됩니다.
          </p>
          <div className="mt-4">
            <CreatePageButton eventId={eventId} />
          </div>
        </div>
      </div>
    );
  }

  const firstPage = pages[0];
  const sections = await db
    .select()
    .from(eventSections)
    .where(eq(eventSections.eventPageId, firstPage.id))
    .orderBy(eventSections.sortOrder);

  const nextSortOrder = sections.length > 0
    ? Math.max(...sections.map((s) => s.sortOrder)) + 1
    : 0;

  const sectionDtos: SectionBlockDto[] = sections.map((s) => ({
    id: s.id,
    sectionType: s.sectionType,
    sectionKey: s.sectionKey,
    sortOrder: s.sortOrder,
    isEnabled: s.isEnabled,
    propsJson: (s.propsJson as Record<string, unknown>) ?? {},
    visibilityRules: (s.visibilityRules as Record<string, unknown>) ?? {},
  }));

  const previewPanel = (
    <EditorPreviewPanel sections={sectionDtos} />
  );

  const sectionListPanel = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">페이지 편집기</h1>
          <Badge variant="secondary">{firstPage.title ?? firstPage.slug}</Badge>
          {firstPage.publishedVersionId && (
            <Badge variant="default">퍼블리시됨</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <AddSectionDialog
            eventId={eventId}
            pageId={firstPage.id}
            nextSortOrder={nextSortOrder}
          />
          <PublishButton eventId={eventId} pageId={firstPage.id} />
        </div>
      </div>

      {/* Section List */}
      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Layout className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 섹션이 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            섹션을 추가하여 페이지를 구성하세요.
          </p>
        </div>
      ) : (
        <SortableSectionList
          eventId={eventId}
          sections={sections.map((s) => ({
            id: s.id,
            sectionType: s.sectionType,
            sectionKey: s.sectionKey,
            sortOrder: s.sortOrder,
            isEnabled: s.isEnabled,
            propsJson: (s.propsJson as Record<string, unknown>) ?? {},
          }))}
        />
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden h-[calc(100dvh-4rem)] lg:grid lg:grid-cols-[1fr_1fr] lg:gap-0">
        <div className="overflow-y-auto border-r">
          {previewPanel}
        </div>
        <div className="overflow-y-auto p-6">
          {sectionListPanel}
        </div>
      </div>

      {/* Mobile / Tablet: tabs */}
      <div className="lg:hidden">
        <EditorLayoutTabs
          previewPanel={previewPanel}
          sectionListPanel={sectionListPanel}
        />
      </div>
    </>
  );
}
