
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'worker';
  employee_id?: string;
  phone?: string;
  assigned_city: string;
  assigned_area: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  zoom_level: number;
  created_at: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'pipe' | 'pump' | 'tap' | 'valve' | 'meter' | 'tank';
  condition: 'good' | 'average' | 'poor' | 'critical';
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  installation_date?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  maintenance_cycle_months?: number;
  specifications?: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Add water connection and bill info for tap assets
  water_connection?: WaterConnection;
  current_bill?: WaterBill;
}

export interface WaterConnection {
  id: string;
  water_id: string;
  household_name: string;
  tap_asset_id?: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  connection_date: string;
  is_active: boolean;
  monthly_rate: number;
  created_at: string;
  updated_at: string;
}

export interface WaterBill {
  id: string;
  water_connection_id: string;
  water_id: string;
  bill_month: number;
  bill_year: number;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue';
  late_fee: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  bill_id: string;
  water_id: string;
  amount: number;
  payment_method: 'upi' | 'card' | 'net_banking' | 'cash';
  transaction_id: string;
  payment_date: string;
  status: string;
  created_at: string;
}

export interface MaintenanceTask {
  id: string;
  asset_id: string;
  title: string;
  description?: string;
  task_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  assigned_by?: string;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  estimated_hours?: number;
  actual_hours?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  minimum_stock: number;
  cost_per_unit?: number;
  supplier?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryStock {
  id: string;
  item_id: string;
  city: string;
  area: string;
  current_stock: number;
  last_restocked_date?: string;
  last_restocked_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RestockTask {
  id: string;
  item_id: string;
  city: string;
  area: string;
  requested_quantity: number;
  assigned_to?: string;
  assigned_by?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface IssueReport {
  id: string;
  reporter_name: string;
  reporter_phone?: string;
  issue_type: 'leakage' | 'broken_pipe' | 'no_water' | 'low_pressure' | 'contamination' | 'other';
  description: string;
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  status: 'reported' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

// Network connection interface for pipeline visualization
export interface NetworkConnection {
  from: string;
  to: string;
  type: 'main' | 'secondary' | 'service';
  condition?: 'good' | 'average' | 'poor' | 'critical';
}

// Area boundary interface for map navigation
export interface AreaBoundary {
  center: { lat: number; lng: number };
  zoom: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}
