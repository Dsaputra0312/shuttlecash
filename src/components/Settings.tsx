import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useDataStore } from '../store/useDataStore';
import { Settings as SettingsIcon, DollarSign, Award, Package } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const { 
    shuttlecockPrice, 
    courtPriceNonMember, 
    membershipFeeMonthly,
    setShuttlecockPrice,
    setCourtPriceNonMember,
    setMembershipFeeMonthly
  } = useDataStore();

  const [tempSettings, setTempSettings] = useState({
    shuttlecockPrice,
    courtPriceNonMember,
    membershipFeeMonthly
  });

  const handleSave = () => {
    setShuttlecockPrice(tempSettings.shuttlecockPrice);
    setCourtPriceNonMember(tempSettings.courtPriceNonMember);
    setMembershipFeeMonthly(tempSettings.membershipFeeMonthly);
    toast.success('Pengaturan berhasil disimpan!');
  };

  const handleReset = () => {
    setTempSettings({
      shuttlecockPrice,
      courtPriceNonMember,
      membershipFeeMonthly
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md border-t-4 border-t-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
            Pengaturan Harga
          </CardTitle>
          <CardDescription>
            Atur harga shuttlecock, lapangan non-member, dan iuran member bulanan
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shuttlecock Price */}
            <Card className="border-2 border-emerald-200 bg-emerald-50/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 text-white p-3 rounded-xl">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Harga Shuttlecock</CardTitle>
                    <CardDescription>Per pcs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="shuttlecockPrice">Harga (Rp)</Label>
                  <Input
                    id="shuttlecockPrice"
                    type="number"
                    min="0"
                    value={tempSettings.shuttlecockPrice}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      shuttlecockPrice: parseInt(e.target.value) || 0
                    })}
                    className="text-lg border-emerald-300 focus:border-emerald-500"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Harga saat ini: <span className="text-emerald-600">Rp {shuttlecockPrice.toLocaleString('id-ID')}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Court Price Non-Member */}
            <Card className="border-2 border-orange-200 bg-orange-50/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 text-white p-3 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Harga Lapangan</CardTitle>
                    <CardDescription>Non-Member</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="courtPriceNonMember">Harga (Rp)</Label>
                  <Input
                    id="courtPriceNonMember"
                    type="number"
                    min="0"
                    value={tempSettings.courtPriceNonMember}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      courtPriceNonMember: parseInt(e.target.value) || 0
                    })}
                    className="text-lg border-orange-300 focus:border-orange-500"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Harga saat ini: <span className="text-orange-600">Rp {courtPriceNonMember.toLocaleString('id-ID')}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Membership Fee */}
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white p-3 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Iuran Member</CardTitle>
                    <CardDescription>Per bulan</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="membershipFeeMonthly">Harga (Rp)</Label>
                  <Input
                    id="membershipFeeMonthly"
                    type="number"
                    min="0"
                    value={tempSettings.membershipFeeMonthly}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      membershipFeeMonthly: parseInt(e.target.value) || 0
                    })}
                    className="text-lg border-blue-300 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Harga saat ini: <span className="text-blue-600">Rp {membershipFeeMonthly.toLocaleString('id-ID')}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 justify-end">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-gray-300"
            >
              Reset
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            >
              Simpan Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="shadow-md bg-gradient-to-r from-blue-50 to-emerald-50 border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-blue-900">
              <SettingsIcon className="w-5 h-5" />
              Informasi Perhitungan
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✓</div>
                <div>
                  <p className="text-emerald-700"><strong>Member:</strong></p>
                  <p className="text-gray-600 ml-1">Total Biaya = Jumlah Kok × Harga Kok</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">✗</div>
                <div>
                  <p className="text-orange-700"><strong>Non-Member:</strong></p>
                  <p className="text-gray-600 ml-1">Total Biaya = (Jumlah Kok × Harga Kok) + Harga Lapangan Non-Member</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
