import { db } from '@/db';
import { events, eventMemberships } from '@/db/schema/events';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { EventNotFoundError } from '@/shared/lib/errors';
import type { PublicEventDto, AdminEventDto } from '../types/event.dto';

/** Get published event by slug (for public pages) */
export async function getPublicEventBySlug(slug: string): Promise<PublicEventDto> {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, slug), eq(events.status, 'published')))
    .limit(1);

  if (!event) throw new EventNotFoundError(slug);

  return {
    slug: event.slug,
    eventType: event.eventType,
    title: event.title,
    subtitle: event.subtitle,
    coverImageUrl: event.coverImageUrl,
    heroLayout: event.heroLayout,
    primaryLocale: event.primaryLocale,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    rsvpOpensAt: event.rsvpOpensAt,
    rsvpClosesAt: event.rsvpClosesAt,
    seoTitle: event.seoTitle,
    seoDescription: event.seoDescription,
    ogImageUrl: event.ogImageUrl,
  };
}

/** Get event by ID (for admin console) */
export async function getAdminEventById(eventId: string): Promise<AdminEventDto> {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) throw new EventNotFoundError(eventId);

  return {
    id: event.id,
    workspaceId: event.workspaceId,
    organizationId: event.organizationId,
    slug: event.slug,
    eventType: event.eventType,
    title: event.title,
    subtitle: event.subtitle,
    status: event.status,
    visibility: event.visibility,
    ownerUserId: event.ownerUserId,
    templateId: event.templateId,
    themeId: event.themeId,
    primaryLocale: event.primaryLocale,
    defaultTimezone: event.defaultTimezone,
    coverImageUrl: event.coverImageUrl,
    heroLayout: event.heroLayout,
    publishedAt: event.publishedAt,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    rsvpOpensAt: event.rsvpOpensAt,
    rsvpClosesAt: event.rsvpClosesAt,
    checkinEnabled: event.checkinEnabled,
    messagingEnabled: event.messagingEnabled,
    analyticsEnabled: event.analyticsEnabled,
    seoTitle: event.seoTitle,
    seoDescription: event.seoDescription,
    ogImageUrl: event.ogImageUrl,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    version: event.version,
  };
}

/** List events for a workspace (soft-deleted excluded) */
export async function listEventsByWorkspace(workspaceId: string) {
  return db
    .select()
    .from(events)
    .where(and(eq(events.workspaceId, workspaceId), isNull(events.deletedAt)))
    .orderBy(desc(events.createdAt));
}

/** Create event */
export async function createEvent(data: {
  workspaceId: string;
  slug: string;
  eventType: string;
  title: string;
  subtitle?: string;
  status?: string;
  visibility?: string;
  ownerUserId: string;
  primaryLocale?: string;
  defaultTimezone?: string;
  startsAt?: string;
  endsAt?: string;
  coverImageUrl?: string;
}) {
  const [event] = await db.insert(events).values({
    ...data,
    status: data.status ?? 'draft',
    visibility: data.visibility ?? 'private',
    primaryLocale: data.primaryLocale ?? 'ko',
    defaultTimezone: data.defaultTimezone ?? 'Asia/Seoul',
  }).returning();
  return event;
}

/** Update event */
export async function updateEvent(eventId: string, data: Partial<{
  title: string;
  subtitle: string | null;
  slug: string;
  status: string;
  visibility: string;
  primaryLocale: string;
  defaultTimezone: string;
  coverImageUrl: string;
  startsAt: string | null;
  endsAt: string | null;
  rsvpOpensAt: string | null;
  rsvpClosesAt: string | null;
  checkinEnabled: boolean;
  messagingEnabled: boolean;
  analyticsEnabled: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  publishedAt: string;
  deletedAt: string | null;
}>) {
  const [event] = await db
    .update(events)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(events.id, eventId))
    .returning();
  if (!event) throw new EventNotFoundError(eventId);
  return event;
}

/** Create event membership (e.g. add owner when creating an event) */
export async function createEventMembership(data: {
  eventId: string;
  userId: string;
  role: string;
  permissions: string[];
}) {
  const [membership] = await db.insert(eventMemberships).values({
    ...data,
    status: 'active',
  }).returning();
  return membership;
}
