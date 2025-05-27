import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, Wrench, Package, TrendingUp, Plus, Eye, Settings, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface WorkerTask {
  id: string;
  asset_id: string;
  title: string;
  task_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface RestockTask {
  id: string;
  itemName: string;
  location: string;
  requestedQuantity: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  description: string;
}

export const WorkerDashboard = () => {
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<WorkerTask[]>([
    {
      id: 'task-002',
      asset_id: 'pump-001',
      title: 'Pump-001 Maintenance',
      task_type: 'Pump Maintenance',
      priority: 'medium',
      status: 'in_progress',
      scheduled_date: '2024-01-30',
      description: 'Routine pump maintenance and filter replacement',
      created_at: '2024-01-18',
      updated_at: '2024-01-22'
    },
    {
      id: 'task-003',
      asset_id: 'tap-001',
      title: 'Bharathi House Tap Inspection',
      task_type: 'Tap Inspection',
      priority: 'low',
      status: 'pending',
      scheduled_date: '2024-02-05',
      description: 'Monthly tap inspection and flow rate check',
      created_at: '2024-01-20',
      updated_at: '2024-01-20'
    }
  ]);

  const [restockTasks, setRestockTasks] = useState<RestockTask[]>([
    {
      id: 'restock-001',
      itemName: 'Filter Cartridges',
      location: 'Main Warehouse - Muthialpet',
      requestedQuantity: 20,
      priority: 'critical',
      status: 'assigned',
      dueDate: '2024-01-28',
      description: 'Critical stock level - immediate restocking required'
    },
    {
      id: 'restock-002',
      itemName: 'Valve Components',
      location: 'Main Warehouse - Muthialpet',
      requestedQuantity: 10,
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-02-02',
      description: 'Stock running low - schedule restocking'
    }
  ]);

  const handleStartTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'in_progress' as const, updated_at: new Date().toISOString().split('T')[0] }
        : task
    ));
    toast.success('Task started successfully');
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const, updated_at: new Date().toISOString().split('T')[0] }
        : task
    ));
    toast.success('Task completed successfully');
  };

  const handleStartRestock = (taskId: string) => {
    setRestockTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'assigned' as const }
        : task
    ));
    toast.success('Restock task started');
  };

  const handleCompleteRestock = (taskId: string) => {
    setRestockTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ));
    toast.success('Restock task completed');
  };

  const handleViewTaskDetails = (taskId: string) => {
    console.log(`Viewing details for task ${taskId}`);
    toast.info('Opening task details...');
  };

  const handleLogAssetReplacement = () => {
    console.log('Logging asset replacement');
    toast.success('Asset replacement logged successfully');
  };

  const handleTakePhoto = (taskId: string) => {
    console.log(`Taking photo for task ${taskId}`);
    toast.info('Opening camera for task documentation...');
  };

  const handleAddNotes = (taskId: string) => {
    console.log(`Adding notes for task ${taskId}`);
    toast.info('Opening notes editor...');
  };

  const handleRequestHelp = (taskId: string) => {
    console.log(`Requesting help for task ${taskId}`);
    toast.success('Help request sent to supervisor');
  };

  const handleNavigateToLocation = (taskId: string) => {
    console.log(`Navigating to task location ${taskId}`);
    navigate('/map');
  };

  const totalTasks = tasks.length + restockTasks.length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length + 
                         restockTasks.filter(t => t.status === 'assigned').length;
  const completedToday = tasks.filter(t => t.status === 'completed' && t.updated_at === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="p-2 sm:p-4 space-y-3 sm:space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">Worker Dashboard</h1>
        <p className="text-xs sm:text-base text-gray-600">Assigned Area: Muthialpet • Pondicherry</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-1 sm:gap-4">
        <Card className="p-2">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1">
              <Wrench className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-sm sm:text-xl font-bold text-gray-900">{totalTasks}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Total</p>
          </div>
        </Card>

        <Card className="p-2">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-5 sm:w-5 text-orange-600" />
              <span className="text-sm sm:text-xl font-bold text-orange-600">{inProgressTasks}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Active</p>
          </div>
        </Card>

        <Card className="p-2">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 sm:h-5 sm:w-5 text-purple-600" />
              <span className="text-sm sm:text-xl font-bold text-purple-600">{restockTasks.length}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Inventory</p>
          </div>
        </Card>

        <Card className="p-2">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-sm sm:text-xl font-bold text-green-600">{completedToday}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Done</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Maintenance Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Wrench className="h-4 w-4" />
              <span>Maintenance Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="p-2 sm:p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-xs sm:text-sm">{task.title}</h3>
                  <Badge variant={
                    task.status === 'completed' ? 'default' :
                    task.status === 'in_progress' ? 'default' : 'outline'
                  } className="text-xs">
                    {task.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 font-medium">{task.task_type}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Due: {task.scheduled_date || 'Not scheduled'}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {task.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStartTask(task.id)}
                      className="text-xs h-6 px-2"
                    >
                      Start
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleCompleteTask(task.id)}
                        className="text-xs h-6 px-2"
                      >
                        Complete
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTakePhoto(task.id)}
                        className="text-xs h-6 px-2"
                      >
                        Photo
                      </Button>
                    </>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewTaskDetails(task.id)}
                    className="text-xs h-6 px-2"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleNavigateToLocation(task.id)}
                    className="text-xs h-6 px-2"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Go
                  </Button>
                </div>
                {task.status === 'in_progress' && (
                  <div className="flex gap-1 pt-1 border-t">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAddNotes(task.id)}
                      className="text-xs h-6 flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Notes
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRequestHelp(task.id)}
                      className="text-xs h-6 flex-1"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Help
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Inventory Restock Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Package className="h-4 w-4" />
              <span>Inventory Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {restockTasks.map(task => (
              <div key={task.id} className="p-2 sm:p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-xs sm:text-sm">{task.itemName}</h3>
                  <Badge variant={task.priority === 'critical' ? 'destructive' : 'default'} className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">Qty: {task.requestedQuantity} units</p>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Due: {task.dueDate}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {task.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStartRestock(task.id)}
                      className="text-xs h-6 px-2"
                    >
                      Start
                    </Button>
                  )}
                  {task.status === 'assigned' && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleCompleteRestock(task.id)}
                        className="text-xs h-6 px-2"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTakePhoto(task.id)}
                        className="text-xs h-6 px-2"
                      >
                        Photo
                      </Button>
                    </>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleNavigateToLocation(task.id)}
                    className="text-xs h-6 px-2"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Go
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Map Access */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <MapPin className="h-4 w-4" />
              <span>Task Locations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium text-sm">Task Navigation</p>
                <p className="text-xs text-gray-500">Routes & Locations</p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/map')}
                  className="w-full flex items-center gap-2 h-8"
                  size="sm"
                >
                  <MapPin className="h-3 w-3" />
                  Open Map
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Downloading offline maps...')}
                  className="w-full flex items-center gap-2 h-8"
                  size="sm"
                >
                  <Package className="h-3 w-3" />
                  Offline Maps
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Update Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <TrendingUp className="h-4 w-4" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium text-sm">Asset Management</p>
                <p className="text-xs text-gray-500">Log replacements & updates</p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={handleLogAssetReplacement}
                  className="w-full flex items-center gap-2 h-8"
                  size="sm"
                >
                  <Plus className="h-3 w-3" />
                  Log Replacement
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/inventory')}
                  className="w-full flex items-center gap-2 h-8"
                  size="sm"
                >
                  <Package className="h-3 w-3" />
                  View Inventory
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Generating work report...')}
                  className="w-full flex items-center gap-2 h-8"
                  size="sm"
                >
                  <Settings className="h-3 w-3" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
