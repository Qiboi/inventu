"use client";

import * as React from "react";
import Image from "next/image";
import {
  // Package,
  // ClipboardList,
  // Boxes,
  // Fuel,
  ArrowDownCircle,
  ArrowUpCircle,
  Layers,
  House,
  Shapes,
  Ruler,
  ShoppingBag,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

// Data Sidebar
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
      isActive: true,
    },
    // {
    //   title: "Stock Log",
    //   url: "/dashboard/stock-log",
    //   icon: ClipboardList,
    // },
  ],
  navInventory: [
    {
      title: "Product",
      url: "/dashboard/product",
      icon: ShoppingBag,
    },
    // {
    //   title: "ATK",
    //   url: "/dashboard/atk",
    //   icon: Boxes,
    // },
    // {
    //   title: "Inventaris",
    //   url: "/dashboard/inventaris",
    //   icon: Package,
    // },
    // {
    //   title: "Bahan Bakar Oil",
    //   url: "/dashboard/oil",
    //   icon: Fuel,
    // },
  ],
  navStock: [
    {
      title: "Stock In",
      url: "/dashboard/stock-in",
      icon: ArrowDownCircle,
    },
    {
      title: "Stok Out",
      url: "/dashboard/stock-out",
      icon: ArrowUpCircle,
    },
  ],
  navMaster: [
    {
      title: "Category",
      url: "/dashboard/category",
      icon: Shapes,
    },
    {
      title: "Unit",
      url: "/dashboard/unit",
      icon: Ruler,
    },
    {
      title: "Part",
      url: "/dashboard/part",
      icon: Layers,
    },
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  // Ambil data pengguna dari sesi
  const user = session?.user
    ? {
      name: session.user.name || "User",
      email: session.user.email || "user@example.com",
      avatar: session.user.avatar || "/avatars/default.jpg",
    }
    : {
      name: "Guest",
      email: "guest@example.com",
      avatar: "/avatars/default.jpg",
    };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-center">
          <Image
            src="/image/logo-white.png"
            alt="Inventu Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Menu Utama */}
        {/* Grup Stok */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <NavMain items={data.navMain} />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Inventory</SidebarGroupLabel>
          <NavMain items={data.navInventory} />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Stock Management</SidebarGroupLabel>
          <NavMain items={data.navStock} />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Master Data</SidebarGroupLabel>
          <NavMain items={data.navMaster} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
