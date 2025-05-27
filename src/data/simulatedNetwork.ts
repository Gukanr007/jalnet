
import { Asset } from '@/types';

// Simulated water network data with accurate Pondicherry coordinates
export const simulatedAssets: Asset[] = [
  // Water Tanks (Main sources) - Muthialpet area
  {
    id: 'tank-001',
    name: 'Muthialpet Main Tank',
    type: 'tank',
    condition: 'good',
    latitude: 11.9289,
    longitude: 79.8175,
    city: 'Pondicherry',
    area: 'Muthialpet',
    installation_date: '2020-01-15',
    last_maintenance_date: '2024-01-10',
    next_maintenance_date: '2024-07-10',
    maintenance_cycle_months: 6,
    specifications: { capacity: '50000L', material: 'Concrete' },
    created_at: '2024-01-01',
    updated_at: '2024-01-10'
  },
  // White Town area tank
  {
    id: 'tank-002',
    name: 'White Town Distribution Tank',
    type: 'tank',
    condition: 'average',
    latitude: 11.9350,
    longitude: 79.8290,
    city: 'Pondicherry',
    area: 'White Town',
    installation_date: '2018-03-20',
    last_maintenance_date: '2023-12-15',
    next_maintenance_date: '2024-06-15',
    maintenance_cycle_months: 6,
    specifications: { capacity: '30000L', material: 'Steel' },
    created_at: '2024-01-01',
    updated_at: '2024-01-05'
  },
  // Lawspet area tank
  {
    id: 'tank-003',
    name: 'Lawspet Storage Tank',
    type: 'tank',
    condition: 'good',
    latitude: 11.9580,
    longitude: 79.8120,
    city: 'Pondicherry',
    area: 'Lawspet',
    installation_date: '2019-06-10',
    last_maintenance_date: '2024-01-08',
    specifications: { capacity: '40000L', material: 'Concrete' },
    created_at: '2024-01-01',
    updated_at: '2024-01-08'
  },

  // Main Distribution Pipes - Muthialpet
  {
    id: 'pipe-main-001',
    name: 'Muthialpet Main Line A',
    type: 'pipe',
    condition: 'good',
    latitude: 11.9285,
    longitude: 79.8180,
    city: 'Pondicherry',
    area: 'Muthialpet',
    installation_date: '2020-02-01',
    last_maintenance_date: '2024-01-05',
    specifications: { diameter: '300mm', material: 'HDPE', length: '500m' },
    created_at: '2024-01-01',
    updated_at: '2024-01-05'
  },
  {
    id: 'pipe-main-002',
    name: 'Muthialpet Distribution Line B',
    type: 'pipe',
    condition: 'average',
    latitude: 11.9275,
    longitude: 79.8185,
    city: 'Pondicherry',
    area: 'Muthialpet',
    installation_date: '2019-05-10',
    last_maintenance_date: '2023-11-20',
    specifications: { diameter: '250mm', material: 'PVC', length: '400m' },
    created_at: '2024-01-01',
    updated_at: '2024-01-03'
  },
  // White Town pipes
  {
    id: 'pipe-main-003',
    name: 'White Town Main Line',
    type: 'pipe',
    condition: 'good',
    latitude: 11.9345,
    longitude: 79.8295,
    city: 'Pondicherry',
    area: 'White Town',
    installation_date: '2020-04-15',
    last_maintenance_date: '2024-01-12',
    specifications: { diameter: '200mm', material: 'HDPE', length: '600m' },
    created_at: '2024-01-01',
    updated_at: '2024-01-12'
  },
  // Lawspet pipes
  {
    id: 'pipe-main-004',
    name: 'Lawspet Connection Line',
    type: 'pipe',
    condition: 'poor',
    latitude: 11.9575,
    longitude: 79.8125,
    city: 'Pondicherry',
    area: 'Lawspet',
    installation_date: '2017-08-15',
    last_maintenance_date: '2023-09-10',
    specifications: { diameter: '200mm', material: 'Iron', length: '800m' },
    created_at: '2024-01-01',
    updated_at: '2024-01-02'
  },

  // Pumps - distributed across areas
  {
    id: 'pump-001',
    name: 'Muthialpet Booster Pump',
    type: 'pump',
    condition: 'good',
    latitude: 11.9290,
    longitude: 79.8178,
    city: 'Pondicherry',
    area: 'Muthialpet',
    installation_date: '2020-01-20',
    last_maintenance_date: '2024-01-15',
    next_maintenance_date: '2024-04-15',
    maintenance_cycle_months: 3,
    specifications: { capacity: '50HP', type: 'Centrifugal' },
    created_at: '2024-01-01',
    updated_at: '2024-01-15'
  },
  {
    id: 'pump-002',
    name: 'White Town Pressure Pump',
    type: 'pump',
    condition: 'average',
    latitude: 11.9348,
    longitude: 79.8288,
    city: 'Pondicherry',
    area: 'White Town',
    installation_date: '2018-06-10',
    last_maintenance_date: '2023-12-20',
    specifications: { capacity: '30HP', type: 'Submersible' },
    created_at: '2024-01-01',
    updated_at: '2024-01-08'
  },
  {
    id: 'pump-003',
    name: 'Lawspet Distribution Pump',
    type: 'pump',
    condition: 'good',
    latitude: 11.9578,
    longitude: 79.8118,
    city: 'Pondicherry',
    area: 'Lawspet',
    installation_date: '2019-03-15',
    last_maintenance_date: '2024-01-10',
    specifications: { capacity: '40HP', type: 'Centrifugal' },
    created_at: '2024-01-01',
    updated_at: '2024-01-10'
  },

  // Valves
  {
    id: 'valve-001',
    name: 'Muthialpet Control Valve',
    type: 'valve',
    condition: 'good',
    latitude: 11.9287,
    longitude: 79.8182,
    city: 'Pondicherry',
    area: 'Muthialpet',
    installation_date: '2020-02-05',
    last_maintenance_date: '2024-01-08',
    specifications: { size: '300mm', type: 'Gate Valve' },
    created_at: '2024-01-01',
    updated_at: '2024-01-08'
  },
  {
    id: 'valve-002',
    name: 'White Town Main Valve',
    type: 'valve',
    condition: 'good',
    latitude: 11.9352,
    longitude: 79.8292,
    city: 'Pondicherry',
    area: 'White Town',
    installation_date: '2020-04-20',
    specifications: { size: '200mm', type: 'Ball Valve' },
    created_at: '2024-01-01',
    updated_at: '2024-01-06'
  },
  {
    id: 'valve-003',
    name: 'Lawspet Isolation Valve',
    type: 'valve',
    condition: 'average',
    latitude: 11.9582,
    longitude: 79.8122,
    city: 'Pondicherry',
    area: 'Lawspet',
    installation_date: '2019-07-10',
    last_maintenance_date: '2023-11-15',
    specifications: { size: '150mm', type: 'Gate Valve' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },

  // Water Meters
  {
    id: 'meter-001',
    name: 'Muthialpet Flow Meter',
    type: 'meter',
    condition: 'good',
    latitude: 11.9292,
    longitude: 79.8177,
    city: 'Pondicherry',
    area: 'Muthialpet',
    installation_date: '2020-01-25',
    last_maintenance_date: '2024-01-12',
    specifications: { type: 'Electromagnetic', accuracy: '±0.5%' },
    created_at: '2024-01-01',
    updated_at: '2024-01-12'
  },
  {
    id: 'meter-002',
    name: 'White Town Usage Meter',
    type: 'meter',
    condition: 'good',
    latitude: 11.9346,
    longitude: 79.8294,
    city: 'Pondicherry',
    area: 'White Town',
    installation_date: '2020-05-10',
    last_maintenance_date: '2024-01-09',
    specifications: { type: 'Ultrasonic', accuracy: '±1%' },
    created_at: '2024-01-01',
    updated_at: '2024-01-09'
  },

  // Consumer Taps
  {
    id: 'tap-001',
    name: 'Muthialpet Residential Tap 1',
    type: 'tap',
    condition: 'good',
    latitude: 11.9280,
    longitude: 79.8188,
    city: 'Pondicherry',
    area: 'Muthialpet',
    installation_date: '2020-04-10',
    last_maintenance_date: '2024-01-05',
    specifications: { connection_type: 'Domestic', pipe_size: '20mm' },
    created_at: '2024-01-01',
    updated_at: '2024-01-05'
  },
  {
    id: 'tap-002',
    name: 'Muthialpet Commercial Tap',
    type: 'tap',
    condition: 'good',
    latitude: 11.9278,
    longitude: 79.8190,
    city: 'Pondicherry',
    area: 'Muthialpet',
    installation_date: '2020-05-15',
    last_maintenance_date: '2024-01-03',
    specifications: { connection_type: 'Commercial', pipe_size: '25mm' },
    created_at: '2024-01-01',
    updated_at: '2024-01-03'
  },
  {
    id: 'tap-003',
    name: 'White Town Heritage Tap',
    type: 'tap',
    condition: 'average',
    latitude: 11.9340,
    longitude: 79.8298,
    city: 'Pondicherry',
    area: 'White Town',
    installation_date: '2019-09-20',
    last_maintenance_date: '2023-11-15',
    specifications: { connection_type: 'Domestic', pipe_size: '20mm' },
    created_at: '2024-01-01',
    updated_at: '2024-01-02'
  },
  {
    id: 'tap-004',
    name: 'White Town Public Tap',
    type: 'tap',
    condition: 'good',
    latitude: 11.9342,
    longitude: 79.8300,
    city: 'Pondicherry',
    area: 'White Town',
    installation_date: '2020-06-10',
    last_maintenance_date: '2024-01-07',
    specifications: { connection_type: 'Public', pipe_size: '32mm' },
    created_at: '2024-01-01',
    updated_at: '2024-01-07'
  },
  {
    id: 'tap-005',
    name: 'Lawspet Community Tap',
    type: 'tap',
    condition: 'poor',
    latitude: 11.9570,
    longitude: 79.8130,
    city: 'Pondicherry',
    area: 'Lawspet',
    installation_date: '2018-02-10',
    last_maintenance_date: '2023-08-05',
    specifications: { connection_type: 'Public', pipe_size: '32mm' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 'tap-006',
    name: 'Lawspet Residential Tap',
    type: 'tap',
    condition: 'good',
    latitude: 11.9585,
    longitude: 79.8115,
    city: 'Pondicherry',
    area: 'Lawspet',
    installation_date: '2019-08-25',
    last_maintenance_date: '2024-01-02',
    specifications: { connection_type: 'Domestic', pipe_size: '20mm' },
    created_at: '2024-01-01',
    updated_at: '2024-01-02'
  }
];

// Network connections for pipeline visualization
export const networkConnections = [
  // Tank to pump connections
  { from: 'tank-001', to: 'pump-001', type: 'main' },
  { from: 'tank-002', to: 'pump-002', type: 'main' },
  { from: 'tank-003', to: 'pump-003', type: 'main' },
  
  // Pump to main distribution
  { from: 'pump-001', to: 'meter-001', type: 'main' },
  { from: 'meter-001', to: 'valve-001', type: 'main' },
  { from: 'valve-001', to: 'pipe-main-001', type: 'main' },
  
  { from: 'pump-002', to: 'meter-002', type: 'main' },
  { from: 'meter-002', to: 'valve-002', type: 'main' },
  { from: 'valve-002', to: 'pipe-main-003', type: 'main' },
  
  { from: 'pump-003', to: 'valve-003', type: 'main' },
  { from: 'valve-003', to: 'pipe-main-004', type: 'main' },
  
  // Main distribution network
  { from: 'pipe-main-001', to: 'pipe-main-002', type: 'main' },
  
  // Consumer connections
  { from: 'pipe-main-001', to: 'tap-001', type: 'service' },
  { from: 'pipe-main-002', to: 'tap-002', type: 'service' },
  { from: 'pipe-main-003', to: 'tap-003', type: 'service' },
  { from: 'pipe-main-003', to: 'tap-004', type: 'service' },
  { from: 'pipe-main-004', to: 'tap-005', type: 'service' },
  { from: 'pipe-main-004', to: 'tap-006', type: 'service' }
];

// Accurate area boundaries for Pondicherry
export const areaBoundaries = {
  'Muthialpet': {
    center: { lat: 11.9285, lng: 79.8180 },
    zoom: 16,
    bounds: {
      north: 11.9310,
      south: 11.9260,
      east: 79.8210,
      west: 79.8150
    }
  },
  'White Town': {
    center: { lat: 11.9345, lng: 79.8295 },
    zoom: 16,
    bounds: {
      north: 11.9370,
      south: 11.9320,
      east: 79.8320,
      west: 79.8270
    }
  },
  'Lawspet': {
    center: { lat: 11.9580, lng: 79.8120 },
    zoom: 16,
    bounds: {
      north: 11.9600,
      south: 11.9560,
      east: 79.8140,
      west: 79.8100
    }
  },
  'All Areas': {
    center: { lat: 11.9400, lng: 79.8200 },
    zoom: 13,
    bounds: {
      north: 11.9620,
      south: 11.9240,
      east: 79.8340,
      west: 79.8080
    }
  }
};
