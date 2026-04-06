import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { events, eventSchedules } from "./events";
import { guests } from "./guests";
import { users } from "./identity";

// ─── Checkin Sessions ────────────────────────────────────────────────────────

export const checkinSessions = pgTable("checkin_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  name: text("name").notNull(),
  scheduleId: uuid("schedule_id").references(() => eventSchedules.id),
  startsAt: timestamp("starts_at", { withTimezone: true, mode: "string" }),
  endsAt: timestamp("ends_at", { withTimezone: true, mode: "string" }),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Checkin Logs ────────────────────────────────────────────────────────────

export const checkinLogs = pgTable(
  "checkin_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    checkinSessionId: uuid("checkin_session_id").references(
      () => checkinSessions.id,
    ),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id),
    method: text("method").notNull(),
    status: text("status").notNull(),
    checkedInAt: timestamp("checked_in_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    checkedInBy: uuid("checked_in_by").references(() => users.id),
    deviceInfo: jsonb("device_info").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("checkin_logs_event_checked_in_at_idx").on(
      table.eventId,
      table.checkedInAt,
    ),
  ],
);

// ─── QR Tokens ───────────────────────────────────────────────────────────────

export const qrTokens = pgTable("qr_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  guestId: uuid("guest_id")
    .notNull()
    .references(() => guests.id),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }),
  revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const checkinSessionsRelations = relations(
  checkinSessions,
  ({ one, many }) => ({
    event: one(events, {
      fields: [checkinSessions.eventId],
      references: [events.id],
    }),
    schedule: one(eventSchedules, {
      fields: [checkinSessions.scheduleId],
      references: [eventSchedules.id],
    }),
    logs: many(checkinLogs),
  }),
);

export const checkinLogsRelations = relations(checkinLogs, ({ one }) => ({
  event: one(events, {
    fields: [checkinLogs.eventId],
    references: [events.id],
  }),
  checkinSession: one(checkinSessions, {
    fields: [checkinLogs.checkinSessionId],
    references: [checkinSessions.id],
  }),
  guest: one(guests, {
    fields: [checkinLogs.guestId],
    references: [guests.id],
  }),
  checkedInByUser: one(users, {
    fields: [checkinLogs.checkedInBy],
    references: [users.id],
  }),
}));

export const qrTokensRelations = relations(qrTokens, ({ one }) => ({
  event: one(events, {
    fields: [qrTokens.eventId],
    references: [events.id],
  }),
  guest: one(guests, {
    fields: [qrTokens.guestId],
    references: [guests.id],
  }),
}));
