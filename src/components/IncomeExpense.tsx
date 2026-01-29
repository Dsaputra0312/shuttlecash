import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useDataStore } from "../store/useDataStore";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar as CalendarIcon,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function IncomeExpense() {
  const {
    incomeRecords,
    expenseRecords,
    addIncomeRecord,
    addExpenseRecord,
    deleteIncomeRecord,
    deleteExpenseRecord,
    fetchIncomeRecords,
    fetchExpenseRecords,
    isAuthenticated,
    loadingStates,
  } = useDataStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchIncomeRecords();
      fetchExpenseRecords();
    }
  }, [fetchIncomeRecords, fetchExpenseRecords, isAuthenticated]);

  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [incomeSearch, setIncomeSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");
  const [isSubmittingIncome, setIsSubmittingIncome] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<{ id: string; type: "income" | "expense" } | null>(null);

  const [newIncome, setNewIncome] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
  });

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
  });

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newIncome.description.trim() && newIncome.amount > 0) {
      setIsSubmittingIncome(true);
      try {
        await addIncomeRecord(newIncome);
        setNewIncome({
          date: new Date().toISOString().split("T")[0],
          description: "",
          amount: 0,
        });
        setIsIncomeDialogOpen(false);
        toast.success("Pemasukan berhasil dicatat!");
      } catch (error) {
        toast.error("Gagal mencatat pemasukan");
      } finally {
        setIsSubmittingIncome(false);
      }
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.description.trim() && newExpense.amount > 0) {
      setIsSubmittingExpense(true);
      try {
        await addExpenseRecord(newExpense);
        setNewExpense({
          date: new Date().toISOString().split("T")[0],
          description: "",
          amount: 0,
        });
        setIsExpenseDialogOpen(false);
        toast.success("Pengeluaran berhasil dicatat!");
      } catch (error) {
        toast.error("Gagal mencatat pengeluaran");
      } finally {
        setIsSubmittingExpense(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      setIsDeleting(true);
      try {
        if (recordToDelete.type === "income") {
          await deleteIncomeRecord(recordToDelete.id);
          toast.success("Pemasukan berhasil dihapus!");
        } else {
          await deleteExpenseRecord(recordToDelete.id);
          toast.success("Pengeluaran berhasil dihapus!");
        }
      } catch (error) {
        toast.error("Gagal menghapus data");
      } finally {
        setIsDeleting(false);
        setRecordToDelete(null);
      }
    }
  };

  const filteredIncome = incomeRecords.filter(r => 
    r.description.toLowerCase().includes(incomeSearch.toLowerCase())
  );

  const filteredExpense = expenseRecords.filter(r => 
    r.description.toLowerCase().includes(expenseSearch.toLowerCase())
  );

  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = expenseRecords.reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">Kelola arus kas masuk dan keluar klub secara transparan.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Pemasukan</p>
                <p className="text-3xl font-bold mt-0.5">Rp {totalIncome.toLocaleString("id-ID")}</p>
                <p className="text-xs opacity-70 mt-1">{incomeRecords.length} Transaksi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="w-16 h-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <ArrowDownRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Pengeluaran</p>
                <p className="text-3xl font-bold mt-0.5">Rp {totalExpense.toLocaleString("id-ID")}</p>
                <p className="text-xs opacity-70 mt-1">{expenseRecords.length} Transaksi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`relative overflow-hidden border-none shadow-xl bg-gradient-to-br ${
            balance >= 0 ? "from-indigo-600 to-violet-700" : "from-amber-600 to-orange-700"
          } text-white`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-16 h-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Saldo Akhir</p>
                <p className="text-3xl font-bold mt-0.5">Rp {balance.toLocaleString("id-ID")}</p>
                <p className="text-xs opacity-70 mt-1">{balance >= 0 ? "Surplus Keuangan" : "Defisit Keuangan"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="w-full max-w-[400px] grid grid-cols-2 p-1.5 bg-muted/50 rounded-2xl mb-8 border border-white/20 shadow-sm">
          <TabsTrigger 
            value="income" 
            className="rounded-xl py-2.5 font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg shadow-emerald-500/30 transition-all duration-300"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Pemasukan
          </TabsTrigger>
          <TabsTrigger 
            value="expense" 
            className="rounded-xl py-2.5 font-bold data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg shadow-rose-500/30 transition-all duration-300"
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Pengeluaran
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="animate-in fade-in slide-in-from-left-4 duration-500 focus-visible:outline-none">
          <Card className="shadow-xl border-none overflow-hidden bg-white/60 backdrop-blur-sm ring-1 ring-emerald-100">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border-b border-emerald-100 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 group-focus-within:text-emerald-700 transition-colors" />
                  <Input 
                    placeholder="Cari transaksi pemasukan..." 
                    className="pl-10 rounded-xl bg-white border-emerald-100 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
                    value={incomeSearch}
                    onChange={(e) => setIncomeSearch(e.target.value)}
                  />
                </div>
                <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-xl shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Pemasukan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Catat Pemasukan</DialogTitle>
                      <DialogDescription>Tambahkan catatan pemasukan kas baru ke sistem.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleIncomeSubmit} className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="income-date" className="text-sm font-bold">Tanggal</Label>
                        <Input
                          id="income-date"
                          type="date"
                          value={newIncome.date}
                          onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                          className="rounded-xl h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="income-description" className="text-sm font-bold">Keterangan</Label>
                        <Textarea
                          id="income-description"
                          placeholder="Contoh: Iuran bulanan dari member..."
                          value={newIncome.description}
                          onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                          className="rounded-xl min-h-[100px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="income-amount" className="text-sm font-bold">Jumlah (Rp)</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                          <Input
                            id="income-amount"
                            type="number"
                            placeholder="0"
                            value={newIncome.amount || ""}
                            onChange={(e) => setNewIncome({ ...newIncome, amount: parseInt(e.target.value) || 0 })}
                            className="rounded-xl h-11 pl-12"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsIncomeDialogOpen(false)} className="rounded-xl">Batal</Button>
                        <Button type="submit" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8" disabled={isSubmittingIncome}>
                          {isSubmittingIncome ? "Menyimpan..." : "Simpan Pemasukan"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingStates.incomeRecords ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                          <TableCell><div className="w-48 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                          <TableCell className="text-right"><div className="w-24 h-4 bg-muted rounded ml-auto animate-pulse"></div></TableCell>
                          <TableCell className="text-right"><div className="w-8 h-8 bg-muted rounded ml-auto animate-pulse"></div></TableCell>
                        </TableRow>
                      ))
                    ) : filteredIncome.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                          <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
                            <TrendingUp className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-lg font-medium">Tidak ada data pemasukan</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIncome.slice().reverse().map((record) => (
                        <TableRow key={record.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                              {new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[400px]">
                            <p className="font-medium group-hover:text-emerald-600 transition-colors">{record.description}</p>
                          </TableCell>
                          <TableCell className="text-right font-bold text-emerald-600">
                            + Rp {record.amount.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setRecordToDelete({ id: record.id, type: "income" })}
                              className="text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg h-8 w-8"
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
        </TabsContent>

        <TabsContent value="expense" className="animate-in fade-in slide-in-from-right-4 duration-500 focus-visible:outline-none">
          <Card className="shadow-xl border-none overflow-hidden bg-white/60 backdrop-blur-sm ring-1 ring-rose-100">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-orange-50/50 border-b border-rose-100 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-600 group-focus-within:text-rose-700 transition-colors" />
                  <Input 
                    placeholder="Cari transaksi pengeluaran..." 
                    className="pl-10 rounded-xl bg-white border-rose-100 focus:border-rose-300 focus:ring-4 focus:ring-rose-100 transition-all shadow-sm"
                    value={expenseSearch}
                    onChange={(e) => setExpenseSearch(e.target.value)}
                  />
                </div>
                <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-xl shadow-lg shadow-rose-500/20 bg-rose-600 hover:bg-rose-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Pengeluaran
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Catat Pengeluaran</DialogTitle>
                      <DialogDescription>Tambahkan catatan pengeluaran kas baru ke sistem.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleExpenseSubmit} className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-date" className="text-sm font-bold">Tanggal</Label>
                        <Input
                          id="expense-date"
                          type="date"
                          value={newExpense.date}
                          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                          className="rounded-xl h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expense-description" className="text-sm font-bold">Keterangan</Label>
                        <Textarea
                          id="expense-description"
                          placeholder="Contoh: Beli 2 slop shuttlecock..."
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                          className="rounded-xl min-h-[100px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expense-amount" className="text-sm font-bold">Jumlah (Rp)</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                          <Input
                            id="expense-amount"
                            type="number"
                            placeholder="0"
                            value={newExpense.amount || ""}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: parseInt(e.target.value) || 0 })}
                            className="rounded-xl h-11 pl-12"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsExpenseDialogOpen(false)} className="rounded-xl">Batal</Button>
                        <Button type="submit" className="rounded-xl bg-rose-600 hover:bg-rose-700 px-8" disabled={isSubmittingExpense}>
                          {isSubmittingExpense ? "Menyimpan..." : "Simpan Pengeluaran"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingStates.expenseRecords ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                          <TableCell><div className="w-48 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                          <TableCell className="text-right"><div className="w-24 h-4 bg-muted rounded ml-auto animate-pulse"></div></TableCell>
                          <TableCell className="text-right"><div className="w-8 h-8 bg-muted rounded ml-auto animate-pulse"></div></TableCell>
                        </TableRow>
                      ))
                    ) : filteredExpense.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                          <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
                            <TrendingDown className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-lg font-medium">Tidak ada data pengeluaran</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpense.slice().reverse().map((record) => (
                        <TableRow key={record.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                              {new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[400px]">
                            <p className="font-medium group-hover:text-rose-600 transition-colors">{record.description}</p>
                          </TableCell>
                          <TableCell className="text-right font-bold text-rose-600">
                            - Rp {record.amount.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setRecordToDelete({ id: record.id, type: "expense" })}
                              className="text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg h-8 w-8"
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
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!recordToDelete} onOpenChange={(open: boolean) => !open && setRecordToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data transaksi akan dihapus secara permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={!!isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
              disabled={!!isDeleting}
            >
              {isDeleting ? (
                <>Menghapus...</>
              ) : (
                <>Ya, Hapus</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
