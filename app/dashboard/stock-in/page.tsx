"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Plus,
    // Edit, 
    // Trash2, 
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertDialogDelete } from "@/components/alert-dialog-delete";
import { DatePicker } from "@/components/date-picker";
import PaginationControl from "@/components/pagination-control";

interface Product {
    _id: string;
    name: string;
    label: string;
    unit: string;
    supplier: string;
    address: string;
}

interface StockInItem {
    product_id: { _id: string; name: string; label: string; unit: string; supplier: string; address: string; } | string; // Bisa objek atau string
    quantity: number;
}

interface StockIn {
    _id?: string;
    items: StockInItem[];
    destinationLocation: string;
    doSupplierNo: string;
    forceDate: string;
    draftIn: string;
    forceNumber: string;
}

export default function StockInPage() {
    const [stockInList, setStockInList] = useState<StockIn[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<StockIn>({
        items: [
            {
                product_id: "",
                quantity: 0,
            },
        ],
        destinationLocation: "",
        doSupplierNo: "",
        forceDate: "",
        draftIn: "",
        forceNumber: "",
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [previewData, setPreviewData] = useState<StockIn | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletedId, setDeletedId] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchStockIn = useCallback(async () => {
        try {
            const response = await fetch("/api/stock-in");
            const { data } = await response.json();
            console.log(data);
            if (Array.isArray(data)) {
                setStockInList(data);
            } else {
                setStockInList([]);
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
        fetchStockIn();
        fetchProducts();
    }, [fetchStockIn, fetchProducts]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    }

    const handleSelectChange = (value: string, index: number) => {
        const selectedProduct = products.find((p) => p._id === value);

        if (!selectedProduct) return;

        const updatedItems = [...form.items];
        updatedItems[index].product_id = selectedProduct; // set object Product
        setForm((prev) => ({ ...prev, items: updatedItems }));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedItems = [...form.items];
        updatedItems[index].quantity = Number(e.target.value);
        setForm((prev) => ({ ...prev, items: updatedItems }));
    };

    const handleAddItem = () => {
        setForm((prevForm) => ({
            ...prevForm,
            items: [...prevForm.items, { product_id: "", quantity: 0 }],
        }));
    };

    const handleRemoveItem = (index: number) => {
        setForm((prevForm) => ({
            ...prevForm,
            items: prevForm.items.filter((_, i) => i !== index),
        }));
    };

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
            setForm({
                items: [
                    {
                        product_id: "",
                        quantity: 0,
                    },
                ],
                destinationLocation: "",
                doSupplierNo: "",
                forceDate: "",
                draftIn: "",
                forceNumber: "",
            });
            setIsDialogOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Terjadi kesalahan!");
        }
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/stock-in/${id}`, { method: "DELETE" });
            toast.success("Stock In dihapus!");
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Gagal menghapus!");
        }
        fetchStockIn();
        setDeletedId("");
        setIsDeleteDialogOpen(false);
    }

    const filtered = stockInList.filter((stock) =>
        stock.items?.some(
            (item) =>
                typeof item.product_id === "object" &&
                item.product_id.name.toLowerCase().includes(search.toLowerCase())
        )
    );
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="p-6 flex flex-col h-full">
            <div className="mb-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Stock In</h1>
                    <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-5 w-5" /> Add Stock In
                    </Button>
                </div>
                <Input placeholder="Search stock in..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex-1 overflow-auto">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Draft In</TableHead>
                            <TableHead>Force Number</TableHead>
                            <TableHead>Destination Location</TableHead>
                            <TableHead>DO Supplier No</TableHead>
                            <TableHead>Force Date</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginated.map((stock) => (
                            <TableRow key={stock._id}>
                                <TableCell>{stock.draftIn}</TableCell>
                                <TableCell>{stock.forceNumber}</TableCell>
                                <TableCell>{stock.destinationLocation}</TableCell>
                                <TableCell>{stock.doSupplierNo}</TableCell>
                                <TableCell>
                                    {stock.forceDate
                                        ? new Date(stock.forceDate).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                        {stock.items.map((item, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-full"
                                            >
                                                {typeof item.product_id === "object"
                                                    ? item.product_id.name
                                                    : "–"}{" "}
                                                <span className="ml-1 text-gray-600 dark:text-gray-400">
                                                    × {item.quantity}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="flex space-x-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => {
                                            setPreviewData(stock);
                                            setIsPreviewDialogOpen(true);
                                        }}
                                        aria-label="View stock in details"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4">
                <PaginationControl
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Stock In" : "Add Stock In"}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {form.items.map((item, index) => (
                            <div key={index} className="border p-4 rounded-md space-y-3 relative">
                                {/* Tombol Hapus Item */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    ✖
                                </button>

                                <div className="text-sm font-semibold mb-2">Item {index + 1}</div>

                                {/* Select Product */}
                                <div className="space-y-1">
                                    <Label>Product Name</Label>
                                    <Select
                                        onValueChange={(value) => handleSelectChange(value, index)}
                                        value={
                                            typeof item.product_id === "object"
                                                ? item.product_id._id
                                                : item.product_id || ""
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products
                                                .filter((product) => {
                                                    const selectedIds = form.items.map((item, idx) =>
                                                        idx !== index ?
                                                            (typeof item.product_id === "object" ? item.product_id._id : item.product_id)
                                                            : null
                                                    );
                                                    return !selectedIds.includes(product._id);
                                                })
                                                .map((product) => (
                                                    <SelectItem key={product._id} value={product._id}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Preview Product Details */}
                                {typeof item.product_id === "object" && (
                                    <div className="grid grid-cols-2 gap-2 text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                                        <div>
                                            <div className="font-medium">Item Code:</div>
                                            <div>{item.product_id.label}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Unit:</div>
                                            <div>{item.product_id.unit}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Supplier:</div>
                                            <div>{item.product_id.supplier}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Address:</div>
                                            <div>{item.product_id.address}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div className="space-y-1">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(e, index)}
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Tombol Tambah Produk */}
                        <div>
                            <Button
                                type="button"
                                onClick={handleAddItem}
                                className="w-full"
                                variant="outline"
                            >
                                + Add Another Product
                            </Button>
                        </div>
                        <Label>Force Number</Label><Input name="draftIn" value={form.draftIn} onChange={handleChange} required />
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

            <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Preview Stock In</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Header Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Draft In:</strong> {previewData?.draftIn}</div>
                            <div><strong>Force Number:</strong> {previewData?.forceNumber}</div>
                            <div><strong>Destination:</strong> {previewData?.destinationLocation}</div>
                            <div><strong>DO Supplier No:</strong> {previewData?.doSupplierNo}</div>
                            <div><strong>Force Date:</strong> {previewData?.forceDate
                                ? new Date(previewData.forceDate).toLocaleDateString("id-ID", {
                                    day: "numeric", month: "long", year: "numeric"
                                })
                                : "-"}
                            </div>
                        </div>
                        <hr />
                        {/* Items List */}
                        <div>
                            <h3 className="text-sm font-medium mb-2">Products</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {previewData?.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md grid grid-cols-[1fr_auto] gap-4 text-sm"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {typeof item.product_id === "object"
                                                    ? item.product_id.name
                                                    : "-"}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {typeof item.product_id === "object"
                                                    ? `Label: ${item.product_id.label} • Unit: ${item.product_id.unit}`
                                                    : ""}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {typeof item.product_id === "object"
                                                    ? `Supplier: ${item.product_id.supplier}, ${item.product_id.address}`
                                                    : ""}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-full">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-right">
                        <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                            Close
                        </Button>
                    </div>
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
