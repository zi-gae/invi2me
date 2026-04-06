import { z } from 'zod/v4';

export const createGuestSchema = z.object({
  fullName: z.string().min(1).max(100),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  guestType: z.enum(['primary', 'companion', 'child', 'vip']),
  sideType: z.enum(['bride', 'groom', 'both']).optional(),
  guestGroupId: z.string().uuid().optional(),
  locale: z.enum(['ko', 'en']).optional(),
  notes: z.string().max(500).optional(),
  plusOneAllowed: z.boolean().default(false),
  maxCompanionCount: z.number().int().min(0).max(10).default(0),
  seatAssignmentRequired: z.boolean().default(false),
});
export type CreateGuestInput = z.infer<typeof createGuestSchema>;

export const updateGuestSchema = createGuestSchema.partial();
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;

export const importGuestsSchema = z.object({
  guests: z.array(createGuestSchema).min(1).max(500),
});
export type ImportGuestsInput = z.infer<typeof importGuestsSchema>;
