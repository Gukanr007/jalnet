
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Asset } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';
import { simulatedAssets } from '@/data/simulatedNetwork';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface FastGoogleMapProps {
  assets?: Asset[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onAssetClick?: (asset: Asset) => void;
  className?: string;
}

export const FastGoogleMap: React.FC<FastGoogleMapProps> = ({
  assets = simulatedAssets,
  center = { lat: 11.9400, lng: 79.8200 },
  zoom = 13,
  onAssetClick,
  className = "w-full h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoogleMaps = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.google?.maps) {
        resolve();
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error('Failed to load')));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAD8lcL5dghVNHo94pLQ8CnsE_ai2YthY0&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }, []);

  const initMap = useCallback(async () => {
    if (!mapRef.current || map) return;

    try {
      setIsLoading(true);
      await loadGoogleMaps();
      
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'cooperative',
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'poi.business', stylers: [{ visibility: 'off' }] }
        ]
      });

      setMap(googleMap);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load map');
      setIsLoading(false);
    }
  }, [center, zoom, loadGoogleMaps, map]);

  const createMarkers = useCallback(() => {
    if (!map || !assets.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Limit markers for performance
    const markersToShow = assets.slice(0, 30);
    
    const newMarkers = markersToShow.map(asset => {
      const color = asset.condition === 'good' ? '#22c55e' : 
                   asset.condition === 'average' ? '#f59e0b' : '#ef4444';

      const marker = new window.google.maps.Marker({
        position: { lat: asset.latitude, lng: asset.longitude },
        map,
        title: asset.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 0.8,
          strokeWeight: 1,
          strokeColor: '#ffffff',
          scale: 6
        },
        optimized: true
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold text-sm">${asset.name}</h3>
            <p class="text-xs">${asset.type} • ${asset.condition}</p>
            <p class="text-xs">${asset.area}</p>
          </div>
        `,
        maxWidth: 200
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onAssetClick?.(asset);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, assets, onAssetClick]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  useEffect(() => {
    if (map) {
      const timer = setTimeout(createMarkers, 100);
      return () => clearTimeout(timer);
    }
  }, [createMarkers]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-50 rounded-lg`}>
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setMap(null);
              initMap();
            }}
            className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      <div className="absolute top-2 right-2">
        <Badge variant="secondary" className="bg-white/90 text-xs">
          {Math.min(assets.length, 30)} Assets
        </Badge>
      </div>
    </div>
  );
};
