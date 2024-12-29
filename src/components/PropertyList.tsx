'use client';

import { Property } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/hooks/useProperties';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HomeIcon } from '@heroicons/react/24/outline';

interface PropertyListProps {
  properties: Property[];
}

type ViewMode = 'grid' | 'list';

export default function PropertyList({ properties }: PropertyListProps) {
  const router = useRouter();
  const { user } = useUser();
  const { updateProperty, deleteProperty } = useProperties(user?.id ?? null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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

  const handleDeleteGuidebook = async (propertyId: string, guidebookId: string) => {
    if (confirm('Are you sure you want to delete this guidebook?')) {
      try {
        setIsUpdating(guidebookId);
        setError(null);
        const response = await fetch(`/api/guidebooks/${guidebookId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete guidebook');
        }
        router.refresh();
      } catch (error) {
        console.error('Failed to delete guidebook:', error);
        setError('Failed to delete guidebook');
      } finally {
        setIsUpdating(null);
      }
    }
  };

  const ViewToggle = () => (
    <div className="flex justify-end mb-6">
      <div className="inline-flex rounded-lg border border-gray-200 p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            viewMode === 'grid'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            viewMode === 'list'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </button>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="glass p-6 rounded-2xl hover:shadow-lg transition-all duration-300 h-[300px] flex flex-col">
      <div className="flex flex-col items-center mb-4">
        <HomeIcon className="w-12 h-12 mb-3 text-purple-500 float" />
        <div className="w-full flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 truncate max-w-[200px]">
              {property.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {property.guidebooks.length} Guidebook{property.guidebooks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push(`/properties/${property.propertyId}/edit`)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-300 rounded"
              title="Edit Property"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-label="Edit">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteProperty(property.propertyId)}
              className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors duration-300 disabled:opacity-50 rounded"
              disabled={isUpdating === property.propertyId}
              title="Delete Property"
            >
              {isUpdating === property.propertyId ? (
                <LoadingSpinner />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-label="Delete">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Guidebooks</h4>
          <button
            className="button-gradient group relative flex items-center space-x-1 px-1.5 py-1.5 rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
            onClick={() => handleAddGuidebook(property.propertyId)}
            disabled={isUpdating === property.propertyId}
            title="Add Guidebook"
            aria-label="Add Guidebook"
          >
            <div className="gradient-glow"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Guidebook</span>
          </button>
        </div>
        <div className="flex-1 bg-white/50 rounded-lg py-3 overflow-y-auto">
          {property.guidebooks.length > 0 ? (
            <ul className="space-y-2">
              {property.guidebooks.map((guidebook) => (
                <li key={guidebook.guidebookId} className="flex items-center justify-between">
                  <Link
                    href={`/guidebooks/${guidebook.guidebookId}/view`}
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
                  >
                    {guidebook.title || 'Untitled Guidebook'}
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/guidebooks/${guidebook.guidebookId}/edit`}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDeleteGuidebook(property.propertyId, guidebook.guidebookId)}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 disabled:opacity-50 rounded"
                      disabled={isUpdating === guidebook.guidebookId}
                    >
                      {isUpdating === guidebook.guidebookId ? (
                        <LoadingSpinner />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No guidebooks yet
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const PropertyRow = ({ property }: { property: Property }) => (
    <div className="glass p-4 rounded-xl hover:shadow-lg transition-all duration-300 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 truncate max-w-[300px]">
            {property.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {property.guidebooks.length} Guidebook{property.guidebooks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="button-gradient group relative flex items-center space-x-2 px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
            onClick={() => handleAddGuidebook(property.propertyId)}
            disabled={isUpdating === property.propertyId}
            title="Add Guidebook"
            aria-label="Add Guidebook"
          >
            <div className="gradient-glow"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Guidebook</span>
          </button>
          <button
            onClick={() => router.push(`/properties/${property.propertyId}/edit`)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-300 rounded"
            title="Edit Property"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteProperty(property.propertyId)}
            className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors duration-300 disabled:opacity-50 rounded"
            disabled={isUpdating === property.propertyId}
            title="Delete Property"
          >
            {isUpdating === property.propertyId ? (
              <LoadingSpinner />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {property.guidebooks.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          {property.guidebooks.map((guidebook) => (
            <div key={guidebook.guidebookId} className="flex items-center justify-between py-2">
              <Link
                href={`/guidebooks/${guidebook.guidebookId}/view`}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
              >
                {guidebook.title || 'Untitled Guidebook'}
              </Link>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/guidebooks/${guidebook.guidebookId}/edit`}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDeleteGuidebook(property.propertyId, guidebook.guidebookId)}
                  className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 disabled:opacity-50 rounded"
                  disabled={isUpdating === guidebook.guidebookId}
                >
                  {isUpdating === guidebook.guidebookId ? (
                    <LoadingSpinner />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <ViewToggle />
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.propertyId} property={property} />
          ))}
        </div>
      ) : (
        <div>
          {properties.map((property) => (
            <PropertyRow key={property.propertyId} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}