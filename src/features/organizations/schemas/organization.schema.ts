import { z } from 'zod/v4';

export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  businessType: z.enum(['wedding_hall', 'planner', 'studio', 'corporate']),
  brandName: z.string().max(100).optional(),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().max(20).optional(),
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

export const inviteOrgMemberSchema = z.object({
  email: z.email(),
  role: z.enum(['admin', 'editor', 'analyst', 'checkin_staff', 'viewer']),
});
export type InviteOrgMemberInput = z.infer<typeof inviteOrgMemberSchema>;
