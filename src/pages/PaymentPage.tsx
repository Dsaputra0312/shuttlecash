import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, Loader2 } from "lucide-react";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { CardDescription, CardTitle } from "../components/ui/card";
import { TableCard } from "../components/TableCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { useSettlements, Settlement } from "../hooks/useSettlements";

export function PaymentPage() {
  const [date, setDate] = useState<Date>(new Date());
  const { settlements, loading, fetchSettlements, paySettlement } = useSettlements();
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (date) {
      fetchSettlements(format(date, "yyyy-MM-dd"));
    }
  }, [date, fetchSettlements]);

  const handlePayClick = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setPaymentAmount(settlement.totalBill.toString());
    setIsDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedSettlement || !paymentAmount) return;

    setIsSubmitting(true);
    const amount = parseInt(paymentAmount);
    
    const success = await paySettlement({
      date: format(date, "yyyy-MM-dd"),
      memberId: selectedSettlement.memberId,
      amount: amount,
      totalBill: selectedSettlement.totalBill,
      playerName: selectedSettlement.name
    });

    setIsSubmitting(false);
    if (success) {
      setIsDialogOpen(false);
      setSelectedSettlement(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pembayaran Shuttlecock</h1>
          <p className="text-muted-foreground">
            Kelola pembayaran harian pemain.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d: Date | undefined) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <TableCard
        className="ring-blue-100"
        headerClassName="bg-gradient-to-r from-blue-50 to-indigo-50/50 border-b border-blue-100 pb-6"
        header={
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Daftar Tagihan</CardTitle>
              <CardDescription>Tagihan pemain untuk tanggal terpilih.</CardDescription>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 rounded-full bg-white border-blue-200 text-blue-700 font-bold shadow-sm"
            >
              {settlements.length} Pemain
            </Badge>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead>Nama Pemain</TableHead>
                <TableHead className="text-right">Jumlah Kok</TableHead>
                <TableHead>Status Member</TableHead>
                <TableHead>Rincian Tagihan</TableHead>
                <TableHead className="text-right">Total Bayar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : settlements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Tidak ada data permainan untuk tanggal ini.
                  </TableCell>
                </TableRow>
              ) : (
                settlements.map((settlement) => (
                  <TableRow
                    key={settlement.memberId}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-semibold group-hover:text-primary transition-colors">
                      {settlement.name}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {settlement.shuttlecockCount.toFixed(1)}
                    </TableCell>
                    <TableCell>
                      {settlement.isMember ? (
                        <Badge className="rounded-full px-3 py-0.5 font-medium border-none shadow-sm bg-emerald-50 text-emerald-600">
                          Member
                        </Badge>
                      ) : (
                        <Badge className="rounded-full px-3 py-0.5 font-medium border-none shadow-sm bg-orange-50 text-orange-600">
                          Non-Member
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div>Kok: {formatCurrency(settlement.shuttlecockCost)}</div>
                      {!settlement.isMember && (
                        <div>Lapangan: {formatCurrency(settlement.courtFee)}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums">
                      <div>Rp {settlement.totalBill.toLocaleString("id-ID")}</div>
                      {settlement.overpayment > 0 && (
                        <div className="text-xs text-emerald-600 font-medium">
                          +{formatCurrency(settlement.overpayment)} (Lebih)
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {settlement.status === "paid" ? (
                        <Badge className="rounded-full px-3 py-0.5 font-bold border-none shadow-sm bg-emerald-50 text-emerald-600">
                          Lunas
                        </Badge>
                      ) : (
                        <Badge className="rounded-full px-3 py-0.5 font-bold border-none shadow-sm bg-rose-50 text-rose-600">
                          Belum Lunas
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handlePayClick(settlement)}
                        disabled={settlement.status === "paid"}
                      >
                        {settlement.status === "paid" ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Lunas
                          </>
                        ) : (
                          "Bayar"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TableCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
            <DialogDescription>
              Masukkan jumlah pembayaran untuk {selectedSettlement?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Tagihan</Label>
              <div className="col-span-3 font-bold">
                {selectedSettlement && formatCurrency(selectedSettlement.totalBill)}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Bayar
              </Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
            {paymentAmount && selectedSettlement && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3 text-sm">
                  {parseInt(paymentAmount) > selectedSettlement.totalBill ? (
                    <span className="text-green-600">
                      Lebih bayar: {formatCurrency(parseInt(paymentAmount) - selectedSettlement.totalBill)}
                    </span>
                  ) : parseInt(paymentAmount) < selectedSettlement.totalBill ? (
                    <span className="text-red-600">
                      Kurang bayar: {formatCurrency(selectedSettlement.totalBill - parseInt(paymentAmount))}
                    </span>
                  ) : (
                    <span className="text-green-600">Pas</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleConfirmPayment} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Konfirmasi Lunas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
