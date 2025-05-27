
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, Wrench, Package } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/':
        return [{ label: 'Dashboard', icon: Home, path: '/' }];
      case '/maintenance':
        return [
          { label: 'Dashboard', icon: Home, path: '/' },
          { label: 'Maintenance', icon: Wrench, path: '/maintenance' }
        ];
      case '/inventory':
        return [
          { label: 'Dashboard', icon: Home, path: '/' },
          { label: 'Inventory', icon: Package, path: '/inventory' }
        ];
      default:
        return [{ label: 'Dashboard', icon: Home, path: '/' }];
    }
  };

  const breadcrumbItems = getBreadcrumbItems();
  const canGoBack = breadcrumbItems.length > 1;

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const handleBreadcrumbClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
      <div className="flex items-center space-x-2">
        {/* Back Button */}
        {canGoBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 p-1 sm:p-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Back</span>
          </Button>
        )}

        {/* Breadcrumb Items */}
        <div className="flex items-center space-x-1 sm:space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === breadcrumbItems.length - 1;
            
            return (
              <div key={item.path} className="flex items-center">
                {index > 0 && (
                  <span className="text-gray-400 mx-1">/</span>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleBreadcrumbClick(e, item.path)}
                  disabled={isLast}
                  className={`flex items-center space-x-1 p-1 h-auto ${
                    isLast 
                      ? 'text-blue-600 font-medium cursor-default' 
                      : 'text-gray-600 hover:text-blue-600 cursor-pointer'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
