import { z } from 'zod/v4';

// === Primitives ===

export const uuidSchema = z.uuid();

export const slugSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '소문자, 숫자, 하이픈만 사용할 수 있습니다.');

export const emailSchema = z.email();

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9\s\-()]+$/, '올바른 전화번호 형식이 아닙니다.');

export const localeSchema = z.enum(['ko', 'en']);

export const timezoneSchema = z.string().min(1);

// === Pagination ===

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationInput = z.infer<typeof paginationSchema>;

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type CursorPaginationInput = z.infer<typeof cursorPaginationSchema>;

// === Paginated Response ===

export function paginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  });
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// === Sort / Filter ===

export const sortDirectionSchema = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof sortDirectionSchema>;

// === Date Range ===

export const dateRangeSchema = z.object({
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
});
export type DateRange = z.infer<typeof dateRangeSchema>;

// === API Response Envelope ===

export const apiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.array(z.string())).optional(),
  }),
});

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = z.infer<typeof apiErrorSchema>;

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// === Helper to create API responses ===

export function successResponse<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, string[]>
): ApiError {
  return {
    success: false,
    error: { code, message, ...(details && { details }) },
  };
}
