
import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ReliableGoogleMap } from '@/components/ReliableGoogleMap';
import { MapLegend } from '@/components/MapLegend';
import { AssetDetailsPanel } from '@/components/AssetDetailsPanel';
import { StepByStepAssetDialog } from '@/components/StepByStepAssetDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Home } from 'lucide-react';
import { areaBoundaries, networkConnections } from '@/data/simulatedNetwork';
import { Asset } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useAssetsWithBills } from '@/hooks/useAssetsWithBills';
import { useToast } from '@/components/ui/use-toast';

const MapViewContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('Muthialpet');
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { data: assets = [], isLoading, error } = useAssetsWithBills();

  if (error) {
    console.error('Error loading assets:', error);
    toast({
      title: "Error loading assets",
      description: "Failed to load assets from database",
      variant: "destructive",
    });
  }

  const handleAssetClick = (asset: Asset) => {
    console.log('Asset clicked:', asset.name, 'Type:', asset.type);
    
    // Show water bill info for tap assets
    if (asset.type === 'tap' && asset.water_connection) {
      console.log('Tap water info:', {
        water_id: asset.water_connection.water_id,
        bill_id: asset.current_bill?.id,
        household: asset.water_connection.household_name
      });
      
      toast({
        title: `Tap: ${asset.name}`,
        description: `Water ID: ${asset.water_connection.water_id}${asset.current_bill ? ` | Bill ID: ${asset.current_bill.id}` : ' | No current bill'}`,
      });
    } else {
      // Show general asset info for network components
      toast({
        title: `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}: ${asset.name}`,
        description: `Condition: ${asset.condition} | Area: ${asset.area}`,
      });
    }
    
    setSelectedAsset(asset);
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng, 'showAddAsset:', showAddAsset);
    // Set coordinates whenever the map is clicked and dialog is open
    if (showAddAsset) {
      console.log('Setting clicked coordinates for asset placement');
      setClickedCoords({ lat, lng });
    }
  };

  const handleDashboardClick = () => {
    navigate('/');
  };

  const filteredAssets = selectedArea === 'All Areas' 
    ? assets 
    : assets.filter(asset => asset.area === selectedArea);

  const mapCenter = areaBoundaries[selectedArea]?.center || areaBoundaries['All Areas'].center;
  const mapZoom = areaBoundaries[selectedArea]?.zoom || areaBoundaries['All Areas'].zoom;

  // Calculate connections for filtered assets
  const filteredConnections = networkConnections.filter(connection => {
    const fromAsset = filteredAssets.find(a => a.id === connection.from);
    const toAsset = filteredAssets.find(a => a.id === connection.to);
    return fromAsset && toAsset;
  });

  // Count different asset types
  const assetTypeCounts = filteredAssets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count taps with bills
  const tapsWithBills = filteredAssets.filter(asset => 
    asset.type === 'tap' && asset.water_connection && asset.current_bill
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading network infrastructure and billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Breadcrumb />
      <div className="p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Water Network Map</h1>
            <p className="text-xs sm:text-sm text-gray-600">Complete infrastructure view with billing integration</p>
          </div>

          {/* Controls Section */}
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <label className="text-xs sm:text-sm font-medium">Select Area:</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
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
            
            <div className="flex gap-2">
              <Button 
                onClick={handleDashboardClick} 
                variant="outline"
                className="flex items-center gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm"
                size="sm"
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                Dashboard
              </Button>
              
              <Button 
                onClick={() => {
                  console.log('Add Asset button clicked');
                  setShowAddAsset(true);
                }} 
                className="flex items-center gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm"
                size="sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Add Asset
              </Button>
            </div>
          </div>

          {/* Asset Statistics */}
          <div className="mb-2 sm:mb-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white border text-xs sm:text-sm">
              {filteredAssets.length} Total Assets • {filteredConnections.length} Connections
            </Badge>
            {assetTypeCounts.tank && (
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800 text-xs sm:text-sm">
                {assetTypeCounts.tank} Tanks
              </Badge>
            )}
            {assetTypeCounts.pump && (
              <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-800 text-xs sm:text-sm">
                {assetTypeCounts.pump} Pumps
              </Badge>
            )}
            {assetTypeCounts.pipe && (
              <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-800 text-xs sm:text-sm">
                {assetTypeCounts.pipe} Pipes
              </Badge>
            )}
            {assetTypeCounts.tap && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800 text-xs sm:text-sm">
                {tapsWithBills}/{assetTypeCounts.tap} Taps with Bills
              </Badge>
            )}
          </div>

          {/* Map Container */}
          <div className="relative">
            <ReliableGoogleMap 
              assets={filteredAssets}
              onAssetClick={handleAssetClick}
              onMapClick={handleMapClick}
              isPlacementMode={showAddAsset}
              center={mapCenter}
              zoom={mapZoom}
              className="w-full h-[calc(100vh-200px)] sm:h-[calc(100vh-300px)] rounded-lg shadow-lg"
            />
            
            {/* Legend below the map */}
            <div className="mt-3 sm:mt-4">
              <MapLegend />
            </div>
          </div>
        </div>
      </div>

      {/* Asset Details Panel */}
      {selectedAsset && (
        <AssetDetailsPanel 
          asset={selectedAsset} 
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {/* Step-by-Step Add Asset Dialog */}
      <StepByStepAssetDialog 
        open={showAddAsset}
        onOpenChange={(open) => {
          console.log('Dialog open change:', open);
          setShowAddAsset(open);
          if (!open) {
            // Clear any pending coordinates when dialog closes
            setClickedCoords(null);
          }
        }}
        selectedArea={selectedArea}
        clickedCoords={clickedCoords}
        onClearCoords={() => {
          console.log('Clearing coordinates');
          setClickedCoords(null);
        }}
      />
    </div>
  );
};

const MapView = () => {
  return (
    <AuthProvider>
      <MapViewContent />
    </AuthProvider>
  );
};

export default MapView;
