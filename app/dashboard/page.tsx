"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  // Package, 
  Shapes, 
  Ruler, 
  ShoppingBag, 
  Layers,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalParts, setTotalParts] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const productsRes = await fetch("/api/products");
        const { data: products } = await productsRes.json();
        if (Array.isArray(products)) setTotalProducts(products.length);

        const categoriesRes = await fetch("/api/categories");
        const { data: categories } = await categoriesRes.json();
        if (Array.isArray(categories)) setTotalCategories(categories.length);

        const unitsRes = await fetch("/api/units");
        const { data: units } = await unitsRes.json();
        if (Array.isArray(units)) setTotalUnits(units.length);

        const partRes = await fetch("/api/parts");
        const { data: parts } = await partRes.json();
        if (Array.isArray(parts)) setTotalParts(parts.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="flex gap-4">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="master-data">Master Data</TabsTrigger>
      </TabsList>

      {/* Products Tab */}
      <TabsContent value="products">
        <div className="grid gap-6 md:grid-cols-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Products</CardTitle>
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalProducts}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>

          {/* Tambahkan ATK, Inventaris, dan Bahan Bakar di sini */}
        </div>
      </TabsContent>

      {/* Master Data Tab */}
      <TabsContent value="master-data">
        <div className="grid gap-6 md:grid-cols-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Categories</CardTitle>
              <Shapes className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalCategories}</p>
              <p className="text-sm text-muted-foreground">Total Categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Units</CardTitle>
              <Ruler className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalUnits}</p>
              <p className="text-sm text-muted-foreground">Total Units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Parts</CardTitle>
              <Layers className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalParts}</p>
              <p className="text-sm text-muted-foreground">Total Parts</p>
            </CardContent>
          </Card>

          {/* Tambahkan data master lainnya jika ada */}
        </div>
      </TabsContent>
    </Tabs>
  );
}
