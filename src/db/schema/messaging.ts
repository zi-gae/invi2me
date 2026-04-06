import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { events } from "./events";
import { guests } from "./guests";
import { organizations, workspaces } from "./identity";

// ─── Channels ────────────────────────────────────────────────────────────────

export const channels = pgTable("channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  provider: text("provider").notNull(),
  providerConfigRef: text("provider_config_ref").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Message Templates ───────────────────────────────────────────────────────

export const messageTemplates = pgTable("message_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  channelType: text("channel_type").notNull(),
  name: text("name").notNull(),
  subjectTemplate: text("subject_template"),
  bodyTemplate: text("body_template").notNull(),
  variablesJson: jsonb("variables_json").notNull().default([]),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Campaigns ───────────────────────────────────────────────────────────────

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  channelType: text("channel_type").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  messageTemplateId: uuid("message_template_id").references(
    () => messageTemplates.id,
  ),
  scheduledAt: timestamp("scheduled_at", {
    withTimezone: true,
    mode: "string",
  }),
  filterJson: jsonb("filter_json").notNull().default({}),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Campaign Deliveries ─────────────────────────────────────────────────────

export const campaignDeliveries = pgTable(
  "campaign_deliveries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id),
    status: text("status").notNull(),
    providerMessageId: text("provider_message_id"),
    errorMessage: text("error_message"),
    sentAt: timestamp("sent_at", { withTimezone: true, mode: "string" }),
    deliveredAt: timestamp("delivered_at", {
      withTimezone: true,
      mode: "string",
    }),
    openedAt: timestamp("opened_at", { withTimezone: true, mode: "string" }),
    clickedAt: timestamp("clicked_at", { withTimezone: true, mode: "string" }),
    trackingLinkId: uuid("tracking_link_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("campaign_deliveries_campaign_guest_idx").on(
      table.campaignId,
      table.guestId,
    ),
    index("campaign_deliveries_campaign_status_idx").on(
      table.campaignId,
      table.status,
    ),
  ],
);

// ─── Tracking Links ──────────────────────────────────────────────────────────

export const trackingLinks = pgTable("tracking_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  campaignId: uuid("campaign_id").references(() => campaigns.id),
  code: text("code").unique().notNull(),
  source: text("source"),
  medium: text("medium"),
  campaignName: text("campaign_name"),
  content: text("content"),
  targetUrl: text("target_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const channelsRelations = relations(channels, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [channels.workspaceId],
    references: [workspaces.id],
  }),
}));

export const messageTemplatesRelations = relations(
  messageTemplates,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [messageTemplates.workspaceId],
      references: [workspaces.id],
    }),
    organization: one(organizations, {
      fields: [messageTemplates.organizationId],
      references: [organizations.id],
    }),
    campaigns: many(campaigns),
  }),
);

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  event: one(events, {
    fields: [campaigns.eventId],
    references: [events.id],
  }),
  messageTemplate: one(messageTemplates, {
    fields: [campaigns.messageTemplateId],
    references: [messageTemplates.id],
  }),
  deliveries: many(campaignDeliveries),
  trackingLinks: many(trackingLinks),
}));

export const campaignDeliveriesRelations = relations(
  campaignDeliveries,
  ({ one }) => ({
    campaign: one(campaigns, {
      fields: [campaignDeliveries.campaignId],
      references: [campaigns.id],
    }),
    guest: one(guests, {
      fields: [campaignDeliveries.guestId],
      references: [guests.id],
    }),
    trackingLink: one(trackingLinks, {
      fields: [campaignDeliveries.trackingLinkId],
      references: [trackingLinks.id],
    }),
  }),
);

export const trackingLinksRelations = relations(
  trackingLinks,
  ({ one, many }) => ({
    event: one(events, {
      fields: [trackingLinks.eventId],
      references: [events.id],
    }),
    campaign: one(campaigns, {
      fields: [trackingLinks.campaignId],
      references: [campaigns.id],
    }),
    deliveries: many(campaignDeliveries),
  }),
);
