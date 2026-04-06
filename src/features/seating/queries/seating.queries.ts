import { db } from '@/db';
import { seatingAreas, tables, tableAssignments } from '@/db/schema/seating';
import { guests } from '@/db/schema/guests';
import { eq, and, sql, count, isNull } from 'drizzle-orm';
import { DomainError } from '@/shared/lib/errors';

/** List seating areas with table count */
export async function listSeatingAreas(eventId: string) {
  return db
    .select({
      id: seatingAreas.id,
      eventId: seatingAreas.eventId,
      name: seatingAreas.name,
      sortOrder: seatingAreas.sortOrder,
      createdAt: seatingAreas.createdAt,
      updatedAt: seatingAreas.updatedAt,
      tableCount: sql<number>`(
        SELECT COUNT(*) FROM tables
        WHERE tables.seating_area_id = ${seatingAreas.id}
      )`.as('table_count'),
    })
    .from(seatingAreas)
    .where(eq(seatingAreas.eventId, eventId))
    .orderBy(seatingAreas.sortOrder);
}

/** Create a seating area */
export async function createSeatingArea(data: {
  eventId: string;
  name: string;
  areaType?: string;
  capacity?: number;
}) {
  const [area] = await db
    .insert(seatingAreas)
    .values({
      eventId: data.eventId,
      name: data.name,
    })
    .returning();
  return area;
}

/** List tables in a seating area */
export async function listTables(seatingAreaId: string) {
  return db
    .select()
    .from(tables)
    .where(eq(tables.seatingAreaId, seatingAreaId))
    .orderBy(tables.sortOrder);
}

/** Create a table (resolves eventId from seating area) */
export async function createTable(data: {
  seatingAreaId: string;
  tableName: string;
  tableNumber?: number;
  capacity: number;
  shape?: string;
}) {
  const [area] = await db
    .select({ eventId: seatingAreas.eventId })
    .from(seatingAreas)
    .where(eq(seatingAreas.id, data.seatingAreaId))
    .limit(1);

  if (!area) {
    throw new DomainError('좌석 구역을 찾을 수 없습니다.', {
      code: 'SEATING_AREA_NOT_FOUND',
      statusCode: 404,
    });
  }

  const [table] = await db
    .insert(tables)
    .values({
      eventId: area.eventId,
      seatingAreaId: data.seatingAreaId,
      name: data.tableName,
      capacity: data.capacity,
      shape: data.shape ?? 'round',
    })
    .returning();
  return table;
}

/** Assign a guest to a table (resolves eventId from table) */
export async function assignGuestToTable(data: {
  tableId: string;
  guestId: string;
  seatNumber?: string;
}) {
  const [table] = await db
    .select({ eventId: tables.eventId })
    .from(tables)
    .where(eq(tables.id, data.tableId))
    .limit(1);

  if (!table) {
    throw new DomainError('테이블을 찾을 수 없습니다.', {
      code: 'TABLE_NOT_FOUND',
      statusCode: 404,
    });
  }

  const [assignment] = await db
    .insert(tableAssignments)
    .values({
      eventId: table.eventId,
      tableId: data.tableId,
      guestId: data.guestId,
      seatLabel: data.seatNumber,
      assignedAt: new Date().toISOString(),
    })
    .returning();
  return assignment;
}

/** Remove a guest from a table */
export async function removeGuestFromTable(assignmentId: string) {
  const [assignment] = await db
    .delete(tableAssignments)
    .where(eq(tableAssignments.id, assignmentId))
    .returning();

  if (!assignment) {
    throw new DomainError('좌석 배정을 찾을 수 없습니다.', {
      code: 'ASSIGNMENT_NOT_FOUND',
      statusCode: 404,
    });
  }
  return assignment;
}

/** Get table assignments with guest info */
export async function getTableAssignments(tableId: string) {
  return db
    .select({
      assignment: tableAssignments,
      guest: {
        id: guests.id,
        fullName: guests.fullName,
        guestType: guests.guestType,
        status: guests.status,
      },
    })
    .from(tableAssignments)
    .innerJoin(guests, eq(tableAssignments.guestId, guests.id))
    .where(eq(tableAssignments.tableId, tableId));
}

/** Get seating overview: total capacity, assigned count, unassigned guests */
export async function getSeatingOverview(eventId: string) {
  const [capacityResult] = await db
    .select({
      totalCapacity: sql<number>`COALESCE(SUM(${tables.capacity}), 0)`,
      tableCount: count(tables.id),
    })
    .from(tables)
    .where(eq(tables.eventId, eventId));

  const [assignedResult] = await db
    .select({
      assignedCount: count(tableAssignments.id),
    })
    .from(tableAssignments)
    .where(eq(tableAssignments.eventId, eventId));

  const [unassignedResult] = await db
    .select({
      unassignedCount: count(guests.id),
    })
    .from(guests)
    .leftJoin(
      tableAssignments,
      and(
        eq(tableAssignments.guestId, guests.id),
        eq(tableAssignments.eventId, eventId)
      )
    )
    .where(and(eq(guests.eventId, eventId), isNull(tableAssignments.id)));

  return {
    totalCapacity: capacityResult?.totalCapacity ?? 0,
    tableCount: capacityResult?.tableCount ?? 0,
    assignedCount: assignedResult?.assignedCount ?? 0,
    unassignedGuests: unassignedResult?.unassignedCount ?? 0,
  };
}
