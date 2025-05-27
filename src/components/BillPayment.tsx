
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Smartphone, Building2, Search, Receipt, CheckCircle, AlertCircle } from 'lucide-react';
import { WaterBill, Payment, WaterConnection } from '@/types';

export const BillPayment = () => {
  const [waterID, setWaterID] = useState('');
  const [selectedBill, setSelectedBill] = useState<WaterBill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'net_banking'>('upi');
  const [isSearched, setIsSearched] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch water connection and bills
  const { data: connectionData, isLoading: connectionLoading } = useQuery({
    queryKey: ['water-connection', waterID],
    queryFn: async () => {
      if (!waterID.trim()) return null;
      
      const { data: connection } = await supabase
        .from('water_connections')
        .select('*')
        .eq('water_id', waterID.trim())
        .single();
      
      return connection as WaterConnection;
    },
    enabled: isSearched && !!waterID.trim(),
  });

  const { data: bills = [], isLoading: billsLoading } = useQuery({
    queryKey: ['water-bills', waterID],
    queryFn: async () => {
      if (!waterID.trim()) return [];
      
      const { data } = await supabase
        .from('water_bills')
        .select('*')
        .eq('water_id', waterID.trim())
        .order('bill_year', { ascending: false })
        .order('bill_month', { ascending: false });
      
      return data as WaterBill[];
    },
    enabled: isSearched && !!waterID.trim(),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments', waterID],
    queryFn: async () => {
      if (!waterID.trim()) return [];
      
      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('water_id', waterID.trim())
        .order('payment_date', { ascending: false });
      
      return data as Payment[];
    },
    enabled: isSearched && !!waterID.trim(),
  });

  const paymentMutation = useMutation({
    mutationFn: async ({ billId, amount }: { billId: string; amount: number }) => {
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          bill_id: billId,
          water_id: waterID,
          amount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          status: 'completed'
        });

      if (paymentError) throw paymentError;

      // Update bill status
      const { error: billError } = await supabase
        .from('water_bills')
        .update({ status: 'paid' })
        .eq('id', billId);

      if (billError) throw billError;

      return transactionId;
    },
    onSuccess: (transactionId) => {
      toast({
        title: "Payment Successful!",
        description: `Transaction ID: ${transactionId}`,
      });
      queryClient.invalidateQueries({ queryKey: ['water-bills', waterID] });
      queryClient.invalidateQueries({ queryKey: ['payments', waterID] });
      setSelectedBill(null);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    setIsSearched(true);
    setSelectedBill(null);
  };

  const handlePayment = () => {
    if (selectedBill) {
      paymentMutation.mutate({ 
        billId: selectedBill.id, 
        amount: selectedBill.total_amount 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMonth = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-3 sm:p-4 max-w-4xl mx-auto">
        {/* Mobile-optimized header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-full inline-block mb-3 sm:mb-4">
            <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Water Bill Payment</h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">Enter your Water ID to view and pay your bills</p>
        </div>

        {/* Mobile-first Search Section */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              Find Your Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Enter Water ID (e.g., RNG-HOUSE-001-MTP)"
              value={waterID}
              onChange={(e) => setWaterID(e.target.value)}
              className="h-12 text-base"
            />
            <Button 
              onClick={handleSearch} 
              disabled={!waterID.trim() || connectionLoading}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {connectionLoading ? 'Searching...' : 'Search Account'}
            </Button>
          </CardContent>
        </Card>

        {/* Connection Info - Mobile optimized */}
        {isSearched && connectionData && (
          <Card className="mb-4 sm:mb-6 shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                Account Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Household Name</p>
                    <p className="font-semibold text-sm sm:text-base">{connectionData.household_name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Water ID</p>
                    <p className="font-semibold text-sm sm:text-base font-mono">{connectionData.water_id}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Address</p>
                    <p className="font-semibold text-sm sm:text-base">{connectionData.address}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Monthly Rate</p>
                    <p className="font-semibold text-lg sm:text-xl text-blue-600">₹{connectionData.monthly_rate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Connection Found */}
        {isSearched && !connectionLoading && !connectionData && waterID.trim() && (
          <Card className="mb-4 sm:mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <p className="text-red-800 font-medium mb-1">Water ID Not Found</p>
                <p className="text-sm text-red-600">Water ID: {waterID}</p>
                <p className="text-xs text-red-600 mt-2">Please check your Water ID and try again.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bills and Payment Section - Mobile Stack Layout */}
        {isSearched && connectionData && (
          <div className="space-y-4 sm:space-y-6">
            {/* Current Bills - Mobile First */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Receipt className="h-4 w-4 sm:h-5 sm:w-5" />
                  Current Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {billsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading bills...</p>
                  </div>
                ) : bills.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No bills found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bills.map((bill) => (
                      <div
                        key={bill.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedBill?.id === bill.id 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedBill(bill)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-base sm:text-lg">
                              {formatMonth(bill.bill_month)} {bill.bill_year}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Due: {new Date(bill.due_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(bill.status)} text-xs font-medium`}>
                            {bill.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{bill.total_amount}</span>
                          {bill.status !== 'paid' && (
                            <Button size="sm" variant="outline" className="text-xs">
                              {selectedBill?.id === bill.id ? 'Selected' : 'Select'}
                            </Button>
                          )}
                        </div>
                        {bill.late_fee > 0 && (
                          <p className="text-xs text-red-600 mt-2">Includes late fee: ₹{bill.late_fee}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Section - Mobile Optimized */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Payment Options</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedBill ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Bill Summary */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <p className="font-medium text-sm sm:text-base mb-1">
                        Bill for {formatMonth(selectedBill.bill_month)} {selectedBill.bill_year}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹{selectedBill.total_amount}</p>
                      {selectedBill.late_fee > 0 && (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">
                          Includes late fee: ₹{selectedBill.late_fee}
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Payment Methods - Mobile Stack */}
                    <div className="space-y-3">
                      <p className="font-medium text-sm sm:text-base">Choose Payment Method</p>
                      <div className="space-y-2">
                        <Button
                          variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                          className="w-full justify-start h-12 text-sm sm:text-base"
                          onClick={() => setPaymentMethod('upi')}
                        >
                          <Smartphone className="h-4 w-4 mr-3" />
                          UPI Payment
                        </Button>
                        <Button
                          variant={paymentMethod === 'card' ? 'default' : 'outline'}
                          className="w-full justify-start h-12 text-sm sm:text-base"
                          onClick={() => setPaymentMethod('card')}
                        >
                          <CreditCard className="h-4 w-4 mr-3" />
                          Credit/Debit Card
                        </Button>
                        <Button
                          variant={paymentMethod === 'net_banking' ? 'default' : 'outline'}
                          className="w-full justify-start h-12 text-sm sm:text-base"
                          onClick={() => setPaymentMethod('net_banking')}
                        >
                          <Building2 className="h-4 w-4 mr-3" />
                          Net Banking
                        </Button>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <Button
                      onClick={handlePayment}
                      disabled={paymentMutation.isPending}
                      className="w-full h-14 text-base sm:text-lg font-semibold bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {paymentMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${selectedBill.total_amount}`
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm sm:text-base">Select a bill above to proceed with payment</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment History - Mobile Optimized */}
            {payments.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="p-3 border rounded-lg bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-sm sm:text-base">₹{payment.amount}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span className="uppercase">{payment.payment_method}</span>
                          <span className="font-mono">{payment.transaction_id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Mobile Help Section */}
        <Card className="mt-6 bg-blue-50 border-blue-200 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-blue-800 font-medium">
                <strong>Need Help?</strong>
              </p>
              <p className="text-xs text-blue-700">
                Call <strong>+91-413-2200-100</strong> for payment assistance
              </p>
              <p className="text-xs text-blue-600">
                Your Water ID is printed on your monthly bill or connection certificate
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
