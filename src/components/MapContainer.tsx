'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';

// Memoize the geocoding function
const geocodeAddress = async (address: string): Promise<[number, number]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();

    if (data && data[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
  }
  
  // Fallback to Rockefeller Center
  return [40.7587, -73.9787];
};

// Dynamically import the Map component with no SSR
const Map = dynamic(
  () => import('./Map'),
  {
    ssr: false,
    loading: () => <LoadingPlaceholder />
  }
);

// Memoize the loading placeholder
const LoadingPlaceholder = memo(function LoadingPlaceholder() {
  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
      Loading map...
    </div>
  );
});

LoadingPlaceholder.displayName = 'LoadingPlaceholder';

interface MapContainerProps {
  address: string;
}

const MapContainer = memo(function MapContainer({ address }: MapContainerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  // Memoize the position update function
  const updatePosition = useCallback(async () => {
    const pos = await geocodeAddress(address);
    setPosition(pos);
  }, [address]);

  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  if (!position) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className="w-full">
      <div className="h-[400px] rounded-xl overflow-hidden">
        <Map position={position} address={address} />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        View on Google Maps
      </a>
    </div>
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer; 