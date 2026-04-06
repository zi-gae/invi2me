import { NextResponse } from 'next/server';
import { db } from '@/db';
import { eventGalleries, eventGalleryItems, eventAssets } from '@/db/schema/content';
import { getPublicEventBySlug } from '@/features/events/queries/event.queries';
import { events } from '@/db/schema/events';
import { eq, and, asc } from 'drizzle-orm';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

// GET /api/public/events/:slug/gallery — Get public gallery
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const event = await getPublicEventBySlug(slug);

    const [eventRow] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.slug, slug))
      .limit(1);

    const galleries = await db
      .select({
        galleryId: eventGalleries.id,
        galleryName: eventGalleries.name,
        layoutType: eventGalleries.layoutType,
        gallerySortOrder: eventGalleries.sortOrder,
        itemId: eventGalleryItems.id,
        caption: eventGalleryItems.caption,
        itemSortOrder: eventGalleryItems.sortOrder,
        url: eventAssets.storagePath,
        mimeType: eventAssets.mimeType,
        width: eventAssets.width,
        height: eventAssets.height,
        altText: eventAssets.altText,
      })
      .from(eventGalleries)
      .innerJoin(
        eventGalleryItems,
        eq(eventGalleryItems.galleryId, eventGalleries.id),
      )
      .innerJoin(
        eventAssets,
        eq(eventAssets.id, eventGalleryItems.assetId),
      )
      .where(
        and(
          eq(eventGalleries.eventId, eventRow.id),
          eq(eventGalleries.isPublic, true),
        ),
      )
      .orderBy(
        asc(eventGalleries.sortOrder),
        asc(eventGalleryItems.sortOrder),
      );

    const items = galleries.map((row) => ({
      id: row.itemId,
      galleryName: row.galleryName,
      layoutType: row.layoutType,
      url: row.url,
      caption: row.caption,
      sortOrder: row.itemSortOrder,
      mimeType: row.mimeType,
      width: row.width,
      height: row.height,
      altText: row.altText,
    }));

    return NextResponse.json(successResponse({ slug: event.slug, items }));
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
