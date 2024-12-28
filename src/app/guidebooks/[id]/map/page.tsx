'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Guidebook } from '@/types';
import dynamic from 'next/dynamic';
import BottomNav from '@/components/BottomNav';

// Dynamically import MapContainer with no SSR
const MapContainer = dynamic(
  () => import('@/components/MapContainer'),
  { ssr: false }
);

export default function MapPage() {
  const { id } = useParams();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!guidebook) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Guidebook Not Found</h1>
          <p className="text-gray-600">The guidebook you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Location</h1>
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Map</h2>
            <MapContainer 
              address={guidebook.address || "30 Rockefeller Plaza, New York, NY 10111"}
              className="w-full h-[400px] rounded-xl overflow-hidden"
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(guidebook.address || "30 Rockefeller Plaza, New York, NY 10111")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
      <BottomNav activeSection="map" />
    </div>
  );
} 