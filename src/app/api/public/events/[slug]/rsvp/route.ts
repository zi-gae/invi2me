import { NextResponse } from 'next/server';

// POST /api/public/events/:slug/rsvp — Submit RSVP response
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // TODO: Validate with submitRsvpSchema
  // TODO: Check RSVP window (rsvp_opens_at / rsvp_closes_at)
  // TODO: Check for duplicate submission
  // TODO: Create rsvp_response record
  // TODO: Update guest status

  return NextResponse.json({
    success: true,
    data: { slug, message: 'TODO: implement RSVP submission' },
  }, { status: 201 });
}
