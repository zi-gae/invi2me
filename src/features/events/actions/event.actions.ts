'use server';

import { requireUser } from '@/shared/server/supabase';
import { getCurrentWorkspace } from '@/features/auth/utils/get-current-workspace';
import { createEvent, createEventMembership, updateEvent } from '../queries/event.queries';
import {
  createEventSchema,
  updateEventSchema,
  updateEventBasicSchema,
  updateEventScheduleSchema,
  updateEventVisibilitySchema,
  updateEventSeoSchema,
  updateEventFeaturesSchema,
} from '../schemas/event.schema';
import type {
  CreateEventInput,
  UpdateEventBasicInput,
  UpdateEventScheduleInput,
  UpdateEventVisibilityInput,
  UpdateEventSeoInput,
  UpdateEventFeaturesInput,
} from '../schemas/event.schema';

export type ActionResult = { success: true } | { success: false; error: string };

export async function createEventAction(input: CreateEventInput) {
  const user = await requireUser();
  const workspace = await getCurrentWorkspace();

  const validated = createEventSchema.parse(input);

  const event = await createEvent({
    workspaceId: workspace.id,
    slug: validated.slug,
    eventType: validated.eventType,
    title: validated.title,
    subtitle: validated.subtitle,
    status: 'draft',
    visibility: validated.visibility,
    ownerUserId: user.id,
    primaryLocale: validated.primaryLocale,
    defaultTimezone: validated.defaultTimezone,
    startsAt: validated.startsAt,
    endsAt: validated.endsAt,
    coverImageUrl: validated.coverImageUrl,
  });

  await createEventMembership({
    eventId: event.id,
    userId: user.id,
    role: 'owner',
    permissions: [
      'event.edit',
      'event.publish',
      'guest.read',
      'guest.write',
      'guest.checkin',
      'message.send',
      'report.read',
    ],
  });

  return event;
}

export async function updateEventAction(eventId: string, input: Record<string, unknown>) {
  const validated = updateEventSchema.parse(input);
  return updateEvent(eventId, validated);
}

export async function updateEventBasicAction(
  eventId: string,
  input: UpdateEventBasicInput,
): Promise<ActionResult> {
  try {
    await requireUser();
    const validated = updateEventBasicSchema.parse(input);
    await updateEvent(eventId, validated);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : '저장에 실패했습니다' };
  }
}

export async function updateEventScheduleAction(
  eventId: string,
  input: UpdateEventScheduleInput,
): Promise<ActionResult> {
  try {
    await requireUser();
    const validated = updateEventScheduleSchema.parse(input);
    await updateEvent(eventId, {
      startsAt: validated.startsAt ?? null,
      endsAt: validated.endsAt ?? null,
      rsvpOpensAt: validated.rsvpOpensAt ?? null,
      rsvpClosesAt: validated.rsvpClosesAt ?? null,
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : '저장에 실패했습니다' };
  }
}

export async function updateEventVisibilityAction(
  eventId: string,
  input: UpdateEventVisibilityInput,
): Promise<ActionResult> {
  try {
    await requireUser();
    const validated = updateEventVisibilitySchema.parse(input);
    await updateEvent(eventId, { visibility: validated.visibility });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : '저장에 실패했습니다' };
  }
}

export async function updateEventSeoAction(
  eventId: string,
  input: UpdateEventSeoInput,
): Promise<ActionResult> {
  try {
    await requireUser();
    const validated = updateEventSeoSchema.parse(input);
    await updateEvent(eventId, {
      seoTitle: validated.seoTitle ?? null,
      seoDescription: validated.seoDescription ?? null,
      ogImageUrl: validated.ogImageUrl || null,
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : '저장에 실패했습니다' };
  }
}

export async function updateEventFeaturesAction(
  eventId: string,
  input: UpdateEventFeaturesInput,
): Promise<ActionResult> {
  try {
    await requireUser();
    const validated = updateEventFeaturesSchema.parse(input);
    await updateEvent(eventId, validated);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : '저장에 실패했습니다' };
  }
}

export async function archiveEventAction(eventId: string): Promise<ActionResult> {
  try {
    await requireUser();
    await updateEvent(eventId, { status: 'archived' });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : '보관에 실패했습니다' };
  }
}

export async function deleteEventAction(eventId: string): Promise<ActionResult> {
  try {
    await requireUser();
    await updateEvent(eventId, { deletedAt: new Date().toISOString() });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : '삭제에 실패했습니다' };
  }
}
