import React, { useEffect, useRef, useState, useCallback } from "react";
import { Asset } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { simulatedAssets, networkConnections } from "@/data/simulatedNetwork";

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}

interface EnhancedGoogleMapProps {
  assets?: Asset[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onAssetClick?: (asset: Asset) => void;
  className?: string;
}

// Global state to track Google Maps loading
let isGoogleMapsLoading = false;
let googleMapsLoaded = false;
const loadingPromises: Promise<void>[] = [];

export const EnhancedGoogleMap: React.FC<EnhancedGoogleMapProps> = ({
  assets = simulatedAssets,
  center = { lat: 11.94, lng: 79.82 },
  zoom = 13,
  onAssetClick,
  className = "w-full h-96",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Asset type configurations
  const assetConfig = {
    tank: { color: "#0066CC", icon: "⬢", size: 40, shape: "square" },
    pump: { color: "#FF6600", icon: "⚡", size: 35, shape: "triangle" },
    pipe: { color: "#666666", icon: "━", size: 30, shape: "line" },
    valve: { color: "#CC0066", icon: "◈", size: 28, shape: "diamond" },
    meter: { color: "#00CC66", icon: "◉", size: 26, shape: "circle" },
    tap: { color: "#000000", icon: "●", size: 24, shape: "circle" },
  };

  // Condition-based styling
  const getConditionColor = (condition: string, baseColor: string) => {
    switch (condition) {
      case "good":
        return baseColor;
      case "average":
        return "#FFA500";
      case "poor":
        return "#FF4444";
      case "critical":
        return "#CC0000";
      default:
        return baseColor;
    }
  };

  // Simplified Google Maps API loading
  const loadGoogleMaps = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // Return immediately if already loaded
      if (googleMapsLoaded && window.google?.maps) {
        resolve();
        return;
      }

      // If already loading, return the existing promise
      if (isGoogleMapsLoading && loadingPromises.length > 0) {
        Promise.all(loadingPromises)
          .then(() => resolve())
          .catch(reject);
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => {
          googleMapsLoaded = true;
          resolve();
        });
        existingScript.addEventListener("error", () =>
          reject(new Error("Failed to load Google Maps"))
        );
        return;
      }

      // Start loading
      isGoogleMapsLoading = true;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=*Google map api key*&libraries=places`;
      script.async = true;
      script.defer = true;

      const loadPromise = new Promise<void>((promiseResolve, promiseReject) => {
        script.onload = () => {
          googleMapsLoaded = true;
          isGoogleMapsLoading = false;
          promiseResolve();
        };

        script.onerror = () => {
          isGoogleMapsLoading = false;
          promiseReject(new Error("Failed to load Google Maps API"));
        };
      });

      loadingPromises.push(loadPromise);
      document.head.appendChild(script);

      loadPromise.then(() => resolve()).catch(reject);
    });
  }, []);

  const initMap = useCallback(async () => {
    if (!mapRef.current || map) return;

    setIsLoading(true);
    setError(null);

    try {
      await loadGoogleMaps();

      if (!window.google?.maps) {
        throw new Error("Google Maps API not available");
      }

      const googleMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        mapTypeId: "roadmap",
        gestureHandling: "cooperative",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      setMap(googleMap);
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setError(error instanceof Error ? error.message : "Failed to load map");
      setIsLoading(false);
    }
  }, [center.lat, center.lng, zoom, loadGoogleMaps, map]);

  // Initialize map on mount
  useEffect(() => {
    initMap();
  }, [initMap]);

  // Update map center and zoom when props change
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  // Create custom marker
  const createCustomMarker = (asset: Asset) => {
    const config = assetConfig[asset.type];
    const color = getConditionColor(asset.condition, config.color);

    return new window.google.maps.Marker({
      position: { lat: asset.latitude, lng: asset.longitude },
      map,
      title: asset.name,
      icon: {
        path: getMarkerPath(config.shape),
        fillColor: color,
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
        scale: config.size / 20,
        anchor: new window.google.maps.Point(0, 0),
      },
    });
  };

  const getMarkerPath = (shape: string) => {
    switch (shape) {
      case "square":
        return "M -10,-10 L 10,-10 L 10,10 L -10,10 Z";
      case "triangle":
        return "M 0,-12 L 10,8 L -10,8 Z";
      case "diamond":
        return "M 0,-10 L 8,0 L 0,10 L -8,0 Z";
      case "circle":
      default:
        return google.maps.SymbolPath.CIRCLE;
    }
  };

  // Create network connections
  const createNetworkLines = useCallback(() => {
    if (!map) return;

    // Clear existing polylines
    polylines.forEach((line) => line.setMap(null));
    setPolylines([]);

    const newPolylines: google.maps.Polyline[] = [];

    networkConnections.forEach((connection) => {
      const fromAsset = assets.find((a) => a.id === connection.from);
      const toAsset = assets.find((a) => a.id === connection.to);

      if (fromAsset && toAsset) {
        const lineColor =
          connection.type === "main"
            ? "#0066CC"
            : connection.type === "secondary"
            ? "#00AA44"
            : "#666666";
        const lineWeight =
          connection.type === "main"
            ? 6
            : connection.type === "secondary"
            ? 4
            : 2;

        const polyline = new window.google.maps.Polyline({
          path: [
            { lat: fromAsset.latitude, lng: fromAsset.longitude },
            { lat: toAsset.latitude, lng: toAsset.longitude },
          ],
          geodesic: true,
          strokeColor: lineColor,
          strokeOpacity: 0.8,
          strokeWeight: lineWeight,
          map,
        });

        newPolylines.push(polyline);
      }
    });

    setPolylines(newPolylines);
  }, [map, assets]);

  // Create markers
  const createMarkers = useCallback(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));

    // Create new markers
    const newMarkers = assets.map((asset) => {
      const marker = createCustomMarker(asset);

      const infoContent = `
        <div class="p-3 min-w-[200px] max-w-[280px]">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">${assetConfig[asset.type].icon}</span>
            <h3 class="font-bold text-sm">${asset.name}</h3>
          </div>
          <div class="space-y-1 text-xs">
            <p><strong>Type:</strong> ${
              asset.type.charAt(0).toUpperCase() + asset.type.slice(1)
            }</p>
            <p><strong>Condition:</strong> 
              <span class="inline-block w-2 h-2 rounded-full ml-1" 
                    style="background-color: ${getConditionColor(
                      asset.condition,
                      assetConfig[asset.type].color
                    )}"></span>
              ${
                asset.condition.charAt(0).toUpperCase() +
                asset.condition.slice(1)
              }
            </p>
            <p><strong>Location:</strong> ${asset.area}, ${asset.city}</p>
            ${
              asset.last_maintenance_date
                ? `<p><strong>Last Maintenance:</strong> ${asset.last_maintenance_date}</p>`
                : ""
            }
          </div>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
        maxWidth: 300,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        onAssetClick?.(asset);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, assets, onAssetClick]);

  // Update markers and network when map is ready
  useEffect(() => {
    if (map) {
      createMarkers();
      createNetworkLines();
    }
  }, [createMarkers, createNetworkLines]);

  // Error state
  if (error) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="w-full h-full rounded-lg bg-red-50 flex items-center justify-center">
          <div className="text-center space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
            <p className="text-sm text-red-600">Failed to load map</p>
            <p className="text-xs text-red-500">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setMap(null);
                initMap();
              }}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Asset Count */}
      <div className="absolute top-2 right-2 z-20">
        <Badge
          variant="secondary"
          className="bg-white/95 backdrop-blur-sm border-0 shadow-lg text-xs"
        >
          {assets.length} Assets
        </Badge>
      </div>
    </div>
  );
};
