import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Login } from '@/components/Login';
import { PublicSection } from '@/components/PublicSection';
import { AdminDashboard } from '@/components/AdminDashboard';
import { WorkerDashboard } from '@/components/WorkerDashboard';
import { Button } from '@/components/ui/button';
import { Users, UserCheck } from 'lucide-react';

const AppContent = () => {
  const { user } = useAuth();
  const [showPublic, setShowPublic] = useState(false);

  if (!user && !showPublic) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed top-2 right-2 z-50 sm:top-4 sm:right-4">
          <Button
            variant="outline"
            onClick={() => setShowPublic(true)}
            className="bg-white/95 hover:bg-white border-blue-200 text-blue-700 font-medium shadow-lg backdrop-blur-sm h-8 px-2 sm:h-11 sm:px-4 text-xs sm:text-sm"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Citizens</span>
          </Button>
        </div>
        <Login />
      </div>
    );
  }

  if (!user && showPublic) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed top-2 right-2 z-50 sm:top-4 sm:right-4">
          <Button
            variant="outline"
            onClick={() => setShowPublic(false)}
            className="bg-white/95 hover:bg-white border-blue-200 text-blue-700 font-medium shadow-lg backdrop-blur-sm h-8 px-2 sm:h-11 sm:px-4 text-xs sm:text-sm"
          >
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Login</span>
          </Button>
        </div>
        <PublicSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Breadcrumb />
      <main className="pb-safe">
        {user?.role === 'admin' && <AdminDashboard />}
        {user?.role === 'worker' && <WorkerDashboard />}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
