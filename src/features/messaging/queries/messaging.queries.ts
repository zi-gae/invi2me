import { db } from '@/db';
import {
  campaigns,
  campaignDeliveries,
  trackingLinks,
  messageTemplates,
} from '@/db/schema/messaging';
import { events } from '@/db/schema/events';
import { eq, desc } from 'drizzle-orm';
import { DomainError, EventNotFoundError } from '@/shared/lib/errors';

/** Create a campaign with status='draft' */
export async function createCampaign(data: {
  eventId: string;
  name: string;
  channelType: string;
  templateId?: string;
  segmentFilter?: Record<string, unknown>;
  scheduledAt?: string;
}) {
  const [campaign] = await db
    .insert(campaigns)
    .values({
      eventId: data.eventId,
      name: data.name,
      channelType: data.channelType,
      status: 'draft',
      messageTemplateId: data.templateId,
      filterJson: data.segmentFilter ?? {},
      scheduledAt: data.scheduledAt,
    })
    .returning();
  return campaign;
}

/** Update campaign status */
export async function updateCampaignStatus(
  campaignId: string,
  status: string
) {
  const [campaign] = await db
    .update(campaigns)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(campaigns.id, campaignId))
    .returning();

  if (!campaign) {
    throw new DomainError('캠페인을 찾을 수 없습니다.', {
      code: 'CAMPAIGN_NOT_FOUND',
      statusCode: 404,
    });
  }
  return campaign;
}

/** List campaigns for an event, ordered by createdAt desc */
export async function listCampaigns(eventId: string) {
  return db
    .select()
    .from(campaigns)
    .where(eq(campaigns.eventId, eventId))
    .orderBy(desc(campaigns.createdAt));
}

/** Get a single campaign by ID */
export async function getCampaignById(campaignId: string) {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!campaign) {
    throw new DomainError('캠페인을 찾을 수 없습니다.', {
      code: 'CAMPAIGN_NOT_FOUND',
      statusCode: 404,
    });
  }
  return campaign;
}

/** Bulk insert campaign deliveries with status='pending' */
export async function createCampaignDeliveries(
  campaignId: string,
  deliveries: Array<{
    guestId: string;
    channelType: string;
    recipientAddress: string;
  }>
) {
  if (deliveries.length === 0) return [];

  return db
    .insert(campaignDeliveries)
    .values(
      deliveries.map((d) => ({
        campaignId,
        guestId: d.guestId,
        status: 'pending',
      }))
    )
    .returning();
}

/** List tracking links for an event */
export async function listTrackingLinks(eventId: string) {
  return db
    .select()
    .from(trackingLinks)
    .where(eq(trackingLinks.eventId, eventId))
    .orderBy(desc(trackingLinks.createdAt));
}

/** Create a tracking link */
export async function createTrackingLink(data: {
  eventId: string;
  slug: string;
  targetUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
}) {
  const [link] = await db
    .insert(trackingLinks)
    .values({
      eventId: data.eventId,
      code: data.slug,
      targetUrl: data.targetUrl,
      source: data.utmSource,
      medium: data.utmMedium,
      campaignName: data.utmCampaign,
      content: data.utmContent,
    })
    .returning();
  return link;
}

/** List message templates accessible from an event (via workspace) */
export async function listMessageTemplates(eventId: string) {
  const [event] = await db
    .select({ workspaceId: events.workspaceId })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) throw new EventNotFoundError(eventId);

  return db
    .select()
    .from(messageTemplates)
    .where(eq(messageTemplates.workspaceId, event.workspaceId))
    .orderBy(desc(messageTemplates.createdAt));
}

/** Create a message template (resolved to workspace via eventId) */
export async function createMessageTemplate(data: {
  eventId: string;
  name: string;
  channelType: string;
  subjectTemplate?: string;
  bodyTemplate: string;
  variables: unknown[];
}) {
  const [event] = await db
    .select({ workspaceId: events.workspaceId })
    .from(events)
    .where(eq(events.id, data.eventId))
    .limit(1);

  if (!event) throw new EventNotFoundError(data.eventId);

  const [template] = await db
    .insert(messageTemplates)
    .values({
      workspaceId: event.workspaceId,
      name: data.name,
      channelType: data.channelType,
      subjectTemplate: data.subjectTemplate,
      bodyTemplate: data.bodyTemplate,
      variablesJson: data.variables,
    })
    .returning();
  return template;
}
