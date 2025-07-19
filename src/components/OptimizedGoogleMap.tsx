import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Asset } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Layers, Info, Satellite, Loader2 } from "lucide-react";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface OptimizedGoogleMapProps {
  assets?: Asset[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onAssetClick?: (asset: Asset) => void;
  className?: string;
}

export const OptimizedGoogleMap: React.FC<OptimizedGoogleMapProps> = ({
  assets = [],
  center = { lat: 11.94, lng: 79.82 },
  zoom = 13,
  onAssetClick,
  className = "w-full h-96",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("All Areas");
  const [showInfo, setShowInfo] = useState(true);
  const [showTerrain, setShowTerrain] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Memoized asset configuration to prevent recreations
  const assetConfig = useMemo(
    () => ({
      tank: { color: "#0066CC", icon: "⬢", size: 40, shape: "square" },
      pump: { color: "#FF6600", icon: "⚡", size: 35, shape: "triangle" },
      pipe: { color: "#666666", icon: "━", size: 30, shape: "line" },
      valve: { color: "#CC0066", icon: "◈", size: 28, shape: "diamond" },
      meter: { color: "#00CC66", icon: "◉", size: 26, shape: "circle" },
      tap: { color: "#000000", icon: "●", size: 24, shape: "circle" },
    }),
    []
  );

  // Memoized area boundaries with correct coordinates
  const areaBoundaries = useMemo(
    () => ({
      "All Areas": { center: { lat: 11.94, lng: 79.82 }, zoom: 13 },
      Muthialpet: { center: { lat: 11.9285, lng: 79.818 }, zoom: 16 },
      "White Town": { center: { lat: 11.9345, lng: 79.8295 }, zoom: 16 },
      Lawspet: { center: { lat: 11.958, lng: 79.812 }, zoom: 16 },
    }),
    []
  );

  // Optimized condition color function
  const getConditionColor = useCallback(
    (condition: string, baseColor: string) => {
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
    },
    []
  );

  // Lazy load Google Maps API
  const loadGoogleMaps = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLEMAP_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        console.error("Failed to load Google Maps");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    });
  }, []);

  // Initialize map with performance optimizations
  const initMap = useCallback(async () => {
    if (!mapRef.current || mapLoaded) return;

    try {
      await loadGoogleMaps();

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
      setMapLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setIsLoading(false);
    }
  }, [center.lat, center.lng, zoom, mapLoaded, loadGoogleMaps]);

  // Initialize map on mount
  useEffect(() => {
    initMap();
  }, [initMap]);

  // Handle terrain toggle separately to prevent re-initialization
  useEffect(() => {
    if (map && mapLoaded) {
      console.log(
        "Optimized Map - Changing map type to:",
        showTerrain ? "terrain" : "roadmap"
      );
      map.setMapTypeId(showTerrain ? "terrain" : "roadmap");
    }
  }, [map, mapLoaded, showTerrain]);

  // Optimized marker creation with proper cleanup
  const createMarkers = useCallback(() => {
    if (!map || assets.length === 0) return;

    console.log("Optimized Map - Creating markers, showInfo:", showInfo);

    // Clear existing markers efficiently
    markers.forEach((marker) => {
      marker.setMap(null);
    });

    // Filter assets
    const filteredAssets =
      selectedArea === "All Areas"
        ? assets
        : assets.filter((asset) => asset.area === selectedArea);

    // Limit markers for performance (show max 50 at a time)
    const maxMarkers = 50;
    const assetsToShow = filteredAssets.slice(0, maxMarkers);

    const newMarkers = assetsToShow
      .map((asset) => {
        const config = assetConfig[asset.type];
        if (!config) return null;

        const color = getConditionColor(asset.condition, config.color);

        const marker = new window.google.maps.Marker({
          position: { lat: asset.latitude, lng: asset.longitude },
          map,
          title: asset.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
            scale: 8,
          },
          optimized: true,
        });

        // Only add click listeners if showInfo is true
        if (showInfo) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
            <div class="p-2 max-w-48">
              <h3 class="font-bold text-sm">${asset.name}</h3>
              <p class="text-xs text-gray-600 capitalize">${asset.type} • ${asset.condition}</p>
            </div>
          `,
            maxWidth: 200,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
            onAssetClick?.(asset);
          });
        }

        return marker;
      })
      .filter(Boolean) as google.maps.Marker[];

    setMarkers(newMarkers);
  }, [
    map,
    assets,
    selectedArea,
    showInfo,
    onAssetClick,
    assetConfig,
    getConditionColor,
  ]);

  // Update markers when dependencies change
  useEffect(() => {
    if (mapLoaded) {
      const timer = setTimeout(createMarkers, 100);
      return () => clearTimeout(timer);
    }
  }, [createMarkers, mapLoaded]);

  // Area change handler with logging
  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    if (map && areaBoundaries[area]) {
      const bounds = areaBoundaries[area];
      console.log(`Optimized Map - Zooming to ${area}:`, bounds.center);
      map.setCenter(bounds.center);
      map.setZoom(bounds.zoom);
    }
  };

  // Handle terrain toggle
  const handleTerrainToggle = (checked: boolean) => {
    console.log("Optimized Map - Terrain toggle:", checked);
    setShowTerrain(checked);
  };

  // Handle info toggle
  const handleInfoToggle = (checked: boolean) => {
    console.log("Optimized Map - Info toggle:", checked);
    setShowInfo(checked);
  };

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

  const filteredAssetCount =
    selectedArea === "All Areas"
      ? assets.length
      : assets.filter((a) => a.area === selectedArea).length;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Simplified Controls */}
      <div className="absolute top-2 left-2 z-20 max-w-[180px]">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-2 space-y-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Area</label>
              <Select value={selectedArea} onValueChange={handleAreaChange}>
                <SelectTrigger className="w-full h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Areas">All Areas</SelectItem>
                  <SelectItem value="Muthialpet">Muthialpet</SelectItem>
                  <SelectItem value="White Town">White Town</SelectItem>
                  <SelectItem value="Lawspet">Lawspet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Info</label>
              <Switch
                checked={showInfo}
                onCheckedChange={handleInfoToggle}
                className="scale-75"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Terrain</label>
              <Switch
                checked={showTerrain}
                onCheckedChange={handleTerrainToggle}
                className="scale-75"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Count */}
      <div className="absolute top-2 right-2 z-20">
        <Badge
          variant="secondary"
          className="bg-white/95 backdrop-blur-sm border-0 shadow-lg text-xs"
        >
          {filteredAssetCount} Assets
        </Badge>
      </div>
    </div>
  );
};
