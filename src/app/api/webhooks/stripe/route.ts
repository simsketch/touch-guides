import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature found', { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse('Webhook signature verification failed', { status: 400 });
    }

    const subscription = event.data.object as Stripe.Subscription;

    // Find user by stripeCustomerId
    const users = await clerkClient.users.getUserList({
      query: JSON.stringify({ publicMetadata: { stripeCustomerId: subscription.customer } }),
    });

    const user = users[0];
    if (!user) {
      console.error('No user found with stripeCustomerId:', subscription.customer);
      return new NextResponse('User not found', { status: 404 });
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await clerkClient.users.updateUser(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            isPremium: subscription.status === 'active',
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0].price.id,
          },
        });
        break;

      case 'customer.subscription.deleted':
        await clerkClient.users.updateUser(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            isPremium: false,
            subscriptionStatus: 'canceled',
          },
        });
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        await clerkClient.users.updateUser(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            isPremium: false,
            subscriptionStatus: 'payment_failed',
            lastPaymentError: (invoice as any).last_payment_error?.message || 'Payment failed',
          },
        });
        break;
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 