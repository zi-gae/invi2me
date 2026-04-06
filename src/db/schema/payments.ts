import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { events } from "./events";
import { guests } from "./guests";
import { workspaces } from "./identity";

// ─── Gift Accounts ───────────────────────────────────────────────────────────

export const giftAccounts = pgTable("gift_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  accountHolderName: text("account_holder_name").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumberEncrypted: text("account_number_encrypted").notNull(),
  accountType: text("account_type"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Gift Messages ───────────────────────────────────────────────────────────

export const giftMessages = pgTable("gift_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  guestId: uuid("guest_id").references(() => guests.id),
  name: text("name"),
  message: text("message").notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Orders ──────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  eventId: uuid("event_id").references(() => events.id),
  orderType: text("order_type").notNull(),
  status: text("status").notNull(),
  currency: text("currency").notNull().default("KRW"),
  amountTotal: bigint("amount_total", { mode: "number" }).notNull(),
  provider: text("provider").notNull(),
  providerOrderId: text("provider_order_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const giftAccountsRelations = relations(giftAccounts, ({ one }) => ({
  event: one(events, {
    fields: [giftAccounts.eventId],
    references: [events.id],
  }),
}));

export const giftMessagesRelations = relations(giftMessages, ({ one }) => ({
  event: one(events, {
    fields: [giftMessages.eventId],
    references: [events.id],
  }),
  guest: one(guests, {
    fields: [giftMessages.guestId],
    references: [guests.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [orders.workspaceId],
    references: [workspaces.id],
  }),
  event: one(events, {
    fields: [orders.eventId],
    references: [events.id],
  }),
}));
