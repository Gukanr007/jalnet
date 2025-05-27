
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Droplets } from 'lucide-react';
import { Navigation } from './Navigation';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg relative z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12 sm:h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="p-1 sm:p-2 bg-white/20 rounded-lg flex-shrink-0">
              <Droplets className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold truncate">JALNET</h1>
              <p className="text-xs text-blue-200 hidden sm:block">Jal Jeevan Mission Platform</p>
            </div>
          </div>
          
          {/* Navigation and User Section */}
          {user && (
            <div className="flex items-center space-x-1 lg:space-x-4">
              {/* Desktop User Info */}
              <div className="hidden lg:flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-medium text-sm">{user.full_name}</p>
                  <p className="text-blue-200 text-xs capitalize">
                    {user.role} • {user.assigned_area}
                  </p>
                </div>
              </div>
              
              {/* Navigation Component */}
              <Navigation />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
