import { db } from '@/db';
import { checkinSessions, checkinLogs, qrTokens } from '@/db/schema/checkin';
import { guests } from '@/db/schema/guests';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  CheckinDuplicateError,
  InvalidTokenError,
  GuestNotFoundError,
} from '@/shared/lib/errors';
import { generateToken } from '@/shared/server/crypto';
import type {
  CheckinLogDto,
  CheckinSessionDto,
  CheckinSummaryDto,
} from '../types/checkin.dto';

export async function createCheckinSession(data: {
  eventId: string;
  name: string;
  scheduleId?: string;
  startsAt?: string;
  endsAt?: string;
}) {
  const [session] = await db
    .insert(checkinSessions)
    .values({
      ...data,
      status: 'active',
    })
    .returning();
  return session;
}

export async function listCheckinSessions(
  eventId: string,
): Promise<CheckinSessionDto[]> {
  const sessions = await db
    .select()
    .from(checkinSessions)
    .where(eq(checkinSessions.eventId, eventId))
    .orderBy(desc(checkinSessions.createdAt));

  const result: CheckinSessionDto[] = [];
  for (const s of sessions) {
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(checkinLogs)
      .where(
        and(
          eq(checkinLogs.checkinSessionId, s.id),
          eq(checkinLogs.status, 'success'),
        ),
      );
    result.push({
      id: s.id,
      eventId: s.eventId,
      name: s.name,
      scheduleId: s.scheduleId,
      status: s.status,
      startsAt: s.startsAt,
      endsAt: s.endsAt,
      totalCheckins: countResult?.count ?? 0,
    });
  }
  return result;
}

export async function performCheckin(data: {
  eventId: string;
  guestId: string;
  method: string;
  checkinSessionId?: string;
  checkedInBy?: string;
  deviceInfo?: Record<string, unknown>;
}): Promise<CheckinLogDto> {
  const [guest] = await db
    .select()
    .from(guests)
    .where(and(eq(guests.id, data.guestId), eq(guests.eventId, data.eventId)))
    .limit(1);

  if (!guest) throw new GuestNotFoundError(data.guestId);

  const [existing] = await db
    .select()
    .from(checkinLogs)
    .where(
      and(
        eq(checkinLogs.eventId, data.eventId),
        eq(checkinLogs.guestId, data.guestId),
        eq(checkinLogs.status, 'success'),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .insert(checkinLogs)
      .values({
        eventId: data.eventId,
        checkinSessionId: data.checkinSessionId,
        guestId: data.guestId,
        method: data.method,
        status: 'duplicate',
        checkedInAt: new Date().toISOString(),
        checkedInBy: data.checkedInBy,
        deviceInfo: data.deviceInfo ?? {},
      })
      .returning();

    throw new CheckinDuplicateError(data.guestId);
  }

  const [log] = await db
    .insert(checkinLogs)
    .values({
      eventId: data.eventId,
      checkinSessionId: data.checkinSessionId,
      guestId: data.guestId,
      method: data.method,
      status: 'success',
      checkedInAt: new Date().toISOString(),
      checkedInBy: data.checkedInBy,
      deviceInfo: data.deviceInfo ?? {},
    })
    .returning();

  await db
    .update(guests)
    .set({
      status: 'checked_in',
      updatedAt: new Date().toISOString(),
    })
    .where(eq(guests.id, data.guestId));

  return {
    id: log.id,
    guestId: log.guestId,
    guestName: guest.fullName,
    method: log.method,
    status: log.status,
    checkedInAt: log.checkedInAt,
    checkedInBy: log.checkedInBy,
  };
}

export async function performQrCheckin(token: string) {
  const [qrToken] = await db
    .select()
    .from(qrTokens)
    .where(eq(qrTokens.token, token))
    .limit(1);

  if (!qrToken) throw new InvalidTokenError();

  if (qrToken.expiresAt && new Date(qrToken.expiresAt) < new Date()) {
    throw new InvalidTokenError();
  }

  if (qrToken.revokedAt) {
    throw new InvalidTokenError();
  }

  return performCheckin({
    eventId: qrToken.eventId,
    guestId: qrToken.guestId,
    method: 'qr',
  });
}

export async function generateQrToken(
  eventId: string,
  guestId: string,
  expiresAt?: string,
) {
  const token = generateToken(32);
  const [qrToken] = await db
    .insert(qrTokens)
    .values({
      eventId,
      guestId,
      token,
      expiresAt,
    })
    .returning();
  return qrToken;
}

export async function getCheckinSummary(
  eventId: string,
): Promise<CheckinSummaryDto> {
  const [guestCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(guests)
    .where(eq(guests.eventId, eventId));

  const [checkedIn] = await db
    .select({
      count: sql<number>`count(distinct ${checkinLogs.guestId})::int`,
    })
    .from(checkinLogs)
    .where(
      and(
        eq(checkinLogs.eventId, eventId),
        eq(checkinLogs.status, 'success'),
      ),
    );

  const [duplicates] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(checkinLogs)
    .where(
      and(
        eq(checkinLogs.eventId, eventId),
        eq(checkinLogs.status, 'duplicate'),
      ),
    );

  return {
    totalGuests: guestCount?.count ?? 0,
    checkedIn: checkedIn?.count ?? 0,
    pending: (guestCount?.count ?? 0) - (checkedIn?.count ?? 0),
    duplicateAttempts: duplicates?.count ?? 0,
  };
}

export async function listCheckinLogs(
  eventId: string,
  limit = 50,
): Promise<CheckinLogDto[]> {
  const rows = await db
    .select({
      log: checkinLogs,
      guestName: guests.fullName,
    })
    .from(checkinLogs)
    .innerJoin(guests, eq(checkinLogs.guestId, guests.id))
    .where(eq(checkinLogs.eventId, eventId))
    .orderBy(desc(checkinLogs.checkedInAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.log.id,
    guestId: r.log.guestId,
    guestName: r.guestName,
    method: r.log.method,
    status: r.log.status,
    checkedInAt: r.log.checkedInAt,
    checkedInBy: r.log.checkedInBy,
  }));
}
