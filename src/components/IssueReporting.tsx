
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Droplets, CheckCircle, XCircle, MapPin, Phone, Clock } from 'lucide-react';

type IssueType = 'leakage' | 'broken_pipe' | 'no_water' | 'low_pressure' | 'contamination' | 'other';

interface WaterConnection {
  id: string;
  water_id: string;
  household_name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  is_active: boolean;
}

export const IssueReporting = () => {
  const [waterID, setWaterID] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [connectionData, setConnectionData] = useState<WaterConnection | null>(null);
  const [formData, setFormData] = useState({
    reporter_phone: '',
    issue_type: '' as IssueType | '',
    description: ''
  });

  const { toast } = useToast();

  // Verify Water ID
  const verifyMutation = useMutation({
    mutationFn: async (water_id: string) => {
      const { data, error } = await supabase
        .from('water_connections')
        .select('*')
        .eq('water_id', water_id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as WaterConnection;
    },
    onSuccess: (data) => {
      setConnectionData(data);
      setIsVerified(true);
      toast({
        title: "Water ID Verified!",
        description: `Found connection for ${data.household_name}`,
      });
    },
    onError: () => {
      setIsVerified(false);
      setConnectionData(null);
      toast({
        title: "Water ID Not Found",
        description: "Please check your Water ID and try again.",
        variant: "destructive",
      });
    },
  });

  // Submit issue report
  const reportMutation = useMutation({
    mutationFn: async (data: typeof formData & { water_id: string; connection: WaterConnection }) => {
      const { error } = await supabase
        .from('issue_reports')
        .insert({
          reporter_name: data.connection.household_name,
          reporter_phone: data.reporter_phone || null,
          issue_type: data.issue_type as IssueType,
          description: data.description,
          latitude: data.connection.latitude,
          longitude: data.connection.longitude,
          city: data.connection.city,
          area: data.connection.area
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Issue Reported Successfully!",
        description: "Your report has been submitted. We will address it soon.",
      });
      // Reset form
      setWaterID('');
      setIsVerified(false);
      setConnectionData(null);
      setFormData({
        reporter_phone: '',
        issue_type: '',
        description: ''
      });
    },
    onError: () => {
      toast({
        title: "Failed to Submit Report",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleVerifyWaterID = () => {
    if (!waterID.trim()) {
      toast({
        title: "Enter Water ID",
        description: "Please enter your Water ID to verify.",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate(waterID.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified || !connectionData) {
      toast({
        title: "Verify Water ID First",
        description: "Please verify your Water ID before submitting the report.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.issue_type || !formData.description) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    reportMutation.mutate({ ...formData, water_id: waterID, connection: connectionData });
  };

  const issueTypes = [
    { value: 'leakage', label: 'Water Leakage', icon: '💧' },
    { value: 'broken_pipe', label: 'Broken Pipe', icon: '🔧' },
    { value: 'no_water', label: 'No Water Supply', icon: '🚫' },
    { value: 'low_pressure', label: 'Low Water Pressure', icon: '📉' },
    { value: 'contamination', label: 'Water Contamination', icon: '⚠️' },
    { value: 'other', label: 'Other Issue', icon: '❓' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="p-3 sm:p-4 max-w-2xl mx-auto">
        {/* Mobile-optimized header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-full inline-block mb-3 sm:mb-4">
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Report Water Issue</h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">Enter your Water ID to report issues with your water connection</p>
        </div>

        {/* Step 1: Water ID Verification - Mobile First */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                1
              </div>
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span>Verify Your Water ID</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Water ID <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <Input
                    value={waterID}
                    onChange={(e) => {
                      setWaterID(e.target.value);
                      setIsVerified(false);
                      setConnectionData(null);
                    }}
                    placeholder="Enter your Water ID (e.g., WTR001)"
                    disabled={verifyMutation.isPending}
                    className={`h-12 text-base ${isVerified ? 'border-green-500 bg-green-50' : ''}`}
                  />
                  <Button
                    onClick={handleVerifyWaterID}
                    disabled={verifyMutation.isPending || !waterID.trim()}
                    variant={isVerified ? "default" : "outline"}
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Verified
                      </>
                    ) : (
                      'Verify Water ID'
                    )}
                  </Button>
                </div>
              </div>

              {/* Verification Success */}
              {connectionData && isVerified && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-green-800 text-sm sm:text-base">Connection Verified ✓</h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="bg-white p-2 rounded-lg">
                          <p className="text-gray-600 text-xs">Household</p>
                          <p className="font-medium text-green-800">{connectionData.household_name}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <p className="text-gray-600 text-xs">Address</p>
                          <p className="font-medium text-green-800">{connectionData.address}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <p className="text-gray-600 text-xs">Location</p>
                          <p className="font-medium text-green-800 flex items-center">
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {connectionData.area}, {connectionData.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Report Form - Only show when verified */}
        {isVerified && connectionData && (
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                  2
                </div>
                <span>Report Your Issue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input
                    value={formData.reporter_phone}
                    onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                    placeholder="Enter your phone number for updates"
                    type="tel"
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll use this to update you on the repair status</p>
                </div>

                {/* Issue Type - Mobile Optimized */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.issue_type}
                    onValueChange={(value: IssueType) => setFormData({ ...formData, issue_type: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select the type of issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="py-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{type.icon}</span>
                            <span className="text-sm sm:text-base">{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Issue Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Issue Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the issue in detail..."
                    rows={5}
                    required
                    className="text-base resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please provide as much detail as possible to help our team resolve the issue quickly
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 text-base sm:text-lg font-semibold bg-red-600 hover:bg-red-700"
                  size="lg"
                  disabled={reportMutation.isPending || !isVerified}
                >
                  {reportMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Report...
                    </>
                  ) : (
                    'Submit Issue Report'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact - Mobile Optimized */}
        <Card className="mt-6 bg-red-50 border-red-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-2 bg-red-100 rounded-full">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Emergency Contact
                </p>
                <p className="text-lg sm:text-xl font-bold text-red-600">
                  +91-413-2200-100
                </p>
                <p className="text-xs text-red-700 mt-1">
                  For urgent water emergencies, call immediately
                </p>
              </div>
              <div className="pt-2 border-t border-red-200">
                <p className="text-xs text-red-600 flex items-center justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  24/7 emergency helpline
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center text-xs sm:text-sm text-blue-700 space-y-1">
              <p className="font-medium">Important:</p>
              <p>Your Water ID helps us identify the exact location and prioritize repairs.</p>
              <p>Reports without verified Water IDs cannot be processed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
