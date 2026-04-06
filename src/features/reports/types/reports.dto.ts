// Reports DTOs

export interface EventReportSummaryDto {
  eventId: string;
  period: { from: string; to: string };
  pageViews: number;
  uniqueVisitors: number;
  rsvpStarted: number;
  rsvpCompleted: number;
  rsvpConversionRate: number;
  attendingCount: number;
  declinedCount: number;
  maybeCount: number;
  checkins: number;
  checkinRate: number;
  shares: number;
}

export interface DailyMetricDto {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  rsvpCompleted: number;
  checkins: number;
}

export interface ReferrerBreakdownDto {
  referrer: string;
  visits: number;
  rsvpConversions: number;
}

export interface ChannelPerformanceDto {
  channel: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  rsvpConversions: number;
}
