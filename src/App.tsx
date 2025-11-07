import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { DashboardView } from './components/DashboardView';
import { ShuttlecockUsage } from './components/ShuttlecockUsage';
import { IncomeExpense } from './components/IncomeExpense';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { MemberManagement } from './components/MemberManagement';
import { Activity, TrendingUp, DollarSign, Clock, Settings as SettingsIcon, Users } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl tracking-tight">Badminton Club Manager</h1>
              <p className="text-emerald-50 text-sm">Sistem Pencatatan Shuttlecock & Keuangan</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid bg-white shadow-md">
            <TabsTrigger value="dashboard" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="usage" className="gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Penggunaan Kok</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Member</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Keuangan</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Riwayat</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Pengaturan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardView />
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <ShuttlecockUsage />
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <MemberManagement />
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <IncomeExpense />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <History />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  );
}
