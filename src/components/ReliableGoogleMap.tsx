import React, { useEffect, useRef, useState, useCallback } from "react";
import { Asset } from "@/types";
import { Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { networkConnections } from "@/data/simulatedNetwork";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface ReliableGoogleMapProps {
  assets?: Asset[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onAssetClick?: (asset: Asset) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isPlacementMode?: boolean;
  className?: string;
}

export const ReliableGoogleMap: React.FC<ReliableGoogleMapProps> = ({
  assets = [],
  center = { lat: 11.94, lng: 79.82 },
  zoom = 13,
  onAssetClick,
  onMapClick,
  isPlacementMode = false,
  className = "w-full h-96",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [realTimeAssets, setRealTimeAssets] = useState<Asset[]>([]);
  const [mapClickListener, setMapClickListener] =
    useState<google.maps.MapsEventListener | null>(null);

  // Google Maps style zoom scaling - balanced visibility
  const getZoomScale = useCallback((zoomLevel: number, assetType: string) => {
    // For pipes and taps, keep reasonable visibility
    if (assetType === "pipe" || assetType === "tap") {
      const minScale = 0.3;
      const maxScale = 1.0;
      const minZoom = 8;
      const maxZoom = 18;

      const normalizedZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel));
      return (
        minScale +
        (maxScale - minScale) *
          ((normalizedZoom - minZoom) / (maxZoom - minZoom))
      );
    }

    // For tanks, pumps, and valves - keep them visible but small
    // Scale from 0.3 at zoom 8 to 1.0 at zoom 18
    const minScale = 0.3; // Visible minimum at low zoom
    const maxScale = 1.0; // Full size at high zoom
    const minZoom = 8;
    const maxZoom = 18;

    const normalizedZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel));
    const linearScale = (normalizedZoom - minZoom) / (maxZoom - minZoom);

    return minScale + (maxScale - minScale) * linearScale;
  }, []);

  const getAssetIcon = useCallback(
    (asset: Asset, zoomLevel: number) => {
      const conditionColors = {
        good: "#22c55e",
        average: "#f59e0b",
        poor: "#ef4444",
        critical: "#dc2626",
      };

      const baseColors = {
        tank: "#0066CC",
        pump: "#FF6600",
        pipe: "#666666",
        valve: "#CC0066",
        meter: "#00CC66",
        tap: "#000000",
      };

      const fillColor =
        conditionColors[asset.condition as keyof typeof conditionColors] ||
        baseColors[asset.type as keyof typeof baseColors];
      const strokeColor =
        baseColors[asset.type as keyof typeof baseColors] || "#000000";

      const getSymbolPath = (type: string) => {
        switch (type) {
          case "tank":
            return "M -10,-10 L 10,-10 L 10,10 L -10,10 Z"; // Square for tanks
          case "pump":
            return "M 0,-12 L 10,8 L -10,8 Z"; // Triangle for pumps
          case "valve":
            return "M 0,-10 L 8,0 L 0,10 L -8,0 Z"; // Diamond for valves
          case "meter":
            return google.maps.SymbolPath.CIRCLE; // Circle for meters
          case "tap":
            return google.maps.SymbolPath.CIRCLE; // Circle for taps
          case "pipe":
          default:
            return google.maps.SymbolPath.CIRCLE; // Circle for pipe junctions
        }
      };

      // Base sizes - smaller but visible for tanks, pumps, valves
      const getBaseScale = (type: string) => {
        switch (type) {
          case "tank":
            return 1.0; // Small but visible
          case "pump":
            return 1.0; // Small but visible
          case "valve":
            return 1.0; // Small but visible
          case "meter":
            return 2.5; // Keep same for meters
          case "tap":
            return 4; // Keep same for taps
          case "pipe":
            return 5; // Keep same for pipes
          default:
            return 1.0;
        }
      };

      // Apply zoom-based scaling
      const zoomScale = getZoomScale(zoomLevel, asset.type);
      const finalScale = getBaseScale(asset.type) * zoomScale;

      return {
        path: getSymbolPath(asset.type),
        fillColor: fillColor,
        fillOpacity: 0.9,
        strokeWeight: Math.max(0.3, 0.5 * zoomScale),
        strokeColor: strokeColor,
        scale: Math.max(0.3, finalScale), // Ensure minimum visible scale
      };
    },
    [getZoomScale]
  );

  const loadGoogleMaps = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.google?.maps) {
        console.log("Google Maps already loaded");
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        console.log("Google Maps script already exists, waiting for load");
        const checkLoaded = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkLoaded);
          reject(new Error("Google Maps loading timeout"));
        }, 10000);
        return;
      }

      console.log("Loading Google Maps script");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLEMAP_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("Google Maps script loaded successfully");
        resolve();
      };

      script.onerror = () => {
        console.error("Failed to load Google Maps script");
        reject(new Error("Failed to load Google Maps"));
      };

      document.head.appendChild(script);
    });
  }, []);

  // Real-time asset loading
  const loadRealTimeAssets = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("assets").select("*");

      if (error) {
        console.error("Error loading assets:", error);
        return;
      }

      if (data) {
        console.log("Loaded real-time assets:", data.length);
        setRealTimeAssets(data as Asset[]);
      }
    } catch (error) {
      console.error("Error loading real-time assets:", error);
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    loadRealTimeAssets();

    const channel = supabase
      .channel("assets-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "assets" },
        (payload) => {
          console.log("New asset added:", payload.new);
          setRealTimeAssets((prev) => [...prev, payload.new as Asset]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "assets" },
        (payload) => {
          console.log("Asset updated:", payload.new);
          setRealTimeAssets((prev) =>
            prev.map((asset) =>
              asset.id === payload.new.id ? (payload.new as Asset) : asset
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "assets" },
        (payload) => {
          console.log("Asset deleted:", payload.old);
          setRealTimeAssets((prev) =>
            prev.filter((asset) => asset.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadRealTimeAssets]);

  // Handle map click listener setup
  useEffect(() => {
    if (!map || !onMapClick) return;

    console.log(
      "Setting up map click listener, placement mode:",
      isPlacementMode
    );

    // Remove existing listener
    if (mapClickListener) {
      google.maps.event.removeListener(mapClickListener);
      setMapClickListener(null);
    }

    // Add new listener only if in placement mode
    if (isPlacementMode) {
      const listener = map.addListener(
        "click",
        (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            console.log("Map click detected during placement mode:", {
              lat,
              lng,
            });
            onMapClick(lat, lng);
          }
        }
      );
      setMapClickListener(listener);
    }

    return () => {
      if (mapClickListener) {
        google.maps.event.removeListener(mapClickListener);
      }
    };
  }, [map, onMapClick, isPlacementMode]);

  const initMap = useCallback(async () => {
    console.log("Attempting to initialize map...");

    if (!mapRef.current) {
      console.log("Map container not ready - ref is null");
      return;
    }

    if (map) {
      console.log("Map already initialized");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("Loading Google Maps API...");
      await loadGoogleMaps();

      if (!mapRef.current) {
        console.log("Map container lost during loading");
        throw new Error("Map container unavailable");
      }

      console.log("Creating map instance...");
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        styles: [
          {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Track zoom changes
      googleMap.addListener("zoom_changed", () => {
        const newZoom = googleMap.getZoom() || zoom;
        setCurrentZoom(newZoom);
      });

      console.log("Map created successfully");
      setMap(googleMap);
      setCurrentZoom(zoom);
      setIsLoading(false);
      setRetryCount(0);
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to load map. Check your internet connection.");
      setIsLoading(false);
    }
  }, [center, zoom, loadGoogleMaps, map]);

  const createPipelines = useCallback(() => {
    if (!map) {
      console.log("Map not ready for pipelines");
      return;
    }

    // Combine all assets (simulated + real-time) for pipeline creation
    const allAssets = [...assets, ...realTimeAssets];

    if (!allAssets.length) {
      console.log("No assets available for pipelines");
      return;
    }

    // Clear existing polylines
    polylines.forEach((line) => line.setMap(null));

    const newPolylines: google.maps.Polyline[] = [];

    // Scale line weights based on zoom - more aggressive scaling
    const zoomScale = getZoomScale(currentZoom, "pipe");
    const baseLineScale = Math.max(0.3, zoomScale * 1.5); // More responsive line scaling

    networkConnections.forEach((connection) => {
      const fromAsset = allAssets.find((a) => a.id === connection.from);
      const toAsset = allAssets.find((a) => a.id === connection.to);

      if (fromAsset && toAsset) {
        const lineConfig = {
          main: { color: "#0066CC", weight: 5, opacity: 0.8 },
          secondary: { color: "#00AA44", weight: 3, opacity: 0.7 },
          service: { color: "#666666", weight: 2, opacity: 0.6 },
        };

        const config =
          lineConfig[connection.type as keyof typeof lineConfig] ||
          lineConfig.service;
        const scaledWeight = Math.max(0.5, config.weight * baseLineScale);

        const polyline = new window.google.maps.Polyline({
          path: [
            { lat: fromAsset.latitude, lng: fromAsset.longitude },
            { lat: toAsset.latitude, lng: toAsset.longitude },
          ],
          geodesic: true,
          strokeColor: config.color,
          strokeOpacity: config.opacity,
          strokeWeight: scaledWeight,
          map,
        });

        // Add click listener to pipeline
        polyline.addListener("click", (event: google.maps.PolyMouseEvent) => {
          const infoWindow = new window.google.maps.InfoWindow({
            position: event.latLng,
            content: `
              <div class="p-3">
                <h3 class="font-bold text-sm mb-2">Pipeline Connection</h3>
                <div class="space-y-1 text-xs">
                  <p><span class="font-semibold">Type:</span> ${
                    connection.type.charAt(0).toUpperCase() +
                    connection.type.slice(1)
                  }</p>
                  <p><span class="font-semibold">From:</span> ${
                    fromAsset.name
                  }</p>
                  <p><span class="font-semibold">To:</span> ${toAsset.name}</p>
                  <p><span class="font-semibold">Status:</span> Active</p>
                  <p><span class="font-semibold">Flow Direction:</span> ${
                    fromAsset.name
                  } → ${toAsset.name}</p>
                </div>
              </div>
            `,
            maxWidth: 250,
          });
          infoWindow.open(map);
        });

        newPolylines.push(polyline);
      }
    });

    setPolylines(newPolylines);
    console.log(
      `Created ${
        newPolylines.length
      } pipeline connections with zoom scale ${baseLineScale.toFixed(2)}`
    );
  }, [map, assets, realTimeAssets, currentZoom, getZoomScale]);

  const createMarkers = useCallback(() => {
    // Combine real-time assets with provided assets, ensuring no duplicates
    const allAssets = [...realTimeAssets, ...assets];
    const uniqueAssets = allAssets.filter(
      (asset, index, self) => index === self.findIndex((a) => a.id === asset.id)
    );

    if (!map || !uniqueAssets.length) {
      console.log("Map or assets not ready for markers");
      return;
    }

    console.log(
      `Creating ${uniqueAssets.length} markers (${realTimeAssets.length} real-time + ${assets.length} simulated) at zoom level ${currentZoom}...`
    );

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));

    // Create new markers with improved zoom-responsive sizing
    const newMarkers = uniqueAssets.map((asset) => {
      const marker = new window.google.maps.Marker({
        position: { lat: asset.latitude, lng: asset.longitude },
        map,
        title: `${asset.name} (${asset.type})`,
        icon: getAssetIcon(asset, currentZoom),
        optimized: true,
      });

      // Asset type specific info
      const getAssetSpecificInfo = (asset: Asset) => {
        const typeDescriptions = {
          tank: "Water storage and supply source",
          pump: "Pumps water through the network",
          pipe: "Distributes water to connections",
          valve: "Controls water flow and pressure",
          meter: "Measures water flow and consumption",
          tap: "End-user water connection point",
        };

        return (
          typeDescriptions[asset.type as keyof typeof typeDescriptions] ||
          "Water infrastructure asset"
        );
      };

      // Enhanced info window content for tap assets
      const getInfoWindowContent = (asset: Asset) => {
        let content = `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-base mb-2">${asset.name}</h3>
            <div class="space-y-1 text-sm">
              <p><span class="font-semibold">Type:</span> ${
                asset.type.charAt(0).toUpperCase() + asset.type.slice(1)
              }</p>
              <p><span class="font-semibold">Function:</span> ${getAssetSpecificInfo(
                asset
              )}</p>
              <p><span class="font-semibold">Condition:</span> 
                <span class="inline-block w-2 h-2 rounded-full ml-1 mr-1" style="background-color: ${
                  asset.condition === "good"
                    ? "#22c55e"
                    : asset.condition === "average"
                    ? "#f59e0b"
                    : asset.condition === "poor"
                    ? "#ef4444"
                    : "#dc2626"
                }"></span>
                ${
                  asset.condition.charAt(0).toUpperCase() +
                  asset.condition.slice(1)
                }
              </p>
              <p><span class="font-semibold">Area:</span> ${asset.area}</p>`;

        // Add water connection info for tap assets
        if (asset.type === "tap" && asset.water_connection) {
          content += `
              <p><span class="font-semibold">Water ID:</span> ${asset.water_connection.water_id}</p>
              <p><span class="font-semibold">Household:</span> ${asset.water_connection.household_name}</p>
              <p><span class="font-semibold">Monthly Rate:</span> ₹${asset.water_connection.monthly_rate}</p>`;

          if (asset.current_bill) {
            content += `
              <p><span class="font-semibold">Current Bill:</span> ₹${
                asset.current_bill.total_amount
              } (${asset.current_bill.status})</p>
              <p><span class="font-semibold">Due Date:</span> ${new Date(
                asset.current_bill.due_date
              ).toLocaleDateString()}</p>`;
          } else {
            content += `<p><span class="font-semibold">Bill Status:</span> No current bill</p>`;
          }
        }

        content += `
              ${
                asset.specifications
                  ? `<p><span class="font-semibold">Specs:</span> ${Object.values(
                      asset.specifications
                    ).join(", ")}</p>`
                  : ""
              }
              ${
                asset.last_maintenance_date
                  ? `<p><span class="font-semibold">Last Maintenance:</span> ${new Date(
                      asset.last_maintenance_date
                    ).toLocaleDateString()}</p>`
                  : ""
              }
            </div>
            <button onclick="window.selectAsset('${
              asset.id
            }')" class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
              View Details
            </button>
          </div>
        `;

        return content;
      };

      const infoWindow = new window.google.maps.InfoWindow({
        content: getInfoWindowContent(asset),
        maxWidth: 300,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        onAssetClick?.(asset);
      });

      return marker;
    });

    setMarkers(newMarkers);
    const avgScale =
      uniqueAssets.length > 0 ? getZoomScale(currentZoom, "tank") : 0;
    console.log(
      `Created ${newMarkers.length} markers with zoom scale ${avgScale.toFixed(
        3
      )}`
    );
  }, [
    map,
    assets,
    realTimeAssets,
    onAssetClick,
    currentZoom,
    getAssetIcon,
    getZoomScale,
  ]);

  const handleRetry = () => {
    console.log("Retrying map initialization...");
    setRetryCount((prev) => prev + 1);
    setMap(null);
    setError(null);
    setTimeout(initMap, 100);
  };

  useEffect(() => {
    console.log("Map component mounted, checking readiness...");

    const timer = setTimeout(() => {
      if (mapRef.current) {
        console.log("Map container ready, initializing...");
        initMap();
      } else {
        console.log("Map container still not ready");
        setError("Map container failed to initialize");
        setIsLoading(false);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (map && (assets.length > 0 || realTimeAssets.length > 0)) {
      console.log("Map and assets ready, creating markers and pipelines...");
      createMarkers();
      createPipelines();
    }
  }, [map, assets, realTimeAssets, onAssetClick]);

  // Update markers when zoom changes
  useEffect(() => {
    if (map && (assets.length > 0 || realTimeAssets.length > 0)) {
      console.log(
        `Zoom changed to ${currentZoom}, updating markers and pipelines...`
      );
      createMarkers();
      createPipelines();
    }
  }, [currentZoom]);

  // Update map center and zoom when props change
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-red-50 rounded-lg border border-red-200`}
      >
        <div className="text-center p-6">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <p className="text-xs text-red-500 mb-4">
            Retry attempt: {retryCount}
          </p>
          <Button
            onClick={handleRetry}
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry Loading Map
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-blue-50 rounded-lg border border-blue-200`}
      >
        <div className="text-center p-6">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-sm text-blue-600 font-medium">
            Loading Network Map...
          </p>
          <p className="text-xs text-blue-500 mt-2">
            Please wait while we initialize the map
          </p>
          {isPlacementMode && (
            <p className="text-xs text-green-600 mt-2">
              Ready for asset placement
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {isPlacementMode && (
        <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium z-10">
          Placement Mode Active
        </div>
      )}
    </div>
  );
};
