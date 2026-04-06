import { NextResponse } from 'next/server';

// GET /api/public/events/:slug/gallery — Get public gallery
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // TODO: Fetch public gallery items for event

  return NextResponse.json({
    success: true,
    data: { slug, items: [] },
  });
}
