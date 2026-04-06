import { NextResponse } from 'next/server';

// GET /api/app/events/:eventId/guests — List guests
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // TODO: Auth + permission check (guest.read)
  // TODO: Pagination, filtering, sorting
  // TODO: Return AdminGuestDto[] with masked phone/email

  return NextResponse.json({
    success: true,
    data: { items: [], total: 0, page: 1, limit: 20, totalPages: 0 },
  });
}

// POST /api/app/events/:eventId/guests — Create guest
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // TODO: Auth + permission check (guest.write)
  // TODO: Validate with createGuestSchema
  // TODO: Generate invitation_token
  // TODO: Create guest record
  // TODO: Audit log

  return NextResponse.json({
    success: true,
    data: { eventId, message: 'TODO: implement guest creation' },
  }, { status: 201 });
}
