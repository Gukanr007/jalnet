
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Menu, 
  X,
  ChevronRight,
  LogOut,
  Wrench,
  Package
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    console.log('User logging out');
    logout();
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/',
      allowedRoles: ['admin', 'worker']
    },
    {
      label: 'Maintenance',
      icon: Wrench,
      path: '/maintenance',
      allowedRoles: ['admin', 'worker']
    },
    {
      label: 'Inventory',
      icon: Package,
      path: '/inventory',
      allowedRoles: ['admin', 'worker']
    }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.allowedRoles.includes(user?.role || '')
  );

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-1 xl:space-x-2 text-white hover:bg-white/20 transition-colors text-xs xl:text-sm ${
                isActive ? 'bg-white/30 text-white' : ''
              }`}
            >
              <Icon className="h-3 w-3 xl:h-4 xl:w-4" />
              <span className="hidden xl:inline">{item.label}</span>
            </Button>
          );
        })}
        
        {/* Desktop Logout Button - Clearly Separated */}
        <div className="ml-2 xl:ml-4 pl-2 xl:pl-4 border-l border-white/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-red-500/30 hover:text-white transition-colors text-xs xl:text-sm"
          >
            <LogOut className="h-3 w-3 xl:h-4 xl:w-4" />
            <span className="hidden xl:inline ml-1">Logout</span>
          </Button>
        </div>
      </nav>

      {/* Tablet Navigation - Shows icons only */}
      <nav className="hidden md:flex lg:hidden items-center space-x-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center p-2 text-white hover:bg-white/20 transition-colors ${
                isActive ? 'bg-white/30 text-white' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        
        {/* Tablet Logout Button */}
        <div className="ml-2 pl-2 border-l border-white/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-red-500/30 hover:text-white transition-colors p-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:bg-white/20 p-2 h-10 w-10"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <Card className="absolute top-14 right-3 left-3 bg-white shadow-2xl border-0 rounded-lg overflow-hidden">
            {/* Navigation Items */}
            <div className="p-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full justify-between h-12 px-4 text-left ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
            
            {/* User Info & Logout - Clearly Separated */}
            <div className="border-t bg-gray-50 p-4">
              <div className="text-center pb-3 border-b border-gray-200 mb-3">
                <p className="font-semibold text-gray-900 text-sm">{user.full_name}</p>
                <p className="text-gray-600 text-xs capitalize">
                  {user.role} • {user.assigned_area}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full h-11 border-red-200 text-red-600 hover:bg-red-50 font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
