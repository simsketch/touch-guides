'use client';

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, SparklesIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';


type UserMetadata = {
  isPremium?: boolean;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
};

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const metadata = user?.publicMetadata as UserMetadata;
  const isPremium = metadata?.isPremium === true;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            <div className="flex items-center">
              <Image src="/logo.png" alt="TouchGuides Logo" width={250} height={56} className="h-8 w-auto mr-2" />
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {!isLoaded ? (
              <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
            ) : user ? (
              <>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </Link>
                {isPremium && (
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                )}
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
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                          <SignOutButton>
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
              </>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </Link>
                <SignInButton mode="modal">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 