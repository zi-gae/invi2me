import { NextResponse } from 'next/server';
import { db } from '@/db';
import { events } from '@/db/schema/events';
import { eq, and } from 'drizzle-orm';
import { submitRsvpSchema } from '@/features/rsvp/schemas/rsvp.schema';
import { submitRsvpResponse, getDefaultRsvpForm } from '@/features/rsvp/queries/rsvp.queries';
import { getGuestByToken } from '@/features/guests/queries/guest.queries';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError, RsvpClosedError, EventNotFoundError } from '@/shared/lib/errors';

// POST /api/public/events/:slug/rsvp — Submit RSVP response
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Parse and validate body
    const body = await request.json();
    const result = submitRsvpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 }
      );
    }
    const data = result.data;

    // Get the event
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.slug, slug), eq(events.status, 'published')))
      .limit(1);

    if (!event) throw new EventNotFoundError(slug);

    // Check RSVP window
    const now = new Date();
    if (event.rsvpClosesAt && new Date(event.rsvpClosesAt) < now) {
      throw new RsvpClosedError(event.id);
    }

    // Get guest by token from header or body
    const guestToken = request.headers.get('x-guest-token') ?? body.guestToken;
    const guest = await getGuestByToken(guestToken);

    // Get default RSVP form
    const form = await getDefaultRsvpForm(event.id);
    if (!form) {
      return NextResponse.json(
        errorResponse('RSVP_FORM_NOT_FOUND', 'RSVP 양식을 찾을 수 없습니다.'),
        { status: 404 }
      );
    }

    // Submit response
    const response = await submitRsvpResponse({
      eventId: event.id,
      rsvpFormId: form.id,
      guestId: guest.id,
      attendanceStatus: data.attendanceStatus,
      partySize: data.partySize,
      mealCount: data.mealCount,
      sourceType: guestToken ? 'personal_link' : 'public_link',
      messageToCouple: data.messageToCouple,
      answersJson: data.answers,
      consentsJson: data.consents,
    });

    return NextResponse.json(successResponse(response), { status: 201 });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        errorResponse(error.code, error.message),
        { status: error.statusCode }
      );
    }
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', '서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}
