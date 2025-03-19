"use client";

import * as React from "react";
import Image from "next/image";
import {
  Package,
  ClipboardList,
  // Boxes,
  // Fuel,
  // ArrowDownCircle,
  // ArrowUpCircle,
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
      icon: Package,
      isActive: true,
    },
    {
      title: "Bahan Baku",
      url: "/dashboard/raw-materials",
      icon: ClipboardList,
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
  // navStock: [
  //   {
  //     title: "Stok In",
  //     url: "/dashboard/stock-in",
  //     icon: ArrowDownCircle,
  //   },
  //   {
  //     title: "Stok Out",
  //     url: "/dashboard/stock-out",
  //     icon: ArrowUpCircle,
  //   },
  // ],
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
        {/* <SidebarGroup>
          <SidebarGroupLabel>Manajemen Stok</SidebarGroupLabel>
          <NavMain items={data.navStock} />
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
