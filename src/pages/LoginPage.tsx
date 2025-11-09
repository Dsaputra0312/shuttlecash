import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Activity, Eye, EyeOff } from "lucide-react";
import { useDataStore } from "../store/useDataStore";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

export function LoginPage() {
  const { isAuthenticated } = useDataStore();
  const { login, loginLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Username dan password harus diisi");
      return;
    }

    try {
      await login(formData.username, formData.password);
      toast.success("Login berhasil!");
    } catch (error) {
      toast.error("Login gagal. Periksa kredensial Anda.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-t-lg">
          <div className="mx-auto bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-fit mb-4">
            <Activity className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl">ShuttleCash</CardTitle>
          <CardDescription className="text-emerald-50">
            Sistem Pencatatan Shuttlecock & Keuangan
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="border-gray-300 focus:border-emerald-500"
                disabled={loginLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="border-gray-300 focus:border-emerald-500 pr-10"
                  disabled={loginLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              disabled={loginLoading}>
              {loginLoading ? "Sedang Masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials:</p>
            <p>Username: admin | Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
