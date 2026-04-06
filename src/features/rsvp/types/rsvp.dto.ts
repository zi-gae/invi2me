// Public RSVP response (shown to guest after submission)
export interface PublicRsvpResponseDto {
  attendanceStatus: string;
  partySize: number;
  mealCount: number;
  submittedAt: string;
  messageToCouple: string | null;
}

// Admin RSVP DTO
export interface AdminRsvpResponseDto {
  id: string;
  eventId: string;
  guestId: string;
  guestName: string;
  attendanceStatus: string;
  partySize: number;
  mealCount: number;
  submittedAt: string;
  sourceType: string;
  answersJson: Record<string, unknown>;
  messageToCouple: string | null;
  createdAt: string;
  updatedAt: string;
}

// RSVP summary for dashboard
export interface RsvpSummaryDto {
  total: number;
  attending: number;
  notAttending: number;
  maybe: number;
  totalPartySize: number;
  totalMealCount: number;
}
