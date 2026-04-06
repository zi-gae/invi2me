import { db } from '@/db';
import { eventPages, eventPageVersions, eventSections } from '@/db/schema/content';
import { events } from '@/db/schema/events';
import { eq, and } from 'drizzle-orm';
import { PageNotFoundError, EventNotFoundError } from '@/shared/lib/errors';
import type { PublishedPageDto, SectionBlockDto } from '../types/editor.dto';

/**
 * Get published page for public rendering.
 * Always reads from published_version_id — never draft.
 */
export async function getPublishedPage(eventSlug: string, locale = 'ko'): Promise<PublishedPageDto> {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, eventSlug), eq(events.status, 'published')))
    .limit(1);

  if (!event) throw new EventNotFoundError(eventSlug);

  const [page] = await db
    .select()
    .from(eventPages)
    .where(and(
      eq(eventPages.eventId, event.id),
      eq(eventPages.locale, locale),
      eq(eventPages.isHome, true)
    ))
    .limit(1);

  if (!page) throw new PageNotFoundError(`${eventSlug}/${locale}`);

  let themeTokens: Record<string, unknown> = {};
  if (page.publishedVersionId) {
    const [version] = await db
      .select()
      .from(eventPageVersions)
      .where(eq(eventPageVersions.id, page.publishedVersionId))
      .limit(1);
    if (version) {
      themeTokens = version.themeTokens as Record<string, unknown>;
    }
  }

  const sections = await db
    .select()
    .from(eventSections)
    .where(and(
      eq(eventSections.eventPageId, page.id),
      eq(eventSections.isEnabled, true)
    ))
    .orderBy(eventSections.sortOrder);

  const sectionDtos: SectionBlockDto[] = sections.map((s) => ({
    id: s.id,
    sectionType: s.sectionType,
    sectionKey: s.sectionKey,
    sortOrder: s.sortOrder,
    isEnabled: s.isEnabled,
    propsJson: s.propsJson as Record<string, unknown>,
    visibilityRules: s.visibilityRules as Record<string, unknown>,
  }));

  return {
    eventSlug: event.slug,
    locale,
    title: page.title,
    sections: sectionDtos,
    themeTokens,
  };
}

/**
 * Get page for editing (admin) — includes all sections regardless of enabled state.
 */
export async function getPageForEditing(eventId: string, pageId: string) {
  const [page] = await db
    .select()
    .from(eventPages)
    .where(and(eq(eventPages.id, pageId), eq(eventPages.eventId, eventId)))
    .limit(1);

  if (!page) throw new PageNotFoundError(pageId);

  const sections = await db
    .select()
    .from(eventSections)
    .where(eq(eventSections.eventPageId, page.id))
    .orderBy(eventSections.sortOrder);

  return { page, sections };
}
