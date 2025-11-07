import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useDataStore, Member } from '../store/useDataStore';
import { Plus, Trash2, Edit2, Users, Award, User, Trophy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

export function MemberManagement() {
  const { members, addMember, updateMember, deleteMember } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    isMember: true,
    grade: 'Pemula',
  });

  const grades = ['Pemula', 'Menengah', 'Mahir', 'Advanced', 'Pro'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (editingMember) {
        updateMember(editingMember.id, {
          name: formData.name,
          isMember: formData.isMember,
          grade: formData.grade,
        });
        toast.success('Member berhasil diupdate!');
      } else {
        const newMember: Member = {
          id: Date.now().toString(),
          name: formData.name,
          isMember: formData.isMember,
          grade: formData.grade,
        };
        addMember(newMember);
        toast.success('Member berhasil ditambahkan!');
      }
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      isMember: true,
      grade: 'Pemula',
    });
    setEditingMember(null);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      isMember: member.isMember,
      grade: member.grade,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMember(id);
    toast.success('Member berhasil dihapus!');
  };

  const totalMembers = members.filter(m => m.isMember).length;
  const totalNonMembers = members.filter(m => !m.isMember).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Pemain</p>
                <p className="text-3xl mt-1">{members.length}</p>
              </div>
              <Users className="w-10 h-10 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Member Aktif</p>
                <p className="text-3xl mt-1">{totalMembers}</p>
              </div>
              <Award className="w-10 h-10 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Non-Member</p>
                <p className="text-3xl mt-1">{totalNonMembers}</p>
              </div>
              <User className="w-10 h-10 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Table */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Manajemen Member
              </CardTitle>
              <CardDescription>Kelola data member dan pemain klub badminton</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {editingMember ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingMember ? 'Edit Member' : 'Tambah Member Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMember ? 'Update informasi member' : 'Tambahkan member baru ke dalam sistem'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade Pemain</Label>
                    <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                      <SelectTrigger id="grade">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4" />
                              {grade}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status Keanggotaan</Label>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        {formData.isMember ? (
                          <Award className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <User className="w-5 h-5 text-orange-600" />
                        )}
                        <span className={formData.isMember ? 'text-emerald-700' : 'text-orange-700'}>
                          {formData.isMember ? 'Member Aktif' : 'Non-Member'}
                        </span>
                      </div>
                      <Switch
                        checked={formData.isMember}
                        onCheckedChange={(checked) => setFormData({ ...formData, isMember: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                    >
                      {editingMember ? 'Update' : 'Tambah'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Belum ada data member</p>
                      <p className="text-sm mt-1">Klik tombol "Tambah Member" untuk memulai</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`${member.isMember ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'} p-2 rounded-lg`}>
                            {member.isMember ? (
                              <Award className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={member.isMember ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}>
                          {member.isMember ? 'Member' : 'Non-Member'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Trophy className="w-3 h-3" />
                          {member.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(member)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
