import { z } from 'zod/v4';

export const submitRsvpSchema = z.object({
  attendanceStatus: z.enum(['attending', 'not_attending', 'maybe']),
  partySize: z.number().int().min(0).max(20).default(1),
  mealCount: z.number().int().min(0).max(20).default(0),
  messageToCouple: z.string().max(1000).optional(),
  answers: z.record(z.string(), z.unknown()).optional(),
  consents: z.record(z.string(), z.boolean()).optional(),
});
export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
