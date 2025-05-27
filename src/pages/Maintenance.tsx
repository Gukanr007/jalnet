import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CreateMaintenanceDialog } from '@/components/CreateMaintenanceDialog';
import { AssignTaskDialog } from '@/components/AssignTaskDialog';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Wrench,
  User,
  Eye,
  Clock,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

const Maintenance = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string; assignee?: string } | null>(null);

  const upcomingMaintenance = [
    {
      id: 'maint-001',
      assetId: 'tank-001',
      assetName: 'Tank-001',
      type: 'Quarterly Inspection',
      scheduledDate: '2024-02-01',
      priority: 'medium' as const,
      area: 'Muthialpet',
      assignedTo: 'John Doe'
    },
    {
      id: 'maint-002',
      assetId: 'pump-002',
      assetName: 'Pump-002',
      type: 'Monthly Check',
      scheduledDate: '2024-01-28',
      priority: 'high' as const,
      area: 'White Town',
      assignedTo: 'Jane Smith'
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
      daysOverdue: 5,
      assignedTo: 'Mike Johnson'
    }
  ];

  const completedMaintenance = [
    {
      id: 'maint-004',
      assetId: 'pump-001',
      assetName: 'Pump-001',
      type: 'Filter Replacement',
      completedDate: '2024-01-25',
      priority: 'medium' as const,
      area: 'Muthialpet',
      completedBy: 'John Doe'
    }
  ];

  const handleAssignMaintenance = (maintenanceId: string, title: string, currentAssignee?: string) => {
    setSelectedTask({
      id: maintenanceId,
      title: title,
      assignee: currentAssignee
    });
    setAssignDialogOpen(true);
  };

  const handleViewDetails = (taskId: string) => {
    console.log(`Viewing details for task ${taskId}`);
    toast.info('Opening task details...');
  };

  const handleMarkUrgent = (taskId: string) => {
    console.log(`Marking task ${taskId} as urgent`);
    toast.success('Task marked as urgent and escalated');
  };

  const handleViewReport = (taskId: string) => {
    console.log(`Viewing report for task ${taskId}`);
    toast.info('Opening completion report...');
  };

  const handleStartTask = (taskId: string) => {
    console.log(`Starting task ${taskId}`);
    toast.success('Task status updated to "In Progress"');
  };

  const handleCompleteTask = (taskId: string) => {
    console.log(`Completing task ${taskId}`);
    toast.success('Task marked as completed');
  };

  const stats = {
    upcoming: upcomingMaintenance.length,
    overdue: overdueMaintenance.length,
    completed: completedMaintenance.length,
    total: upcomingMaintenance.length + overdueMaintenance.length + completedMaintenance.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Breadcrumb />
      <main className="pb-safe">
        <div className="p-3 sm:p-4 space-y-4 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Maintenance Tasks</h1>
              <p className="text-xs sm:text-sm text-gray-600">Schedule and track maintenance activities</p>
            </div>
            <div className="flex gap-2">
              {user?.role === 'admin' && (
                <CreateMaintenanceDialog onTaskCreated={() => toast.success('Task created successfully')} />
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => toast.info('Generating maintenance report...')}
                className="flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                Reports
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Card className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1">
                  <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">{stats.total}</span>
                </div>
                <p className="text-xs font-medium text-gray-600">Total</p>
              </div>
            </Card>

            <Card className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600">{stats.upcoming}</span>
                </div>
                <p className="text-xs font-medium text-gray-600">Upcoming</p>
              </div>
            </Card>

            <Card className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-red-600">{stats.overdue}</span>
                </div>
                <p className="text-xs font-medium text-gray-600">Overdue</p>
              </div>
            </Card>

            <Card className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">{stats.completed}</span>
                </div>
                <p className="text-xs font-medium text-gray-600">Completed</p>
              </div>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-3">
            <TabsList className="grid w-full grid-cols-3 h-8 sm:h-10">
              <TabsTrigger value="upcoming" className="text-xs sm:text-sm">Upcoming</TabsTrigger>
              <TabsTrigger value="overdue" className="text-xs sm:text-sm">Overdue</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                    <span>Upcoming Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingMaintenance.map(maintenance => (
                    <div key={maintenance.id} className="p-2.5 sm:p-3 bg-green-50 rounded-lg space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm lg:text-base">{maintenance.assetName}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{maintenance.type}</p>
                          <p className="text-xs text-gray-500">Assigned: {maintenance.assignedTo}</p>
                        </div>
                        <Badge variant="outline" className="text-xs self-start">{maintenance.priority}</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Due: {maintenance.scheduledDate} • {maintenance.area}
                        </span>
                        <div className="flex gap-1.5 w-full sm:w-auto flex-wrap">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewDetails(maintenance.id)}
                            className="flex-1 sm:flex-none text-xs h-7 sm:h-8"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleStartTask(maintenance.id)}
                            className="flex-1 sm:flex-none text-xs h-7 sm:h-8"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                          {user?.role === 'admin' && (
                            <Button 
                              size="sm"
                              variant="secondary"
                              onClick={() => handleAssignMaintenance(maintenance.id, maintenance.assetName, maintenance.assignedTo)}
                              className="flex items-center gap-1 flex-1 sm:flex-none text-xs h-7 sm:h-8"
                            >
                              <User className="h-3 w-3" />
                              Reassign
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overdue" className="space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                    <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
                    <span>Overdue Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {overdueMaintenance.map(maintenance => (
                    <div key={maintenance.id} className="p-2.5 sm:p-3 bg-red-50 rounded-lg space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-red-700 text-sm lg:text-base">{maintenance.assetName}</h3>
                          <p className="text-xs sm:text-sm text-red-600">{maintenance.type}</p>
                          <p className="text-xs text-red-500">Assigned: {maintenance.assignedTo}</p>
                        </div>
                        <Badge variant="destructive" className="text-xs self-start">{maintenance.priority}</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span className="text-xs sm:text-sm text-red-500">
                          {maintenance.daysOverdue} days overdue • {maintenance.area}
                        </span>
                        <div className="flex gap-1.5 w-full sm:w-auto flex-wrap">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewDetails(maintenance.id)}
                            className="flex-1 sm:flex-none text-xs h-7 sm:h-8"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleMarkUrgent(maintenance.id)}
                            className="flex-1 sm:flex-none text-xs h-7 sm:h-8"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Urgent
                          </Button>
                          {user?.role === 'admin' && (
                            <Button 
                              size="sm"
                              onClick={() => handleAssignMaintenance(maintenance.id, maintenance.assetName, maintenance.assignedTo)}
                              className="flex-1 sm:flex-none text-xs h-7 sm:h-8"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Reassign
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                    <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                    <span>Completed Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completedMaintenance.map(maintenance => (
                    <div key={maintenance.id} className="p-2.5 sm:p-3 bg-blue-50 rounded-lg space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-blue-700 text-sm lg:text-base">{maintenance.assetName}</h3>
                          <p className="text-xs sm:text-sm text-blue-600">{maintenance.type}</p>
                          <p className="text-xs text-blue-500">Completed by: {maintenance.completedBy}</p>
                        </div>
                        <Badge variant="outline" className="text-xs self-start">{maintenance.priority}</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span className="text-xs sm:text-sm text-blue-500">
                          Completed: {maintenance.completedDate} • {maintenance.area}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewReport(maintenance.id)}
                          className="w-full sm:w-auto text-xs h-7 sm:h-8"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Report
                        </Button>
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
      </main>
    </div>
  );
};

export default Maintenance;
