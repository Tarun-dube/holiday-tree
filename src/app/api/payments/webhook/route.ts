import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { id: paymentIntentId, metadata } = paymentIntent;
  
  // Update booking status to confirmed
  await prisma.booking.update({
    where: { stripePaymentIntentId: paymentIntentId },
    data: {
      paymentStatus: 'COMPLETED',
      status: 'CONFIRMED',
    },
  });

  console.log(`Payment succeeded for booking: ${metadata.bookingId}`);
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { id: paymentIntentId } = paymentIntent;
  
  // Update booking status to failed
  await prisma.booking.update({
    where: { stripePaymentIntentId: paymentIntentId },
    data: {
      paymentStatus: 'FAILED',
      status: 'CANCELLED',
    },
  });

  console.log(`Payment failed for payment intent: ${paymentIntentId}`);
}
