import { z } from 'zod/v4';

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional(),
  eventType: z.string(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  visibility: z.enum(['public', 'private', 'invite_only', 'password_protected']),
  primaryLocale: z.enum(['ko', 'en']).default('ko'),
  defaultTimezone: z.string().default('Asia/Seoul'),
  startsAt: z.string().optional(), // ISO datetime
  endsAt: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial();
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const updateEventStatusSchema = z.object({
  status: z.enum(['draft', 'scheduled', 'published', 'archived']),
});
export type UpdateEventStatusInput = z.infer<typeof updateEventStatusSchema>;
