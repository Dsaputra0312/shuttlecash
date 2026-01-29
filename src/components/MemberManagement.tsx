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
  Edit2, 
  Users, 
  Award, 
  User, 
  Trophy, 
  Search,
  MoreVertical,
  UserPlus
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
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "./ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function MemberManagement() {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    fetchMembers,
    isAuthenticated,
    loadingStates,
  } = useDataStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
    }
  }, [fetchMembers, isAuthenticated]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    is_member: true,
    grade: "Pemula",
  });

  const grades = ["Pemula", "Menengah", "Mahir", "Advanced", "Pro"];

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      setIsSubmitting(true);
      try {
        if (editingMember) {
          await updateMember(editingMember.id, {
            name: formData.name,
            is_member: formData.is_member,
            grade: formData.grade,
          });
          toast.success("Member berhasil diupdate!");
        } else {
          const newMember: Omit<Member, "id" | "created_at" | "updated_at"> = {
            name: formData.name,
            is_member: formData.is_member,
            grade: formData.grade,
          };
          await addMember(newMember);
          toast.success("Member berhasil ditambahkan!");
        }
        resetForm();
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("Gagal menyimpan data member");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      is_member: true,
      grade: "Pemula",
    });
    setEditingMember(null);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      is_member: member.is_member,
      grade: member.grade,
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (memberToDelete) {
      setIsDeleting(memberToDelete);
      try {
        await deleteMember(memberToDelete);
        toast.success("Member berhasil dihapus!");
      } catch (error) {
        toast.error("Gagal menghapus member");
      } finally {
        setIsDeleting(null);
        setMemberToDelete(null);
      }
    }
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMembersCount = members.filter((m) => m.is_member).length;
  const totalNonMembersCount = members.filter((m) => !m.is_member).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Kelola data pemain dan status keanggotaan klub.</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open: boolean) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <UserPlus className="w-4 h-4 mr-2" />
              Tambah Pemain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editingMember ? "Edit Profil Pemain" : "Tambah Pemain Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingMember
                  ? "Update informasi profil dan status pemain."
                  : "Isi formulir di bawah untuk menambahkan pemain baru ke klub."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="e.g. Budi Santoso"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade" className="text-sm font-bold">Level Kemampuan</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, grade: value })
                  }>
                  <SelectTrigger id="grade" className="rounded-xl h-11">
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          {grade}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${formData.is_member ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <Label className="text-sm font-bold block">Status Member</Label>
                    <span className="text-xs text-muted-foreground">
                      {formData.is_member ? "Mendapatkan harga khusus member" : "Pemain tamu / non-member"}
                    </span>
                  </div>
                </div>
                <Switch
                  checked={formData.is_member}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, is_member: checked })
                  }
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl">
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl px-8 shadow-md shadow-primary/10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Menyimpan..."
                  ) : (
                    editingMember ? "Simpan Perubahan" : "Simpan Pemain"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-16 h-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Pemain</p>
                <p className="text-3xl font-bold mt-0.5">{members.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award className="w-16 h-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Member Aktif</p>
                <p className="text-3xl font-bold mt-0.5">{totalMembersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <User className="w-16 h-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Pemain Tamu</p>
                <p className="text-3xl font-bold mt-0.5">{totalNonMembersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Table */}
      <Card className="shadow-xl border-none overflow-hidden bg-white/60 backdrop-blur-sm ring-1 ring-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border-b border-blue-100 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 group-focus-within:text-blue-700 transition-colors" />
              <Input 
                placeholder="Cari nama pemain..." 
                className="pl-10 rounded-xl bg-white border-blue-100 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 rounded-full bg-white border-blue-200 text-blue-700 font-bold shadow-sm">
                {filteredMembers.length} Terdaftar
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="w-[300px]">Pemain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingStates.members ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-20 h-3 bg-muted rounded animate-pulse"></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><div className="w-20 h-6 bg-muted rounded-full animate-pulse"></div></TableCell>
                      <TableCell><div className="w-16 h-6 bg-muted rounded-full animate-pulse"></div></TableCell>
                      <TableCell className="text-right"><div className="w-8 h-8 bg-muted rounded ml-auto animate-pulse"></div></TableCell>
                    </TableRow>
                  ))
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
                        <Users className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-lg font-medium">Pemain tidak ditemukan</p>
                        <p className="text-sm">Coba kata kunci lain atau tambah pemain baru.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-muted shadow-sm">
                            <AvatarFallback className={member.is_member ? "bg-primary/10 text-primary font-bold" : "bg-muted text-muted-foreground font-bold"}>
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold group-hover:text-primary transition-colors">{member.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">ID: {member.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full px-3 py-0.5 font-medium border-none shadow-sm ${
                            member.is_member
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-orange-50 text-orange-600"
                          }`}>
                          {member.is_member ? "Active Member" : "Guest Player"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1 rounded-full px-3 py-0.5 font-medium bg-amber-50 text-amber-600 border-none shadow-sm">
                          <Trophy className="w-3 h-3" />
                          {member.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl w-40">
                            <DropdownMenuItem 
                              onClick={() => handleEdit(member)}
                              className="gap-2 cursor-pointer rounded-lg"
                            >
                              <Edit2 className="w-4 h-4 text-blue-500" />
                              <span>Edit Profil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setMemberToDelete(member.id)}
                              className="gap-2 cursor-pointer text-destructive focus:text-destructive rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Hapus</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!memberToDelete} onOpenChange={(open: boolean) => !open && setMemberToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data member akan dihapus secara permanen dari database.
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
