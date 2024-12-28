'use client';

import { Property } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/hooks/useProperties';
import { useUser } from '@clerk/nextjs';
import { Key, useState } from 'react';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const router = useRouter();
  const { user } = useUser();
  const { updateProperty, deleteProperty } = useProperties(user?.id ?? null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddGuidebook = (propertyId: string) => {
    router.push(`/properties/${propertyId}/guidebooks/new`);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        setIsUpdating(propertyId);
        setError(null);
        await deleteProperty(propertyId);
      } catch (error) {
        console.error('Failed to delete property:', error);
        setError('Failed to delete property');
      } finally {
        setIsUpdating(null);
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div
          key={property.propertyId}
          className="glass p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              {property.name}
            </h3>
            <button
              onClick={() => router.push(`/properties/${property.propertyId}/edit`)}
              className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
            >
              Edit Property
            </button>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Guidebooks ({property.guidebooks.length})</h4>
            <ul className="space-y-2">
              {property.guidebooks.map((guidebook: { guidebookId: Key | null | undefined; title: any; }) => (
                <li key={guidebook.guidebookId} className="flex items-center">
                  <span className="flex-grow">{guidebook.title || 'Untitled Guidebook'}</span>
                  <div className="flex gap-4">
                    <Link
                      href={`/guidebooks/${guidebook.guidebookId}/view`}
                      className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                    >
                      View
                    </Link>
                    <Link
                      href={`/guidebooks/${guidebook.guidebookId}/edit`}
                      className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              className="text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              onClick={() => handleAddGuidebook(property.propertyId)}
              disabled={isUpdating === property.propertyId}
            >
              Add Guidebook
            </button>
            <button
              className="text-sm text-red-500 hover:text-red-600 transition-colors duration-300 disabled:opacity-50"
              onClick={() => handleDeleteProperty(property.propertyId)}
              disabled={isUpdating === property.propertyId}
            >
              {isUpdating === property.propertyId ? 'Deleting...' : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}