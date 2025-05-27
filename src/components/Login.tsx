
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Users, Wrench, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      console.log('Attempting login with:', email);
      const success = await login(email, password);
      
      if (!success) {
        setError('Invalid credentials. Please use the demo credentials below or check your login details.');
      } else {
        toast.success(`Welcome to JALNET!`);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'worker') => {
    if (type === 'admin') {
      setEmail('admin@jalnet.gov.in');
      setActiveTab('admin');
    } else {
      setEmail('worker@jalnet.gov.in');
      setActiveTab('worker');
    }
    setPassword('jalnet123');
    setError('');
  };

  const currentLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Droplets className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">JALNET</h1>
          <p className="text-sm text-blue-600 font-medium mb-1">Rural Water Management</p>
          <p className="text-xs text-gray-500">Jal Jeevan Mission • Digital India</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center text-gray-900">Official Login</CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm">
              Access your JALNET dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="admin" 
                  className="flex items-center space-x-2 py-2.5 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="worker" 
                  className="flex items-center space-x-2 py-2.5 rounded-md data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
                >
                  <Wrench className="h-4 w-4" />
                  <span className="text-sm font-medium">Worker</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="admin" className="space-y-4">
                <div className="text-xs text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  For Junior Engineers, Assistant Engineers, and administrative staff
                </div>
                
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Official Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={currentLoading}
                    className="h-12 text-base"
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      disabled={currentLoading}
                      className="h-12 text-base pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={handleLogin} 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg"
                  disabled={currentLoading}
                >
                  {currentLoading ? 'Signing In...' : 'Login as Admin'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => fillDemoCredentials('admin')}
                  className="w-full h-12 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium"
                  disabled={currentLoading}
                >
                  Use Demo Admin Credentials
                </Button>
              </TabsContent>
              
              <TabsContent value="worker" className="space-y-4">
                <div className="text-xs text-green-800 bg-green-50 p-3 rounded-lg border border-green-200">
                  For field technicians, plumbers, and maintenance staff
                </div>
                
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Worker ID / Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={currentLoading}
                    className="h-12 text-base"
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      disabled={currentLoading}
                      className="h-12 text-base pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={handleLogin} 
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg"
                  disabled={currentLoading}
                >
                  {currentLoading ? 'Signing In...' : 'Login as Worker'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => fillDemoCredentials('worker')}
                  className="w-full h-12 border-green-200 text-green-600 hover:bg-green-50 font-medium"
                  disabled={currentLoading}
                >
                  Use Demo Worker Credentials
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center border-t pt-4">
              <p className="text-xs text-gray-600 mb-2 font-medium">Demo Credentials:</p>
              <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
                <p><span className="font-medium">Admin:</span> admin@jalnet.gov.in</p>
                <p><span className="font-medium">Worker:</span> worker@jalnet.gov.in</p>
                <p><span className="font-medium">Password:</span> jalnet123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
