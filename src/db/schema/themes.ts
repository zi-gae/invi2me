import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { organizations, workspaces } from "./identity";

// ─── Event Templates ─────────────────────────────────────────────────────────

export const eventTemplates = pgTable("event_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  code: text("code").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(),
  category: text("category").notNull(),
  isSystem: boolean("is_system").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(false),
  previewImageUrl: text("preview_image_url"),
  baseSchemaJson: jsonb("base_schema_json").notNull(),
  defaultThemeTokens: jsonb("default_theme_tokens").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Event Themes ────────────────────────────────────────────────────────────

export const eventThemes = pgTable("event_themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  name: text("name").notNull(),
  themeTokens: jsonb("theme_tokens").notNull(),
  fontTokens: jsonb("font_tokens").notNull(),
  radiusTokens: jsonb("radius_tokens").notNull(),
  shadowTokens: jsonb("shadow_tokens").notNull(),
  motionTokens: jsonb("motion_tokens").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Custom Domains ──────────────────────────────────────────────────────────

export const customDomains = pgTable("custom_domains", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  domain: text("domain").unique().notNull(),
  status: text("status").notNull(),
  verificationToken: text("verification_token").notNull(),
  sslStatus: text("ssl_status").notNull(),
  connectedAt: timestamp("connected_at", {
    withTimezone: true,
    mode: "string",
  }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const eventTemplatesRelations = relations(
  eventTemplates,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [eventTemplates.workspaceId],
      references: [workspaces.id],
    }),
    organization: one(organizations, {
      fields: [eventTemplates.organizationId],
      references: [organizations.id],
    }),
  }),
);

export const eventThemesRelations = relations(eventThemes, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [eventThemes.workspaceId],
    references: [workspaces.id],
  }),
  organization: one(organizations, {
    fields: [eventThemes.organizationId],
    references: [organizations.id],
  }),
}));

export const customDomainsRelations = relations(customDomains, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [customDomains.workspaceId],
    references: [workspaces.id],
  }),
  organization: one(organizations, {
    fields: [customDomains.organizationId],
    references: [organizations.id],
  }),
}));
