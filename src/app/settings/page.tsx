'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 gradient-bg min-h-screen">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 mb-8">
        Account Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="glass card-gradient p-6 space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="text-gray-600">{user.fullName}</div>
            </div>
            <a
              href="https://accounts.touchguides.com/user"
              target="_blank"
              rel="noopener noreferrer"
              className="button-gradient text-white px-4 py-2 rounded-full hover:shadow-lg transition-all w-full inline-block text-center"
            >
              Edit Profile
            </a>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="glass card-gradient p-6 space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Product Updates
              </label>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailUpdates ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="glass card-gradient p-6 space-y-4">
          <h2 className="text-xl font-semibold">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="text-gray-600">Free Plan</div>
            </div>
            <button
              className="button-gradient text-white px-4 py-2 rounded-full hover:shadow-lg transition-all w-full"
            >
              Upgrade to Pro
            </button>
            <button
              onClick={() => signOut(() => {
                window.location.href = '/';
              })}
              className="text-red-500 hover:text-red-600 animated-border px-4 py-2 rounded-full w-full"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 