
import React, { useEffect, useRef, useState } from 'react';
import { Asset } from '@/types';

// Extend the Window interface to include google
declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapProps {
  assets: Asset[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onAssetClick?: (asset: Asset) => void;
  className?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  assets,
  center = { lat: 11.9416, lng: 79.8083 }, // Pondicherry coordinates
  zoom = 14,
  onAssetClick,
  className = "w-full h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      const googleMap = new window.google.maps.Map(mapRef.current!, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      setMap(googleMap);
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAD8lcL5dghVNHo94pLQ8CnsE_ai2YthY0&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = assets.map(asset => {
      const color = asset.condition === 'good' ? 'green' : 
                   asset.condition === 'average' ? 'blue' : 'yellow';

      const marker = new window.google.maps.Marker({
        position: { lat: asset.latitude, lng: asset.longitude },
        map,
        title: asset.name,
        icon: {
          url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold text-sm">${asset.name}</h3>
            <p class="text-xs text-gray-600 capitalize">${asset.type} • ${asset.condition}</p>
            <p class="text-xs"><strong>City:</strong> ${asset.city}</p>
            <p class="text-xs"><strong>Area:</strong> ${asset.area}</p>
            ${asset.last_maintenance_date ? `<p class="text-xs"><strong>Last Maintenance:</strong> ${asset.last_maintenance_date}</p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onAssetClick?.(asset);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, assets, onAssetClick]);

  return <div ref={mapRef} className={className} />;
};
