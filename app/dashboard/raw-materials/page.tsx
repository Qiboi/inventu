"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialogDelete } from "@/components/alert-dialog-delete";

interface RawMaterial {
    _id?: string;
    name: string;
    category: string;
    unit: string;
    stock: number;
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
        label: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletedId, setDeletedId] = useState("");

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
            [name]: name === "stock" ? Number(value) : value, // Ensure stock is a number
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

            if (!response.ok) throw new Error("Failed to save data.");

            toast.success(isEditing ? "Data updated!" : "Raw material added!");
            fetchRawMaterials();
            setIsDialogOpen(false);
            setForm({ name: "", category: "", unit: "", stock: 0, label: "" });
            setIsEditing(false);
        } catch (error) {
            console.log("Error : ", error);
            toast.error("An error occurred!");
        }
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/raw-materials/${id}`, { method: "DELETE" });
            toast("Raw material deleted!");
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Failed to delete!");
        }
        fetchRawMaterials();
        setDeletedId("");
        setIsDeleteDialogOpen(false);
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Raw Materials</h1>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-5 w-5" /> Add Raw Material
                </Button>
            </div>
            <Input placeholder="Search raw materials..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Label</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rawMaterials
                        .filter((item) =>
                            item.name.toLowerCase().includes(search.toLowerCase()) ||
                            item.label.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.stock}</TableCell>
                                <TableCell>{item.label}</TableCell>
                                <TableCell className="flex space-x-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => {
                                            setForm(item);
                                            setIsEditing(true);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive"
                                        onClick={() => {
                                            if (!item._id) return;
                                            setDeletedId(item._id);
                                            setIsDeleteDialogOpen(true);
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
                        <DialogTitle>{isEditing ? "Edit Raw Material" : "Add Raw Material"}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Label>Raw Material Name</Label><Input name="name" value={form.name} onChange={handleChange} required />
                        <Label>Category</Label><Input name="category" value={form.category} onChange={handleChange} required />
                        <Label>Unit</Label><Input name="unit" value={form.unit} onChange={handleChange} required />
                        <Label>Stock</Label><Input name="stock" type="number" value={form.stock} onChange={handleChange} required />
                        <Label>Label</Label><Input name="label" value={form.label} onChange={handleChange} required />
                        <Button type="submit" className="w-full">{isEditing ? "Update" : "Save"}</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialogDelete
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirm={() => handleDelete(deletedId)}
            />
        </div>
    );
}
