import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { db } from '@/db';
import { eventTemplates } from '@/db/schema/themes';
import { eq } from 'drizzle-orm';
import { getWorkspaceBySlug } from '@/features/auth/utils/get-current-workspace';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

const createTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  code: z.string().min(1).max(100),
  eventType: z.string().min(1),
  category: z.string().min(1),
  baseSchemaJson: z.record(z.string(), z.unknown()).optional(),
  defaultThemeTokens: z.record(z.string(), z.unknown()).optional(),
});

// GET /api/org/:workspaceSlug/templates — List org templates
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> },
) {
  const { workspaceSlug } = await params;

  try {
    const { workspace } = await getWorkspaceBySlug(workspaceSlug);

    const items = await db
      .select()
      .from(eventTemplates)
      .where(eq(eventTemplates.workspaceId, workspace.id));

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

// POST /api/org/:workspaceSlug/templates — Create template
export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> },
) {
  const { workspaceSlug } = await params;

  try {
    const { workspace } = await getWorkspaceBySlug(workspaceSlug);

    const body = await request.json();
    const result = createTemplateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 },
      );
    }

    const [template] = await db
      .insert(eventTemplates)
      .values({
        workspaceId: workspace.id,
        code: result.data.code,
        name: result.data.name,
        description: result.data.description ?? null,
        eventType: result.data.eventType,
        category: result.data.category,
        baseSchemaJson: result.data.baseSchemaJson ?? {},
        defaultThemeTokens: result.data.defaultThemeTokens ?? {},
      })
      .returning();

    return NextResponse.json(successResponse(template), { status: 201 });
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
