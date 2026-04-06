import { DomainError, ValidationError } from '@/shared/lib/errors';
import { type ApiError, errorResponse } from '@/shared/schemas/common';
import { NextResponse } from 'next/server';

/**
 * Wraps an API route handler with standardized error handling.
 * Converts DomainErrors to proper HTTP responses.
 */
export function withErrorHandler(
  handler: (request: Request, context: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
  return async (request: Request, context: { params: Promise<Record<string, string>> }) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ValidationError) {
        const body: ApiError = errorResponse(
          error.code,
          error.message,
          error.fieldErrors
        );
        return NextResponse.json(body, { status: error.statusCode });
      }

      if (error instanceof DomainError) {
        const body: ApiError = errorResponse(error.code, error.message);
        return NextResponse.json(body, { status: error.statusCode });
      }

      // Unknown error — log and return generic message
      console.error('Unhandled API error:', error);
      const body: ApiError = errorResponse(
        'INTERNAL_ERROR',
        '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
      return NextResponse.json(body, { status: 500 });
    }
  };
}
