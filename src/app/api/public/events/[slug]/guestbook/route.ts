import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { guestbookMessages } from '@/db/schema/content';
import { events } from '@/db/schema/events';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError, EventNotFoundError } from '@/shared/lib/errors';

const createMessageSchema = z.object({
  author: z.string().min(1).max(50),
  relation: z.enum(['신랑 측', '신부 측', '지인', '기타']),
  content: z.string().min(1).max(500),
  password: z.string().min(4).max(20),
});

async function getPublishedEvent(slug: string) {
  const [event] = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.slug, slug), eq(events.status, 'published')))
    .limit(1);
  if (!event) throw new EventNotFoundError(slug);
  return event;
}

// GET /api/public/events/:slug/guestbook — 방명록 목록
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const event = await getPublishedEvent(slug);

    const messages = await db
      .select({
        id: guestbookMessages.id,
        author: guestbookMessages.author,
        relation: guestbookMessages.relation,
        content: guestbookMessages.content,
        createdAt: guestbookMessages.createdAt,
      })
      .from(guestbookMessages)
      .where(
        and(
          eq(guestbookMessages.eventId, event.id),
          isNull(guestbookMessages.deletedAt),
        ),
      )
      .orderBy(desc(guestbookMessages.createdAt));

    return NextResponse.json(successResponse(messages));
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

// POST /api/public/events/:slug/guestbook — 방명록 작성
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const body: unknown = await request.json();
    const parsed = createMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'),
        { status: 400 },
      );
    }

    const { author, relation, content, password } = parsed.data;
    const event = await getPublishedEvent(slug);
    const passwordHash = await bcrypt.hash(password, 10);

    const [created] = await db
      .insert(guestbookMessages)
      .values({ eventId: event.id, author, relation, content, passwordHash })
      .returning({
        id: guestbookMessages.id,
        author: guestbookMessages.author,
        relation: guestbookMessages.relation,
        content: guestbookMessages.content,
        createdAt: guestbookMessages.createdAt,
      });

    return NextResponse.json(successResponse(created), { status: 201 });
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
