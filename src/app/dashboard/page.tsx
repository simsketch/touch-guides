'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import PropertyList from '@/components/PropertyList';
import { useProperties } from '@/hooks/useProperties';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useUser();
  const { properties, isLoading, addProperty } = useProperties(user?.id ?? null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddProperty}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Property'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}
      
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