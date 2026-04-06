import { NextResponse } from 'next/server';
import { getAdminEventById, updateEvent } from '@/features/events/queries/event.queries';
import { requireEventAccess, requireEventPermission } from '@/features/auth/utils/rbac';
import { updateEventSchema } from '@/features/events/schemas/event.schema';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

// GET /api/app/events/:eventId — Get event details (admin)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  try {
    await requireEventAccess(eventId);
    const event = await getAdminEventById(eventId);
    return NextResponse.json(successResponse(event));
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        errorResponse(error.code, error.message),
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', '서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

// PATCH /api/app/events/:eventId — Update event
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  try {
    await requireEventPermission(eventId, 'event.edit');

    const body = await request.json();
    const result = updateEventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 }
      );
    }

    const event = await updateEvent(eventId, result.data);
    return NextResponse.json(successResponse(event));
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        errorResponse(error.code, error.message),
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', '서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}
