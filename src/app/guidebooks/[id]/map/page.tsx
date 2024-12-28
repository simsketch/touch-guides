'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Guidebook } from '@/types';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/BottomNav';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

const inter = Inter({ subsets: ['latin'] });

function LoadingState() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${inter.className}`}>
      <div className="relative w-full h-1 overflow-hidden">
        <div className="absolute inset-0 bg-blue-100"></div>
        <div className="loading-bar"></div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 glass rounded-2xl p-4 animate-pulse">
          <div className="w-full h-[400px] bg-gray-200 rounded-xl"></div>
        </div>
      </div>
      <BottomNav activeSection="map" />
    </div>
  );
}

export default function GuidebookMapPage() {
  const { id } = useParams();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: guidebook, isLoading } = useQuery<Guidebook>({
    queryKey: ['guidebook', id],
    queryFn: async () => {
      const response = await fetch(`/api/guidebooks/${id}/view`);
      if (!response.ok) {
        throw new Error('Failed to fetch guidebook');
      }
      const data = await response.json();
      console.log('Fetched guidebook:', data);
      return data;
    },
  });

  if (!mounted || isLoading) {
    return <LoadingState />;
  }

  if (!guidebook) {
    console.log('No guidebook data available');
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 ${inter.className}`}>
        <div className="glass hover-lift transition-all duration-700 ease-out p-8 rounded-[2rem] hover:rounded-xl max-w-md w-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-700">
              <span className="text-4xl transform group-hover:scale-110 transition-transform duration-500">🗺️</span>
            </div>
            <h1 className="text-2xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Map Not Available
            </h1>
            <p className="text-gray-600 text-center leading-relaxed">
              We couldn't load the map for this guidebook. Please check the URL and try again.
            </p>
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-500 ease-out hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] group-hover:rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-700 -z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24 ${inter.className}`}>
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 glass hover-lift transition-all duration-500 rounded-2xl overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Property Location</h2>
            <MapContainer 
              address={guidebook.address || "30 Rockefeller Plaza, New York, NY 10111"}
            />
          </div>
        </div>
      </div>

      <BottomNav activeSection="map" />

      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hover-lift {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .loading-bar {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
          animation: loading 1.5s infinite;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
} 