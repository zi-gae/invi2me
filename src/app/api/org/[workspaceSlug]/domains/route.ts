import { NextResponse } from 'next/server';

// POST /api/org/:workspaceSlug/domains — Add custom domain
export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> }
) {
  const { workspaceSlug } = await params;

  // TODO: Auth + org owner/admin check
  // TODO: Validate domain
  // TODO: Generate verification token

  return NextResponse.json({
    success: true,
    data: { message: 'TODO: implement domain registration' },
  }, { status: 201 });
}

// GET /api/org/:workspaceSlug/domains — List domains
export async function GET(
  request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> }
) {
  const { workspaceSlug } = await params;

  // TODO: Auth check

  return NextResponse.json({
    success: true,
    data: { items: [] },
  });
}
