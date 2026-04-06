import { z } from 'zod/v4';

export const updateSectionSchema = z.object({
  sectionType: z.string(),
  sectionKey: z.string(),
  sortOrder: z.number().int().min(0),
  isEnabled: z.boolean().default(true),
  propsJson: z.record(z.string(), z.unknown()),
  visibilityRules: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;

export const updatePageSectionsSchema = z.object({
  sections: z.array(updateSectionSchema),
});
export type UpdatePageSectionsInput = z.infer<typeof updatePageSectionsSchema>;

export const publishPageSchema = z.object({
  pageId: z.string().uuid(),
});
export type PublishPageInput = z.infer<typeof publishPageSchema>;

export const createPageSchema = z.object({
  locale: z.enum(['ko', 'en']),
  title: z.string().max(200).optional(),
  slug: z.string().min(1).max(100),
  pageType: z.enum(['main', 'rsvp', 'gift', 'gallery', 'faq']),
  isHome: z.boolean().default(false),
});
export type CreatePageInput = z.infer<typeof createPageSchema>;
