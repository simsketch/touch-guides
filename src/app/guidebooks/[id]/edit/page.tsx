'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Guidebook } from '@/types';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

function NavigationButtons({ 
  id, 
  isSubmitting, 
  onCancel 
}: { 
  id: string; 
  isSubmitting: boolean; 
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <Link
          href={`/guidebooks/${id}/view`}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Guidebook
        </Link>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

export default function GuidebookEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: guidebook, isLoading } = useQuery<Guidebook>({
    queryKey: ['guidebook', id],
    queryFn: async () => {
      const response = await fetch(`/api/guidebooks/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch guidebook');
      }
      return response.json();
    },
  });

  const { register, handleSubmit, reset } = useForm<Guidebook>();

  useEffect(() => {
    if (guidebook) {
      reset(guidebook);
    }
  }, [guidebook, reset]);

  const onSubmit = async (data: Guidebook) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/guidebooks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update guidebook');
      }

      await queryClient.invalidateQueries({ queryKey: ['guidebook', id] });
      router.push(`/guidebooks/${id}/view`);
    } catch (err) {
      console.error('Error updating guidebook:', err);
      setError(err instanceof Error ? err.message : 'Failed to update guidebook');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
    <LoadingSpinner />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Edit Guidebook</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Top Navigation Buttons */}
          <NavigationButtons id={id as string} isSubmitting={isSubmitting} onCancel={handleCancel} />

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              {...register('coverImage')}
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a URL for the cover image of your guidebook. This will be displayed at the top of your guidebook.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              {...register('address')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              {...register('contactEmail')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in/Check-out Instructions
            </label>
            <textarea
              {...register('checkInCheckOut')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              House Rules
            </label>
            <textarea
              {...register('houseRules')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quirks of the Home
            </label>
            <textarea
              {...register('quirksOfTheHome')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WiFi & Electronics
            </label>
            <textarea
              {...register('wifiAndElectronics')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Places to Eat
            </label>
            <textarea
              {...register('placesToEat')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Things to Do
            </label>
            <textarea
              {...register('thingsToDo')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transportation
            </label>
            <textarea
              {...register('transportation')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grocery Stores
            </label>
            <textarea
              {...register('groceryStores')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bottom Navigation Buttons */}
          <NavigationButtons id={id as string} isSubmitting={isSubmitting} onCancel={handleCancel} />
        </form>
      </div>
    </div>
  );
} 