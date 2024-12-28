'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams, useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const success = searchParams.get('success');

  const metadata = user?.publicMetadata as {
    isPremium?: boolean;
    subscriptionId?: string;
    subscriptionStatus?: string;
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // Create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.emailAddresses[0]?.emailAddress,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: metadata.subscriptionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      router.refresh();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error === 'payment-failed' && (
          <div className="mb-8 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Payment Failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  {message || 'There was an issue with your payment. Please try again.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  {metadata?.isPremium ? 'Your subscription has been canceled.' : 'Thank you for subscribing to TouchGuides Premium!'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {metadata?.isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            {metadata?.isPremium 
              ? 'Your premium features will remain active until the end of your billing period.'
              : 'Get full access to all features and create unlimited guidebooks'}
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          <div className="rounded-2xl bg-white shadow-xl">
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900">Premium Plan</h3>
              <p className="mt-4 text-gray-600">Everything you need to create and manage your guidebooks</p>
              
              <div className="mt-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">$19</span>
                  <span className="ml-1 text-xl font-semibold text-gray-600">/month</span>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {[
                  'Create unlimited guidebooks',
                  'Access to all premium features',
                  'Priority support',
                  'Custom branding options',
                  'Advanced analytics',
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {metadata?.isPremium ? (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isLoading || metadata.subscriptionStatus === 'canceling'}
                  className="mt-8 w-full rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 
                   metadata.subscriptionStatus === 'canceling' ? 'Cancellation Pending' : 
                   'Cancel Subscription'}
                </button>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading || !user}
                  className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : user ? 'Upgrade Now' : 'Sign in to Subscribe'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 