import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useDataStore } from '../store/useDataStore';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function DashboardView() {
  const { usageRecords, incomeRecords, expenseRecords } = useDataStore();

  // Calculate statistics
  const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalExpense = expenseRecords.reduce((sum, record) => sum + record.amount, 0);
  const balance = totalIncome - totalExpense;
  const totalShuttlecocks = usageRecords.reduce((sum, record) => sum + record.quantity, 0);
  const uniquePlayers = new Set(usageRecords.flatMap(r => r.players.map(p => p.id))).size;

  // Data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyUsageData = last7Days.map(date => {
    const dayRecords = usageRecords.filter(r => r.date === date);
    const total = dayRecords.reduce((sum, r) => sum + r.quantity, 0);
    return {
      date: new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      quantity: total,
    };
  });

  const topPlayers = Object.entries(
    usageRecords.reduce((acc, record) => {
      record.players.forEach(player => {
        acc[player.name] = (acc[player.name] || 0) + record.quantity;
      });
      return acc;
    }, {} as Record<string, number>)
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm opacity-90">Saldo Akhir</CardTitle>
              <DollarSign className="w-5 h-5 opacity-75" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tracking-tight">
              Rp {balance.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              {balance >= 0 ? 'Surplus' : 'Defisit'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm opacity-90">Total Pemasukan</CardTitle>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tracking-tight">
              Rp {totalIncome.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-blue-100 mt-1">
              {incomeRecords.length} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm opacity-90">Total Pengeluaran</CardTitle>
              <TrendingDown className="w-5 h-5 opacity-75" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tracking-tight">
              Rp {totalExpense.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-orange-100 mt-1">
              {expenseRecords.length} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm opacity-90">Kok Digunakan</CardTitle>
              <Package className="w-5 h-5 opacity-75" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tracking-tight">
              {totalShuttlecocks} pcs
            </div>
            <p className="text-xs text-purple-100 mt-1">
              {uniquePlayers} pemain aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Penggunaan Kok 7 Hari Terakhir
            </CardTitle>
            <CardDescription>Tren penggunaan shuttlecock harian</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyUsageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantity" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Jumlah Kok"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Top 5 Pemain Aktif
            </CardTitle>
            <CardDescription>Pemain dengan penggunaan kok terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topPlayers}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="quantity" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  name="Jumlah Kok"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Ringkasan transaksi terkini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageRecords.slice(-5).reverse().map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm">{record.players.map(p => p.name).join(', ')}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(record.date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{record.quantity} kok</p>
                  <p className="text-xs text-gray-500">Rp {record.totalCost.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
            {usageRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Belum ada data penggunaan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
