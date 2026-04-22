import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { organizations, users, workspaces } from "./identity";

// ─── Events ─────────────────────────────────────────────────────────────────

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    organizationId: uuid("organization_id").references(() => organizations.id),
    slug: text("slug").unique().notNull(),
    eventType: text("event_type").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    status: text("status").notNull(),
    visibility: text("visibility").notNull(),
    accessPasswordHash: text("access_password_hash"),
    ownerUserId: uuid("owner_user_id")
      .notNull()
      .references(() => users.id),
    templateId: uuid("template_id"),
    themeId: uuid("theme_id"),
    primaryLocale: text("primary_locale").notNull().default("ko"),
    defaultTimezone: text("default_timezone").notNull().default("Asia/Seoul"),
    coverImageUrl: text("cover_image_url"),
    heroLayout: text("hero_layout"),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "string",
    }),
    startsAt: timestamp("starts_at", { withTimezone: true, mode: "string" }),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "string" }),
    rsvpOpensAt: timestamp("rsvp_opens_at", {
      withTimezone: true,
      mode: "string",
    }),
    rsvpClosesAt: timestamp("rsvp_closes_at", {
      withTimezone: true,
      mode: "string",
    }),
    checkinEnabled: boolean("checkin_enabled").notNull().default(false),
    messagingEnabled: boolean("messaging_enabled").notNull().default(true),
    analyticsEnabled: boolean("analytics_enabled").notNull().default(true),
    customDomainId: uuid("custom_domain_id"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ogImageUrl: text("og_image_url"),
    integrations: jsonb("integrations").$type<{
      kakaoCalendar?: {
        enabled: boolean;
        buttonLabel: string;
        eventId: string | null;
      };
      kakaoPay?: {
        enabled: boolean;
      };
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
    version: integer("version").notNull().default(1),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
  },
  (table) => [
    index("events_workspace_status_idx").on(table.workspaceId, table.status),
  ],
);

// ─── Event Memberships ──────────────────────────────────────────────────────

export const eventMemberships = pgTable(
  "event_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(),
    permissions: jsonb("permissions").$type<string[]>().notNull().default([]),
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("event_memberships_event_user_idx").on(
      table.eventId,
      table.userId,
    ),
  ],
);

// ─── Event Locations ────────────────────────────────────────────────────────

export const eventLocations = pgTable("event_locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  name: text("name").notNull(),
  addressLine1: text("address_line1"),
  addressLine2: text("address_line2"),
  city: text("city"),
  region: text("region"),
  postalCode: text("postal_code"),
  countryCode: text("country_code").notNull().default("KR"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  mapProvider: text("map_provider"),
  mapUrl: text("map_url"),
  parkingGuide: text("parking_guide"),
  transportationGuide: text("transportation_guide"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Event Schedules ────────────────────────────────────────────────────────

export const eventSchedules = pgTable("event_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  name: text("name").notNull(),
  scheduleType: text("schedule_type").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true, mode: "string" })
    .notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true, mode: "string" }),
  locationId: uuid("location_id").references(() => eventLocations.id),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const eventsRelations = relations(events, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [events.workspaceId],
    references: [workspaces.id],
  }),
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id],
  }),
  owner: one(users, {
    fields: [events.ownerUserId],
    references: [users.id],
    relationName: "eventOwner",
  }),
  createdByUser: one(users, {
    fields: [events.createdBy],
    references: [users.id],
    relationName: "eventCreatedBy",
  }),
  updatedByUser: one(users, {
    fields: [events.updatedBy],
    references: [users.id],
    relationName: "eventUpdatedBy",
  }),
  memberships: many(eventMemberships),
  schedules: many(eventSchedules),
  locations: many(eventLocations),
}));

export const eventMembershipsRelations = relations(
  eventMemberships,
  ({ one }) => ({
    event: one(events, {
      fields: [eventMemberships.eventId],
      references: [events.id],
    }),
    user: one(users, {
      fields: [eventMemberships.userId],
      references: [users.id],
    }),
  }),
);

export const eventLocationsRelations = relations(
  eventLocations,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventLocations.eventId],
      references: [events.id],
    }),
    schedules: many(eventSchedules),
  }),
);

export const eventSchedulesRelations = relations(
  eventSchedules,
  ({ one }) => ({
    event: one(events, {
      fields: [eventSchedules.eventId],
      references: [events.id],
    }),
    location: one(eventLocations, {
      fields: [eventSchedules.locationId],
      references: [eventLocations.id],
    }),
  }),
);
