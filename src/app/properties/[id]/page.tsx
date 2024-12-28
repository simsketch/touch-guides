'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Property } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      return response.json();
    },
  });

  const handleDeleteGuidebook = async (guidebookId: string) => {
    if (!confirm('Are you sure you want to delete this guidebook?')) {
      return;
    }

    try {
      setIsDeleting(guidebookId);
      setError(null);

      const response = await fetch(`/api/guidebooks/${guidebookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete guidebook');
      }

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['property', id] });
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
    } catch (err) {
      console.error('Error deleting guidebook:', err);
      setError('Failed to delete guidebook');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
          Property not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{property.name}</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push(`/properties/${id}/guidebooks/new`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Guidebook
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Guidebooks</h2>
        {property.guidebooks.length === 0 ? (
          <p className="text-gray-500">No guidebooks yet. Create your first one!</p>
        ) : (
          <ul className="space-y-4">
            {property.guidebooks.map((guidebook: any) => (
              <li
                key={guidebook.guidebookId}
                className="flex items-center justify-between border-b pb-4 last:border-b-0"
              >
                <div>
                  <h3 className="font-medium">{guidebook.title || 'Untitled Guidebook'}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(guidebook.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href={`/guidebooks/${guidebook.guidebookId}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/guidebooks/${guidebook.guidebookId}/view`}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDeleteGuidebook(guidebook.guidebookId)}
                    disabled={isDeleting === guidebook.guidebookId}
                    className="text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    {isDeleting === guidebook.guidebookId ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 