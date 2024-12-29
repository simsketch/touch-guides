'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Guidebook } from '@/types';
import { useGuidebooks } from '@/hooks/useGuidebooks';

type GuidebookFormData = Omit<Guidebook, 'guidebookId'>;

export default function NewGuidebookPage() {
  const { id: propertyId } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addGuidebook } = useGuidebooks(propertyId as string);

  const { register, handleSubmit, formState: { errors } } = useForm<GuidebookFormData>({
    defaultValues: {
      title: '',
    }
  });

  const onSubmit = async (data: GuidebookFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      console.log('Submitting data:', data); // Debug log

      await addGuidebook(data);
      router.push(`/properties/${propertyId}`);
      router.refresh();
    } catch (err) {
      console.error('Error creating guidebook:', err);
      setError(err instanceof Error ? err.message : 'Failed to create guidebook');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Guidebook</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Guidebook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 