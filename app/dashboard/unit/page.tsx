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

interface Unit {
    _id?: string;
    name: string;
}

export default function UnitPage() {
    const [units, setUnits] = useState<Unit[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<Unit>({
        name: ""
    })
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletedId, setDeletedId] = useState("");

    const fetchUnit = useCallback(async () => {
        try {
            const response = await fetch("/api/units");
            const { data } = await response.json();
            if (Array.isArray(data)) {
                setUnits(data);
            } else {
                setUnits([]);
            }
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    }, []);

    useEffect(() => {
        fetchUnit();
    }, [fetchUnit]);

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
        const url = isEditing && form._id ? `/api/units/${form._id}` : "/api/units";
        console.log("URL : ", url);

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Failed to save data.");

            toast.success(isEditing ? "Data updated!" : "Unit added!");
            fetchUnit();
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
            await fetch(`/api/units/${id}`, { method: "DELETE" });
            toast.success("Unit deleted!");
        } catch (error) {
            console.log("Error : ", error);
            toast.error("Failed to delete!");
        }
        fetchUnit();
        setDeletedId("");
        setIsDeleteDialogOpen(false);
    }

    return(
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Unit</h1>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-5 w-5" /> Add Unit
                </Button>
            </div>
            <Input placeholder="Search unit..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {units
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
                        <DialogTitle>{isEditing ? "Edit Unit" : "Add Unit"}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Label>Unit Name</Label><Input name="name" value={form.name} onChange={handleChange} required />
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
