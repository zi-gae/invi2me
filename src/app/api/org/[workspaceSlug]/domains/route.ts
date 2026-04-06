import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { db } from '@/db';
import { customDomains } from '@/db/schema/themes';
import { eq } from 'drizzle-orm';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';
import { generateToken } from '@/shared/server/crypto';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

const createDomainSchema = z.object({
  domain: z
    .string()
    .min(1)
    .max(253)
    .regex(
      /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/,
      '올바른 도메인 형식이 아닙니다.',
    ),
});

// POST /api/org/:workspaceSlug/domains — Add custom domain
export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> },
) {
  const { workspaceSlug } = await params;

  try {
    const { workspace } = await getWorkspaceBySlug(workspaceSlug);

    const body = await request.json();
    const result = createDomainSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 },
      );
    }

    const verificationToken = generateToken();

    const [domain] = await db
      .insert(customDomains)
      .values({
        workspaceId: workspace.id,
        domain: result.data.domain,
        status: 'pending_verification',
        verificationToken,
        sslStatus: 'pending',
      })
      .returning();

    return NextResponse.json(successResponse(domain), { status: 201 });
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

// GET /api/org/:workspaceSlug/domains — List domains
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> },
) {
  const { workspaceSlug } = await params;

  try {
    const { workspace } = await getWorkspaceBySlug(workspaceSlug);

    const items = await db
      .select()
      .from(customDomains)
      .where(eq(customDomains.workspaceId, workspace.id));

    return NextResponse.json(successResponse({ items }));
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
