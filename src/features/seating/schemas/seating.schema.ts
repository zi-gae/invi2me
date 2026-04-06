import { z } from 'zod/v4';

export const createSeatingAreaSchema = z.object({
  name: z.string().min(1).max(100),
  sortOrder: z.number().int().min(0).default(0),
});
export type CreateSeatingAreaInput = z.infer<typeof createSeatingAreaSchema>;

export const createTableSchema = z.object({
  name: z.string().min(1).max(100),
  capacity: z.number().int().min(1).max(100),
  shape: z.enum(['round', 'rect', 'custom']),
  seatingAreaId: z.string().uuid().optional(),
  sortOrder: z.number().int().min(0).default(0),
});
export type CreateTableInput = z.infer<typeof createTableSchema>;

export const assignSeatSchema = z.object({
  guestId: z.string().uuid(),
  tableId: z.string().uuid(),
  seatLabel: z.string().max(20).optional(),
});
export type AssignSeatInput = z.infer<typeof assignSeatSchema>;

export const bulkAssignSeatsSchema = z.object({
  assignments: z.array(assignSeatSchema).min(1).max(200),
});
export type BulkAssignSeatsInput = z.infer<typeof bulkAssignSeatsSchema>;
