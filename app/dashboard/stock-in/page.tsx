"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertDialogDelete } from "@/components/alert-dialog-delete";
import { DatePicker } from "@/components/date-picker";

interface StockIn {
    _id?: string;
    rawMaterial: { _id: string; name: string } | string; // Bisa objek atau string
    quantity: number;
    supplier: string;
    address: string;
    destinationLocation: string;
    doSupplierNo: string;
    forceDate: string;
    draftIn: string;
    forceNumber: string;
}

interface RawMaterial {
    _id: string;
    name: string;
}

export default function StockInPage() {
    const [stockInList, setStockInList] = useState<StockIn[]>([]);
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<StockIn>({
        rawMaterial: "",
        quantity: 0,
        supplier: "",
        address: "",
        destinationLocation: "",
        doSupplierNo: "",
        forceDate: "",
        draftIn: "",
        forceNumber: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletedId, setDeletedId] = useState("");

    const fetchStockIn = useCallback(async () => {
        try {
            const response = await fetch("/api/stock-in");
            const { data } = await response.json();
            if (Array.isArray(data)) {
                setStockInList(data);
            } else {
                setStockInList([]);
            }
        } catch (error) {
            console.error("Error fetching stock-in:", error);
        }
    }, []);

    const fetchRawMaterials = useCallback(async () => {
        try {
            const response = await fetch("/api/raw-materials");
            const { data } = await response.json();
            setRawMaterials(data || []);
        } catch (error) {
            console.error("Error fetching raw materials:", error);
        }
    }, []);

    useEffect(() => {
        fetchStockIn();
        fetchRawMaterials();
    }, [fetchStockIn, fetchRawMaterials]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    }

    function handleSelectChange(value: string) {
        setForm((prev) => ({ ...prev, rawMaterial: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing && form._id ? `/api/stock-in/${form._id}` : "/api/stock-in";

        const newForm = {
            ...form,
            forceNumber: form.draftIn
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newForm),
            });

            if (!response.ok) throw new Error("Gagal menyimpan data.");

            toast.success(isEditing ? "Data diperbarui!" : "Stock In ditambahkan!");
            fetchStockIn();
            setIsDialogOpen(false);
            setForm({ rawMaterial: "", quantity: 0, supplier: "", address: "", destinationLocation: "", doSupplierNo: "", forceDate: "", draftIn: "", forceNumber: "" });
            setIsEditing(false);
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Terjadi kesalahan!");
        }
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/stock-in/${id}`, { method: "DELETE" });
            toast("Stock In dihapus!");
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Gagal menghapus!");
        }
        fetchStockIn();
        setDeletedId("");
        setIsDeleteDialogOpen(false);
    }

    console.log("STOCK IN : ", stockInList);
    console.log("RAW : ", rawMaterials)

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Stock In</h1>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-5 w-5" /> Add Stock In
                </Button>
            </div>
            <Input placeholder="Search stock in..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Supplier Address</TableHead>
                        <TableHead>Draft In</TableHead>
                        <TableHead>DO Supplier No</TableHead>
                        <TableHead>Destination Location</TableHead>
                        <TableHead>Force Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockInList
                        .filter((item) =>
                            typeof item.rawMaterial === "object" && item.rawMaterial?.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{typeof item.rawMaterial === "object" ? item.rawMaterial?.name : "-"}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.supplier}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>{item.draftIn}</TableCell>
                                <TableCell>{item.doSupplierNo}</TableCell>
                                <TableCell>{item.destinationLocation}</TableCell>
                                <TableCell>{item.forceDate ? new Date(item.forceDate).toLocaleDateString() : "-"}</TableCell>
                                <TableCell className="flex space-x-2">
                                    <Button size="icon" variant="outline" onClick={() => {
                                        setForm(item);
                                        setIsEditing(true);
                                        setIsDialogOpen(true);
                                    }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => {
                                        if (!item._id) return;
                                        setDeletedId(item._id);
                                        setIsDeleteDialogOpen(true);
                                    }}>
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
                        <DialogTitle>{isEditing ? "Edit Stock In" : "Add Stock In"}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Label>Product Name</Label>
                        <Select onValueChange={handleSelectChange} value={typeof form.rawMaterial === "object" ? form.rawMaterial._id : form.rawMaterial || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih bahan baku" />
                            </SelectTrigger>
                            <SelectContent>
                                {rawMaterials.map((item) => (
                                    <SelectItem key={item._id} value={item._id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label>Quantity</Label><Input name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
                        <Label>Supplier</Label><Input name="supplier" value={form.supplier} onChange={handleChange} required />
                        <Label>Address</Label><Input name="address" value={form.address} onChange={handleChange} required />
                        <Label>Draft In</Label><Input name="draftIn" value={form.draftIn} onChange={handleChange} required />
                        <Label>DO Supplier No</Label><Input name="doSupplierNo" value={form.doSupplierNo} onChange={handleChange} required />
                        <Label>Destination Location</Label><Input name="destinationLocation" value={form.destinationLocation} onChange={handleChange} required />
                        <Label>Force Date</Label>
                        <DatePicker 
                            value={form.forceDate} 
                            onChange={(date) => setForm({ ...form, forceDate: date })} 
                        />
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
