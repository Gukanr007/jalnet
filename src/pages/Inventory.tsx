import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CreateInventoryDialog } from '@/components/CreateInventoryDialog';
import { AssignTaskDialog } from '@/components/AssignTaskDialog';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  MapPin,
  User,
  ArrowLeft,
  Plus,
  Settings,
  FileText,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';

const Inventory = () => {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);

  const inventoryLocations = [
    { 
      id: 'loc-001', 
      name: 'Main Warehouse - Muthialpet', 
      area: 'Muthialpet',
      totalItems: 5,
      lowStockItems: 2,
      criticalItems: 1
    },
    { 
      id: 'loc-002', 
      name: 'Storage - White Town', 
      area: 'White Town',
      totalItems: 4,
      lowStockItems: 1,
      criticalItems: 0
    },
    { 
      id: 'loc-003', 
      name: 'Field Station - Lawspet', 
      area: 'Lawspet',
      totalItems: 3,
      lowStockItems: 0,
      criticalItems: 0
    }
  ];

  const inventoryItems = [
    { id: 'inv-001', name: 'Water Pumps', quantity: 12, minStock: 5, status: 'good', location: 'Main Warehouse - Muthialpet' },
    { id: 'inv-002', name: 'Pipe Sections (5m)', quantity: 45, minStock: 20, status: 'good', location: 'Main Warehouse - Muthialpet' },
    { id: 'inv-003', name: 'Valve Components', quantity: 8, minStock: 10, status: 'low', location: 'Main Warehouse - Muthialpet' },
    { id: 'inv-004', name: 'Filter Cartridges', quantity: 3, minStock: 15, status: 'critical', location: 'Main Warehouse - Muthialpet' },
    { id: 'inv-005', name: 'Pressure Gauges', quantity: 18, minStock: 8, status: 'good', location: 'Storage - White Town' },
    { id: 'inv-006', name: 'Pipe Fittings', quantity: 25, minStock: 12, status: 'good', location: 'Storage - White Town' },
    { id: 'inv-007', name: 'Meters', quantity: 7, minStock: 10, status: 'low', location: 'Storage - White Town' },
    { id: 'inv-008', name: 'Tools & Equipment', quantity: 15, minStock: 5, status: 'good', location: 'Field Station - Lawspet' },
    { id: 'inv-009', name: 'Safety Gear', quantity: 20, minStock: 8, status: 'good', location: 'Field Station - Lawspet' }
  ];

  const handleViewLocationInventory = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleAssignRestock = (itemId: string, itemName: string) => {
    setSelectedTask({
      id: itemId,
      title: `Restock: ${itemName}`
    });
    setAssignDialogOpen(true);
  };

  const handleUpdateStock = (itemId: string, itemName: string) => {
    console.log(`Opening stock update dialog for ${itemName}`);
    toast.info(`Opening stock update form for ${itemName}...`);
  };

  const handleViewItemHistory = (itemId: string, itemName: string) => {
    console.log(`Viewing history for ${itemName}`);
    toast.info(`Loading item history for ${itemName}...`);
  };

  const handleGenerateReport = (locationType: 'all' | 'location', locationId?: string) => {
    const reportType = locationType === 'all' ? 'All Locations' : 'Location Specific';
    console.log(`Generating inventory report for: ${reportType}`);
    toast.success(`Generating ${reportType} inventory report...`);
  };

  const handleRequestDelivery = (itemId: string, itemName: string) => {
    console.log(`Requesting delivery for ${itemName}`);
    toast.success(`Delivery request created for ${itemName}`);
  };

  const handleQuickRestock = (itemId: string, itemName: string) => {
    console.log(`Quick restock for ${itemName}`);
    toast.success(`Quick restock order placed for ${itemName}`);
  };

  const getLocationItems = (locationName: string) => {
    return inventoryItems.filter(item => item.location === locationName);
  };

  const selectedLocationData = selectedLocation 
    ? inventoryLocations.find(loc => loc.id === selectedLocation)
    : null;

  const totalLocations = inventoryLocations.length;
  const totalLowStock = inventoryLocations.reduce((sum, loc) => sum + loc.lowStockItems, 0);
  const totalCritical = inventoryLocations.reduce((sum, loc) => sum + loc.criticalItems, 0);
  const totalItems = inventoryLocations.reduce((sum, loc) => sum + loc.totalItems, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Breadcrumb />
      <main className="pb-safe">
        <div className="p-2 sm:p-3 lg:p-4 space-y-3 lg:space-y-4 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div className="space-y-0.5 sm:space-y-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {selectedLocationData ? selectedLocationData.name : 'Inventory Management'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {selectedLocationData ? 'Manage location inventory' : 'Track supplies across all locations'}
              </p>
            </div>
            <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
              {selectedLocation && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                  className="flex items-center gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  Back
                </Button>
              )}
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleGenerateReport(selectedLocation ? 'location' : 'all', selectedLocation || undefined)}
                className="flex items-center gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                Report
              </Button>
              {user?.role === 'admin' && (
                <CreateInventoryDialog onItemCreated={() => toast.success('Item added successfully')} />
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <Card className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                    {selectedLocationData ? selectedLocationData.totalItems : totalLocations}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-600">
                  {selectedLocationData ? 'Total Items' : 'Locations'}
                </p>
              </div>
            </Card>

            <Card className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600">
                    {selectedLocationData ? selectedLocationData.totalItems - selectedLocationData.lowStockItems - selectedLocationData.criticalItems : totalItems}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-600">
                  {selectedLocationData ? 'Good Stock' : 'Total Items'}
                </p>
              </div>
            </Card>

            <Card className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-orange-600">
                    {selectedLocationData ? selectedLocationData.lowStockItems : totalLowStock}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-600">Low Stock</p>
              </div>
            </Card>

            <Card className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-red-600">
                    {selectedLocationData ? selectedLocationData.criticalItems : totalCritical}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-600">Critical</p>
              </div>
            </Card>
          </div>

          {!selectedLocation ? (
            // Inventory Locations View
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {inventoryLocations.map(location => (
                <Card 
                  key={location.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewLocationInventory(location.id)}
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="flex items-center space-x-2 text-sm lg:text-base">
                      <Package className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span className="truncate">{location.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Total Items:</span>
                        <span className="text-xs sm:text-sm font-medium">{location.totalItems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Low Stock:</span>
                        <span className="text-xs sm:text-sm font-medium text-orange-600">{location.lowStockItems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Critical:</span>
                        <span className="text-xs sm:text-sm font-medium text-red-600">{location.criticalItems}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-3">
                      <Button className="flex-1" variant="outline" size="sm">
                        View Inventory
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport('location', location.id);
                        }}
                        className="px-2"
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Specific Location Inventory View - Enhanced UI
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-base lg:text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Inventory Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid gap-4 sm:gap-6">
                  {getLocationItems(selectedLocationData?.name || '').map(item => (
                    <div key={item.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                      {/* Status indicator bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1 ${
                        item.status === 'critical' ? 'bg-red-500' :
                        item.status === 'low' ? 'bg-orange-400' :
                        'bg-green-500'
                      }`} />
                      
                      <div className="p-4 sm:p-5">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                item.status === 'critical' ? 'bg-red-100' :
                                item.status === 'low' ? 'bg-orange-100' :
                                'bg-green-100'
                              }`}>
                                {item.status === 'good' && <TrendingUp className="h-5 w-5 text-green-600" />}
                                {item.status === 'low' && <TrendingDown className="h-5 w-5 text-orange-600" />}
                                {item.status === 'critical' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 truncate">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Current Stock: <span className="font-medium text-gray-900">{item.quantity} units</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                  Minimum Required: {item.minStock} units
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-start">
                            <Badge 
                              variant={
                                item.status === 'critical' ? 'destructive' : 
                                item.status === 'low' ? 'default' : 
                                'outline'
                              }
                              className={`text-xs font-medium ${
                                item.status === 'good' ? 'bg-green-100 text-green-700 border-green-200' : ''
                              }`}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)} Stock
                            </Badge>
                          </div>
                        </div>

                        {/* Stock Level Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Stock Level</span>
                            <span>{Math.round((item.quantity / (item.minStock * 2)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                item.status === 'critical' ? 'bg-red-500' :
                                item.status === 'low' ? 'bg-orange-400' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(Math.max((item.quantity / (item.minStock * 2)) * 100, 5), 100)}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {/* Primary Actions */}
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateStock(item.id, item.name)}
                              className="flex items-center gap-1.5 text-xs h-8 flex-1 sm:flex-none"
                            >
                              <Settings className="h-3 w-3" />
                              Update Stock
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewItemHistory(item.id, item.name)}
                              className="flex items-center gap-1.5 text-xs h-8 flex-1 sm:flex-none"
                            >
                              <FileText className="h-3 w-3" />
                              History
                            </Button>

                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRequestDelivery(item.id, item.name)}
                              className="flex items-center gap-1.5 text-xs h-8 flex-1 sm:flex-none"
                            >
                              <Truck className="h-3 w-3" />
                              Request Delivery
                            </Button>
                          </div>

                          {/* Conditional Actions for Low/Critical Stock */}
                          {(item.status === 'critical' || item.status === 'low') && (
                            <div className="flex flex-wrap gap-2 w-full border-t pt-3 mt-1">
                              <Button 
                                size="sm"
                                onClick={() => handleQuickRestock(item.id, item.name)}
                                className="flex items-center gap-1.5 text-xs h-8 flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-3 w-3" />
                                Quick Restock
                              </Button>
                              
                              {user?.role === 'admin' && (
                                <Button 
                                  size="sm" 
                                  variant={item.status === 'critical' ? 'destructive' : 'default'}
                                  onClick={() => handleAssignRestock(item.id, item.name)}
                                  className="flex items-center gap-1.5 text-xs h-8 flex-1 sm:flex-none"
                                >
                                  <User className="h-3 w-3" />
                                  Assign Task
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignment Dialog */}
          {selectedTask && (
            <AssignTaskDialog
              open={assignDialogOpen}
              onOpenChange={setAssignDialogOpen}
              taskId={selectedTask.id}
              taskTitle={selectedTask.title}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Inventory;
