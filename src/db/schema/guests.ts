import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { events } from "./events";

// ─── Guest Groups ────────────────────────────────────────────────────────────

export const guestGroups = pgTable(
  "guest_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    name: text("name").notNull(),
    color: text("color"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("guest_groups_event_name_idx").on(table.eventId, table.name),
  ],
);

// ─── Guests ──────────────────────────────────────────────────────────────────

export const guests = pgTable(
  "guests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    guestGroupId: uuid("guest_group_id").references(() => guestGroups.id),
    firstName: text("first_name"),
    lastName: text("last_name"),
    fullName: text("full_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    locale: text("locale"),
    guestType: text("guest_type").notNull(),
    sideType: text("side_type"),
    status: text("status").notNull(),
    notes: text("notes"),
    externalRef: text("external_ref"),
    plusOneAllowed: boolean("plus_one_allowed").notNull().default(false),
    maxCompanionCount: integer("max_companion_count").notNull().default(0),
    seatAssignmentRequired: boolean("seat_assignment_required")
      .notNull()
      .default(false),
    invitationChannel: text("invitation_channel"),
    invitationToken: text("invitation_token").unique(),
    personalAccessCode: text("personal_access_code").unique(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("guests_event_status_idx").on(table.eventId, table.status),
    index("guests_event_group_idx").on(table.eventId, table.guestGroupId),
  ],
);

// ─── Guest Tags ──────────────────────────────────────────────────────────────

export const guestTags = pgTable(
  "guest_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("guest_tags_event_name_idx").on(table.eventId, table.name),
  ],
);

// ─── Guest Tag Assignments ───────────────────────────────────────────────────

export const guestTagAssignments = pgTable(
  "guest_tag_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id),
    guestTagId: uuid("guest_tag_id")
      .notNull()
      .references(() => guestTags.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("guest_tag_assignments_guest_tag_idx").on(
      table.guestId,
      table.guestTagId,
    ),
  ],
);

// ─── Guest Relationships ─────────────────────────────────────────────────────

export const guestRelationships = pgTable(
  "guest_relationships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    primaryGuestId: uuid("primary_guest_id")
      .notNull()
      .references(() => guests.id),
    relatedGuestId: uuid("related_guest_id")
      .notNull()
      .references(() => guests.id),
    relationshipType: text("relationship_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("guest_relationships_primary_related_type_idx").on(
      table.primaryGuestId,
      table.relatedGuestId,
      table.relationshipType,
    ),
  ],
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const guestGroupsRelations = relations(guestGroups, ({ one, many }) => ({
  event: one(events, {
    fields: [guestGroups.eventId],
    references: [events.id],
  }),
  guests: many(guests),
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
  event: one(events, {
    fields: [guests.eventId],
    references: [events.id],
  }),
  guestGroup: one(guestGroups, {
    fields: [guests.guestGroupId],
    references: [guestGroups.id],
  }),
  tagAssignments: many(guestTagAssignments),
  primaryRelationships: many(guestRelationships, {
    relationName: "primaryGuest",
  }),
  relatedRelationships: many(guestRelationships, {
    relationName: "relatedGuest",
  }),
}));

export const guestTagsRelations = relations(guestTags, ({ one, many }) => ({
  event: one(events, {
    fields: [guestTags.eventId],
    references: [events.id],
  }),
  assignments: many(guestTagAssignments),
}));

export const guestTagAssignmentsRelations = relations(
  guestTagAssignments,
  ({ one }) => ({
    guest: one(guests, {
      fields: [guestTagAssignments.guestId],
      references: [guests.id],
    }),
    tag: one(guestTags, {
      fields: [guestTagAssignments.guestTagId],
      references: [guestTags.id],
    }),
  }),
);

export const guestRelationshipsRelations = relations(
  guestRelationships,
  ({ one }) => ({
    event: one(events, {
      fields: [guestRelationships.eventId],
      references: [events.id],
    }),
    primaryGuest: one(guests, {
      fields: [guestRelationships.primaryGuestId],
      references: [guests.id],
      relationName: "primaryGuest",
    }),
    relatedGuest: one(guests, {
      fields: [guestRelationships.relatedGuestId],
      references: [guests.id],
      relationName: "relatedGuest",
    }),
  }),
);
