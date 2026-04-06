import { NextResponse } from 'next/server';
import { requireEventAccess, requireEventPermission } from '@/features/auth/utils/rbac';
import { createCampaign, listCampaigns } from '@/features/messaging/queries/messaging.queries';
import { createCampaignSchema } from '@/features/messaging/schemas/messaging.schema';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

// POST /api/app/events/:eventId/campaigns — Create campaign
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;

  try {
    const membership = await requireEventPermission(eventId, 'message.send');

    const body = await request.json();
    const result = createCampaignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 },
      );
    }

    const campaign = await createCampaign({
      eventId,
      name: result.data.name,
      channelType: result.data.channelType,
      templateId: result.data.messageTemplateId,
      segmentFilter: result.data.filter,
      scheduledAt: result.data.scheduledAt,
    });
    return NextResponse.json(successResponse(campaign), { status: 201 });
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

// GET /api/app/events/:eventId/campaigns — List campaigns
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;

  try {
    await requireEventAccess(eventId);
    const items = await listCampaigns(eventId);
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
