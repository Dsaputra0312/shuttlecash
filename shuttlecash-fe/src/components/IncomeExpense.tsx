import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useDataStore } from '../store/useDataStore';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

export function IncomeExpense() {
  const { 
    incomeRecords, 
    expenseRecords, 
    addIncomeRecord, 
    addExpenseRecord, 
    deleteIncomeRecord, 
    deleteExpenseRecord 
  } = useDataStore();

  const [newIncome, setNewIncome] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
  });

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
  });

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIncome.description.trim() && newIncome.amount > 0) {
      addIncomeRecord(newIncome);
      setNewIncome({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
      });
    }
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.description.trim() && newExpense.amount > 0) {
      addExpenseRecord(newExpense);
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
      });
    }
  };

  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = expenseRecords.reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm opacity-90 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl tracking-tight">Rp {totalIncome.toLocaleString('id-ID')}</p>
            <p className="text-xs text-green-100 mt-1">{incomeRecords.length} transaksi</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-orange-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm opacity-90 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Total Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl tracking-tight">Rp {totalExpense.toLocaleString('id-ID')}</p>
            <p className="text-xs text-red-100 mt-1">{expenseRecords.length} transaksi</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-red-600'} text-white border-0 shadow-lg`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm opacity-90 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Saldo Akhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl tracking-tight">Rp {balance.toLocaleString('id-ID')}</p>
            <p className="text-xs text-blue-100 mt-1">{balance >= 0 ? 'Surplus' : 'Defisit'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Income and Expense */}
      <Tabs defaultValue="income" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md">
          <TabsTrigger value="income" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Pemasukan
          </TabsTrigger>
          <TabsTrigger value="expense" className="gap-2">
            <TrendingDown className="w-4 h-4" />
            Pengeluaran
          </TabsTrigger>
        </TabsList>

        {/* Income Tab */}
        <TabsContent value="income" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-md border-t-4 border-t-green-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  Tambah Pemasukan
                </CardTitle>
                <CardDescription>Catat pemasukan dari member atau sumber lain</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleIncomeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="income-date">Tanggal</Label>
                    <Input
                      id="income-date"
                      type="date"
                      value={newIncome.date}
                      onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income-description">Keterangan</Label>
                    <Textarea
                      id="income-description"
                      placeholder="Contoh: Member Hasanuddin, Iuran bulan November"
                      value={newIncome.description}
                      onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                      className="border-gray-300 focus:border-green-500"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income-amount">Jumlah (Rp)</Label>
                    <Input
                      id="income-amount"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newIncome.amount || ''}
                      onChange={(e) => setNewIncome({ ...newIncome, amount: parseInt(e.target.value) || 0 })}
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Pemasukan
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle>Daftar Pemasukan</CardTitle>
                <CardDescription>Riwayat pemasukan klub</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incomeRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Belum ada data pemasukan</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        incomeRecords.slice().reverse().map((record, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell>
                              <Badge variant="outline">
                                {new Date(record.date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.description}</TableCell>
                            <TableCell className="text-right text-green-600">
                              + Rp {record.amount.toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteIncomeRecord(incomeRecords.length - 1 - index)}
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
        </TabsContent>

        {/* Expense Tab */}
        <TabsContent value="expense" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-md border-t-4 border-t-orange-500">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-orange-600" />
                  Tambah Pengeluaran
                </CardTitle>
                <CardDescription>Catat pengeluaran untuk pembelian shuttlecock atau lainnya</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Tanggal</Label>
                    <Input
                      id="expense-date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="border-gray-300 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expense-description">Keterangan</Label>
                    <Textarea
                      id="expense-description"
                      placeholder="Contoh: Beli shuttlecock 1 slop @30.000"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="border-gray-300 focus:border-orange-500"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Jumlah (Rp)</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseInt(e.target.value) || 0 })}
                      className="border-gray-300 focus:border-orange-500"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Pengeluaran
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle>Daftar Pengeluaran</CardTitle>
                <CardDescription>Riwayat pengeluaran klub</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                            <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Belum ada data pengeluaran</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        expenseRecords.slice().reverse().map((record, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell>
                              <Badge variant="outline">
                                {new Date(record.date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.description}</TableCell>
                            <TableCell className="text-right text-red-600">
                              - Rp {record.amount.toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteExpenseRecord(expenseRecords.length - 1 - index)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
