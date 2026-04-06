import { NextResponse } from 'next/server';

// GET /api/app/events/:eventId — Get event details (admin)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // TODO: Auth check
  // TODO: Permission check (event membership)
  // TODO: Fetch event with AdminEventDto

  return NextResponse.json({
    success: true,
    data: { eventId, message: 'TODO: implement admin event fetch' },
  });
}

// PATCH /api/app/events/:eventId — Update event
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // TODO: Auth + permission check
  // TODO: Validate with updateEventSchema
  // TODO: Update event
  // TODO: Audit log

  return NextResponse.json({
    success: true,
    data: { eventId, message: 'TODO: implement event update' },
  });
}
