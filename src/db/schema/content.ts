import { relations } from "drizzle-orm";
import {
  bigint,
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
import { users } from "./identity";

// ─── Event Pages ─────────────────────────────────────────────────────────────

export const eventPages = pgTable(
  "event_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    locale: text("locale").notNull(),
    title: text("title"),
    slug: text("slug").notNull(),
    pageType: text("page_type").notNull(),
    status: text("status").notNull(),
    isHome: boolean("is_home").notNull().default(false),
    publishedVersionId: uuid("published_version_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("event_pages_event_locale_slug_idx").on(
      table.eventId,
      table.locale,
      table.slug,
    ),
  ],
);

// ─── Event Page Versions ─────────────────────────────────────────────────────

export const eventPageVersions = pgTable(
  "event_page_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventPageId: uuid("event_page_id")
      .notNull()
      .references(() => eventPages.id),
    versionNo: integer("version_no").notNull(),
    schemaVersion: integer("schema_version").notNull(),
    contentJson: jsonb("content_json").notNull(),
    themeTokens: jsonb("theme_tokens").notNull().default({}),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("event_page_versions_page_version_idx").on(
      table.eventPageId,
      table.versionNo,
    ),
  ],
);

// ─── Event Sections ──────────────────────────────────────────────────────────

export const eventSections = pgTable(
  "event_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventPageId: uuid("event_page_id")
      .notNull()
      .references(() => eventPages.id),
    sectionType: text("section_type").notNull(),
    sectionKey: text("section_key").notNull(),
    sortOrder: integer("sort_order").notNull(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    propsJson: jsonb("props_json").notNull().default({}),
    visibilityRules: jsonb("visibility_rules").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("event_sections_page_key_idx").on(
      table.eventPageId,
      table.sectionKey,
    ),
  ],
);

// ─── Event Assets ────────────────────────────────────────────────────────────

export const eventAssets = pgTable("event_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  assetType: text("asset_type").notNull(),
  storageBucket: text("storage_bucket").notNull(),
  storagePath: text("storage_path").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: bigint("file_size", { mode: "number" }).notNull(),
  width: integer("width"),
  height: integer("height"),
  durationMs: integer("duration_ms"),
  altText: text("alt_text"),
  metadataJson: jsonb("metadata_json").notNull().default({}),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Event Galleries ─────────────────────────────────────────────────────────

export const eventGalleries = pgTable("event_galleries", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  name: text("name").notNull(),
  layoutType: text("layout_type").notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Event Gallery Items ─────────────────────────────────────────────────────

export const eventGalleryItems = pgTable("event_gallery_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  galleryId: uuid("gallery_id")
    .notNull()
    .references(() => eventGalleries.id),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => eventAssets.id),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── Guestbook Messages ──────────────────────────────────────────────────────

export const guestbookMessages = pgTable(
  "guestbook_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    author: text("author").notNull(),
    relation: text("relation").notNull(),
    content: text("content").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("guestbook_messages_event_created_idx").on(
      table.eventId,
      table.createdAt,
    ),
  ],
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const eventPagesRelations = relations(eventPages, ({ one, many }) => ({
  event: one(events, {
    fields: [eventPages.eventId],
    references: [events.id],
  }),
  publishedVersion: one(eventPageVersions, {
    fields: [eventPages.publishedVersionId],
    references: [eventPageVersions.id],
  }),
  versions: many(eventPageVersions),
  sections: many(eventSections),
}));

export const eventPageVersionsRelations = relations(
  eventPageVersions,
  ({ one }) => ({
    eventPage: one(eventPages, {
      fields: [eventPageVersions.eventPageId],
      references: [eventPages.id],
    }),
    creator: one(users, {
      fields: [eventPageVersions.createdBy],
      references: [users.id],
    }),
  }),
);

export const eventSectionsRelations = relations(eventSections, ({ one }) => ({
  eventPage: one(eventPages, {
    fields: [eventSections.eventPageId],
    references: [eventPages.id],
  }),
}));

export const eventAssetsRelations = relations(
  eventAssets,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventAssets.eventId],
      references: [events.id],
    }),
    creator: one(users, {
      fields: [eventAssets.createdBy],
      references: [users.id],
    }),
    galleryItems: many(eventGalleryItems),
  }),
);

export const eventGalleriesRelations = relations(
  eventGalleries,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventGalleries.eventId],
      references: [events.id],
    }),
    items: many(eventGalleryItems),
  }),
);

export const eventGalleryItemsRelations = relations(
  eventGalleryItems,
  ({ one }) => ({
    gallery: one(eventGalleries, {
      fields: [eventGalleryItems.galleryId],
      references: [eventGalleries.id],
    }),
    asset: one(eventAssets, {
      fields: [eventGalleryItems.assetId],
      references: [eventAssets.id],
    }),
  }),
);

export const guestbookMessagesRelations = relations(
  guestbookMessages,
  ({ one }) => ({
    event: one(events, {
      fields: [guestbookMessages.eventId],
      references: [events.id],
    }),
  }),
);
