"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RawMaterial {
    _id?: string;
    name: string;
    category: string;
    unit: string;
    stock: number;
    supplier: string;
    address: string;
    label: string;
}

export default function RawMaterialsPage() {
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<RawMaterial>({
        name: "",
        category: "",
        unit: "",
        stock: 0,
        supplier: "",
        address: "",
        label: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchRawMaterials = useCallback(async () => {
        try {
            const response = await fetch("/api/raw-materials");
            const { data } = await response.json();
            if (Array.isArray(data)) {
                setRawMaterials(data);
            } else {
                setRawMaterials([]);
            }
        } catch (error) {
            console.error("Error fetching raw materials:", error);
        }
    }, []);

    useEffect(() => {
        fetchRawMaterials();
    }, [fetchRawMaterials]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "stock" ? Number(value) : value, // Pastikan stok adalah number
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing && form._id ? `/api/raw-materials/${form._id}` : "/api/raw-materials";
        console.log("URL : ", url);

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Gagal menyimpan data.");

            toast.success(isEditing ? "Data diperbarui!" : "Bahan baku ditambahkan!");
            fetchRawMaterials();
            setIsDialogOpen(false);
            setForm({ name: "", category: "", unit: "", stock: 0, supplier: "", address: "", label: "" });
            setIsEditing(false);
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Terjadi kesalahan!");
        }
    }

    // function handleEdit(item: RawMaterial) {
    //     setForm({ ...item }); // Ini akan menyertakan _id saat edit
    //     setIsEditing(true);
    // }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/raw-materials/${id}`, { method: "DELETE" });
            toast("Bahan baku dihapus!");
            fetchRawMaterials();
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Gagal menghapus!");
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Bahan Baku</h1>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-5 w-5" /> Tambah Bahan Baku
                </Button>
            </div>
            <Input placeholder="Cari bahan baku..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Satuan</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Label</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rawMaterials
                        .filter((item) =>
                            item.name.toLowerCase().includes(search.toLowerCase()) ||
                            item.label.toLowerCase().includes(search.toLowerCase()) // Tambahkan pencarian berdasarkan label
                        )
                        .map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.stock}</TableCell>
                                <TableCell>{item.supplier}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>{item.label}</TableCell>
                                <TableCell className="flex space-x-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => {
                                            setForm(item);
                                            setIsEditing(true);
                                            setIsDialogOpen(true); // Pastikan dialog terbuka
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive"
                                        onClick={() => {
                                            if (!item._id) return; // Jika _id tidak ada, keluar dari fungsi
                                            handleDelete(item._id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Bahan Baku" : "Tambah Bahan Baku"}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Label>Nama Bahan</Label><Input name="name" value={form.name} onChange={handleChange} required />
                        <Label>Kategori</Label><Input name="category" value={form.category} onChange={handleChange} required />
                        <Label>Satuan</Label><Input name="unit" value={form.unit} onChange={handleChange} required />
                        <Label>Stok</Label><Input name="stock" type="number" value={form.stock} onChange={handleChange} required />
                        <Label>Supplier</Label><Input name="supplier" value={form.supplier} onChange={handleChange} required />
                        <Label>Alamat</Label><Input name="address" value={form.address} onChange={handleChange} required />
                        <Label>Label</Label><Input name="label" value={form.label} onChange={handleChange} required />
                        <Button type="submit" className="w-full">{isEditing ? "Update" : "Simpan"}</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
