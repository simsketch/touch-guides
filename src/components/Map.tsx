'use client';

import { useEffect, useRef, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  position: [number, number];
  address: string;
}

// Initialize Leaflet icons globally, but only once
const initializeLeaflet = () => {
  if (typeof window === 'undefined') return;
  
  // Only initialize if not already done
  if (!(L.Icon.Default.prototype as any)._initialized) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: '/marker-icon.png',
      iconRetinaUrl: '/marker-icon-2x.png',
      shadowUrl: '/marker-shadow.png',
    });
    (L.Icon.Default.prototype as any)._initialized = true;
  }
};

// Initialize outside of component to ensure it only happens once
initializeLeaflet();

const Map = memo(function Map({ position, address }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Cleanup any existing map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Create new map instance
    mapRef.current = L.map(mapContainerRef.current, {
      center: position,
      zoom: 15,
      scrollWheelZoom: false
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Add marker
    L.marker(position)
      .bindPopup(address)
      .addTo(mapRef.current);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [position, address]); // Only re-run if position or address changes

  return (
    <div 
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%' }}
    />
  );
});

Map.displayName = 'Map';

export default Map; 