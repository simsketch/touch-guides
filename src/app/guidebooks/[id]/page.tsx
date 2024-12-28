'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Guidebook } from '@/types';
import { useState } from 'react';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/BottomNav';
import Image from 'next/image';
import { HomeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

function HomeContent({ guidebook }: { guidebook: Guidebook }) {
  const { user, isLoaded } = useUser();

  return (
    <div className="relative min-h-screen">
      {/* Hero Image Section */}
      <div className="relative h-screen">
        <Image
          src={guidebook.coverImage || "/beach.jpg"}
          alt="Property View"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          {isLoaded && user && (
            <Link
              href={`/guidebooks/${guidebook.guidebookId}/edit`}
              className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
            >
              Edit Guidebook
            </Link>
          )}
          <div className="w-20 h-20 mb-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <HomeIcon className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">{guidebook.title}</h1>
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="text-xl text-white/90 text-center">
              {guidebook.address || 'Address not provided'}
            </p>
            {guidebook.contactEmail && (
              <a 
                href={`mailto:${guidebook.contactEmail}`} 
                className="text-white/80 hover:text-white flex items-center gap-2"
              >
                <EnvelopeIcon className="w-5 h-5" />
                {guidebook.contactEmail}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center">
        <button 
          onClick={() => {
            const element = document.getElementById('welcome');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-opacity-90 transition-all"
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
}

export default function GuidebookPage() {
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
    <>
      <HomeContent guidebook={guidebook} />
      <BottomNav activeSection="home" />
    </>
  );
} 