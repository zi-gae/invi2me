import { z } from 'zod/v4';

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  type: z.enum(['personal', 'business']),
});
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  defaultLocale: z.enum(['ko', 'en']).optional(),
  defaultTimezone: z.string().optional(),
});
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

export const inviteWorkspaceMemberSchema = z.object({
  email: z.email(),
  role: z.enum(['admin', 'editor', 'viewer']),
});
export type InviteWorkspaceMemberInput = z.infer<typeof inviteWorkspaceMemberSchema>;
