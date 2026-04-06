'use server';

import { requireUser } from '@/shared/server/supabase';
import { getCurrentWorkspace } from '@/features/auth/utils/get-current-workspace';
import { createEvent, createEventMembership, updateEvent } from '../queries/event.queries';
import { createEventSchema, updateEventSchema } from '../schemas/event.schema';
import type { CreateEventInput } from '../schemas/event.schema';

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
