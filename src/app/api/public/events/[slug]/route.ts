import { NextResponse } from 'next/server';

// GET /api/public/events/:slug — Get published event data
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // TODO: Fetch published event by slug
  // TODO: Return PublicEventDto (no sensitive data)

  return NextResponse.json({
    success: true,
    data: { slug, message: 'TODO: implement public event fetch' },
  });
}
