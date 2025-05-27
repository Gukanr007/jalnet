
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react';
import { toast } from 'sonner';

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
  currentAssignee?: string;
}

export const AssignTaskDialog = ({ open, onOpenChange, taskId, taskTitle, currentAssignee }: AssignTaskDialogProps) => {
  const [selectedWorker, setSelectedWorker] = useState(currentAssignee || '');
  const [notes, setNotes] = useState('');

  const workers = [
    { id: 'worker-001', name: 'John Doe', area: 'Muthialpet', status: 'Available' },
    { id: 'worker-002', name: 'Jane Smith', area: 'White Town', status: 'Busy' },
    { id: 'worker-003', name: 'Mike Johnson', area: 'Lawspet', status: 'Available' },
    { id: 'worker-004', name: 'Sarah Wilson', area: 'Muthialpet', status: 'Available' }
  ];

  const handleAssign = () => {
    if (!selectedWorker) {
      toast.error('Please select a worker');
      return;
    }

    const worker = workers.find(w => w.id === selectedWorker);
    console.log(`Assigning task ${taskId} to worker ${selectedWorker}`, { notes });
    
    toast.success(`Task "${taskTitle}" assigned to ${worker?.name}`);
    onOpenChange(false);
    setSelectedWorker('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Assign Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Task</Label>
            <p className="text-sm text-gray-600 mt-1">{taskTitle}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="worker">Assign to Worker</Label>
            <Select value={selectedWorker} onValueChange={setSelectedWorker}>
              <SelectTrigger>
                <SelectValue placeholder="Select worker" />
              </SelectTrigger>
              <SelectContent>
                {workers.map(worker => (
                  <SelectItem key={worker.id} value={worker.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{worker.name} ({worker.area})</span>
                      <span className={`text-xs px-2 py-1 rounded ml-2 ${
                        worker.status === 'Available' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {worker.status}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Assignment Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions or notes for the worker..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              Assign Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
