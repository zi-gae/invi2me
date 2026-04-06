import { z } from 'zod/v4';

export const checkinSchema = z.object({
  guestId: z.string().uuid(),
  method: z.enum(['qr', 'manual', 'search']),
  sessionId: z.string().uuid().optional(),
});
export type CheckinInput = z.infer<typeof checkinSchema>;

export const createCheckinSessionSchema = z.object({
  name: z.string().min(1).max(100),
  scheduleId: z.string().uuid().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});
export type CreateCheckinSessionInput = z.infer<typeof createCheckinSessionSchema>;
