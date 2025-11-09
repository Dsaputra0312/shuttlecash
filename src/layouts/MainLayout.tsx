import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Settings as SettingsIcon,
  LogOut,
  Package,
} from "lucide-react";
import { useDataStore } from "../store/useDataStore";
import { toast } from "sonner";

interface MainLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: TrendingUp },
  { name: "Shuttlecock", href: "/shuttlecock", icon: Package },
  { name: "Members", href: "/members", icon: Users },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "History", href: "/history", icon: Clock },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDataStore();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil logout");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl tracking-tight">ShuttleCash</h1>
                <p className="text-emerald-50 text-sm">
                  Sistem Pencatatan Shuttlecock & Keuangan
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm">Selamat datang, {user?.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
