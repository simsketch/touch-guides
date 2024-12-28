'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HomeIcon, InformationCircleIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface MenuItem {
  id: 'home' | 'info' | 'map' | 'search';
  icon: React.ForwardRefExoticComponent<any>;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', icon: HomeIcon, label: 'HOME' },
  { id: 'info', icon: InformationCircleIcon, label: 'INFO' },
  { id: 'map', icon: MapPinIcon, label: 'MAP' },
  { id: 'search', icon: MagnifyingGlassIcon, label: 'SEARCH' },
];

export default function BottomNav({ activeSection }: { activeSection: string }) {
  const { id } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case 'home':
        window.location.href = `/guidebooks/${id}/view`;
        break;
      case 'info':
        window.location.href = `/guidebooks/${id}/info`;
        break;
      case 'map':
        window.location.href = `/guidebooks/${id}/map`;
        break;
      case 'search':
        window.location.href = `/guidebooks/${id}/search`;
        break;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 z-20">
      <div className="max-w-lg mx-auto">
        <div className="nav-glass rounded-2xl p-2">
          <div className="flex justify-around items-center">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className="group relative flex flex-col items-center p-2 transition-all duration-300 ease-in-out"
                >
                  {/* Background gradient */}
                  <div className={`
                    absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-500/20 via-blue-500/20 to-purple-500/20
                    transition-all duration-300 ease-in-out opacity-0 scale-90
                    ${isActive ? 'opacity-100 scale-100' : ''}
                    group-hover:opacity-100 group-hover:scale-100
                  `} />
                  
                  {/* Icon container */}
                  <div className={`
                    relative z-10 rounded-xl p-2
                    transition-all duration-300 ease-in-out
                    ${isActive ? 'text-white scale-110' : 'text-gray-400'}
                    group-hover:text-white group-hover:scale-110
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Label */}
                  <span className={`
                    relative z-10 text-xs font-medium mt-1
                    transition-all duration-300 ease-in-out
                    ${isActive ? 'text-white' : 'text-gray-400'}
                    group-hover:text-white
                  `}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-glass {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
} 