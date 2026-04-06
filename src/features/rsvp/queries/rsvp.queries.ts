import { db } from '@/db';
import { rsvpForms, rsvpResponses } from '@/db/schema/rsvp';
import { guests } from '@/db/schema/guests';
import { eq, and, sql } from 'drizzle-orm';
import { RsvpAlreadySubmittedError } from '@/shared/lib/errors';
import type { AdminRsvpResponseDto, RsvpSummaryDto } from '../types/rsvp.dto';

/** Get default RSVP form for an event */
export async function getDefaultRsvpForm(eventId: string) {
  const [form] = await db
    .select()
    .from(rsvpForms)
    .where(and(eq(rsvpForms.eventId, eventId), eq(rsvpForms.isDefault, true)))
    .limit(1);
  return form ?? null;
}

/** Submit RSVP response (prevents duplicates, updates guest status) */
export async function submitRsvpResponse(data: {
  eventId: string;
  rsvpFormId: string;
  guestId: string;
  attendanceStatus: string;
  partySize: number;
  mealCount: number;
  sourceType: string;
  sourceRef?: string;
  answersJson?: Record<string, unknown>;
  messageToCouple?: string;
  consentsJson?: Record<string, boolean>;
}) {
  const [existing] = await db
    .select()
    .from(rsvpResponses)
    .where(and(eq(rsvpResponses.eventId, data.eventId), eq(rsvpResponses.guestId, data.guestId)))
    .limit(1);

  if (existing) {
    throw new RsvpAlreadySubmittedError(data.guestId);
  }

  const [response] = await db.insert(rsvpResponses).values({
    eventId: data.eventId,
    rsvpFormId: data.rsvpFormId,
    guestId: data.guestId,
    attendanceStatus: data.attendanceStatus,
    partySize: data.partySize,
    mealCount: data.mealCount,
    submittedAt: new Date().toISOString(),
    sourceType: data.sourceType,
    sourceRef: data.sourceRef,
    answersJson: data.answersJson ?? {},
    messageToCouple: data.messageToCouple,
    consentsJson: data.consentsJson ?? {},
  }).returning();

  // Sync guest status with attendance
  await db.update(guests).set({
    status: data.attendanceStatus === 'not_attending' ? 'declined' : 'responded',
    updatedAt: new Date().toISOString(),
  }).where(eq(guests.id, data.guestId));

  return response;
}

/** Get RSVP summary counts for an event */
export async function getRsvpSummary(eventId: string): Promise<RsvpSummaryDto> {
  const [summary] = await db
    .select({
      total: sql<number>`count(*)::int`,
      attending: sql<number>`count(*) filter (where ${rsvpResponses.attendanceStatus} = 'attending')::int`,
      notAttending: sql<number>`count(*) filter (where ${rsvpResponses.attendanceStatus} = 'not_attending')::int`,
      maybe: sql<number>`count(*) filter (where ${rsvpResponses.attendanceStatus} = 'maybe')::int`,
      totalPartySize: sql<number>`coalesce(sum(${rsvpResponses.partySize}), 0)::int`,
      totalMealCount: sql<number>`coalesce(sum(${rsvpResponses.mealCount}), 0)::int`,
    })
    .from(rsvpResponses)
    .where(eq(rsvpResponses.eventId, eventId));

  return summary ?? {
    total: 0,
    attending: 0,
    notAttending: 0,
    maybe: 0,
    totalPartySize: 0,
    totalMealCount: 0,
  };
}

/** List RSVP responses with guest names (for admin) */
export async function listRsvpResponses(eventId: string): Promise<AdminRsvpResponseDto[]> {
  const rows = await db
    .select({
      response: rsvpResponses,
      guestName: guests.fullName,
    })
    .from(rsvpResponses)
    .innerJoin(guests, eq(rsvpResponses.guestId, guests.id))
    .where(eq(rsvpResponses.eventId, eventId));

  return rows.map((row) => ({
    id: row.response.id,
    eventId: row.response.eventId,
    guestId: row.response.guestId,
    guestName: row.guestName,
    attendanceStatus: row.response.attendanceStatus,
    partySize: row.response.partySize,
    mealCount: row.response.mealCount,
    submittedAt: row.response.submittedAt,
    sourceType: row.response.sourceType,
    answersJson: row.response.answersJson as Record<string, unknown>,
    messageToCouple: row.response.messageToCouple,
    createdAt: row.response.createdAt,
    updatedAt: row.response.updatedAt,
  }));
}
