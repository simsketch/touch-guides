'use client';

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const { user, isLoaded } = useUser();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            <div className="flex items-center">
              <img src="/logo.png" alt="TouchGuides Logo" className="h-8 w-auto mr-2" />
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {!isLoaded ? (
              <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{user.emailAddresses[0]?.emailAddress}</span>
                  <SignOutButton>
                    <button className="text-red-500 hover:text-red-600">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 