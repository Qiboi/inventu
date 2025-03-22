"use client"

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialogDelete } from "@/components/alert-dialog-delete";

interface Category {
    _id?: string;
    name: string;
}

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<Category>({
        name: ""
    })
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletedId, setDeletedId] = useState("");

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch("/api/categories");
            const { data } = await response.json();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing && form._id ? `/api/categories/${form._id}` : "/api/categories";
        console.log("URL : ", url);

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Failed to save data.");

            toast.success(isEditing ? "Data updated!" : "Category added!");
            fetchCategories();
            setForm({ name: "" });
            setIsDialogOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.log("Error : ", error);
            toast.error("An error occurred!");
        }
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/categories/${id}`, { method: "DELETE" });
            toast.success("Category deleted!");
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Failed to delete!");
        }
        fetchCategories();
        setDeletedId("");
        setIsDeleteDialogOpen(false);
    }

    return(
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Category</h1>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-5 w-5" /> Add Category
                </Button>
            </div>
            <Input placeholder="Search category..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories
                        .filter((item) =>
                            item.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
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
                        ))
                    }
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Label>Category Name</Label><Input name="name" value={form.name} onChange={handleChange} required />
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
