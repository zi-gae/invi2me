import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { requireUser } from '@/shared/server/supabase';
import { getCurrentWorkspace } from '@/features/auth/utils/get-current-workspace';
import { createEvent, createEventMembership, listEventsByWorkspace } from '@/features/events/queries/event.queries';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  eventType: z.string().min(1),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  subtitle: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).default('private'),
});

// GET /api/app/events — List workspace events
export async function GET() {
  try {
    const workspace = await getCurrentWorkspace();
    const items = await listEventsByWorkspace(workspace.id);
    return NextResponse.json(successResponse({ items, total: items.length }));
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(errorResponse(error.code, error.message), { status: error.statusCode });
    }
    console.error('List events error:', error);
    return NextResponse.json(errorResponse('INTERNAL_ERROR', '서버 오류가 발생했습니다.'), { status: 500 });
  }
}

// POST /api/app/events — Create new event
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const workspace = await getCurrentWorkspace();

    const body = await request.json();
    const result = createEventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(errorResponse('VALIDATION_ERROR', '입력 데이터가 유효하지 않습니다.'), { status: 400 });
    }

    const event = await createEvent({
      workspaceId: workspace.id,
      ownerUserId: user.id,
      ...result.data,
      status: 'draft',
    });

    await createEventMembership({
      eventId: event.id,
      userId: user.id,
      role: 'owner',
      permissions: ['event.edit', 'event.publish', 'guest.read', 'guest.write', 'guest.checkin', 'message.send', 'report.read'],
    });

    return NextResponse.json(successResponse(event), { status: 201 });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(errorResponse(error.code, error.message), { status: error.statusCode });
    }
    console.error('Create event error:', error);
    return NextResponse.json(errorResponse('INTERNAL_ERROR', '서버 오류가 발생했습니다.'), { status: 500 });
  }
}
