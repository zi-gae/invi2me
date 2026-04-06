import { z } from 'zod/v4';

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  channelType: z.enum(['email', 'sms', 'kakao', 'webhook']),
  messageTemplateId: z.string().uuid().optional(),
  scheduledAt: z.string().optional(),
  filter: z.record(z.string(), z.unknown()).optional(),
});
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const createMessageTemplateSchema = z.object({
  channelType: z.enum(['email', 'sms', 'kakao', 'webhook']),
  name: z.string().min(1).max(200),
  subjectTemplate: z.string().max(500).optional(),
  bodyTemplate: z.string().min(1),
  variables: z.array(z.string()).optional(),
});
export type CreateMessageTemplateInput = z.infer<typeof createMessageTemplateSchema>;

export const createTrackingLinkSchema = z.object({
  source: z.string().max(100).optional(),
  medium: z.string().max(100).optional(),
  campaignName: z.string().max(100).optional(),
  content: z.string().max(200).optional(),
  targetUrl: z.string().url(),
});
export type CreateTrackingLinkInput = z.infer<typeof createTrackingLinkSchema>;
