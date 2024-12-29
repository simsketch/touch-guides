'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Guidebook } from '@/types';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/BottomNav';
import Image from 'next/image';
import { HomeIcon, EnvelopeIcon, ShareIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

function HomeContent({ guidebook }: { guidebook: Guidebook }) {
  const { user, isLoaded } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsPdfLoading(true);
      const response = await fetch(`/api/guidebooks/${guidebook.guidebookId}/pdf`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate PDF');
      }

      if (response.headers.get('Content-Type') === 'application/pdf') {
        // It's a PDF, download it
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${guidebook.title.replace(/\s+/g, '-').toLowerCase()}-guide.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // It's an error response
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate PDF');
      }
    } catch (err) {
      console.error('Failed to download PDF:', err);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsPdfLoading(false);
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen" />;
  }

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
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isPdfLoading}
              className="hidden px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isPdfLoading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all flex items-center space-x-2"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Share</span>
            </button>
            {isLoaded && user && (
              <Link
                href={`/guidebooks/${guidebook.guidebookId}/edit`}
                className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
              >
                Edit Guidebook
              </Link>
            )}
          </div>
          <div className="w-20 h-20 mb-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <HomeIcon className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">{guidebook.title}</h1>
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="text-xl text-white/90 text-center">
              {guidebook.address}
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

      {/* Share Toast */}
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full transition-all duration-200 ${
          showShareToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        URL copied to clipboard!
      </div>

      {/* Error Toast */}
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-full transition-all duration-200 ${
          showErrorToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        Failed to generate PDF. Please try again.
      </div>

      {/* Get Started Button */}
      <div className="absolute bottom-64 left-0 right-0 flex justify-center">
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

export default function GuidebookViewPage() {
  const params = useParams();
  const { data: guidebook, isLoading } = useQuery<Guidebook>({
    queryKey: ['guidebook', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/guidebooks/${params.id}/view`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  if (isLoading || !guidebook) {
    return <div className="min-h-screen" />;
  }

  return (
    <>
      <HomeContent guidebook={guidebook} />
      <BottomNav activeSection="home" />
    </>
  );
} 