export interface KakaoCalendarIntegration {
  enabled: boolean;
  buttonLabel: string;
  eventId: string | null;
}

export interface KakaoPayIntegration {
  enabled: boolean;
}

export interface EventIntegrations {
  kakaoCalendar?: KakaoCalendarIntegration;
  kakaoPay?: KakaoPayIntegration;
}

// Public DTO — shown on public event pages (no sensitive data)
export interface PublicEventDto {
  slug: string;
  eventType: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  heroLayout: string | null;
  primaryLocale: string;
  startsAt: string | null;
  endsAt: string | null;
  rsvpOpensAt: string | null;
  rsvpClosesAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  integrations: EventIntegrations | null;
}

// Admin DTO — shown in console (includes internal fields)
export interface AdminEventDto {
  id: string;
  workspaceId: string;
  organizationId: string | null;
  slug: string;
  eventType: string;
  title: string;
  subtitle: string | null;
  status: string;
  visibility: string;
  ownerUserId: string;
  templateId: string | null;
  themeId: string | null;
  primaryLocale: string;
  defaultTimezone: string;
  coverImageUrl: string | null;
  heroLayout: string | null;
  publishedAt: string | null;
  startsAt: string | null;
  endsAt: string | null;
  rsvpOpensAt: string | null;
  rsvpClosesAt: string | null;
  checkinEnabled: boolean;
  messagingEnabled: boolean;
  analyticsEnabled: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  integrations: EventIntegrations | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// Analytics summary
export interface EventAnalyticsDto {
  eventId: string;
  totalPageViews: number;
  uniqueVisitors: number;
  rsvpStarted: number;
  rsvpCompleted: number;
  attendingCount: number;
  declinedCount: number;
  checkins: number;
}
