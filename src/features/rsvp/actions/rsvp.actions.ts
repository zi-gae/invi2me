'use server';

import { db } from '@/db';
import { events } from '@/db/schema/events';
import { eq, and } from 'drizzle-orm';
import { submitRsvpSchema } from '../schemas/rsvp.schema';
import { submitRsvpResponse, getDefaultRsvpForm } from '../queries/rsvp.queries';
import { getGuestByToken } from '@/features/guests/queries/guest.queries';
import { DomainError, EventNotFoundError, RsvpClosedError } from '@/shared/lib/errors';
import type { SubmitRsvpInput } from '../schemas/rsvp.schema';
import type { PublicRsvpResponseDto } from '../types/rsvp.dto';

export type RsvpActionResult =
  | { success: true; data: PublicRsvpResponseDto }
  | { success: false; error: string; code: string };

export async function submitRsvpAction(
  eventSlug: string,
  guestToken: string,
  input: SubmitRsvpInput,
): Promise<RsvpActionResult> {
  try {
    const validated = submitRsvpSchema.parse(input);

    // Get published event
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.slug, eventSlug), eq(events.status, 'published')))
      .limit(1);

    if (!event) throw new EventNotFoundError(eventSlug);

    // Check RSVP window
    const now = new Date();
    if (event.rsvpClosesAt && new Date(event.rsvpClosesAt) < now) {
      throw new RsvpClosedError(event.id);
    }

    // Validate guest token
    const guest = await getGuestByToken(guestToken);

    // Get default RSVP form
    const form = await getDefaultRsvpForm(event.id);
    if (!form) {
      return { success: false, error: 'RSVP 양식을 찾을 수 없습니다.', code: 'RSVP_FORM_NOT_FOUND' };
    }

    // Submit response
    const response = await submitRsvpResponse({
      eventId: event.id,
      rsvpFormId: form.id,
      guestId: guest.id,
      attendanceStatus: validated.attendanceStatus,
      partySize: validated.partySize,
      mealCount: validated.mealCount,
      sourceType: 'personal_link',
      messageToCouple: validated.messageToCouple,
      answersJson: validated.answers,
      consentsJson: validated.consents,
    });

    return {
      success: true,
      data: {
        attendanceStatus: response.attendanceStatus,
        partySize: response.partySize,
        mealCount: response.mealCount,
        submittedAt: response.submittedAt,
        messageToCouple: response.messageToCouple,
      },
    };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('RSVP submission error:', error);
    return { success: false, error: '서버 오류가 발생했습니다.', code: 'INTERNAL_ERROR' };
  }
}
