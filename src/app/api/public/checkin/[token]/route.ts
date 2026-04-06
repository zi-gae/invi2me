import { NextResponse } from 'next/server';

// POST /api/public/checkin/:token — QR check-in
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // TODO: Validate QR token
  // TODO: Check expiry/revocation
  // TODO: Check for duplicate check-in
  // TODO: Create checkin_log record
  // TODO: Update guest status

  return NextResponse.json({
    success: true,
    data: { message: 'TODO: implement QR check-in' },
  });
}
