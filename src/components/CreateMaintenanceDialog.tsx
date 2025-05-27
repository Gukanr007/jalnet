
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { simulatedAssets } from '@/data/simulatedNetwork';

interface CreateMaintenanceDialogProps {
  onTaskCreated?: () => void;
}

export const CreateMaintenanceDialog = ({ onTaskCreated }: CreateMaintenanceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assetId: '',
    taskType: '',
    priority: 'medium',
    assignedTo: '',
    estimatedHours: '',
    scheduledDate: undefined as Date | undefined
  });

  const workers = [
    { id: 'worker-001', name: 'John Doe', area: 'Muthialpet' },
    { id: 'worker-002', name: 'Jane Smith', area: 'White Town' },
    { id: 'worker-003', name: 'Mike Johnson', area: 'Lawspet' }
  ];

  const taskTypes = [
    'Routine Inspection',
    'Pump Maintenance',
    'Tank Cleaning',
    'Valve Repair',
    'Pipe Replacement',
    'Filter Change',
    'Meter Reading',
    'Emergency Repair'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.assetId || !formData.taskType) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Creating maintenance task:', formData);
    
    // Simulate task creation
    toast.success(`Maintenance task "${formData.title}" created successfully`);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      assetId: '',
      taskType: '',
      priority: 'medium',
      assignedTo: '',
      estimatedHours: '',
      scheduledDate: undefined
    });
    
    setOpen(false);
    onTaskCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Maintenance Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Quarterly pump inspection"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskType">Task Type *</Label>
              <Select value={formData.taskType} onValueChange={(value) => setFormData(prev => ({ ...prev, taskType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset">Asset *</Label>
            <Select value={formData.assetId} onValueChange={(value) => setFormData(prev => ({ ...prev, assetId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {simulatedAssets.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} - {asset.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the maintenance task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map(worker => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name} ({worker.area})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                placeholder="e.g., 2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Scheduled Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.scheduledDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, scheduledDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
