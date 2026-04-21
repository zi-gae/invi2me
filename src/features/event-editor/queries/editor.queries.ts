import { db } from '@/db';
import {
  eventPages,
  eventPageVersions,
  eventSections,
} from '@/db/schema/content';
import { events } from '@/db/schema/events';
import { eq, and, desc, asc, sql, max } from 'drizzle-orm';
import { DomainError, PageNotFoundError } from '@/shared/lib/errors';

/** List pages for an event */
export async function listEventPages(eventId: string) {
  return db
    .select()
    .from(eventPages)
    .where(eq(eventPages.eventId, eventId))
    .orderBy(asc(eventPages.createdAt));
}

/** Create an event page */
export async function createEventPage(data: {
  eventId: string;
  locale?: string;
  title?: string;
  slug: string;
  pageType?: string;
  isHome?: boolean;
}) {
  const [page] = await db
    .insert(eventPages)
    .values({
      eventId: data.eventId,
      locale: data.locale ?? 'ko',
      title: data.title,
      slug: data.slug,
      pageType: data.pageType ?? 'main',
      status: 'draft',
      isHome: data.isHome ?? false,
    })
    .returning();
  return page;
}

/** Add a section to a page */
export async function createSection(data: {
  eventPageId: string;
  sectionType: string;
  sectionKey: string;
  sortOrder: number;
  propsJson?: Record<string, unknown>;
  isEnabled?: boolean;
}) {
  const [section] = await db
    .insert(eventSections)
    .values({
      eventPageId: data.eventPageId,
      sectionType: data.sectionType,
      sectionKey: data.sectionKey,
      sortOrder: data.sortOrder,
      propsJson: data.propsJson ?? {},
      isEnabled: data.isEnabled ?? true,
    })
    .returning();
  return section;
}

/** Update a section */
export async function updateSection(
  sectionId: string,
  data: Partial<{
    sectionType: string;
    sortOrder: number;
    propsJson: Record<string, unknown>;
    isEnabled: boolean;
    visibilityRules: Record<string, unknown>;
  }>
) {
  const [section] = await db
    .update(eventSections)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(eventSections.id, sectionId))
    .returning();

  if (!section) {
    throw new DomainError('섹션을 찾을 수 없습니다.', {
      code: 'SECTION_NOT_FOUND',
      statusCode: 404,
    });
  }
  return section;
}

/** Delete a section */
export async function deleteSection(sectionId: string) {
  const [section] = await db
    .delete(eventSections)
    .where(eq(eventSections.id, sectionId))
    .returning();

  if (!section) {
    throw new DomainError('섹션을 찾을 수 없습니다.', {
      code: 'SECTION_NOT_FOUND',
      statusCode: 404,
    });
  }
  return section;
}

/** Reorder sections by updating sortOrder for each id in order */
export async function reorderSections(
  eventPageId: string,
  orderedIds: string[]
) {
  await db.transaction(async (tx) => {
    const now = new Date().toISOString();
    for (let i = 0; i < orderedIds.length; i++) {
      await tx
        .update(eventSections)
        .set({ sortOrder: i, updatedAt: now })
        .where(
          and(
            eq(eventSections.id, orderedIds[i]),
            eq(eventSections.eventPageId, eventPageId)
          )
        );
    }
  });
}

/** Reorder sections by ID only (no eventPageId filter), in a single transaction */
export async function reorderSectionsById(orderedIds: string[]) {
  await db.transaction(async (tx) => {
    const now = new Date().toISOString();
    for (let i = 0; i < orderedIds.length; i++) {
      await tx
        .update(eventSections)
        .set({ sortOrder: i, updatedAt: now })
        .where(eq(eventSections.id, orderedIds[i]));
    }
  });
}

/**
 * Publish a page:
 * 1. Snapshot current sections into a new version
 * 2. Set publishedVersionId on the page
 * 3. Update event status to 'published' if not already
 */
export async function publishPage(pageId: string, publishedBy: string) {
  return db.transaction(async (tx) => {
    const [page] = await tx
      .select()
      .from(eventPages)
      .where(eq(eventPages.id, pageId))
      .limit(1);

    if (!page) throw new PageNotFoundError(pageId);

    // Snapshot current sections as content
    const sections = await tx
      .select()
      .from(eventSections)
      .where(eq(eventSections.eventPageId, pageId))
      .orderBy(asc(eventSections.sortOrder));

    // Determine next version number
    const [maxResult] = await tx
      .select({ maxNo: max(eventPageVersions.versionNo) })
      .from(eventPageVersions)
      .where(eq(eventPageVersions.eventPageId, pageId));

    const nextVersionNo = (maxResult?.maxNo ?? 0) + 1;

    const now = new Date().toISOString();

    // Create version
    const [version] = await tx
      .insert(eventPageVersions)
      .values({
        eventPageId: pageId,
        versionNo: nextVersionNo,
        schemaVersion: 1,
        contentJson: sections,
        publishedAt: now,
        createdBy: publishedBy,
      })
      .returning();

    // Update page with published version
    await tx
      .update(eventPages)
      .set({
        publishedVersionId: version.id,
        status: 'published',
        updatedAt: now,
      })
      .where(eq(eventPages.id, pageId));

    // Update event status to 'published' if not already
    const [event] = await tx
      .select()
      .from(events)
      .where(eq(events.id, page.eventId))
      .limit(1);

    if (event && event.status !== 'published') {
      await tx
        .update(events)
        .set({
          status: 'published',
          publishedAt: now,
          updatedAt: now,
        })
        .where(eq(events.id, page.eventId));
    }

    return version;
  });
}

/** Get page version history ordered by version number desc */
export async function getPageVersionHistory(pageId: string) {
  return db
    .select()
    .from(eventPageVersions)
    .where(eq(eventPageVersions.eventPageId, pageId))
    .orderBy(desc(eventPageVersions.versionNo));
}
