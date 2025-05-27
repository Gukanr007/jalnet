import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { simulatedAssets } from '@/data/simulatedNetwork';
import { Asset, MaintenanceTask, IssueReport } from '@/types';
import { 
  Users, 
  Wrench, 
  AlertTriangle, 
  MapPin, 
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Calendar,
  ArrowRight,
  User,
  Settings,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateMaintenanceDialog } from './CreateMaintenanceDialog';
import { CreateInventoryDialog } from './CreateInventoryDialog';
import { AssignTaskDialog } from './AssignTaskDialog';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string; assignee?: string } | null>(null);

  // Mock data for dashboard
  const stats = {
    totalWorkers: 8,
    activeIssues: 3,
    pendingTasks: 12,
    assetsGood: simulatedAssets.filter(a => a.condition === 'good').length,
    assetsNeedAttention: simulatedAssets.filter(a => a.condition !== 'good').length,
    completedTasksToday: 5
  };

  // Mock inventory data with locations
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
    { id: 'inv-005', name: 'Pressure Gauges', quantity: 18, minStock: 8, status: 'good', location: 'Storage - White Town' }
  ];

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Mock maintenance data
  const upcomingMaintenance = [
    {
      id: 'maint-001',
      assetId: 'tank-001',
      assetName: 'Tank-001',
      type: 'Quarterly Inspection',
      scheduledDate: '2024-02-01',
      priority: 'medium' as const,
      area: 'Muthialpet'
    },
    {
      id: 'maint-002',
      assetId: 'pump-002',
      assetName: 'Pump-002',
      type: 'Monthly Check',
      scheduledDate: '2024-01-28',
      priority: 'high' as const,
      area: 'White Town'
    }
  ];

  const overdueMaintenance = [
    {
      id: 'maint-003',
      assetId: 'valve-001',
      assetName: 'Valve-001',
      type: 'Valve Inspection',
      scheduledDate: '2024-01-20',
      priority: 'critical' as const,
      area: 'Lawspet',
      daysOverdue: 5
    }
  ];

  const recentIssues: IssueReport[] = [
    {
      id: 'issue-001',
      reporter_name: 'Ravi Kumar',
      reporter_phone: '+91 9876543210',
      issue_type: 'leakage',
      description: 'Water leakage near the main valve on Gandhi Street',
      latitude: 11.9425,
      longitude: 79.8088,
      city: 'Pondicherry',
      area: 'Muthialpet',
      status: 'assigned',
      priority: 'high',
      assigned_to: 'worker-001',
      created_at: '2024-01-25T09:30:00Z',
      updated_at: '2024-01-25T10:15:00Z'
    },
    {
      id: 'issue-002',
      reporter_name: 'Priya Sharma',
      issue_type: 'no_water',
      description: 'No water supply since yesterday evening',
      latitude: 11.9380,
      longitude: 79.8155,
      city: 'Pondicherry',
      area: 'Lawspet',
      status: 'in_progress',
      priority: 'critical',
      assigned_to: 'worker-002',
      created_at: '2024-01-25T08:45:00Z',
      updated_at: '2024-01-25T11:00:00Z'
    }
  ];

  const MaintenanceTasks: MaintenanceTask[] = [
    {
      id: 'task-001',
      asset_id: 'tank-001',
      title: 'Tank-001 Quarterly Inspection',
      task_type: 'Tank Maintenance',
      priority: 'medium',
      status: 'pending',
      scheduled_date: '2024-02-01',
      description: 'Quarterly tank inspection and cleaning',
      assigned_to: 'worker-003',
      created_at: '2024-01-20',
      updated_at: '2024-01-20'
    },
    {
      id: 'task-002',
      asset_id: 'pump-001',
      title: 'Pump-001 Maintenance',
      task_type: 'Pump Maintenance',
      priority: 'high',
      status: 'in_progress',
      scheduled_date: '2024-01-30',
      description: 'Routine pump maintenance and filter replacement',
      assigned_to: 'worker-001',
      created_at: '2024-01-18',
      updated_at: '2024-01-25'
    }
  ];

  const handleAssignIssue = (issueId: string) => {
    console.log(`Opening assignment dialog for issue ${issueId}`);
    const issue = recentIssues.find(i => i.id === issueId);
    if (issue) {
      setSelectedTask({
        id: issueId,
        title: `Issue: ${issue.description}`,
        assignee: issue.assigned_to
      });
      setAssignDialogOpen(true);
    }
  };

  const handleAssignMaintenance = (taskId: string) => {
    console.log(`Opening assignment dialog for maintenance task ${taskId}`);
    const task = MaintenanceTasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask({
        id: taskId,
        title: task.title,
        assignee: task.assigned_to
      });
      setAssignDialogOpen(true);
    }
  };

  const handleViewDetails = (id: string, type: 'task' | 'issue') => {
    console.log(`Viewing ${type} details for ${id}`);
    toast.info(`Opening ${type} details...`);
  };

  const handleMarkUrgent = (taskId: string) => {
    console.log(`Marking task ${taskId} as urgent`);
    toast.success('Task marked as urgent and escalated');
  };

  const handleViewReport = (taskId: string) => {
    console.log(`Viewing report for task ${taskId}`);
    toast.info('Opening task completion report...');
  };

  const handleRestockItem = (itemId: string) => {
    console.log(`Creating restock task for item ${itemId}`);
    toast.success('Restock task created and assigned to field team');
  };

  const handleQuickAction = (action: string) => {
    console.log(`Executing quick action: ${action}`);
    switch (action) {
      case 'schedule':
        toast.info('Opening maintenance scheduler...');
        break;
      case 'inventory':
        navigate('/inventory');
        break;
      case 'map':
        navigate('/map');
        break;
      case 'workers':
        toast.info('Opening worker management...');
        break;
    }
  };

  return (
    <div className="p-3 sm:p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Water Management System - Pondicherry Region</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <Card className="p-2 sm:p-3">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">{stats.totalWorkers}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Active Workers</p>
          </div>
        </Card>

        <Card className="p-2 sm:p-3">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              <span className="text-lg sm:text-xl font-bold text-red-600">{stats.activeIssues}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Active Issues</p>
          </div>
        </Card>

        <Card className="p-2 sm:p-3">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              <span className="text-lg sm:text-xl font-bold text-orange-600">{stats.pendingTasks}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Tasks</p>
          </div>
        </Card>

        <Card className="p-2 sm:p-3">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-lg sm:text-xl font-bold text-green-600">{stats.assetsGood}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Assets Good</p>
          </div>
        </Card>

        <Card className="p-2 sm:p-3">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              <span className="text-lg sm:text-xl font-bold text-yellow-600">{stats.assetsNeedAttention}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Need Attention</p>
          </div>
        </Card>

        <Card className="p-2 sm:p-3">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span className="text-lg sm:text-xl font-bold text-purple-600">{stats.completedTasksToday}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Today Completed</p>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Issues */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Recent Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentIssues.map(issue => (
                  <div key={issue.id} className="p-3 bg-gray-50 rounded-lg border space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{issue.reporter_name}</h3>
                      <Badge variant={issue.priority === 'critical' ? 'destructive' : 'default'} className="text-xs">
                        {issue.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{issue.description}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-500">{issue.area}</span>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">{issue.status}</Badge>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleViewDetails(issue.id, 'issue')}>
                          Details
                        </Button>
                        <Button size="sm" className="h-7 text-xs" onClick={() => handleAssignIssue(issue.id)}>
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Network Map Access */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  <span>Network Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border">
                    <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">Interactive Network Map</p>
                    <p className="text-sm text-gray-500">View all assets, connections & analytics</p>
                  </div>
                  <Button onClick={() => navigate('/map')} className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Open Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-xl font-semibold">Maintenance Overview</h2>
            <div className="flex gap-2">
              <CreateMaintenanceDialog onTaskCreated={() => toast.success('Task created successfully')} />
              <Button onClick={() => navigate('/maintenance')} variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-1" />
                View All
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Upcoming Maintenance */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Upcoming Maintenance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingMaintenance.slice(0, 3).map(maintenance => (
                  <div key={maintenance.id} className="p-3 bg-blue-50 rounded-lg border space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{maintenance.assetName}</h3>
                        <p className="text-xs text-gray-600">{maintenance.type}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{maintenance.priority}</Badge>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-gray-500">
                        Due: {maintenance.scheduledDate} • {maintenance.area}
                      </span>
                      <Button size="sm" className="h-7 text-xs" onClick={() => handleAssignMaintenance(maintenance.id)}>
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-3" onClick={() => navigate('/maintenance')}>
                  View All Maintenance
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-10" onClick={() => handleQuickAction('schedule')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline" className="w-full justify-start h-10" onClick={() => handleQuickAction('inventory')}>
                  <Package className="h-4 w-4 mr-2" />
                  Manage Inventory
                </Button>
                <Button variant="outline" className="w-full justify-start h-10" onClick={() => handleQuickAction('map')}>
                  <MapPin className="h-4 w-4 mr-2" />
                  View Network Map
                </Button>
                <Button variant="outline" className="w-full justify-start h-10" onClick={() => handleQuickAction('workers')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Workers
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-xl font-semibold">Inventory Overview</h2>
            <div className="flex gap-2">
              <CreateInventoryDialog onItemCreated={() => toast.success('Item added successfully')} />
              <Button onClick={() => navigate('/inventory')} variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-1" />
                View All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Critical Stock Items */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Items Needing Attention</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inventoryItems.filter(item => item.status !== 'good').map(item => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg border space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-600">Stock: {item.quantity} / Min: {item.minStock}</p>
                      </div>
                      <Badge variant={item.status === 'critical' ? 'destructive' : 'default'} className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{item.location}</p>
                    <Button 
                      size="sm"
                      variant={item.status === 'critical' ? 'destructive' : 'default'}
                      className="w-full h-7 text-xs mt-2"
                      onClick={() => handleRestockItem(item.id)}
                    >
                      Create Restock Task
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-3" onClick={() => navigate('/inventory')}>
                  View All Inventory
                </Button>
              </CardContent>
            </Card>

            {/* Inventory Stats */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Inventory Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg border">
                    <p className="text-2xl font-bold text-green-600">2</p>
                    <p className="text-xs text-gray-600">Good Stock</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border">
                    <p className="text-2xl font-bold text-orange-600">1</p>
                    <p className="text-xs text-gray-600">Low Stock</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border">
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-xs text-gray-600">Critical</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/inventory')}>
                    Manage All Locations
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => toast.info('Generating inventory report...')}>
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-xl font-semibold">Issue Management</h2>
            <Button onClick={() => toast.info('Opening issue reporting form...')} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Report Issue
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Active Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentIssues.map(issue => (
                <div key={issue.id} className="p-4 bg-gray-50 rounded-lg border space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{issue.reporter_name}</h3>
                      <p className="text-xs text-gray-600 capitalize">{issue.issue_type.replace('_', ' ')}</p>
                    </div>
                    <Badge variant={issue.priority === 'critical' ? 'destructive' : 'default'} className="text-xs">
                      {issue.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{issue.description}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-xs text-gray-500">{issue.area}, {issue.city}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">{issue.status}</Badge>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleViewDetails(issue.id, 'issue')}>
                        Details
                      </Button>
                      <Button size="sm" className="h-7 text-xs" onClick={() => handleAssignIssue(issue.id)}>
                        Assign Worker
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assignment Dialog */}
      {selectedTask && (
        <AssignTaskDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          taskId={selectedTask.id}
          taskTitle={selectedTask.title}
          currentAssignee={selectedTask.assignee}
        />
      )}
    </div>
  );
};
