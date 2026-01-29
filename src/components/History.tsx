import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useDataStore } from '../store/useDataStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Search, Filter, Activity, ArrowUpRight, ArrowDownRight, Package, Clock } from 'lucide-react';
import { cn } from './ui/utils';
import { TableCard } from './TableCard';

type TransactionType = 'all' | 'usage' | 'income' | 'expense';

export function History() {
  const { usageRecords, incomeRecords, expenseRecords } = useDataStore();
  const [filterType, setFilterType] = useState<TransactionType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Combine all transactions
  const allTransactions = [
    ...usageRecords.map(r => ({ 
      ...r, 
      type: 'usage' as const, 
      amount: r.total_cost,
      searchText: r.players.map(p => p.name).join(' ')
    })),
    ...incomeRecords.map(r => ({ 
      ...r, 
      type: 'income' as const, 
      searchText: r.description 
    })),
    ...expenseRecords.map(r => ({ 
      ...r, 
      type: 'expense' as const, 
      searchText: r.description 
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter transactions
  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = transaction.searchText?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = !startDate || transaction.date >= startDate;
    const matchesEndDate = !endDate || transaction.date <= endDate;
    
    return matchesType && matchesSearch && matchesStartDate && matchesEndDate;
  });

  // Calculate totals for filtered data
  const filteredIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const filteredExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredUsageCost = filteredTransactions
    .filter(t => t.type === 'usage')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredExpense = filteredExpense + filteredUsageCost;
  const filteredBalance = filteredIncome - totalFilteredExpense;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">Telusuri seluruh riwayat transaksi dan aktivitas klub.</p>
      </div>

      {/* Filter Section */}
      <Card className="shadow-xl border-none bg-white/60 backdrop-blur-sm ring-1 ring-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10 pb-4">
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            Filter Riwayat
          </CardTitle>
          <CardDescription>Sesuaikan tampilan data berdasarkan kebutuhan Anda.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pencarian</Label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="search"
                  placeholder="Nama atau keterangan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl bg-white/50 border-muted focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipe Transaksi</Label>
              <Select value={filterType} onValueChange={(value: string) => setFilterType(value as TransactionType)}>
                <SelectTrigger id="type" className="rounded-xl bg-white/50 border-muted focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="usage">Penggunaan Kok</SelectItem>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl bg-muted/30 border-muted focus:bg-background transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tanggal Akhir</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl bg-muted/30 border-muted focus:bg-background transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Data</p>
                <p className="text-2xl font-bold mt-0.5">{filteredTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Pemasukan</p>
                <p className="text-2xl font-bold mt-0.5">Rp {filteredIncome.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <ArrowDownRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Pengeluaran</p>
                <p className="text-2xl font-bold mt-0.5">Rp {totalFilteredExpense.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "border-none shadow-xl bg-gradient-to-br text-white",
          filteredBalance >= 0 ? "from-indigo-600 to-violet-700" : "from-amber-600 to-orange-700"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Saldo Filter</p>
                <p className="text-2xl font-bold mt-0.5">Rp {filteredBalance.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <TableCard
        header={
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-primary font-bold">Daftar Aktivitas</CardTitle>
            <Badge
              variant="outline"
              className="rounded-full bg-white border-primary/20 text-primary font-medium shadow-sm"
            >
              Menampilkan {filteredTransactions.length} Aktivitas
            </Badge>
          </div>
        }
        headerClassName="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10 pb-4"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="w-[180px]">Waktu</TableHead>
                <TableHead className="w-[150px]">Tipe</TableHead>
                <TableHead>Keterangan / Pemain</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-24 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
                      <Search className="w-16 h-16 mb-4 opacity-10" />
                      <p className="text-lg font-medium">Tidak ada data yang sesuai filter</p>
                      <p className="text-sm">Coba ubah kriteria pencarian atau filter Anda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <TableRow key={index} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(transaction.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "rounded-full px-3 py-0.5 font-bold border-none shadow-sm text-[10px] uppercase tracking-wider",
                        transaction.type === 'usage' ? "bg-indigo-50 text-indigo-600" :
                        transaction.type === 'income' ? "bg-emerald-50 text-emerald-600" :
                        "bg-rose-50 text-rose-600"
                      )}>
                        {transaction.type === 'usage' ? 'Penggunaan' :
                         transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[500px]">
                        {transaction.type === 'usage' && 'players' in transaction ? (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {transaction.players.map((player, idx) => (
                                <Badge
                                  key={idx}
                                  className={cn(
                                    "text-[10px] font-bold rounded-full border-none px-2 shadow-sm",
                                    player.is_member ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                  )}
                                >
                                  {player.name}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Package className="w-3 h-3" />
                              <span>{transaction.quantity} Shuttlecock</span>
                            </div>
                          </div>
                        ) : (
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {'description' in transaction ? transaction.description : ''}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "text-sm font-black",
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      )}>
                        {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TableCard>
    </div>
  );
}
