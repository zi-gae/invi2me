import { NextResponse } from 'next/server';
import { requireEventPermission } from '@/features/auth/utils/rbac';
import { listGuestsByEvent, getGuestCount, createGuest } from '@/features/guests/queries/guest.queries';
import { createGuestSchema } from '@/features/guests/schemas/guest.schema';
import { paginationSchema } from '@/shared/schemas/common';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

// GET /api/app/events/:eventId/guests — List guests
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  try {
    await requireEventPermission(eventId, 'guest.read');

    const url = new URL(request.url);
    const pagination = paginationSchema.parse({
      page: url.searchParams.get('page'),
      limit: url.searchParams.get('limit'),
    });
    const status = url.searchParams.get('status') ?? undefined;
    const groupId = url.searchParams.get('groupId') ?? undefined;

    const offset = (pagination.page - 1) * pagination.limit;
    const [items, total] = await Promise.all([
      listGuestsByEvent(eventId, {
        status,
        groupId,
        limit: pagination.limit,
        offset,
      }),
      getGuestCount(eventId),
    ]);

    return NextResponse.json(successResponse({
      items,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    }));
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

// POST /api/app/events/:eventId/guests — Create guest
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  try {
    await requireEventPermission(eventId, 'guest.write');

    const body = await request.json();
    const result = createGuestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 }
      );
    }

    const guest = await createGuest({
      eventId,
      ...result.data,
    });

    return NextResponse.json(successResponse(guest), { status: 201 });
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
