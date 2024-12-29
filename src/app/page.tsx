'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check if we're not on localhost
    // const hostname = window.location.hostname;
    // if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    //   router.push('/dashboard');
    // }
    // just redirect for now
    router.push('/dashboard');
  }, [router]);
  return (
    <div id="loginLoadingScreen" className="login-loading-screen">
      <div className="login-loading-bar"></div>
    </div>
  )
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Beautiful Digital Guidebooks
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Help your guests have the best experience by providing them with detailed information about your vacation rental property.
          </p>
          {user ? (
            <Link
              href="/dashboard"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          ) : (
            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <button className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors">
                Get Started
              </button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Easy to Create"
              description="Create professional guidebooks in minutes with our intuitive interface."
            />
            <FeatureCard
              title="Digital & PDF Format"
              description="Share your guidebooks digitally or download them as PDFs."
            />
            <FeatureCard
              title="Import from Airbnb"
              description="Import your property details directly from your Airbnb listings."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
