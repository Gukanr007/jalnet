
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = "" }) => {
  const assetTypes = [
    { 
      type: 'tank', 
      label: 'Water Tanks', 
      color: '#0066CC',
      shape: '■',
      description: 'Main water sources'
    },
    { 
      type: 'pump', 
      label: 'Pumps', 
      color: '#FF6600',
      shape: '▲',
      description: 'Pressure boosters'
    },
    { 
      type: 'pipe', 
      label: 'Pipelines', 
      color: '#666666',
      shape: '●',
      description: 'Distribution network'
    },
    { 
      type: 'valve', 
      label: 'Valves', 
      color: '#CC0066',
      shape: '◆',
      description: 'Flow control'
    },
    { 
      type: 'meter', 
      label: 'Meters', 
      color: '#00CC66',
      shape: '●',
      description: 'Flow measurement'
    },
    { 
      type: 'tap', 
      label: 'Taps/Connections', 
      color: '#000000',
      shape: '●',
      description: 'End user points'
    }
  ];

  const conditions = [
    { condition: 'good', color: '#22c55e', label: 'Good' },
    { condition: 'average', color: '#f59e0b', label: 'Average' },
    { condition: 'poor', color: '#ef4444', label: 'Poor' },
    { condition: 'critical', color: '#dc2626', label: 'Critical' }
  ];

  const pipelineTypes = [
    { type: 'main', color: '#0066CC', width: '6px', label: 'Main Lines' },
    { type: 'secondary', color: '#00AA44', width: '4px', label: 'Secondary Lines' },
    { type: 'service', color: '#666666', width: '2px', label: 'Service Lines' }
  ];

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-gray-200 ${className}`}>
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3 text-gray-900">Map Legend</h3>
        
        {/* Asset Types with Correct Shapes */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Asset Types</h4>
          <div className="space-y-1">
            {assetTypes.map(({ type, label, color, shape, description }) => (
              <div key={type} className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span 
                    className="text-lg font-bold"
                    style={{ color }}
                  >
                    {shape}
                  </span>
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Types */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Pipeline Types</h4>
          <div className="space-y-1">
            {pipelineTypes.map(({ type, color, width, label }) => (
              <div key={type} className="flex items-center space-x-2">
                <div 
                  className="rounded"
                  style={{ 
                    backgroundColor: color, 
                    width: '20px',
                    height: width,
                    opacity: 0.8
                  }}
                />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-2">Asset Condition</h4>
          <div className="grid grid-cols-2 gap-1">
            {conditions.map(({ condition, color, label }) => (
              <div key={condition} className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
