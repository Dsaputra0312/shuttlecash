import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useDataStore } from '../store/useDataStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Search, Filter, TrendingUp, TrendingDown, Activity, Award } from 'lucide-react';

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
      amount: r.totalCost,
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
    <div className="space-y-6">
      {/* Filter Section */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filter Riwayat
          </CardTitle>
          <CardDescription>Cari dan filter transaksi berdasarkan kriteria</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Cari</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nama atau keterangan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipe Transaksi</Label>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as TransactionType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="usage">Penggunaan Kok</SelectItem>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Akhir</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Transaksi</p>
                <p className="text-2xl mt-1">{filteredTransactions.length}</p>
              </div>
              <Activity className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Pemasukan</p>
                <p className="text-2xl mt-1">Rp {filteredIncome.toLocaleString('id-ID')}</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Pengeluaran</p>
                <p className="text-2xl mt-1">Rp {totalFilteredExpense.toLocaleString('id-ID')}</p>
              </div>
              <TrendingDown className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${filteredBalance >= 0 ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} text-white border-0 shadow-md`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Saldo</p>
                <p className="text-2xl mt-1">Rp {filteredBalance.toLocaleString('id-ID')}</p>
              </div>
              <Calendar className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
          <CardTitle>Daftar Riwayat Transaksi</CardTitle>
          <CardDescription>
            Menampilkan {filteredTransactions.length} dari {allTransactions.length} transaksi
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada transaksi yang sesuai dengan filter</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(transaction.date).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.type === 'usage' && (
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                            <Activity className="w-3 h-3 mr-1" />
                            Penggunaan Kok
                          </Badge>
                        )}
                        {transaction.type === 'income' && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Pemasukan
                          </Badge>
                        )}
                        {transaction.type === 'expense' && (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Pengeluaran
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          {transaction.type === 'usage' && 'players' in transaction ? (
                            <>
                              <div className="flex flex-wrap gap-1">
                                {transaction.players.map((player, idx) => (
                                  <Badge
                                    key={idx}
                                    className={`${player.isMember ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'} text-xs`}
                                  >
                                    {player.isMember ? <Award className="w-3 h-3 mr-1" /> : null}
                                    {player.name}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{transaction.quantity} shuttlecock</p>
                            </>
                          ) : (
                            <p>{'description' in transaction ? transaction.description : ''}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={
                          transaction.type === 'income' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }>
                          {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
                        </span>
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
  );
}
