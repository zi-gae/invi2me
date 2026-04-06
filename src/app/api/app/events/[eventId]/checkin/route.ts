import { NextResponse } from 'next/server';

// POST /api/app/events/:eventId/checkin — Manual check-in
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // TODO: Auth + permission check (guest.checkin)
  // TODO: Validate check-in data
  // TODO: Check duplicate
  // TODO: Create checkin_log
  // TODO: Update guest status

  return NextResponse.json({
    success: true,
    data: { eventId, message: 'TODO: implement manual check-in' },
  }, { status: 201 });
}
