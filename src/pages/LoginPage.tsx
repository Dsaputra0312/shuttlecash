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
import { TrendingUp, Eye, EyeOff, Lock, User, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-500 to-primary/50" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-[440px] z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 mb-6 transform hover:rotate-12 transition-transform duration-300">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">ShuttleCash</h1>
          <p className="text-slate-500 font-medium">Badminton Finance Management System</p>
        </div>

        <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-3xl overflow-hidden">
          <CardHeader className="pt-8 pb-4 px-8">
            <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-bold text-slate-700 ml-1">Username</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="h-12 pl-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:ring-4 focus:ring-primary/10"
                    disabled={loginLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" element="label" className="text-sm font-bold text-slate-700 ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-12 pl-11 pr-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:ring-4 focus:ring-primary/10"
                    disabled={loginLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
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
                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Demo: admin / admin123</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-sm text-slate-400">
          &copy; 2024 ShuttleCash. All rights reserved.
        </p>
      </div>
    </div>
  );
}
