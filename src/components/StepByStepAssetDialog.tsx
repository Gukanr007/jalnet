import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, MapPin, MousePointer, CheckCircle, X, Map } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StepByStepAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedArea: string;
  clickedCoords?: { lat: number; lng: number } | null;
  onClearCoords: () => void;
}

type AssetType = 'tank' | 'pump' | 'pipe' | 'valve' | 'meter' | 'tap';
type AssetCondition = 'good' | 'average' | 'poor' | 'critical';

interface AssetData {
  type: AssetType | '';
  name: string;
  condition: AssetCondition;
  area: string;
  city: string;
  installation_date: string;
  // Location data
  latitude?: number;
  longitude?: number;
  startPoint?: { lat: number; lng: number };
  endPoint?: { lat: number; lng: number };
}

export const StepByStepAssetDialog: React.FC<StepByStepAssetDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedArea,
  clickedCoords,
  onClearCoords
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isWaitingForClick, setIsWaitingForClick] = useState(false);
  const [placementMode, setPlacementMode] = useState<'single' | 'start' | 'end' | null>(null);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const [assetData, setAssetData] = useState<AssetData>({
    type: '',
    name: '',
    condition: 'good',
    area: selectedArea,
    city: 'Pondicherry',
    installation_date: today // Default to today
  });

  const assetTypes = [
    { value: 'tank' as const, label: 'Water Tank', description: 'Main water storage' },
    { value: 'pump' as const, label: 'Pump Station', description: 'Water pressure booster' },
    { value: 'pipe' as const, label: 'Pipeline', description: 'Water distribution line' },
    { value: 'valve' as const, label: 'Control Valve', description: 'Flow control device' },
    { value: 'meter' as const, label: 'Flow Meter', description: 'Measurement device' },
    { value: 'tap' as const, label: 'Water Tap', description: 'End-user connection' }
  ];

  const conditions = [
    { value: 'good', label: 'Good', color: 'text-green-600' },
    { value: 'average', label: 'Average', color: 'text-yellow-600' },
    { value: 'poor', label: 'Poor', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ];

  // Helper function to generate unique water ID
  const generateWaterID = (area: string) => {
    const areaCode = area.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    return `${areaCode}-TAP-${timestamp}`;
  };

  // Helper function to create water connection and bill for tap assets
  const createWaterConnectionAndBill = async (assetId: string, waterID: string, latitude: number, longitude: number, area: string, city: string) => {
    try {
      // Create water connection
      const { data: connection, error: connectionError } = await supabase
        .from('water_connections')
        .insert({
          water_id: waterID,
          household_name: `Household ${waterID}`,
          tap_asset_id: assetId,
          address: `${area}, ${city}`,
          latitude: latitude,
          longitude: longitude,
          city: city,
          area: area,
          is_active: true,
          monthly_rate: 450.00
        })
        .select()
        .single();

      if (connectionError) {
        console.error('Error creating water connection:', connectionError);
        throw connectionError;
      }

      console.log('Water connection created:', connection);

      // Create current month's bill
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      // Calculate due date (15th of next month)
      const dueDate = new Date(currentYear, currentMonth, 15);

      const { data: bill, error: billError } = await supabase
        .from('water_bills')
        .insert({
          water_connection_id: connection.id,
          water_id: waterID,
          bill_month: currentMonth,
          bill_year: currentYear,
          amount: 450.00,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending',
          late_fee: 0.00,
          total_amount: 450.00
        })
        .select()
        .single();

      if (billError) {
        console.error('Error creating water bill:', billError);
        throw billError;
      }

      console.log('Water bill created:', bill);

      return { connection, bill };
    } catch (error) {
      console.error('Error creating water connection and bill:', error);
      throw error;
    }
  };

  // Handle map clicks
  useEffect(() => {
    console.log('Map click effect:', { clickedCoords, isWaitingForClick, placementMode });
    
    if (clickedCoords && isWaitingForClick) {
      console.log('Processing map click for asset placement');
      
      if (assetData.type === 'pipe') {
        if (placementMode === 'start') {
          console.log('Setting pipeline start point');
          setAssetData(prev => ({ ...prev, startPoint: clickedCoords }));
          setPlacementMode('end');
          toast({
            title: "Start point set",
            description: "Now click to set the end point of the pipeline"
          });
        } else if (placementMode === 'end') {
          console.log('Setting pipeline end point');
          setAssetData(prev => ({ 
            ...prev, 
            endPoint: clickedCoords,
            latitude: (prev.startPoint!.lat + clickedCoords.lat) / 2,
            longitude: (prev.startPoint!.lng + clickedCoords.lng) / 2
          }));
          setIsWaitingForClick(false);
          setPlacementMode(null);
          setCurrentStep(3);
          toast({
            title: "Pipeline placed successfully",
            description: "Both start and end points have been set"
          });
        }
      } else {
        console.log('Setting single asset location');
        setAssetData(prev => ({ 
          ...prev, 
          latitude: clickedCoords.lat, 
          longitude: clickedCoords.lng 
        }));
        setIsWaitingForClick(false);
        setPlacementMode(null);
        setCurrentStep(3);
        toast({
          title: "Asset placed successfully",
          description: "Location has been set on the map"
        });
      }
      onClearCoords();
    }
  }, [clickedCoords, isWaitingForClick, placementMode, assetData.type, onClearCoords, toast]);

  const handleTypeSelection = (type: AssetType) => {
    console.log('Asset type selected:', type);
    setAssetData(prev => ({ 
      ...prev, 
      type,
      name: '', // Reset name when type changes
      startPoint: undefined,
      endPoint: undefined,
      latitude: undefined,
      longitude: undefined
    }));
    setCurrentStep(2);
  };

  const handleLocationPlacement = () => {
    console.log('Starting location placement for:', assetData.type);
    
    if (assetData.type === 'pipe') {
      setPlacementMode('start');
      setIsWaitingForClick(true);
      toast({
        title: "Pipeline Mode Active",
        description: "Click on the map to set the START point of the pipeline",
        duration: 5000
      });
    } else {
      setPlacementMode('single');
      setIsWaitingForClick(true);
      toast({
        title: "Placement Mode Active", 
        description: "Click anywhere on the map to place this asset",
        duration: 5000
      });
    }
  };

  const cancelPlacement = () => {
    console.log('Canceling asset placement');
    setIsWaitingForClick(false);
    setPlacementMode(null);
    toast({
      title: "Placement cancelled",
      description: "You can try placing the asset again"
    });
  };

  const cancelAssetCreation = () => {
    console.log('Canceling entire asset creation process');
    resetForm();
    onOpenChange(false);
    toast({
      title: "Asset creation cancelled",
      description: "The add asset process has been cancelled"
    });
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting asset:', assetData);
      
      // Generate a unique name if not provided
      const finalName = assetData.name || `${assetData.type}-${Date.now()}`;
      
      // Create basic specifications based on asset type
      const defaultSpecs = {
        tank: { capacity: "10000L", material: "Concrete" },
        pump: { power: "5HP", flow_rate: "100L/min" },
        pipe: { diameter: "6inch", material: "PVC" },
        valve: { type: "Gate Valve", size: "4inch" },
        meter: { type: "Digital", accuracy: "±2%" },
        tap: { type: "Standard", connection: "3/4inch" }
      };
      
      // Prepare the asset data for insertion with proper type casting
      const assetToInsert = {
        name: finalName,
        type: assetData.type as 'tank' | 'pump' | 'pipe' | 'valve' | 'meter' | 'tap',
        condition: assetData.condition,
        area: assetData.area,
        city: assetData.city,
        latitude: assetData.latitude!,
        longitude: assetData.longitude!,
        installation_date: assetData.installation_date || null,
        specifications: defaultSpecs[assetData.type as keyof typeof defaultSpecs] || null
      };

      console.log('Inserting asset into database:', assetToInsert);

      const { data: newAsset, error } = await supabase
        .from('assets')
        .insert(assetToInsert)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('Asset created successfully:', newAsset);

      // If it's a tap asset, create water connection and bill
      if (assetData.type === 'tap') {
        const waterID = generateWaterID(assetData.area);
        
        try {
          const { connection, bill } = await createWaterConnectionAndBill(
            newAsset.id,
            waterID,
            assetData.latitude!,
            assetData.longitude!,
            assetData.area,
            assetData.city
          );

          toast({
            title: "Tap Asset Added Successfully!",
            description: `${finalName} with Water ID: ${waterID} and Bill ID: ${bill.id}`
          });
        } catch (connectionError) {
          console.error('Error creating water connection/bill:', connectionError);
          toast({
            title: "Asset Added with Warning",
            description: `${finalName} was created but water connection/bill creation failed`,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Asset Added Successfully!",
          description: `${finalName} has been added to the map`
        });
      }

      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: "Error",
        description: "Failed to add asset. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    console.log('Resetting form');
    setCurrentStep(1);
    setIsWaitingForClick(false);
    setPlacementMode(null);
    setAssetData({
      type: '',
      name: '',
      condition: 'good',
      area: selectedArea,
      city: 'Pondicherry',
      installation_date: today // Reset to today's date
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Select Asset Type';
      case 2: return 'Set Location';
      case 3: return 'Asset Details';
      default: return 'Add Asset';
    }
  };

  const canProceedFromStep2 = () => {
    if (assetData.type === 'pipe') {
      return assetData.startPoint && assetData.endPoint;
    }
    return assetData.latitude && assetData.longitude;
  };

  const handleDialogClose = (shouldClose: boolean) => {
    if (shouldClose && isWaitingForClick) {
      // Don't close if we're waiting for a map click
      toast({
        title: "Placement in progress",
        description: "Please click on the map or cancel placement first"
      });
      return;
    }
    
    if (shouldClose) {
      resetForm();
      setIsWaitingForClick(false);
    }
    onOpenChange(shouldClose);
  };

  // Show mobile-optimized placement UI when waiting for clicks
  if (isWaitingForClick) {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Mobile-first floating instruction card */}
        <div className="absolute top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-auto pointer-events-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-3 rounded-xl shadow-2xl border border-blue-500">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <MousePointer className="h-6 w-6 sm:h-5 sm:w-5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-sm mb-1">
                  {assetData.type === 'pipe' 
                    ? placementMode === 'start' 
                      ? 'Set Pipeline Start'
                      : 'Set Pipeline End'
                    : 'Place Asset'
                  }
                </h3>
                <p className="text-sm sm:text-xs text-blue-100 leading-relaxed">
                  {assetData.type === 'pipe' 
                    ? placementMode === 'start' 
                      ? 'Tap anywhere on the map to mark where the pipeline begins'
                      : 'Tap anywhere on the map to mark where the pipeline ends'
                    : 'Tap anywhere on the map to place this asset at that location'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3 pt-3 border-t border-blue-400">
              <Button 
                onClick={cancelPlacement}
                variant="outline"
                size="sm"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm h-9"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                onClick={cancelAssetCreation}
                variant="outline"
                size="sm"
                className="flex-1 bg-red-500/20 border-red-400/30 text-white hover:bg-red-500/30 text-sm h-9"
              >
                <X className="h-4 w-4 mr-1" />
                Exit
              </Button>
            </div>
          </div>
        </div>
        
        {/* Progress indicator for pipelines */}
        {assetData.type === 'pipe' && assetData.startPoint && (
          <div className="absolute top-24 sm:top-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-80 pointer-events-auto">
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium">Start Point Set</div>
                  <div className="text-xs text-green-100 truncate">
                    {assetData.startPoint.lat.toFixed(4)}, {assetData.startPoint.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map indicator overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 pointer-events-none">
          <div className="bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Map className="h-4 w-4" />
              <span>Map is ready for placement</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {getStepTitle()}
          </DialogTitle>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Step 1: Asset Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">What type of asset would you like to add?</p>
              <div className="grid grid-cols-1 gap-2">
                {assetTypes.map(type => (
                  <Button
                    key={type.value}
                    variant="outline"
                    className="h-auto p-4 justify-start"
                    onClick={() => handleTypeSelection(type.value)}
                  >
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
              
              {/* Cancel button for step 1 */}
              <div className="pt-4">
                <Button 
                  onClick={cancelAssetCreation}
                  variant="outline"
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Location Placement */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Place {assetTypes.find(t => t.value === assetData.type)?.label}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {assetData.type === 'pipe' 
                    ? 'Click on the map to set start and end points of the pipeline'
                    : 'Click on the map to place this asset'
                  }
                </p>

                {assetData.type === 'pipe' && assetData.startPoint && (
                  <div className="text-xs text-gray-600 mb-2 bg-green-50 p-2 rounded">
                    <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
                    Start point set: {assetData.startPoint.lat.toFixed(6)}, {assetData.startPoint.lng.toFixed(6)}
                  </div>
                )}

                {assetData.type === 'pipe' && assetData.endPoint && (
                  <div className="text-xs text-gray-600 mb-2 bg-green-50 p-2 rounded">
                    <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
                    End point set: {assetData.endPoint.lat.toFixed(6)}, {assetData.endPoint.lng.toFixed(6)}
                  </div>
                )}

                {assetData.type !== 'pipe' && assetData.latitude && (
                  <div className="text-xs text-gray-600 mb-2 bg-green-50 p-2 rounded">
                    <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
                    Location set: {assetData.latitude.toFixed(6)}, {assetData.longitude!.toFixed(6)}
                  </div>
                )}

                <Button 
                  onClick={handleLocationPlacement}
                  className="w-full mb-3"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {canProceedFromStep2() ? 'Update Location' : 'Click to Place on Map'}
                </Button>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={cancelAssetCreation}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)} 
                  disabled={!canProceedFromStep2()}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Asset Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Asset Name</label>
                  <Input
                    value={assetData.name}
                    onChange={(e) => setAssetData(prev => ({...prev, name: e.target.value}))}
                    placeholder={`${assetData.type}-${Date.now()}`}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Condition</label>
                  <Select 
                    value={assetData.condition} 
                    onValueChange={(value: AssetCondition) => setAssetData(prev => ({...prev, condition: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          <span className={condition.color}>{condition.label}</span>
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
                    onValueChange={(value) => setAssetData(prev => ({...prev, area: value}))}
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
                    value={assetData.installation_date}
                    onChange={(e) => setAssetData(prev => ({...prev, installation_date: e.target.value}))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={cancelAssetCreation}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Add Asset
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
