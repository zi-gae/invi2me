import { NextResponse } from 'next/server';

// GET /api/org/:workspaceSlug/members — List org members
export async function GET(
  request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> }
) {
  const { workspaceSlug } = await params;

  // TODO: Auth + org permission check

  return NextResponse.json({
    success: true,
    data: { items: [], total: 0 },
  });
}
