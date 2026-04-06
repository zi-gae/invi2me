import { NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaceMemberships, users } from '@/db/schema/identity';
import { eq } from 'drizzle-orm';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';
import { maskEmail } from '@/shared/server/crypto';

// GET /api/org/:workspaceSlug/members — List org members
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> },
) {
  const { workspaceSlug } = await params;

  try {
    const { workspace } = await getWorkspaceBySlug(workspaceSlug);

    const rows = await db
      .select({
        id: workspaceMemberships.id,
        userId: workspaceMemberships.userId,
        role: workspaceMemberships.role,
        status: workspaceMemberships.status,
        createdAt: workspaceMemberships.createdAt,
        userName: users.name,
        userEmail: users.email,
        userAvatarUrl: users.avatarUrl,
      })
      .from(workspaceMemberships)
      .innerJoin(users, eq(users.id, workspaceMemberships.userId))
      .where(eq(workspaceMemberships.workspaceId, workspace.id));

    const items = rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      role: row.role,
      status: row.status,
      name: row.userName,
      email: maskEmail(row.userEmail),
      avatarUrl: row.userAvatarUrl,
      createdAt: row.createdAt,
    }));

    return NextResponse.json(successResponse({ items, total: items.length }));
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        errorResponse(error.code, error.message),
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', '서버 오류가 발생했습니다.'),
      { status: 500 },
    );
  }
}
