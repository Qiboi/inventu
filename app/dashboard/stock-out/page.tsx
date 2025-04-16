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

interface StockOut {
    _id?: string;
    product_id: { _id: string; name: string; label: string; unit: string; supplier: string; address: string; } | string; // Bisa objek atau string
    quantity: number;
    forceNumber: string;
    requestCenter: string;
    transferDate: string;
    requestBy: string;
}

interface Product {
    _id: string;
    name: string;
    label: string;
    unit: string;
    supplier: string;
    address: string;
}

export default function StockOutPage() {
    const [stockOutList, setStockOutList] = useState<StockOut[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<StockOut>({
        product_id: "",
        quantity: 0,
        requestCenter: "",
        requestBy: "",
        transferDate: "",
        forceNumber: "",
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [productSelect, setProductSelect] = useState<Product>({ _id: "", name: "", label: "", unit: "", supplier: "", address: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletedId, setDeletedId] = useState("");

    const fetchStockOut = useCallback(async () => {
        try {
            const response = await fetch("/api/stock-out");
            const { data } = await response.json();
            console.log(data);
            if (Array.isArray(data)) {
                setStockOutList(data);
            } else {
                setStockOutList([]);
            }
        } catch (error) {
            console.error("Error fetching stock-in:", error);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch("/api/products");
            const { data } = await response.json();
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching raw materials:", error);
        }
    }, []);

    useEffect(() => {
        fetchStockOut();
        fetchProducts();
    }, [fetchStockOut, fetchProducts]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    }

    function handleSelectChange(value: string) {
        setForm((prev) => ({ ...prev, product_id: value }));
        const item = products.find((item) => item._id === value);
        if (item) {
            setProductSelect(item);
          }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing && form._id ? `/api/stock-out/${form._id}` : "/api/stock-out";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Gagal menyimpan data.");

            toast.success(isEditing ? "Data diperbarui!" : "Stock Out ditambahkan!");
            fetchStockOut();
            setForm({ product_id: "", quantity: 0, requestCenter: "", requestBy: "", transferDate: "", forceNumber: "" });
            setIsDialogOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Terjadi kesalahan!");
        }
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/stock-out/${id}`, { method: "DELETE" });
            toast.success("Stock Out dihapus!");
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Gagal menghapus!");
        }
        fetchStockOut();
        setDeletedId("");
        setIsDeleteDialogOpen(false);
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Stock Out</h1>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-5 w-5" /> Add Stock Out
                </Button>
            </div>
            <Input placeholder="Search stock out..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Force Number</TableHead>
                        <TableHead>Request Center</TableHead>
                        <TableHead>Transfer Date</TableHead>
                        <TableHead>Request By</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockOutList
                        .filter((item) =>
                            typeof item.product_id === "object" && item.product_id?.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{typeof item.product_id === "object" ? item.product_id?.name : "-"}</TableCell>
                                <TableCell>{typeof item.product_id === "object" ? item.product_id?.label : "-"}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{typeof item.product_id === "object" ? item.product_id?.unit : "-"}</TableCell>
                                <TableCell>{item.forceNumber}</TableCell>
                                <TableCell>{item.requestCenter}</TableCell>
                                <TableCell>{item.transferDate ? new Date(item.transferDate).toLocaleDateString() : "-"}</TableCell>
                                <TableCell>{item.requestBy}</TableCell>
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
                <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Stock Out" : "Add Stock Out"}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Label>Product Name</Label>
                        <Select onValueChange={handleSelectChange} value={typeof form.product_id === "object" ? form.product_id._id : form.product_id || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((item) => (
                                    <SelectItem key={item._id} value={item._id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label>Item Code</Label><Input name="label" type="text" value={productSelect.label || ""} readOnly disabled />
                        <Label>Quantity</Label><Input name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
                        <Label>Unit</Label><Input name="unit" type="text" value={productSelect.unit || ""} readOnly disabled />
                        <Label>Force Number</Label><Input name="forceNumber" value={form.forceNumber} onChange={handleChange} required />
                        <Label>Request Center</Label><Input name="requestCenter" value={form.requestCenter} onChange={handleChange} required />
                        <Label>Tranfer Date</Label>
                        <DatePicker 
                            value={form.transferDate} 
                            onChange={(date) => setForm({ ...form, transferDate: date })} 
                        />
                        <Label>Request By</Label><Input name="requestBy" value={form.requestBy} onChange={handleChange} required />
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
