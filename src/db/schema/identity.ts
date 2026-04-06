import { relations } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  locale: text("locale").default("ko"),
  timezone: text("timezone").default("Asia/Seoul"),
  status: text("status").notNull(),
  lastLoginAt: timestamp("last_login_at", {
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

// ─── Workspaces ──────────────────────────────────────────────────────────────

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  ownerUserId: uuid("owner_user_id")
    .notNull()
    .references(() => users.id),
  planCode: text("plan_code").notNull(),
  status: text("status").notNull(),
  defaultLocale: text("default_locale").notNull().default("ko"),
  defaultTimezone: text("default_timezone").notNull().default("Asia/Seoul"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Workspace Memberships ───────────────────────────────────────────────────

export const workspaceMemberships = pgTable(
  "workspace_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
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
    uniqueIndex("workspace_memberships_workspace_user_idx").on(
      table.workspaceId,
      table.userId,
    ),
  ],
);

// ─── Organizations ───────────────────────────────────────────────────────────

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  businessType: text("business_type").notNull(),
  brandName: text("brand_name"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Organization Memberships ────────────────────────────────────────────────

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
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
    uniqueIndex("organization_memberships_org_user_idx").on(
      table.organizationId,
      table.userId,
    ),
  ],
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  ownedWorkspaces: many(workspaces),
  workspaceMemberships: many(workspaceMemberships),
  organizationMemberships: many(organizationMemberships),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerUserId],
    references: [users.id],
  }),
  memberships: many(workspaceMemberships),
  organizations: many(organizations),
}));

export const workspaceMembershipsRelations = relations(
  workspaceMemberships,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMemberships.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMemberships.userId],
      references: [users.id],
    }),
  }),
);

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [organizations.workspaceId],
      references: [workspaces.id],
    }),
    memberships: many(organizationMemberships),
  }),
);

export const organizationMembershipsRelations = relations(
  organizationMemberships,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMemberships.organizationId],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [organizationMemberships.userId],
      references: [users.id],
    }),
  }),
);
