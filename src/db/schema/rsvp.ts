import { relations } from "drizzle-orm";
import {
  boolean,
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
import { users } from "./identity";

// ─── RSVP Forms ──────────────────────────────────────────────────────────────

export const rsvpForms = pgTable("rsvp_forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  name: text("name").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  schemaJson: jsonb("schema_json").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── RSVP Responses ──────────────────────────────────────────────────────────

export const rsvpResponses = pgTable(
  "rsvp_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    rsvpFormId: uuid("rsvp_form_id")
      .notNull()
      .references(() => rsvpForms.id),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id),
    attendanceStatus: text("attendance_status").notNull(),
    partySize: integer("party_size").notNull().default(1),
    mealCount: integer("meal_count").notNull().default(0),
    submittedAt: timestamp("submitted_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    sourceType: text("source_type").notNull(),
    sourceRef: text("source_ref"),
    answersJson: jsonb("answers_json").notNull().default({}),
    messageToCouple: text("message_to_couple"),
    consentsJson: jsonb("consents_json").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("rsvp_responses_event_guest_idx").on(
      table.eventId,
      table.guestId,
    ),
    index("rsvp_responses_event_attendance_idx").on(
      table.eventId,
      table.attendanceStatus,
    ),
  ],
);

// ─── RSVP Response History ───────────────────────────────────────────────────

export const rsvpResponseHistory = pgTable("rsvp_response_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  rsvpResponseId: uuid("rsvp_response_id")
    .notNull()
    .references(() => rsvpResponses.id),
  previousValue: jsonb("previous_value").notNull(),
  newValue: jsonb("new_value").notNull(),
  changedBy: uuid("changed_by").references(() => users.id),
  changedAt: timestamp("changed_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const rsvpFormsRelations = relations(rsvpForms, ({ one, many }) => ({
  event: one(events, {
    fields: [rsvpForms.eventId],
    references: [events.id],
  }),
  responses: many(rsvpResponses),
}));

export const rsvpResponsesRelations = relations(
  rsvpResponses,
  ({ one, many }) => ({
    event: one(events, {
      fields: [rsvpResponses.eventId],
      references: [events.id],
    }),
    rsvpForm: one(rsvpForms, {
      fields: [rsvpResponses.rsvpFormId],
      references: [rsvpForms.id],
    }),
    guest: one(guests, {
      fields: [rsvpResponses.guestId],
      references: [guests.id],
    }),
    history: many(rsvpResponseHistory),
  }),
);

export const rsvpResponseHistoryRelations = relations(
  rsvpResponseHistory,
  ({ one }) => ({
    rsvpResponse: one(rsvpResponses, {
      fields: [rsvpResponseHistory.rsvpResponseId],
      references: [rsvpResponses.id],
    }),
    changedByUser: one(users, {
      fields: [rsvpResponseHistory.changedBy],
      references: [users.id],
    }),
  }),
);
