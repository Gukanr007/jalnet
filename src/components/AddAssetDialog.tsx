
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, MousePointer } from 'lucide-react';
import { simulatedAssets } from '@/data/simulatedNetwork';

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedArea: string;
  onMapClick?: (lat: number, lng: number) => void;
  clickedCoords?: { lat: number; lng: number } | null;
}

export const AddAssetDialog: React.FC<AddAssetDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedArea,
  onMapClick,
  clickedCoords
}) => {
  const [assetData, setAssetData] = useState({
    name: '',
    type: '',
    condition: 'good',
    area: selectedArea,
    city: 'Pondicherry',
    latitude: '',
    longitude: '',
    installationDate: '',
    specifications: '',
    startPoint: null as { lat: number; lng: number } | null,
    endPoint: null as { lat: number; lng: number } | null,
    connectedPipeline: ''
  });

  const [placementMode, setPlacementMode] = useState<'start' | 'end' | 'single' | null>(null);
  const [isWaitingForClick, setIsWaitingForClick] = useState(false);

  const assetTypes = [
    { value: 'tank', label: 'Water Tank', description: 'Main water source' },
    { value: 'pipe', label: 'Pipeline', description: 'Distribution network' },
    { value: 'pump', label: 'Pump', description: 'Pressure booster' },
    { value: 'valve', label: 'Valve', description: 'Flow control' },
    { value: 'meter', label: 'Meter', description: 'Flow measurement' },
    { value: 'tap', label: 'Tap/Connection', description: 'End user connection' }
  ];

  const conditions = ['good', 'average', 'poor', 'critical'];

  // Get available pipelines for tap connections
  const availablePipelines = simulatedAssets.filter(asset => 
    asset.type === 'pipe' && asset.area === selectedArea
  );

  useEffect(() => {
    if (clickedCoords && isWaitingForClick) {
      if (assetData.type === 'pipe') {
        if (placementMode === 'start') {
          setAssetData(prev => ({
            ...prev,
            startPoint: clickedCoords
          }));
          setPlacementMode('end');
        } else if (placementMode === 'end') {
          setAssetData(prev => ({
            ...prev,
            endPoint: clickedCoords,
            latitude: clickedCoords.lat.toString(),
            longitude: clickedCoords.lng.toString()
          }));
          setIsWaitingForClick(false);
          setPlacementMode(null);
        }
      } else {
        setAssetData(prev => ({
          ...prev,
          latitude: clickedCoords.lat.toString(),
          longitude: clickedCoords.lng.toString()
        }));
        setIsWaitingForClick(false);
        setPlacementMode(null);
      }
    }
  }, [clickedCoords, isWaitingForClick, placementMode, assetData.type]);

  const handleTypeChange = (type: string) => {
    setAssetData(prev => ({
      ...prev,
      type,
      startPoint: null,
      endPoint: null,
      connectedPipeline: '',
      latitude: '',
      longitude: ''
    }));
    setPlacementMode(null);
    setIsWaitingForClick(false);
  };

  const handleClickToPlace = () => {
    if (assetData.type === 'pipe') {
      setPlacementMode('start');
      setIsWaitingForClick(true);
    } else {
      setPlacementMode('single');
      setIsWaitingForClick(true);
    }
  };

  const getPlacementInstructions = () => {
    if (!assetData.type) return 'Select asset type first';
    
    if (assetData.type === 'pipe') {
      if (placementMode === 'start') return 'Click on map to set START point';
      if (placementMode === 'end') return 'Click on map to set END point';
      if (!assetData.startPoint) return 'Click "Place on Map" to set pipeline route';
      return 'Pipeline route set';
    }
    
    if (assetData.type === 'tap') {
      return 'Select a pipeline first, then click to place tap';
    }
    
    return 'Click "Place on Map" to set location';
  };

  const canPlaceOnMap = () => {
    if (!assetData.type) return false;
    if (assetData.type === 'tap' && !assetData.connectedPipeline) return false;
    return true;
  };

  const handleSubmit = () => {
    console.log('Adding new asset:', assetData);
    onOpenChange(false);
    
    // Reset form
    setAssetData({
      name: '',
      type: '',
      condition: 'good',
      area: selectedArea,
      city: 'Pondicherry',
      latitude: '',
      longitude: '',
      installationDate: '',
      specifications: '',
      startPoint: null,
      endPoint: null,
      connectedPipeline: ''
    });
    setPlacementMode(null);
    setIsWaitingForClick(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Asset
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Asset Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Asset Type</label>
            <Select value={assetData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tap Pipeline Connection */}
          {assetData.type === 'tap' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Connect to Pipeline</label>
              <Select 
                value={assetData.connectedPipeline} 
                onValueChange={(value) => setAssetData(prev => ({...prev, connectedPipeline: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {availablePipelines.map(pipe => (
                    <SelectItem key={pipe.id} value={pipe.id}>
                      {pipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location Placement */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Location</label>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleClickToPlace}
                disabled={!canPlaceOnMap() || isWaitingForClick}
                className="flex items-center gap-2"
              >
                <MousePointer className="h-4 w-4" />
                {isWaitingForClick ? 'Waiting...' : 'Place on Map'}
              </Button>
            </div>
            
            <div className="text-xs text-gray-600 mb-2">
              {getPlacementInstructions()}
            </div>

            {isWaitingForClick && (
              <Badge variant="secondary" className="mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                Click on the map to place asset
              </Badge>
            )}

            {assetData.type === 'pipe' && assetData.startPoint && (
              <div className="space-y-1 text-xs">
                <p><strong>Start:</strong> {assetData.startPoint.lat.toFixed(6)}, {assetData.startPoint.lng.toFixed(6)}</p>
                {assetData.endPoint && (
                  <p><strong>End:</strong> {assetData.endPoint.lat.toFixed(6)}, {assetData.endPoint.lng.toFixed(6)}</p>
                )}
              </div>
            )}

            {assetData.type !== 'pipe' && assetData.latitude && (
              <div className="text-xs">
                <strong>Location:</strong> {parseFloat(assetData.latitude).toFixed(6)}, {parseFloat(assetData.longitude).toFixed(6)}
              </div>
            )}
          </div>

          {/* Manual Coordinates (fallback) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Latitude (Manual)</label>
              <Input
                type="number"
                step="any"
                value={assetData.latitude}
                onChange={(e) => setAssetData({...assetData, latitude: e.target.value})}
                placeholder="11.9400"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Longitude (Manual)</label>
              <Input
                type="number"
                step="any"
                value={assetData.longitude}
                onChange={(e) => setAssetData({...assetData, longitude: e.target.value})}
                placeholder="79.8200"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Asset Name</label>
              <Input
                value={assetData.name}
                onChange={(e) => setAssetData({...assetData, name: e.target.value})}
                placeholder="Enter asset name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Condition</label>
              <Select 
                value={assetData.condition} 
                onValueChange={(value) => setAssetData({...assetData, condition: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Area</label>
              <Select 
                value={assetData.area} 
                onValueChange={(value) => setAssetData({...assetData, area: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Muthialpet">Muthialpet</SelectItem>
                  <SelectItem value="White Town">White Town</SelectItem>
                  <SelectItem value="Lawspet">Lawspet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Installation Date</label>
              <Input
                type="date"
                value={assetData.installationDate}
                onChange={(e) => setAssetData({...assetData, installationDate: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Specifications (JSON format)</label>
            <Textarea
              value={assetData.specifications}
              onChange={(e) => setAssetData({...assetData, specifications: e.target.value})}
              placeholder='{"capacity": "50000L", "material": "Concrete"}'
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              Add Asset
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
