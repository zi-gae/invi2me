import { db } from '@/db';
import { guests, guestGroups } from '@/db/schema/guests';
import { eq, and, desc, sql } from 'drizzle-orm';
import { GuestNotFoundError } from '@/shared/lib/errors';
import { generateToken, maskEmail, maskPhone } from '@/shared/server/crypto';
import type { AdminGuestDto } from '../types/guest.dto';

function toAdminGuestDto(guest: typeof guests.$inferSelect): AdminGuestDto {
  return {
    id: guest.id,
    eventId: guest.eventId,
    guestGroupId: guest.guestGroupId,
    firstName: guest.firstName,
    lastName: guest.lastName,
    fullName: guest.fullName,
    email: guest.email ? maskEmail(guest.email) : null,
    phone: guest.phone ? maskPhone(guest.phone) : null,
    locale: guest.locale,
    guestType: guest.guestType,
    sideType: guest.sideType,
    status: guest.status,
    notes: guest.notes,
    plusOneAllowed: guest.plusOneAllowed,
    maxCompanionCount: guest.maxCompanionCount,
    seatAssignmentRequired: guest.seatAssignmentRequired,
    invitationChannel: guest.invitationChannel,
    createdAt: guest.createdAt,
    updatedAt: guest.updatedAt,
  };
}

/** List guests for an event with optional filters */
export async function listGuestsByEvent(
  eventId: string,
  options?: { status?: string; groupId?: string; limit?: number; offset?: number }
) {
  const conditions = [eq(guests.eventId, eventId)];
  if (options?.status) conditions.push(eq(guests.status, options.status));
  if (options?.groupId) conditions.push(eq(guests.guestGroupId, options.groupId));

  const rows = await db
    .select()
    .from(guests)
    .where(and(...conditions))
    .orderBy(desc(guests.createdAt))
    .limit(options?.limit ?? 50)
    .offset(options?.offset ?? 0);

  return rows.map(toAdminGuestDto);
}

/** Get guest count by event */
export async function getGuestCount(eventId: string) {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(guests)
    .where(eq(guests.eventId, eventId));
  return result?.count ?? 0;
}

/** Get guest by ID */
export async function getGuestById(guestId: string) {
  const [guest] = await db
    .select()
    .from(guests)
    .where(eq(guests.id, guestId))
    .limit(1);
  if (!guest) throw new GuestNotFoundError(guestId);
  return guest;
}

/** Get guest by invitation token (for personalized links) */
export async function getGuestByToken(token: string) {
  const [guest] = await db
    .select()
    .from(guests)
    .where(eq(guests.invitationToken, token))
    .limit(1);
  if (!guest) throw new GuestNotFoundError(token);
  return guest;
}

/** Create a single guest with auto-generated invitation token */
export async function createGuest(data: {
  eventId: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  guestType: string;
  sideType?: string;
  guestGroupId?: string;
  locale?: string;
  notes?: string;
  plusOneAllowed?: boolean;
  maxCompanionCount?: number;
  seatAssignmentRequired?: boolean;
}) {
  const invitationToken = generateToken(32);

  const [guest] = await db.insert(guests).values({
    ...data,
    status: 'invited',
    invitationToken,
  }).returning();
  return guest;
}

/** Bulk create guests */
export async function createGuestsBulk(eventId: string, guestList: Array<{
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  guestType: string;
  sideType?: string;
  guestGroupId?: string;
}>) {
  const values = guestList.map((g) => ({
    eventId,
    ...g,
    status: 'invited' as const,
    invitationToken: generateToken(32),
  }));
  return db.insert(guests).values(values).returning();
}

/** Update guest status */
export async function updateGuestStatus(guestId: string, status: string) {
  const [guest] = await db
    .update(guests)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(guests.id, guestId))
    .returning();
  if (!guest) throw new GuestNotFoundError(guestId);
  return guest;
}

/** List guest groups for event */
export async function listGuestGroups(eventId: string) {
  return db
    .select()
    .from(guestGroups)
    .where(eq(guestGroups.eventId, eventId))
    .orderBy(guestGroups.sortOrder);
}

/** Create guest group */
export async function createGuestGroup(eventId: string, name: string, color?: string) {
  const [group] = await db.insert(guestGroups).values({
    eventId,
    name,
    color,
  }).returning();
  return group;
}
