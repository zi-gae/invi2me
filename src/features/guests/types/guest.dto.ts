// Public guest info (minimal, for RSVP confirmation)
export interface PublicGuestDto {
  fullName: string;
  guestType: string;
  status: string;
}

// Admin guest DTO (for console, phone/email masked)
export interface AdminGuestDto {
  id: string;
  eventId: string;
  guestGroupId: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  email: string | null; // masked
  phone: string | null; // masked
  locale: string | null;
  guestType: string;
  sideType: string | null;
  status: string;
  notes: string | null;
  plusOneAllowed: boolean;
  maxCompanionCount: number;
  seatAssignmentRequired: boolean;
  invitationChannel: string | null;
  createdAt: string;
  updatedAt: string;
}

// Guest list summary for reports
export interface GuestSummaryDto {
  totalGuests: number;
  invited: number;
  responded: number;
  checkedIn: number;
  declined: number;
  byGroup: Array<{ groupName: string; count: number }>;
  bySide: Array<{ side: string; count: number }>;
}
