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

// Settings page section schemas
export const updateEventBasicSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200),
  subtitle: z.string().max(500).optional(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '영문 소문자, 숫자, 하이픈만 사용 가능합니다'),
  primaryLocale: z.enum(['ko', 'en']),
  defaultTimezone: z.string(),
});
export type UpdateEventBasicInput = z.infer<typeof updateEventBasicSchema>;

export const updateEventScheduleSchema = z.object({
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  rsvpOpensAt: z.string().optional(),
  rsvpClosesAt: z.string().optional(),
});
export type UpdateEventScheduleInput = z.infer<typeof updateEventScheduleSchema>;

export const updateEventVisibilitySchema = z.object({
  visibility: z.enum(['public', 'private', 'invite_only', 'password_protected']),
  accessPassword: z.string().min(4).max(100).optional(),
});
export type UpdateEventVisibilityInput = z.infer<typeof updateEventVisibilitySchema>;

export const updateEventSeoSchema = z.object({
  seoTitle: z.string().max(100).optional(),
  seoDescription: z.string().max(300).optional(),
  ogImageUrl: z.string().url().optional().or(z.literal('')),
});
export type UpdateEventSeoInput = z.infer<typeof updateEventSeoSchema>;

export const updateEventFeaturesSchema = z.object({
  checkinEnabled: z.boolean(),
  messagingEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
});
export type UpdateEventFeaturesInput = z.infer<typeof updateEventFeaturesSchema>;

export const updateEventIntegrationsSchema = z.object({
  kakaoCalendar: z.object({
    enabled: z.boolean(),
    buttonLabel: z.string().min(1).max(50),
    eventId: z.string().nullable(),
  }).optional(),
  kakaoPay: z.object({
    enabled: z.boolean(),
  }).optional(),
});
export type UpdateEventIntegrationsInput = z.infer<typeof updateEventIntegrationsSchema>;
