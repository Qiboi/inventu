"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  //  PenTool, 
  //  Archive, 
  //  Fuel 
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [totalRawMaterials, setTotalRawMaterials] = useState(0);


  useEffect(() => {
    async function fetchRawMaterials() {
      try {
        const response = await fetch("/api/raw-materials");
        const { data } = await response.json();

        if (Array.isArray(data)) {
          setTotalRawMaterials(data.length);
        }
      } catch (error) {
        console.error("Error fetching raw materials:", error);
      }
    }

    fetchRawMaterials();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {/* Card Bahan Baku */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bahan Baku</CardTitle>
          <Package className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalRawMaterials}</p>
          <p className="text-sm text-muted-foreground">Total Items</p>
        </CardContent>
      </Card>

      {/* Card ATK */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ATK</CardTitle>
          <PenTool className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">75</p>
          <p className="text-sm text-muted-foreground">Total Items</p>
        </CardContent>
      </Card> */}

      {/* Card Inventaris */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inventaris</CardTitle>
          <Archive className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">45</p>
          <p className="text-sm text-muted-foreground">Total Items</p>
        </CardContent>
      </Card> */}

      {/* Card Bahan Bakar Oil */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bahan Bakar Oil</CardTitle>
          <Fuel className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">30</p>
          <p className="text-sm text-muted-foreground">Total Liters</p>
        </CardContent>
      </Card> */}
    </div>
  );
}
