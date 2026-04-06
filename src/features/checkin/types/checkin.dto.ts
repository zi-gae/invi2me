// Checkin DTOs

export interface CheckinLogDto {
  id: string;
  guestId: string;
  guestName: string;
  method: string;
  status: string;
  checkedInAt: string;
  checkedInBy: string | null;
}

export interface CheckinSessionDto {
  id: string;
  eventId: string;
  name: string;
  scheduleId: string | null;
  status: string;
  startsAt: string | null;
  endsAt: string | null;
  totalCheckins: number;
}

export interface CheckinSummaryDto {
  totalGuests: number;
  checkedIn: number;
  pending: number;
  duplicateAttempts: number;
}
