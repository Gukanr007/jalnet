
import React, { useState } from 'react';
import { Asset } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar, Wrench, MapPin, Info } from 'lucide-react';

interface AssetDetailsPanelProps {
  asset: Asset;
  onClose: () => void;
}

export const AssetDetailsPanel: React.FC<AssetDetailsPanelProps> = ({ asset, onClose }) => {
  const [showScheduleMaintenance, setShowScheduleMaintenance] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedHours: ''
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScheduleMaintenance = () => {
    console.log('Scheduling maintenance for asset:', asset.id);
    console.log('Maintenance data:', maintenanceData);
    // Here you would typically send this to your backend
    setShowScheduleMaintenance(false);
    setMaintenanceData({
      title: '',
      description: '',
      scheduledDate: '',
      priority: 'medium',
      estimatedHours: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{asset.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Asset Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Type</label>
              <p className="text-sm capitalize">{asset.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Condition</label>
              <Badge className={getConditionColor(asset.condition)}>
                {asset.condition}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p className="text-sm flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {asset.area}, {asset.city}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Installation Date</label>
              <p className="text-sm">{asset.installation_date || 'N/A'}</p>
            </div>
          </div>

          {/* Maintenance Info */}
          <div className="border-t pt-4">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Wrench className="h-4 w-4" />
              Maintenance Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Last Maintenance</label>
                <p className="text-sm">{asset.last_maintenance_date || 'Never'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Next Maintenance</label>
                <p className="text-sm">{asset.next_maintenance_date || 'Not scheduled'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Maintenance Cycle</label>
                <p className="text-sm">{asset.maintenance_cycle_months ? `${asset.maintenance_cycle_months} months` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {asset.specifications && (
            <div className="border-t pt-4">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Info className="h-4 w-4" />
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(asset.specifications).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace('_', ' ')}
                    </label>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t pt-4 flex gap-3">
            <Button 
              onClick={() => setShowScheduleMaintenance(!showScheduleMaintenance)}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule Maintenance
            </Button>
          </div>

          {/* Schedule Maintenance Form */}
          {showScheduleMaintenance && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Schedule Maintenance Task</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    value={maintenanceData.title}
                    onChange={(e) => setMaintenanceData({...maintenanceData, title: e.target.value})}
                    placeholder="Enter maintenance task title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Scheduled Date</label>
                  <Input
                    type="date"
                    value={maintenanceData.scheduledDate}
                    onChange={(e) => setMaintenanceData({...maintenanceData, scheduledDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select 
                    value={maintenanceData.priority} 
                    onValueChange={(value) => setMaintenanceData({...maintenanceData, priority: value as 'low' | 'medium' | 'high'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Estimated Hours</label>
                  <Input
                    type="number"
                    value={maintenanceData.estimatedHours}
                    onChange={(e) => setMaintenanceData({...maintenanceData, estimatedHours: e.target.value})}
                    placeholder="Hours"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={maintenanceData.description}
                    onChange={(e) => setMaintenanceData({...maintenanceData, description: e.target.value})}
                    placeholder="Describe the maintenance task..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleScheduleMaintenance}>
                  Schedule Task
                </Button>
                <Button variant="outline" onClick={() => setShowScheduleMaintenance(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
