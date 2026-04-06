import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { db } from '@/db';
import { events } from '@/db/schema/events';
import { eq, and } from 'drizzle-orm';
import { trackPageEvent } from '@/features/reports/queries/analytics.queries';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError, EventNotFoundError } from '@/shared/lib/errors';

const pageEventSchema = z.object({
  eventType: z.string().min(1),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
  sessionId: z.string().optional(),
});

// POST /api/public/events/:slug/page-events — Track page events (analytics)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const result = pageEventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 },
      );
    }

    const [event] = await db
      .select({ id: events.id })
      .from(events)
      .where(and(eq(events.slug, slug), eq(events.status, 'published')))
      .limit(1);

    if (!event) {
      throw new EventNotFoundError(slug);
    }

    const userAgent = request.headers.get('user-agent') ?? undefined;

    await trackPageEvent({
      eventId: event.id,
      eventType: result.data.eventType,
      pageUrl: result.data.pageUrl,
      referrer: result.data.referrer,
      sessionId: result.data.sessionId,
    });

    return NextResponse.json(successResponse(null), { status: 201 });
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
