import { NextResponse } from 'next/server';

// POST /api/webhooks — Receive external webhooks (Stripe, Resend, etc.)
export async function POST(request: Request) {
  // TODO: Verify webhook signature
  // TODO: Route to appropriate handler based on source

  return NextResponse.json({ received: true });
}
