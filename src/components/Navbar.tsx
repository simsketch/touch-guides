'use client';

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, SparklesIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

type UserMetadata = {
  isPremium?: boolean;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
};

export default function Navbar() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const metadata = user?.publicMetadata as UserMetadata;
  const isPremium = metadata?.isPremium === true;

  return (
    <>
      <style jsx global>{`
        @keyframes login-loading-bar {
          0% {
            left: -35%;
            right: 100%
          }

          100%,60% {
            left: 100%;
            right: -90%
          }
        }

        @keyframes login-loading-bar-short {
          0% {
            left: -200%;
            right: 100%
          }

          100%,60% {
            left: 107%;
            right: -8%
          }
        }

        .login-loading-screen {
          background: #f5f5f5;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          z-index: 12;
          text-align: center
        }

        .login-loading-screen .login-loading-bar {
          position: relative;
          height: 64px;
          display: block;
          width: 100%;
          background-color: #e8f0ff;
          background-clip: padding-box;
          overflow: hidden
        }

        .login-loading-screen .login-loading-bar::after,
        .login-loading-screen .login-loading-bar::before {
          content: '';
          background-color: #4f46e5;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          will-change: left,right;
          animation: login-loading-bar 2.1s cubic-bezier(.65,.815,.735,.395) infinite
        }

        .login-loading-screen .login-loading-bar::after {
          animation: login-loading-bar-short 2.1s cubic-bezier(.165,.84,.44,1) infinite;
          animation-delay: 1.15s
        }

        .login-loading-spacer {
          height: 100vh
        }
      `}</style>

      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              <div className="flex items-center">
                <Image src="/logo.png" alt="TouchGuides Logo" width={250} height={56} className="h-8 w-auto mr-2" />
              </div>
            </Link>

            <div className="flex-1 flex space-x-6 ml-10">
              {!isLoaded ? null : user ? (
                isPremium && (
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                )
              ) : (
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </Link>
              )}
                <Link
                  href="https://touchguides.com/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Support
                </Link>
            </div>

            <div className="flex items-center space-x-6">
              {!isLoaded ? (
                <div className="w-24">
                  <LoadingSpinner />
                </div>
              ) : user ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 rounded-full bg-white p-1 hover:bg-gray-50 focus:outline-none">
                    {user.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName || 'User'}
                        height={32}
                        width={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user.fullName}
                          {isPremium && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                              Premium
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{user.emailAddresses[0]?.emailAddress}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/user-profile"
                            className={`${
                              active ? 'bg-gray-50' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                            Profile Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/pricing"
                            className={`${
                              active ? 'bg-gray-50' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <CreditCardIcon className="mr-3 h-5 w-5 text-gray-400" />
                            Subscription
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <SignOutButton signOutCallback={() => {
                            window.location.href = '/';
                          }}>
                            <button
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                            >
                              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                              Sign out
                            </button>
                          </SignOutButton>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <>
                  <SignInButton mode="modal" redirectUrl="/dashboard">
                    <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      Sign Up
                    </button>
                  </SignInButton>
                  <SignInButton mode="modal" redirectUrl="/dashboard">
                    <button className="text-gray-600 hover:text-gray-900">
                      Log In
                    </button>
                  </SignInButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
} 