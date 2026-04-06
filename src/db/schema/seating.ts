import { relations } from "drizzle-orm";
import {
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

// ─── Seating Areas ───────────────────────────────────────────────────────────

export const seatingAreas = pgTable("seating_areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Tables ──────────────────────────────────────────────────────────────────

export const tables = pgTable("tables", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  seatingAreaId: uuid("seating_area_id").references(() => seatingAreas.id),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  shape: text("shape").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  metadataJson: jsonb("metadata_json").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Table Assignments ───────────────────────────────────────────────────────

export const tableAssignments = pgTable(
  "table_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id),
    tableId: uuid("table_id")
      .notNull()
      .references(() => tables.id),
    seatLabel: text("seat_label"),
    assignedAt: timestamp("assigned_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    assignedBy: uuid("assigned_by").references(() => users.id),
  },
  (table) => [
    uniqueIndex("table_assignments_event_guest_idx").on(
      table.eventId,
      table.guestId,
    ),
  ],
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const seatingAreasRelations = relations(
  seatingAreas,
  ({ one, many }) => ({
    event: one(events, {
      fields: [seatingAreas.eventId],
      references: [events.id],
    }),
    tables: many(tables),
  }),
);

export const tablesRelations = relations(tables, ({ one, many }) => ({
  event: one(events, {
    fields: [tables.eventId],
    references: [events.id],
  }),
  seatingArea: one(seatingAreas, {
    fields: [tables.seatingAreaId],
    references: [seatingAreas.id],
  }),
  assignments: many(tableAssignments),
}));

export const tableAssignmentsRelations = relations(
  tableAssignments,
  ({ one }) => ({
    event: one(events, {
      fields: [tableAssignments.eventId],
      references: [events.id],
    }),
    guest: one(guests, {
      fields: [tableAssignments.guestId],
      references: [guests.id],
    }),
    table: one(tables, {
      fields: [tableAssignments.tableId],
      references: [tables.id],
    }),
    assignedByUser: one(users, {
      fields: [tableAssignments.assignedBy],
      references: [users.id],
    }),
  }),
);
