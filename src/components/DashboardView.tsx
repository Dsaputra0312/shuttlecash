import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Users,
  Package,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { DashboardData } from "../hooks/useDashboard";
import { Badge } from "./ui/badge";

interface DashboardViewProps {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function DashboardView({
  dashboardData,
  loading,
  error,
  refetch,
}: DashboardViewProps) {
  const navigate = useNavigate();
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-in fade-in duration-500">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-8 rounded-2xl bg-destructive/5 border border-destructive/10 animate-in zoom-in-95 duration-300">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-bold mb-2 text-destructive">Terjadi Kesalahan</h3>
          <p className="text-muted-foreground mb-6">
            {error === "Authentication required"
              ? "Silakan login untuk mengakses dashboard"
              : error}
          </p>
          {error !== "Authentication required" && (
            <button
              onClick={refetch}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all shadow-sm"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center opacity-50 animate-in fade-in duration-500">
          <Activity className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl font-medium">Tidak ada data dashboard</p>
        </div>
      </div>
    );
  }

  const { statistics, recentActivities = [], topPlayers = [] } = dashboardData;
  const { members, usage, finance } = statistics || {}; // Safely access nested properties

  // Fallback values if data is missing or undefined
  const balance = finance?.balance || 0;
  const totalIncome = finance?.weekIncome || 0;
  const totalExpense = finance?.weekExpenses || 0;
  const totalShuttlecocks = usage?.week || 0;
  const uniquePlayers = members?.total || 0;
  const todayUsage = usage?.today || 0;
  const weekUsage = usage?.week || 0;
  const weekIncomeCount = finance?.weekIncomeCount || 0;
  const weekExpensesCount = finance?.weekExpensesCount || 0;

  // Mock daily data for usage trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const dailyUsageData = last7Days.map((date, index) => {
    const averageDaily = Math.round(weekUsage / 7);
    return {
      date: new Date(date).toLocaleDateString("id-ID", {
        weekday: "short",
      }),
      quantity: index === 6 ? todayUsage : Math.max(2, averageDaily + (Math.random() - 0.5) * 6),
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan aktivitas hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-20 h-20" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Saldo Akhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp {balance.toLocaleString("id-ID")}</div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-none hover:bg-white/30">
                {balance >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {balance >= 0 ? "Surplus" : "Defisit"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-20 h-20" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Pemasukan (Minggu Ini)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp {totalIncome.toLocaleString("id-ID")}</div>
            <p className="text-xs text-emerald-100 mt-4 flex items-center gap-1 font-medium">
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
                {weekIncomeCount} Transaksi
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="w-20 h-20" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Pengeluaran (Minggu Ini)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp {totalExpense.toLocaleString("id-ID")}</div>
            <p className="text-xs text-rose-100 mt-4 flex items-center gap-1 font-medium">
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
                {weekExpensesCount} Transaksi
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Package className="w-20 h-20" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Kok Digunakan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalShuttlecocks} Pcs</div>
            <p className="text-xs text-amber-100 mt-4 flex items-center gap-1 font-medium">
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
                {uniquePlayers} Pemain Aktif
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Chart */}
        <Card className="lg:col-span-2 shadow-sm border-muted/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Tren Penggunaan Kok</CardTitle>
              <CardDescription>Aktivitas penggunaan shuttlecock 7 hari terakhir</CardDescription>
            </div>
            <div className="p-2 bg-primary/5 rounded-lg">
              <Activity className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyUsageData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888888', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888888', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="quantity"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsage)"
                    name="Jumlah Kok"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Players */}
        <Card className="shadow-sm border-muted/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Top Players</CardTitle>
              <CardDescription>Pemain paling aktif minggu ini</CardDescription>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPlayers} layout="vertical" margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#444', fontSize: 11, fontWeight: 500 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="totalUsage"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                    name="Kok Digunakan"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-8">
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
            <div>
              <CardTitle className="text-xl">Aktivitas Terbaru</CardTitle>
              <CardDescription>Log transaksi dan penggunaan kok terkini</CardDescription>
            </div>
            <Badge variant="outline" className="font-medium">
              Total {recentActivities.length} Aktivitas
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-muted/50">
              {recentActivities.slice(0, 10).map((activity, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${
                        activity.type === "income"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : activity.type === "expense"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                      }`}
                    >
                      {activity.type === "income" ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : activity.type === "expense" ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : (
                        <Package className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      activity.type === "income" ? "text-emerald-600" : 
                      activity.type === "expense" ? "text-rose-600" : "text-indigo-600"
                    }`}>
                      {activity.type === "income" ? "+" : activity.type === "expense" ? "-" : ""}
                      Rp {activity.amount.toLocaleString("id-ID")}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-[10px] uppercase tracking-wider font-bold">
                      {activity.type === "usage" ? "Penggunaan" : activity.type}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Belum ada aktivitas terbaru</p>
                </div>
              )}
            </div>
          </CardContent>
          {recentActivities.length > 10 && (
            <div className="p-4 bg-muted/10 border-t text-center">
              <button 
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => navigate("/history")}
              >
                Lihat Semua Aktivitas
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
