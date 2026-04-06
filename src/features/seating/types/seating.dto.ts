// Seating DTOs

export interface SeatingAreaDto {
  id: string;
  eventId: string;
  name: string;
  sortOrder: number;
  tableCount: number;
}

export interface TableDto {
  id: string;
  eventId: string;
  seatingAreaId: string | null;
  name: string;
  capacity: number;
  shape: string;
  sortOrder: number;
  assignedCount: number;
}

export interface TableAssignmentDto {
  id: string;
  guestId: string;
  guestName: string;
  tableId: string;
  tableName: string;
  seatLabel: string | null;
  assignedAt: string;
}

export interface SeatingOverviewDto {
  totalTables: number;
  totalCapacity: number;
  totalAssigned: number;
  unassignedGuests: number;
}
