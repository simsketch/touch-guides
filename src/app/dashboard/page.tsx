'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import PropertyList from '@/components/PropertyList';
import { useProperties } from '@/hooks/useProperties';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { properties, isLoading, addProperty } = useProperties(user?.id ?? null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('https://touchguides.com');
    }
  }, [router, user, isLoaded]);

  if (!user && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  const handleAddProperty = async () => {
    try {
      setIsAdding(true);
      setError(null);
      await addProperty({
        name: `New Property ${properties.length + 1}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add property');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard - My Properties</h1>
        <button
          className="button-gradient group relative flex items-center space-x-2 px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
          onClick={handleAddProperty}
          disabled={isAdding}
        >
          <div className="gradient-glow"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>{isAdding ? 'Adding...' : 'Add Property'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Welcome to TouchGuides
        </h2>
        <p className="text-gray-700 mb-3">
          Create and manage your property guidebooks with ease. Each property can have multiple guidebooks, perfect for different units or purposes.
        </p>
        <p className="text-gray-600 text-sm">
          <em>Need help? Visit our <a href="https://touchguides.com/contact" className="text-purple-600 hover:text-purple-700 underline">support page</a> or click the Support link in the navigation bar.</em>
        </p>
      </div>
      
      {properties && properties.length > 0 ? (
        <PropertyList properties={properties} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No properties yet</h2>
          <p className="text-gray-600">
            Get started by adding your first property and creating a guidebook.
          </p>
        </div>
      )}
    </div>
  );
} 