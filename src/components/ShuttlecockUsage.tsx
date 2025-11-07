import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useDataStore, Member } from '../store/useDataStore';
import { Plus, Trash2, Calendar, User, Package, Award, Users, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';

export function ShuttlecockUsage() {
  const { 
    usageRecords, 
    addUsageRecord, 
    deleteUsageRecord, 
    shuttlecockPrice, 
    courtPriceNonMember,
    members 
  } = useDataStore();
  
  const [selectedPlayers, setSelectedPlayers] = useState<Member[]>([]);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: 1,
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const calculateTotalCost = (quantity: number, hasNonMember: boolean) => {
    const shuttlecockCost = quantity * shuttlecockPrice;
    return hasNonMember ? shuttlecockCost + courtPriceNonMember : shuttlecockCost;
  };

  const hasNonMember = selectedPlayers.some(player => !player.isMember);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayers.length === 0) {
      toast.error('Pilih minimal 1 pemain');
      return;
    }
    if (newRecord.quantity > 0) {
      addUsageRecord({
        players: selectedPlayers,
        date: newRecord.date,
        quantity: newRecord.quantity,
        hasNonMember,
        totalCost: calculateTotalCost(newRecord.quantity, hasNonMember),
      });
      toast.success('Pencatatan berhasil ditambahkan!');
      setSelectedPlayers([]);
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        quantity: 1,
      });
    }
  };

  const togglePlayer = (player: Member) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.find(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else {
        if (prev.length >= 4) {
          toast.warning('Maksimal 4 pemain per permainan');
          return prev;
        }
        return [...prev, player];
      }
    });
  };

  const removePlayer = (playerId: string) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const totalToday = usageRecords
    .filter(r => r.date === new Date().toISOString().split('T')[0])
    .reduce((sum, r) => sum + r.quantity, 0);

  const totalCostToday = usageRecords
    .filter(r => r.date === new Date().toISOString().split('T')[0])
    .reduce((sum, r) => sum + r.totalCost, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-md border-t-4 border-t-emerald-500">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Tambah Penggunaan
            </CardTitle>
            <CardDescription>Catat penggunaan shuttlecock hari ini</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Pilih Pemain (2-4 orang)
                </Label>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left border-gray-300 hover:border-emerald-500"
                      type="button"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {selectedPlayers.length === 0 ? 'Pilih pemain...' : `${selectedPlayers.length} pemain dipilih`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari pemain..." />
                      <CommandList>
                        <CommandEmpty>
                          {members.length === 0 ? (
                            <div className="py-6 text-center text-sm">
                              <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                              <p className="text-gray-500">Belum ada data member</p>
                              <p className="text-xs text-gray-400 mt-1">Tambahkan member di menu Member</p>
                            </div>
                          ) : (
                            'Pemain tidak ditemukan'
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {members.map((member) => {
                            const isSelected = selectedPlayers.find(p => p.id === member.id);
                            return (
                              <CommandItem
                                key={member.id}
                                onSelect={() => togglePlayer(member)}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`${isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-200'} w-5 h-5 rounded flex items-center justify-center text-xs`}>
                                    {isSelected && '✓'}
                                  </div>
                                  <div className={`${member.isMember ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'} p-1.5 rounded`}>
                                    {member.isMember ? (
                                      <Award className="w-3.5 h-3.5" />
                                    ) : (
                                      <User className="w-3.5 h-3.5" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.grade}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {member.isMember ? 'Member' : 'Non-Member'}
                                </Badge>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Selected Players */}
              {selectedPlayers.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Pemain Terpilih ({selectedPlayers.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlayers.map((player) => (
                      <Badge
                        key={player.id}
                        className={`${player.isMember ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'} pr-1`}
                      >
                        <span className="flex items-center gap-1">
                          {player.isMember ? <Award className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {player.name}
                          <button
                            type="button"
                            onClick={() => removePlayer(player.id)}
                            className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Tanggal
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className="border-gray-300 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  Jumlah Kok (Total Permainan)
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newRecord.quantity}
                  onChange={(e) => setNewRecord({ ...newRecord, quantity: parseInt(e.target.value) || 1 })}
                  className="border-gray-300 focus:border-emerald-500"
                />
              </div>

              <div className={`${hasNonMember ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200'} p-4 rounded-lg border-2 space-y-2`}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kok ({newRecord.quantity} × Rp {shuttlecockPrice.toLocaleString('id-ID')})</span>
                  <span>Rp {(newRecord.quantity * shuttlecockPrice).toLocaleString('id-ID')}</span>
                </div>
                {hasNonMember && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Biaya Lapangan</span>
                      <span>Rp {courtPriceNonMember.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
                      ⚠ Ada pemain non-member, biaya lapangan ditambahkan
                    </div>
                  </>
                )}
                <div className={`flex justify-between pt-2 border-t ${hasNonMember ? 'border-orange-300' : 'border-emerald-300'}`}>
                  <span className="text-gray-700">Total Biaya</span>
                  <span className={`text-xl ${hasNonMember ? 'text-orange-600' : 'text-emerald-600'}`}>
                    Rp {calculateTotalCost(newRecord.quantity, hasNonMember).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                disabled={selectedPlayers.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pencatatan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Daftar Penggunaan Kok</CardTitle>
                <CardDescription>Riwayat penggunaan shuttlecock</CardDescription>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-gray-600">Hari Ini</p>
                  <p className="text-emerald-600">{totalToday} kok</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-gray-600">Total</p>
                  <p className="text-blue-600">Rp {totalCostToday.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Pemain</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Total Biaya</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Belum ada data penggunaan shuttlecock</p>
                        <p className="text-sm mt-1">Mulai tambahkan pencatatan di form sebelah kiri</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    usageRecords.slice().reverse().map((record, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {record.players.map((player, idx) => (
                              <Badge
                                key={idx}
                                className={`${player.isMember ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'} text-xs`}
                              >
                                {player.isMember ? <Award className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                {player.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(record.date).toLocaleDateString('id-ID', { 
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {record.quantity} pcs
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p>Rp {record.totalCost.toLocaleString('id-ID')}</p>
                            {record.hasNonMember && (
                              <p className="text-xs text-orange-600">+ Lapangan</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUsageRecord(usageRecords.length - 1 - index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
