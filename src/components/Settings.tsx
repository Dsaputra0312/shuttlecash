import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useDataStore } from "../store/useDataStore";
import {
  Settings as SettingsIcon,
  DollarSign,
  Award,
  Package,
  Save,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export function Settings() {
  const {
    shuttlecockPrice,
    courtPriceNonMember,
    membershipFeeMonthly,
    updateSettings,
    fetchSettings,
    isAuthenticated,
  } = useDataStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [fetchSettings, isAuthenticated]);

  const [tempSettings, setTempSettings] = useState({
    shuttlecockPrice,
    courtPriceNonMember,
    membershipFeeMonthly,
  });

  // Sync tempSettings with store values when they change
  useEffect(() => {
    setTempSettings({
      shuttlecockPrice,
      courtPriceNonMember,
      membershipFeeMonthly,
    });
  }, [shuttlecockPrice, courtPriceNonMember, membershipFeeMonthly]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        shuttlecock_price: tempSettings.shuttlecockPrice,
        court_price_non_member: tempSettings.courtPriceNonMember,
        membership_fee_monthly: tempSettings.membershipFeeMonthly,
      });
      toast.success("Pengaturan berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTempSettings({
      shuttlecockPrice,
      courtPriceNonMember,
      membershipFeeMonthly,
    });
    toast.info("Nilai dikembalikan ke pengaturan terakhir");
  };

  const hasChanges = 
    tempSettings.shuttlecockPrice !== shuttlecockPrice ||
    tempSettings.courtPriceNonMember !== courtPriceNonMember ||
    tempSettings.membershipFeeMonthly !== membershipFeeMonthly;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Konfigurasi parameter biaya dan operasional klub.</p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-300">
            <Button variant="ghost" size="sm" onClick={handleReset} className="rounded-xl h-10">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="rounded-xl h-10 px-6 shadow-lg shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm border-muted/50 overflow-hidden">
            <CardHeader className="bg-muted/20 border-b pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Parameter Biaya
              </CardTitle>
              <CardDescription>Atur nilai dasar untuk perhitungan otomatis keuangan.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              {/* Shuttlecock Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                      <Package className="w-4 h-4 text-emerald-600" />
                    </div>
                    <Label htmlFor="shuttlecockPrice" className="text-sm font-bold">Harga Shuttlecock</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Biaya per satu buah shuttlecock yang digunakan.</p>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium group-focus-within:text-primary transition-colors">Rp</span>
                    <Input
                      id="shuttlecockPrice"
                      type="number"
                      min="0"
                      value={tempSettings.shuttlecockPrice}
                      onChange={(e) => setTempSettings({ ...tempSettings, shuttlecockPrice: parseInt(e.target.value) || 0 })}
                      className="rounded-xl h-12 pl-12 border-muted focus:ring-2 focus:ring-primary/20 text-lg font-semibold"
                    />
                  </div>
                </div>

                {/* Court Price Non-Member */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-orange-50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                    </div>
                    <Label htmlFor="courtPriceNonMember" className="text-sm font-bold">Biaya Lapangan (Guest)</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Biaya tambahan untuk pemain non-member/tamu.</p>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium group-focus-within:text-primary transition-colors">Rp</span>
                    <Input
                      id="courtPriceNonMember"
                      type="number"
                      min="0"
                      value={tempSettings.courtPriceNonMember}
                      onChange={(e) => setTempSettings({ ...tempSettings, courtPriceNonMember: parseInt(e.target.value) || 0 })}
                      className="rounded-xl h-12 pl-12 border-muted focus:ring-2 focus:ring-primary/20 text-lg font-semibold"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-muted/50" />

              {/* Membership Fee */}
              <div className="space-y-2 max-w-md">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <Label htmlFor="membershipFeeMonthly" className="text-sm font-bold">Iuran Bulanan Member</Label>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Biaya keanggotaan tetap yang dibayarkan setiap bulan.</p>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium group-focus-within:text-primary transition-colors">Rp</span>
                  <Input
                    id="membershipFeeMonthly"
                    type="number"
                    min="0"
                    value={tempSettings.membershipFeeMonthly}
                    onChange={(e) => setTempSettings({ ...tempSettings, membershipFeeMonthly: parseInt(e.target.value) || 0 })}
                    className="rounded-xl h-12 pl-12 border-muted focus:ring-2 focus:ring-primary/20 text-lg font-semibold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm border-primary/10 bg-primary/5 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Aturan Perhitungan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-2xl bg-background/80 border border-primary/5 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Member Aktif</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Hanya membayar biaya shuttlecock sesuai jumlah yang digunakan dalam permainan.
                    </p>
                    <Badge variant="outline" className="mt-2 text-[10px] h-5 bg-emerald-50/50 text-emerald-700 border-emerald-100">
                      Cost = Kok x Price
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-muted/50" />

                <div className="flex gap-3">
                  <div className="mt-1">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Pemain Tamu</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Membayar biaya shuttlecock ditambah dengan biaya kontribusi lapangan per kedatangan.
                    </p>
                    <Badge variant="outline" className="mt-2 text-[10px] h-5 bg-orange-50/50 text-orange-700 border-orange-100">
                      Cost = (Kok x Price) + Court Fee
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-center text-muted-foreground px-4 italic leading-relaxed">
                * Perubahan nilai parameter akan langsung berdampak pada pencatatan baru yang akan dibuat.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
