
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CreateInventoryDialogProps {
  onItemCreated?: () => void;
}

export const CreateInventoryDialog = ({ onItemCreated }: CreateInventoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    currentStock: '',
    minStock: '',
    location: '',
    costPerUnit: '',
    supplier: ''
  });

  const categories = [
    'Pumps & Motors',
    'Pipes & Fittings',
    'Valves & Controls',
    'Filters & Cartridges',
    'Meters & Gauges',
    'Tools & Equipment',
    'Safety Gear',
    'Chemicals'
  ];

  const units = [
    'pieces',
    'meters',
    'liters',
    'kilograms',
    'sets',
    'boxes',
    'rolls'
  ];

  const locations = [
    'Main Warehouse - Muthialpet',
    'Storage - White Town',
    'Field Station - Lawspet'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.unit || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Creating inventory item:', formData);
    
    toast.success(`Inventory item "${formData.name}" created successfully`);
    
    setFormData({
      name: '',
      category: '',
      unit: '',
      currentStock: '',
      minStock: '',
      location: '',
      costPerUnit: '',
      supplier: ''
    });
    
    setOpen(false);
    onItemCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Water Pump Model XYZ"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData(prev => ({ ...prev, currentStock: e.target.value }))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stock</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPerUnit">Cost per Unit</Label>
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => setFormData(prev => ({ ...prev, costPerUnit: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              placeholder="Supplier name"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
