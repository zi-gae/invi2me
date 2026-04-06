import { NextResponse } from 'next/server';

// GET /api/app/events/:eventId/reports — Get event reports summary
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // TODO: Auth + permission check (report.read)
  // TODO: Aggregate from event_metrics_daily
  // TODO: Return EventAnalyticsDto

  return NextResponse.json({
    success: true,
    data: {
      eventId,
      totalPageViews: 0,
      uniqueVisitors: 0,
      rsvpStarted: 0,
      rsvpCompleted: 0,
      attendingCount: 0,
      declinedCount: 0,
      checkins: 0,
    },
  });
}
