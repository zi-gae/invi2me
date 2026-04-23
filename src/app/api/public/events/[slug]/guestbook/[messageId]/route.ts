import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { guestbookMessages } from '@/db/schema/content';
import { events } from '@/db/schema/events';
import { eq, and, isNull } from 'drizzle-orm';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError, EventNotFoundError } from '@/shared/lib/errors';

const deleteMessageSchema = z.object({
  password: z.string().min(1),
});

// DELETE /api/public/events/:slug/guestbook/:messageId — 비밀번호 검증 후 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; messageId: string }> },
) {
  const { slug, messageId } = await params;

  try {
    const body: unknown = await request.json();
    const parsed = deleteMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', '비밀번호를 입력해주세요.'),
        { status: 400 },
      );
    }

    const [event] = await db
      .select({ id: events.id })
      .from(events)
      .where(and(eq(events.slug, slug), eq(events.status, 'published')))
      .limit(1);
    if (!event) throw new EventNotFoundError(slug);

    const [message] = await db
      .select()
      .from(guestbookMessages)
      .where(
        and(
          eq(guestbookMessages.id, messageId),
          eq(guestbookMessages.eventId, event.id),
          isNull(guestbookMessages.deletedAt),
        ),
      )
      .limit(1);

    if (!message) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', '메시지를 찾을 수 없습니다.'),
        { status: 404 },
      );
    }

    const isPasswordValid = await bcrypt.compare(
      parsed.data.password,
      message.passwordHash,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        errorResponse('INVALID_PASSWORD', '비밀번호가 올바르지 않습니다.'),
        { status: 401 },
      );
    }

    await db
      .update(guestbookMessages)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(guestbookMessages.id, messageId));

    return NextResponse.json(successResponse({ id: messageId }));
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
