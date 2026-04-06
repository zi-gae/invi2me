import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/shared/schemas/common';

async function handleStripeWebhook(_body: string, _headers: Headers) {
  // TODO: verify Stripe signature with stripe.webhooks.constructEvent
  console.log('[webhook] Stripe event received');
}

async function handleResendWebhook(_body: string, _headers: Headers) {
  // TODO: verify Resend signature
  console.log('[webhook] Resend event received');
}

// POST /api/webhooks — Receive external webhooks (Stripe, Resend, etc.)
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const source = request.headers.get('x-webhook-source');

    switch (source) {
      case 'stripe':
        await handleStripeWebhook(rawBody, request.headers);
        break;
      case 'resend':
        await handleResendWebhook(rawBody, request.headers);
        break;
      default:
        console.log(`[webhook] Unknown source: ${source ?? 'none'}`);
        return NextResponse.json(
          errorResponse('UNKNOWN_WEBHOOK_SOURCE', 'Unknown webhook source'),
          { status: 400 },
        );
    }

    return NextResponse.json(successResponse({ received: true }));
  } catch (error) {
    console.error('[webhook] Processing error:', error);
    return NextResponse.json(
      errorResponse('WEBHOOK_ERROR', 'Webhook processing failed'),
      { status: 500 },
    );
  }
}
