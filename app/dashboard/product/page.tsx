"use client"

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

interface Product {
    _id?: string;
    name: string;
    part: { _id: string; name: string } | string;
    category: { _id: string; name: string } | string;
    unit: { _id: string; name: string } | string;
    stock: number;
    minimum_stock: number;
    label: string;
    supplier: string;
    address: string;
}

interface Part {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
}

interface Unit {
    _id: string;
    name: string;
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [parts, setParts] = useState<Part[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<Product>({
        name: "",
        part: "",
        category: "",
        unit: "",
        stock: 0,
        minimum_stock: 0,
        label: "",
        supplier: "",
        address: "",
    })
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletedId, setDeletedId] = useState("");

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch("/api/products");
            const { data } = await response.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, []);

    const fetchParts = useCallback(async () => {
        try {
            const response = await fetch("/api/parts");
            const { data } = await response.json();
            setParts(data || []);
        } catch (error) {
            console.error("Error fetching parts:", error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch("/api/categories");
            const { data } = await response.json();
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    const fetchUnits = useCallback(async () => {
        try {
            const response = await fetch("/api/units");
            const { data } = await response.json();
            setUnits(data || []);
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchParts();
        fetchCategories();
        fetchUnits();
    }, [fetchProducts, fetchParts, fetchCategories, fetchUnits]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "stock" || name === "minimum_stock" ? Number(value) : value,
        }));
    }

    function handleSelectChange(field: keyof typeof form, value: string) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing && form._id ? `/api/products/${form._id}` : "/api/products";
        console.log("URL : ", url);

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Failed to save data.");

            toast.success(isEditing ? "Data updated!" : "Product added!");
            fetchProducts();
            setForm({ name: "", part: "", category: "", unit: "", stock: 0, minimum_stock: 0, label: "", supplier: "", address: "" });
            setIsDialogOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.log("Error : ", error);
            toast.error("An error occurred!");
        }
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/products/${id}`, { method: "DELETE" });
            toast.success("Product deleted!");
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Failed to delete!");
        }
        fetchProducts();
        setDeletedId("");
        setIsDeleteDialogOpen(false);
    }

    console.log(products);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Product</h1>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-5 w-5" /> Add Product
                </Button>
            </div>
            <Input placeholder="Search product..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Part</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Minimum Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products
                        .filter((item) =>
                            item.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((item) => {
                            const stockRatio = item.stock / item.minimum_stock;
                            let statusColor = "bg-green-500";

                            if (stockRatio < 1) {
                                statusColor = "bg-red-500";
                            } else if (stockRatio < 1.5) {
                                statusColor = "bg-orange-400";
                            }
                            return (
                                <TableRow key={item._id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{typeof item.part === "object" ? item.part?.name : item.part}</TableCell>
                                    <TableCell>{typeof item.category === "object" ? item.category?.name : item.category}</TableCell>
                                    <TableCell>{item.label}</TableCell>
                                    <TableCell>{typeof item.unit === "object" ? item.unit?.name : item.unit}</TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell>{item.minimum_stock}</TableCell>
                                    <TableCell>
                                        <div className={`h-4 w-4 rounded-full ${statusColor}`} />
                                    </TableCell>
                                    <TableCell>{item.supplier}</TableCell>
                                    <TableCell>{item.address}</TableCell>
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
                            )
                        })
                    }
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Label>Product Name</Label><Input name="name" value={form.name} onChange={handleChange} required />
                        <Label>Part</Label>
                        <Select onValueChange={(value) => handleSelectChange("part", value)} value={typeof form.part === "object" ? form.part._id : form.part || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose part" />
                            </SelectTrigger>
                            <SelectContent>
                                {parts.map((item) => (
                                    <SelectItem key={item._id} value={item.name}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label>Category</Label>
                        <Select onValueChange={(value) => handleSelectChange("category", value)} value={typeof form.category === "object" ? form.category._id : form.category || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((item) => (
                                    <SelectItem key={item._id} value={item.name}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label>Item Code</Label><Input name="label" value={form.label} onChange={handleChange} required />
                        <Label>Unit</Label>
                        <Select onValueChange={(value) => handleSelectChange("unit", value)} value={typeof form.unit === "object" ? form.unit._id : form.unit || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((item) => (
                                    <SelectItem key={item._id} value={item.name}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label>Minimum Stock</Label><Input name="minimum_stock" type="number" value={form.minimum_stock} onChange={handleChange} required />
                        <Label>Supplier</Label>
                        <Input name="supplier" value={form.supplier} onChange={handleChange} required />

                        <Label>Address</Label>
                        <Input name="address" value={form.address} onChange={handleChange} required />
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