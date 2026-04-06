import { relations } from "drizzle-orm";
import {
  bigserial,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { events } from "./events";
import { guests } from "./guests";
import { organizations, users, workspaces } from "./identity";

// ─── Page Events ─────────────────────────────────────────────────────────────

export const pageEvents = pgTable(
  "page_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    guestId: uuid("guest_id").references(() => guests.id),
    sessionId: text("session_id"),
    eventName: text("event_name").notNull(),
    path: text("path"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    utmJson: jsonb("utm_json").notNull().default({}),
    metadataJson: jsonb("metadata_json").notNull().default({}),
    occurredAt: timestamp("occurred_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => [
    index("page_events_event_occurred_idx").on(
      table.eventId,
      table.occurredAt,
    ),
  ],
);

// ─── Event Metrics Daily ─────────────────────────────────────────────────────

export const eventMetricsDaily = pgTable(
  "event_metrics_daily",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    metricDate: date("metric_date").notNull(),
    pageViews: integer("page_views").notNull().default(0),
    uniqueVisitors: integer("unique_visitors").notNull().default(0),
    rsvpStarted: integer("rsvp_started").notNull().default(0),
    rsvpCompleted: integer("rsvp_completed").notNull().default(0),
    attendingCount: integer("attending_count").notNull().default(0),
    declinedCount: integer("declined_count").notNull().default(0),
    checkins: integer("checkins").notNull().default(0),
    shares: integer("shares").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("event_metrics_daily_event_date_idx").on(
      table.eventId,
      table.metricDate,
    ),
    index("event_metrics_daily_event_date_desc_idx").on(
      table.eventId,
      table.metricDate,
    ),
  ],
);

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export const auditLogs = pgTable("audit_logs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  eventId: uuid("event_id").references(() => events.id),
  actorUserId: uuid("actor_user_id").references(() => users.id),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  action: text("action").notNull(),
  beforeJson: jsonb("before_json"),
  afterJson: jsonb("after_json"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const pageEventsRelations = relations(pageEvents, ({ one }) => ({
  event: one(events, {
    fields: [pageEvents.eventId],
    references: [events.id],
  }),
  guest: one(guests, {
    fields: [pageEvents.guestId],
    references: [guests.id],
  }),
}));

export const eventMetricsDailyRelations = relations(
  eventMetricsDaily,
  ({ one }) => ({
    event: one(events, {
      fields: [eventMetricsDaily.eventId],
      references: [events.id],
    }),
  }),
);

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [auditLogs.workspaceId],
    references: [workspaces.id],
  }),
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
  event: one(events, {
    fields: [auditLogs.eventId],
    references: [events.id],
  }),
  actor: one(users, {
    fields: [auditLogs.actorUserId],
    references: [users.id],
  }),
}));
