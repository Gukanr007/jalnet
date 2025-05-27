
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, CreditCard, AlertTriangle, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { BillPayment } from '@/components/BillPayment';
import { IssueReporting } from '@/components/IssueReporting';

export const PublicSection = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'bill-payment' | 'issue-report'>('home');

  if (activeSection === 'bill-payment') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
        <BillPayment />
      </div>
    );
  }

  if (activeSection === 'issue-report') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
        <IssueReporting />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-4 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                <Droplets className="h-12 w-12 sm:h-16 sm:w-16" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">JALNET</h1>
            <p className="text-lg sm:text-xl mb-2 font-medium">Jal Jeevan Mission Platform</p>
            <p className="text-sm sm:text-base opacity-90 max-w-2xl mx-auto leading-relaxed">
              Ensuring safe and adequate drinking water for all households through innovative water management solutions
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Citizen Services</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Access essential water services online - pay your bills, report issues, and stay connected with your local water authority
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Bill Payment Card */}
            <Card 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white transform hover:-translate-y-1" 
              onClick={() => setActiveSection('bill-payment')}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-100 rounded-2xl">
                    <CreditCard className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900">Pay Water Bills</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                  View your current bills, payment history, and make secure online payments using your Water ID
                </p>
                <div className="space-y-2 mb-6">
                  {[
                    'View current and past bills',
                    'Multiple payment options (UPI, Card, Net Banking)',
                    'Instant payment confirmation',
                    'Download payment receipts'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-xs sm:text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg">
                  Pay Bills Now
                </Button>
              </CardContent>
            </Card>

            {/* Issue Reporting Card */}
            <Card 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white transform hover:-translate-y-1" 
              onClick={() => setActiveSection('issue-report')}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-100 rounded-2xl">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900">Report Water Issues</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                  Report water supply problems, leakages, or quality issues in your area for quick resolution
                </p>
                <div className="space-y-2 mb-6">
                  {[
                    'Report leakages and pipe breaks',
                    'Water quality concerns',
                    'Supply disruptions',
                    'Track issue resolution status'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-xs sm:text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg">
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-900">Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">+91-413-2200-100</p>
                <p className="text-sm text-gray-600 leading-relaxed">24/7 emergency helpline for urgent water supply issues</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-900">Support Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-base sm:text-lg font-semibold text-green-600 mb-2 break-all">support@jalnet.gov.in</p>
                <p className="text-sm text-gray-600 leading-relaxed">For general inquiries and non-urgent issues</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-900">Service Areas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-semibold mb-3 text-gray-900">Pondicherry</p>
                <div className="space-y-1">
                  {['Muthialpet', 'White Town', 'Rainbow Nagar'].map((area, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></div>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* About Section */}
          <div className="mt-12 sm:mt-16">
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">About Jal Jeevan Mission</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  The Jal Jeevan Mission aims to provide safe and adequate drinking water through individual household 
                  tap connections by 2024 to all households in rural India. JALNET is our digital platform to ensure 
                  efficient water management, transparent billing, and responsive citizen services in your area.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
