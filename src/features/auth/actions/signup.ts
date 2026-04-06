'use server';

import { db } from '@/db';
import { users, workspaces, workspaceMemberships } from '@/db/schema/identity';

export async function createUserAfterSignup(params: {
  supabaseUserId: string;
  email: string;
  name: string;
}) {
  const [user] = await db
    .insert(users)
    .values({
      id: params.supabaseUserId,
      email: params.email,
      name: params.name,
      status: 'active',
    })
    .returning();

  const slug = params.email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');

  const [workspace] = await db
    .insert(workspaces)
    .values({
      slug: `${slug}-${Date.now().toString(36)}`,
      name: `${params.name}의 워크스페이스`,
      type: 'personal',
      ownerUserId: user.id,
      planCode: 'free',
      status: 'active',
    })
    .returning();

  await db.insert(workspaceMemberships).values({
    workspaceId: workspace.id,
    userId: user.id,
    role: 'owner',
    permissions: [
      'event.edit',
      'event.publish',
      'guest.read',
      'guest.write',
      'guest.checkin',
      'message.send',
      'report.read',
      'billing.manage',
    ],
    status: 'active',
  });

  return { user, workspace };
}
