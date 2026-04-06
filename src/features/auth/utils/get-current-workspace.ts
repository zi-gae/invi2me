import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { workspaceMemberships, workspaces } from '@/db/schema/identity';
import { WorkspaceNotFoundError } from '@/shared/lib/errors';
import { requireUser } from '@/shared/server/supabase';

export async function getCurrentWorkspace() {
  const user = await requireUser();

  const [workspace] = await db
    .select({ workspace: workspaces })
    .from(workspaces)
    .innerJoin(
      workspaceMemberships,
      and(
        eq(workspaceMemberships.workspaceId, workspaces.id),
        eq(workspaceMemberships.userId, user.id),
        eq(workspaceMemberships.status, 'active')
      )
    )
    .where(eq(workspaces.status, 'active'))
    .limit(1);

  if (!workspace) {
    throw new WorkspaceNotFoundError(user.id);
  }

  return workspace.workspace;
}

export async function getWorkspaceBySlug(slug: string) {
  const user = await requireUser();

  const [result] = await db
    .select({ workspace: workspaces, membership: workspaceMemberships })
    .from(workspaces)
    .innerJoin(
      workspaceMemberships,
      and(
        eq(workspaceMemberships.workspaceId, workspaces.id),
        eq(workspaceMemberships.userId, user.id),
        eq(workspaceMemberships.status, 'active')
      )
    )
    .where(and(eq(workspaces.slug, slug), eq(workspaces.status, 'active')))
    .limit(1);

  if (!result) {
    throw new WorkspaceNotFoundError(slug);
  }

  return result;
}
