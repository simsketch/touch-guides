import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      console.log('No session ID provided');
      return NextResponse.redirect(new URL('/pricing', request.url));
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (session.payment_status !== 'paid') {
      console.log('Payment not completed:', session.payment_status);
      return NextResponse.redirect(new URL('/pricing?error=payment-incomplete', request.url));
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('No userId found in session metadata');
      return NextResponse.redirect(new URL('/pricing?error=no-user', request.url));
    }

    // Get subscription details
    const subscription = session.subscription as Stripe.Subscription;

    // Update user's premium status in Clerk
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        isPremium: true,
        stripeCustomerId: session.customer as string,
        subscriptionId: subscription?.id,
        subscriptionStatus: subscription?.status,
        priceId: subscription?.items.data[0].price.id,
        lastUpdated: new Date().toISOString(),
      },
    });

    // Redirect to dashboard with success message
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/dashboard?success=true`, {
      status: 303, // Force GET request
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    return NextResponse.redirect(new URL('/pricing?error=unexpected', request.url));
  }
} 