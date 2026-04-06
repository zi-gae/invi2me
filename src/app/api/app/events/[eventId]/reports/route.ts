import { NextResponse } from 'next/server';
import { requireEventPermission } from '@/features/auth/utils/rbac';
import { getRsvpSummary } from '@/features/rsvp/queries/rsvp.queries';
import { getGuestCount } from '@/features/guests/queries/guest.queries';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

// GET /api/app/events/:eventId/reports — Get event reports summary
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  try {
    await requireEventPermission(eventId, 'report.read');

    const [rsvpSummary, totalGuests] = await Promise.all([
      getRsvpSummary(eventId),
      getGuestCount(eventId),
    ]);

    return NextResponse.json(successResponse({
      eventId,
      totalGuests,
      rsvp: rsvpSummary,
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
