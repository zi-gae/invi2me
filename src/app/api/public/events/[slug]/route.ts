import { NextResponse } from 'next/server';
import { getPublicEventBySlug } from '@/features/events/queries/event.queries';
import { successResponse, errorResponse } from '@/shared/schemas/common';
import { DomainError } from '@/shared/lib/errors';

// GET /api/public/events/:slug — Get published event data
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const event = await getPublicEventBySlug(slug);
    return NextResponse.json(successResponse(event));
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        errorResponse(error.code, error.message),
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', '서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}
