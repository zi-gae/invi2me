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

export const submitAnonymousRsvpSchema = z.object({
  attendanceStatus: z.enum(['attending', 'not_attending', 'maybe']),
  name: z.string().min(1, '이름을 입력해주세요.').max(50),
  phone: z.string().min(9, '전화번호를 입력해주세요.').max(20).regex(/^[0-9\-+]+$/, '올바른 전화번호를 입력해주세요.'),
});
export type SubmitAnonymousRsvpInput = z.infer<typeof submitAnonymousRsvpSchema>;
