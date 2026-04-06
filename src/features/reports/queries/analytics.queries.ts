import { db } from '@/db';
import {
  pageEvents,
  eventMetricsDaily,
  auditLogs,
} from '@/db/schema/analytics';
import { eq, and, desc, gte, lte, sql, count } from 'drizzle-orm';
import { DomainError } from '@/shared/lib/errors';

/** Track a page event */
export async function trackPageEvent(data: {
  eventId: string;
  eventType: string;
  pageUrl?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  guestId?: string;
  sessionId?: string;
  deviceType?: string;
  browserName?: string;
  occurredAt?: string;
}) {
  const [event] = await db
    .insert(pageEvents)
    .values({
      eventId: data.eventId,
      eventName: data.eventType,
      path: data.pageUrl,
      referrer: data.referrer,
      guestId: data.guestId,
      sessionId: data.sessionId,
      utmJson: {
        source: data.utmSource,
        medium: data.utmMedium,
        campaign: data.utmCampaign,
      },
      metadataJson: {
        deviceType: data.deviceType,
        browserName: data.browserName,
      },
      occurredAt: data.occurredAt ?? new Date().toISOString(),
    })
    .returning();
  return event;
}

/** Get page event stats for last N days */
export async function getPageEventStats(eventId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString();

  const [stats] = await db
    .select({
      totalPageViews: count(pageEvents.id),
      uniqueVisitors: sql<number>`COUNT(DISTINCT ${pageEvents.sessionId})`,
    })
    .from(pageEvents)
    .where(
      and(eq(pageEvents.eventId, eventId), gte(pageEvents.occurredAt, sinceStr))
    );

  const topReferrers = await db
    .select({
      referrer: pageEvents.referrer,
      visits: count(pageEvents.id),
    })
    .from(pageEvents)
    .where(
      and(
        eq(pageEvents.eventId, eventId),
        gte(pageEvents.occurredAt, sinceStr),
        sql`${pageEvents.referrer} IS NOT NULL`
      )
    )
    .groupBy(pageEvents.referrer)
    .orderBy(desc(count(pageEvents.id)))
    .limit(10);

  return {
    totalPageViews: stats?.totalPageViews ?? 0,
    uniqueVisitors: stats?.uniqueVisitors ?? 0,
    topReferrers,
  };
}

/** Get daily metrics rows for a date range */
export async function getDailyMetrics(
  eventId: string,
  startDate: string,
  endDate: string
) {
  return db
    .select()
    .from(eventMetricsDaily)
    .where(
      and(
        eq(eventMetricsDaily.eventId, eventId),
        gte(eventMetricsDaily.metricDate, startDate),
        lte(eventMetricsDaily.metricDate, endDate)
      )
    )
    .orderBy(desc(eventMetricsDaily.metricDate));
}

/** Upsert a daily metric by type */
export async function upsertDailyMetrics(data: {
  eventId: string;
  metricDate: string;
  metricType: string;
  metricValue: number;
}) {
  const columnMap: Record<string, string> = {
    pageViews: 'page_views',
    uniqueVisitors: 'unique_visitors',
    rsvpStarted: 'rsvp_started',
    rsvpCompleted: 'rsvp_completed',
    attendingCount: 'attending_count',
    declinedCount: 'declined_count',
    checkins: 'checkins',
    shares: 'shares',
  };

  const column = columnMap[data.metricType];
  if (!column) {
    throw new DomainError('유효하지 않은 메트릭 타입입니다.', {
      code: 'INVALID_METRIC_TYPE',
      statusCode: 400,
    });
  }

  await db.execute(sql`
    INSERT INTO event_metrics_daily (id, event_id, metric_date, ${sql.raw(column)})
    VALUES (gen_random_uuid(), ${data.eventId}, ${data.metricDate}, ${data.metricValue})
    ON CONFLICT (event_id, metric_date) DO UPDATE
    SET ${sql.raw(column)} = ${data.metricValue},
        updated_at = NOW()
  `);
}

/** Create an audit log entry */
export async function createAuditLog(data: {
  workspaceId: string;
  eventId?: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
}) {
  const [log] = await db
    .insert(auditLogs)
    .values({
      workspaceId: data.workspaceId,
      eventId: data.eventId,
      actorUserId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      beforeJson: data.oldValues,
      afterJson: data.newValues,
      ipAddress: data.ipAddress,
    })
    .returning();
  return log;
}

/** List audit logs for a workspace with optional filtering */
export async function listAuditLogs(
  workspaceId: string,
  options?: { eventId?: string; limit?: number; offset?: number }
) {
  const conditions = [eq(auditLogs.workspaceId, workspaceId)];
  if (options?.eventId) {
    conditions.push(eq(auditLogs.eventId, options.eventId));
  }

  return db
    .select()
    .from(auditLogs)
    .where(and(...conditions))
    .orderBy(desc(auditLogs.createdAt))
    .limit(options?.limit ?? 50)
    .offset(options?.offset ?? 0);
}
