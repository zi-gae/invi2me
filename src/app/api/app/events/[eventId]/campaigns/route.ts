import { NextResponse } from 'next/server';

// POST /api/app/events/:eventId/campaigns — Create campaign
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // TODO: Auth + permission check (message.send)
  // TODO: Validate campaign data
  // TODO: Create campaign + campaign_deliveries
  // TODO: Audit log

  return NextResponse.json({
    success: true,
    data: { eventId, message: 'TODO: implement campaign creation' },
  }, { status: 201 });
}

// GET /api/app/events/:eventId/campaigns — List campaigns
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // TODO: Auth + permission check
  // TODO: Return campaign list

  return NextResponse.json({
    success: true,
    data: { items: [], total: 0 },
  });
}
