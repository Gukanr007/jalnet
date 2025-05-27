
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedGoogleMap } from './EnhancedGoogleMap';
import { OptimizedGoogleMap } from './OptimizedGoogleMap';
import { MapLegend } from './MapLegend';
import { simulatedAssets } from '@/data/simulatedNetwork';
import { Asset } from '@/types';
import { MapPin } from 'lucide-react';

export const NetworkMapDemo = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('Muthialpet');

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const areaBoundaries = {
    'All Areas': { center: { lat: 11.9400, lng: 79.8200 }, zoom: 13 },
    'Muthialpet': { center: { lat: 11.9285, lng: 79.8180 }, zoom: 16 },
    'White Town': { center: { lat: 11.9345, lng: 79.8295 }, zoom: 16 },
    'Lawspet': { center: { lat: 11.9580, lng: 79.8120 }, zoom: 16 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Water Distribution Network</h1>
          <p className="text-lg text-gray-600">Pondicherry Infrastructure Management System</p>
        </div>

        {/* Area Selection Above Map */}
        <div className="flex justify-center">
          <Card className="w-auto border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <label className="text-sm font-medium">Select Area:</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-48">
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
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Map - Increased Size */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-0">
                <EnhancedGoogleMap
                  assets={simulatedAssets}
                  onAssetClick={handleAssetClick}
                  className="w-full h-[600px]"
                  center={areaBoundaries[selectedArea]?.center}
                  zoom={areaBoundaries[selectedArea]?.zoom}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Legend and Asset Details */}
          <div className="space-y-6">
            {/* Map Legend */}
            <MapLegend />

            {/* Selected Asset Details */}
            {selectedAsset && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Asset Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-600">{selectedAsset.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {selectedAsset.type} • {selectedAsset.condition}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedAsset.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-medium">{selectedAsset.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className={`font-medium capitalize ${
                        selectedAsset.condition === 'good' ? 'text-green-600' :
                        selectedAsset.condition === 'average' ? 'text-orange-500' :
                        selectedAsset.condition === 'poor' ? 'text-red-500' :
                        'text-red-700'
                      }`}>
                        {selectedAsset.condition}
                      </span>
                    </div>
                    {selectedAsset.last_maintenance_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Maintenance:</span>
                        <span className="font-medium text-xs">{selectedAsset.last_maintenance_date}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Statistics */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Network Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">
                      {simulatedAssets.length}
                    </div>
                    <div className="text-gray-600">Total Assets</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-bold text-lg text-green-600">
                      {simulatedAssets.filter(a => a.condition === 'good').length}
                    </div>
                    <div className="text-gray-600">Good Condition</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="font-bold text-lg text-orange-600">
                      {simulatedAssets.filter(a => a.condition === 'average').length}
                    </div>
                    <div className="text-gray-600">Need Attention</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="font-bold text-lg text-red-600">
                      {simulatedAssets.filter(a => a.condition === 'poor' || a.condition === 'critical').length}
                    </div>
                    <div className="text-gray-600">Critical</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
