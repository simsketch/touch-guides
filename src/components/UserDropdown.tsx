'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from 'react';

export default function UserDropdown() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:opacity-80"
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || 'User'}
          className="w-8 h-8 rounded-full"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <a
            href="/user-profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Manage account
          </a>
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
} 