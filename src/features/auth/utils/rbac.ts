import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { eventMemberships } from '@/db/schema/events';
import {
  organizationMemberships,
  workspaceMemberships,
} from '@/db/schema/identity';
import { InsufficientPermissionError } from '@/shared/lib/errors';
import { requireUser } from '@/shared/server/supabase';

// ─── Membership Lookups ──────────────────────────────────────────────────────

export async function getWorkspaceMembership(workspaceId: string) {
  const user = await requireUser();

  const [membership] = await db
    .select()
    .from(workspaceMemberships)
    .where(
      and(
        eq(workspaceMemberships.workspaceId, workspaceId),
        eq(workspaceMemberships.userId, user.id),
        eq(workspaceMemberships.status, 'active')
      )
    )
    .limit(1);

  return membership ?? null;
}

export async function getEventMembership(eventId: string) {
  const user = await requireUser();

  const [membership] = await db
    .select()
    .from(eventMemberships)
    .where(
      and(
        eq(eventMemberships.eventId, eventId),
        eq(eventMemberships.userId, user.id),
        eq(eventMemberships.status, 'active')
      )
    )
    .limit(1);

  return membership ?? null;
}

export async function getOrgMembership(organizationId: string) {
  const user = await requireUser();

  const [membership] = await db
    .select()
    .from(organizationMemberships)
    .where(
      and(
        eq(organizationMemberships.organizationId, organizationId),
        eq(organizationMemberships.userId, user.id),
        eq(organizationMemberships.status, 'active')
      )
    )
    .limit(1);

  return membership ?? null;
}

// ─── Permission Checks ──────────────────────────────────────────────────────

function hasPermission(
  role: string,
  permissions: string[],
  required: string
): boolean {
  if (role === 'owner' || role === 'admin') {
    return true;
  }
  return permissions.includes(required);
}

export async function requireWorkspacePermission(
  workspaceId: string,
  permission: string
) {
  const membership = await getWorkspaceMembership(workspaceId);
  if (!membership) {
    throw new InsufficientPermissionError(permission);
  }

  const permissions = membership.permissions as string[];
  if (!hasPermission(membership.role, permissions, permission)) {
    throw new InsufficientPermissionError(permission);
  }

  return membership;
}

export async function requireOrgPermission(
  organizationId: string,
  permission: string
) {
  const membership = await getOrgMembership(organizationId);
  if (!membership) {
    throw new InsufficientPermissionError(permission);
  }

  const permissions = membership.permissions as string[];
  if (!hasPermission(membership.role, permissions, permission)) {
    throw new InsufficientPermissionError(permission);
  }

  return membership;
}

export async function requireEventPermission(
  eventId: string,
  permission: string
) {
  const membership = await getEventMembership(eventId);
  if (!membership) {
    throw new InsufficientPermissionError(permission);
  }

  const permissions = membership.permissions as string[];
  if (!hasPermission(membership.role, permissions, permission)) {
    throw new InsufficientPermissionError(permission);
  }

  return membership;
}

export async function requireEventAccess(eventId: string) {
  const membership = await getEventMembership(eventId);
  if (!membership) {
    throw new InsufficientPermissionError('event.access');
  }
  return membership;
}
