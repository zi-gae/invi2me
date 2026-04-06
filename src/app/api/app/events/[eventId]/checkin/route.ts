import { NextResponse } from 'next/server';
import { requireEventPermission } from '@/features/auth/utils/rbac';
import {
  performCheckin,
  getCheckinSummary,
  listCheckinLogs,
} from '@/features/checkin/queries/checkin.queries';
import { checkinSchema } from '@/features/checkin/schemas/checkin.schema';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;
  try {
    const membership = await requireEventPermission(eventId, 'guest.checkin');
    const body = await request.json();
    const result = checkinSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 },
      );
    }
    const log = await performCheckin({
      eventId,
      guestId: result.data.guestId,
      method: result.data.method,
      checkinSessionId: result.data.sessionId,
      checkedInBy: membership.userId,
    });
    return NextResponse.json(successResponse(log), { status: 201 });
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;
  try {
    await requireEventPermission(eventId, 'guest.checkin');
    const [summary, logs] = await Promise.all([
      getCheckinSummary(eventId),
      listCheckinLogs(eventId),
    ]);
    return NextResponse.json(successResponse({ summary, logs }));
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
