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
import { useDataStore, Member } from "../store/useDataStore";
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  User,
  Package,
  Award,
  Users,
  X,
  Check,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
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
import { cn } from "./ui/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function ShuttlecockUsage() {
  const {
    usageRecords,
    addUsageRecord,
    deleteUsageRecord,
    shuttlecockPrice,
    courtPriceNonMember,
    members,
    fetchUsageRecords,
    fetchSettings,
    fetchMembers,
    isAuthenticated,
    loadingStates,
  } = useDataStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
      fetchUsageRecords();
      fetchSettings();
    }
  }, [fetchMembers, fetchUsageRecords, fetchSettings, isAuthenticated]);

  const [selectedPlayers, setSelectedPlayers] = useState<Member[]>([]);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: 1,
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const calculateTotalCost = (quantity: number, hasNonMember: boolean) => {
    return quantity * shuttlecockPrice;
  };

  const hasNonMember = selectedPlayers.some((player) => !player.is_member);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayers.length === 0) {
      toast.error("Pilih minimal 1 pemain");
      return;
    }
    if (newRecord.quantity > 0) {
      setIsSubmitting(true);
      try {
        await addUsageRecord({
          players: selectedPlayers,
          date: newRecord.date,
          quantity: newRecord.quantity,
          has_non_member: hasNonMember,
          total_cost: calculateTotalCost(newRecord.quantity, hasNonMember),
        });
        toast.success("Pencatatan berhasil ditambahkan!");
        setSelectedPlayers([]);
        setNewRecord({
          date: new Date().toISOString().split("T")[0],
          quantity: 1,
        });
      } catch (error) {
        toast.error("Gagal menyimpan catatan penggunaan");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      setIsDeleting(recordToDelete);
      try {
        await deleteUsageRecord(recordToDelete);
        toast.success("Catatan berhasil dihapus!");
      } catch (error) {
        toast.error("Gagal menghapus catatan");
      } finally {
        setIsDeleting(null);
        setRecordToDelete(null);
      }
    }
  };

  const togglePlayer = (player: Member) => {
    const isSelected = selectedPlayers.find((p) => p.id === player.id);
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      if (selectedPlayers.length >= 4) {
        toast.warning("Maksimal 4 pemain per permainan");
        return;
      }
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const removePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
  };

  const totalToday = usageRecords
    .filter((r) => r.date === new Date().toISOString().split("T")[0])
    .reduce((sum, r) => sum + r.quantity, 0);

  const totalCostToday = usageRecords
    .filter((r) => r.date === new Date().toISOString().split("T")[0])
    .reduce((sum, r) => sum + r.total_cost, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shuttlecock</h1>
        <p className="text-muted-foreground">Catat penggunaan kok per sesi permainan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-xl border-none overflow-hidden h-fit sticky top-24 bg-white/50 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/10 pb-6">
            <CardTitle className="flex items-center gap-3 text-primary">
              <div className="p-2 bg-primary rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5" />
              </div>
              Catat Sesi
            </CardTitle>
            <CardDescription className="text-primary/70 font-medium">
              Input data penggunaan kok hari ini
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold">Pilih Pemain (2-4 orang)</Label>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isPopoverOpen}
                      className="w-full justify-between rounded-xl h-11 border-muted"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="truncate">
                          {selectedPlayers.length === 0
                            ? "Pilih pemain..."
                            : `${selectedPlayers.length} pemain dipilih`}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-2xl shadow-xl border-muted" align="start">
                    <Command className="rounded-2xl">
                      <CommandInput placeholder="Cari pemain..." className="h-11" />
                      <CommandList className="max-h-60">
                        <CommandEmpty className="py-6 text-center text-sm">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-10" />
                          <p className="text-muted-foreground">Pemain tidak ditemukan</p>
                        </CommandEmpty>
                        <CommandGroup>
                          {members.map((member) => {
                            const isSelected = selectedPlayers.find((p) => p.id === member.id);
                            return (
                              <CommandItem
                                key={member.id}
                                value={member.name}
                                onSelect={() => togglePlayer(member)}
                                className="flex items-center justify-between px-3 py-2 cursor-pointer rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                                    isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted"
                                  )}>
                                    {isSelected && <Check className="h-3 w-3" />}
                                  </div>
                                  <Avatar className="h-8 w-8 border border-muted">
                                    <AvatarFallback className={cn("text-[10px] font-bold", member.is_member ? "bg-primary/10 text-primary" : "bg-muted")}>
                                      {member.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{member.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{member.grade}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className={cn(
                                  "text-[10px] h-5 rounded-full border-none px-2",
                                  member.is_member ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                )}>
                                  {member.is_member ? "Member" : "Guest"}
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

              {/* Selected Players Tags */}
              {selectedPlayers.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-muted/30 border border-muted/50">
                  {selectedPlayers.map((player) => (
                    <Badge
                      key={player.id}
                      className={cn(
                        "rounded-full pl-2 pr-1 py-1 gap-1 border-none shadow-sm",
                        player.is_member ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                      )}>
                      <span className="text-xs font-semibold">{player.name}</span>
                      <button
                        type="button"
                        onClick={() => removePlayer(player.id)}
                        className="hover:bg-black/5 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-bold">Tanggal</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      className="rounded-xl h-11 pl-10 border-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-bold">Jumlah Kok</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newRecord.quantity}
                      onChange={(e) => setNewRecord({ ...newRecord, quantity: parseInt(e.target.value) || 1 })}
                      className="rounded-xl h-11 pl-10 border-muted"
                    />
                  </div>
                </div>
              </div>

              <div className={cn(
                "p-5 rounded-2xl border-2 transition-colors",
                hasNonMember ? "bg-orange-50 border-orange-100" : "bg-emerald-50 border-emerald-100"
              )}>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Shuttlecock ({newRecord.quantity}x)</span>
                    <span className="font-bold">Rp {(newRecord.quantity * shuttlecockPrice).toLocaleString("id-ID")}</span>
                  </div>
                  <div className={cn("pt-3 border-t flex justify-between items-center", hasNonMember ? "border-orange-200" : "border-emerald-200")}>
                    <span className="font-bold text-sm">Total Estimasi</span>
                    <span className={cn("text-2xl font-black", hasNonMember ? "text-orange-600" : "text-emerald-600")}>
                      Rp {calculateTotalCost(newRecord.quantity, hasNonMember).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl h-12 shadow-lg shadow-primary/20 transition-all active:scale-95"
                disabled={selectedPlayers.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Simpan Catatan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="lg:col-span-2 shadow-sm border-muted/50 overflow-hidden h-fit">
          <CardHeader className="bg-muted/20 border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Riwayat Sesi</CardTitle>
                <CardDescription>
                  Daftar penggunaan shuttlecock terkini
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="bg-background border border-muted px-4 py-2 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hari Ini</p>
                  <p className="text-lg font-black text-emerald-600">{totalToday} <span className="text-xs font-normal">Kok</span></p>
                </div>
                <div className="bg-background border border-muted px-4 py-2 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Biaya</p>
                  <p className="text-lg font-black text-primary">Rp {totalCostToday.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="w-[300px]">Pemain</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead className="text-center">Partai</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Biaya</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingStates.usageRecords ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><div className="flex gap-2"><div className="w-16 h-6 bg-muted rounded-full animate-pulse"></div><div className="w-16 h-6 bg-muted rounded-full animate-pulse"></div></div></TableCell>
                        <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell className="text-right"><div className="w-12 h-6 bg-muted rounded ml-auto animate-pulse"></div></TableCell>
                        <TableCell className="text-right"><div className="w-20 h-4 bg-muted rounded ml-auto animate-pulse"></div></TableCell>
                        <TableCell className="text-right"><div className="w-8 h-8 bg-muted rounded ml-auto animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : usageRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-24 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
                          <Package className="w-16 h-16 mb-4 opacity-10" />
                          <p className="text-lg font-medium">Belum ada catatan hari ini</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    usageRecords.slice().reverse().map((record, index) => (
                      <TableRow key={index} className="group hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {record.players.map((player, idx) => (
                              <Badge
                                key={idx}
                                className={cn(
                                  "text-[10px] font-bold rounded-full border-none px-2 shadow-sm",
                                  player.is_member ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                )}>
                                {player.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
                            #{record.match_number || '-'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold">
                            {record.quantity} Pcs
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold">Rp {record.total_cost.toLocaleString("id-ID")} / Orang</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setRecordToDelete(record.id)}
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
      </div>

      <AlertDialog open={!!recordToDelete} onOpenChange={(open: boolean) => !open && setRecordToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Catatan penggunaan kok akan dihapus secara permanen.
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
