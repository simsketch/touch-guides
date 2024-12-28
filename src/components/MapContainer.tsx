'use client';

import { MapContainer as LeafletMapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

interface MapContainerProps {
  address: string;
  className?: string;
}

export default function MapContainer({ address, className = "w-full h-[400px]" }: MapContainerProps) {
  const [position, setPosition] = useState<[number, number]>([40.7587, -73.9787]); // Default to Rockefeller Center
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        
        if (data && data[0]) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      } finally {
        setIsLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  if (isLoading) {
    return <div className={className}>Loading map...</div>;
  }

  // Fix for Leaflet marker icon
  const icon = L.icon({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });

  return (
    <LeafletMapContainer 
      center={position} 
      zoom={13} 
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon} />
    </LeafletMapContainer>
  );
} 