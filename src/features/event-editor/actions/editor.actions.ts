'use server';

import { revalidatePath } from 'next/cache';
import { requireEventPermission } from '@/features/auth/utils/rbac';
import { requireUser } from '@/shared/server/supabase';
import {
  createEventPage,
  createSection,
  updateSection,
  deleteSection,
  publishPage,
} from '../queries/editor.queries';

const DEFAULT_SECTIONS = [
  { sectionType: 'hero', sectionKey: 'hero', sortOrder: 0 },
  { sectionType: 'couple_profile', sectionKey: 'couple-profile', sortOrder: 1 },
  { sectionType: 'event_schedule', sectionKey: 'event-schedule', sortOrder: 2 },
  { sectionType: 'location_map', sectionKey: 'location-map', sortOrder: 3 },
  { sectionType: 'gallery', sectionKey: 'gallery', sortOrder: 4 },
  { sectionType: 'gift_account', sectionKey: 'gift-account', sortOrder: 5 },
  { sectionType: 'guestbook', sectionKey: 'guestbook', sortOrder: 6 },
  { sectionType: 'rsvp_form', sectionKey: 'rsvp-form', sortOrder: 7 },
] as const;

export async function createPageAction(eventId: string) {
  await requireEventPermission(eventId, 'event.edit');

  const page = await createEventPage({
    eventId,
    locale: 'ko',
    title: '메인 페이지',
    slug: 'main',
    pageType: 'main',
    isHome: true,
  });

  for (const section of DEFAULT_SECTIONS) {
    await createSection({
      eventPageId: page.id,
      ...section,
      propsJson: {},
    });
  }

  revalidatePath(`/app/events/${eventId}/editor`);
  return { success: true, pageId: page.id };
}

export async function addSectionAction(
  eventId: string,
  pageId: string,
  sectionType: string,
  sortOrder: number
) {
  await requireEventPermission(eventId, 'event.edit');

  const sectionKey = `${sectionType}-${Date.now().toString(36)}`;

  const section = await createSection({
    eventPageId: pageId,
    sectionType,
    sectionKey,
    sortOrder,
    propsJson: {},
    isEnabled: true,
  });

  revalidatePath(`/app/events/${eventId}/editor`);
  return { success: true, sectionId: section.id };
}

export async function toggleSectionAction(
  eventId: string,
  sectionId: string,
  isEnabled: boolean
) {
  await requireEventPermission(eventId, 'event.edit');
  await updateSection(sectionId, { isEnabled });
  revalidatePath(`/app/events/${eventId}/editor`);
  return { success: true };
}

export async function deleteSectionAction(
  eventId: string,
  sectionId: string
) {
  await requireEventPermission(eventId, 'event.edit');
  await deleteSection(sectionId);
  revalidatePath(`/app/events/${eventId}/editor`);
  return { success: true };
}

export async function publishPageAction(eventId: string, pageId: string) {
  await requireEventPermission(eventId, 'event.publish');
  const user = await requireUser();
  const version = await publishPage(pageId, user.id);
  revalidatePath(`/app/events/${eventId}`);
  revalidatePath(`/app/events/${eventId}/editor`);
  return { success: true, versionNo: version.versionNo };
}

export async function updateSectionPropsAction(
  eventId: string,
  sectionId: string,
  propsJson: Record<string, unknown>,
) {
  await requireEventPermission(eventId, 'event.edit');
  await updateSection(sectionId, { propsJson });
  revalidatePath(`/app/events/${eventId}/editor`);
  return { success: true };
}

export async function reorderSectionsAction(
  eventId: string,
  sectionIds: string[],
) {
  await requireEventPermission(eventId, 'event.edit');

  // 각 섹션의 sortOrder를 배열 인덱스로 업데이트
  await Promise.all(
    sectionIds.map((id, index) => updateSection(id, { sortOrder: index }))
  );

  revalidatePath(`/app/events/${eventId}/editor`);
  return { success: true };
}
