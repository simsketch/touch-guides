'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Guidebook } from '@/types';
import { useState } from 'react';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/BottomNav';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  HomeIcon,
  WifiIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const inter = Inter({ subsets: ['latin'] });

const sections = [
  { 
    id: 'places-to-eat', 
    icon: BuildingStorefrontIcon, 
    title: 'Places to Eat', 
    content: (g: Guidebook) => g.placesToEat,
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    id: 'things-to-do', 
    icon: RocketLaunchIcon, 
    title: 'Things to Do', 
    content: (g: Guidebook) => g.thingsToDo,
    gradient: 'from-blue-500 to-purple-500'
  },
  { 
    id: 'house-rules', 
    icon: ClipboardDocumentCheckIcon, 
    title: 'House Rules', 
    content: (g: Guidebook) => g.houseRules,
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'quirks', 
    icon: HomeIcon, 
    title: 'Quirks of the Home', 
    content: (g: Guidebook) => g.quirksOfTheHome,
    gradient: 'from-indigo-500 to-blue-500'
  },
  { 
    id: 'transportation', 
    icon: TruckIcon, 
    title: 'Transportation', 
    content: (g: Guidebook) => g.transportation,
    gradient: 'from-yellow-500 to-orange-500'
  },
  { 
    id: 'groceries', 
    icon: MapPinIcon, 
    title: 'Grocery Stores', 
    content: (g: Guidebook) => g.groceryStores,
    gradient: 'from-teal-500 to-cyan-500'
  },
  { 
    id: 'wifi', 
    icon: WifiIcon, 
    title: 'WiFi & Electronics', 
    content: (g: Guidebook) => g.wifiAndElectronics,
    gradient: 'from-purple-500 to-pink-500'
  },
];

function AccordionSection({ 
  title, 
  content, 
  icon: Icon, 
  isOpen, 
  onToggle,
  gradient 
}: { 
  title: string; 
  content?: string; 
  icon: React.ElementType; 
  isOpen: boolean; 
  onToggle: () => void;
  gradient: string;
}) {
  return (
    <div className="mb-4 glass hover-lift transition-all duration-500 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center space-x-3 bg-white/5 hover:bg-white/10 transition-all duration-500"
      >
        <div className={`relative p-2 rounded-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-6 h-6 text-white transform transition-all duration-500" />
          <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        </div>
        <span className="text-lg font-medium flex-grow text-left">{title}</span>
        <span className={`transform transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div
        className={`transition-all duration-700 ease-in-out ${
          isOpen 
            ? 'max-h-[500px] opacity-100' 
            : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-4 text-gray-700 whitespace-pre-wrap">
          {content || (
            <span className="text-gray-400 italic">
              No information provided for this section
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${inter.className}`}>
      <div className="relative w-full h-1 overflow-hidden">
        <div className="absolute inset-0 bg-blue-100"></div>
        <div className="loading-bar"></div>
      </div>
      <div className="container mx-auto px-4 py-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mb-4 glass rounded-2xl p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav activeSection="info" />
    </div>
  );
}

export default function GuidebookInfoPage() {
  const { id } = useParams();
  const [openSection, setOpenSection] = useState<string | null>(null);

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
    return <LoadingState />;
  }

  if (!guidebook) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 ${inter.className}`}>
        <div className="glass hover-lift transition-all duration-700 ease-out p-8 rounded-[2rem] hover:rounded-xl max-w-md w-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-700">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500">
                <HomeIcon className="w-10 h-10 text-white transform transition-all duration-500" />
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Looking for Something?
            </h1>
            <p className="text-gray-600 text-center leading-relaxed">
              We couldn&apos;t find the guidebook you&apos;re looking for. It might have been moved or deleted.
            </p>
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-500 ease-out hover:scale-105"
              >
                Back to Dashboard
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
        {sections.map((section) => (
          <AccordionSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            content={section.content(guidebook)}
            isOpen={openSection === section.id}
            onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
            gradient={section.gradient}
          />
        ))}
      </div>

      <BottomNav activeSection="info" />

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