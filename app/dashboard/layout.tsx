"use client";

import NextTopLoader from "nextjs-toploader";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DynamicBreadcrumb } from "@/components/dyniamic-breadcrumb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Tampilkan loading state saat session sedang dimuat
  if (status === "loading") {
    return null; // Tidak perlu skeleton, progress bar akan jalan otomatis
  }

  // Jika tidak ada session, arahkan ke halaman login
  if (!session) {
    router.push("/auth");
    return null;
  }

  return (
    <>
    <NextTopLoader 
        color="#2563eb" 
        initialPosition={0.08} 
        crawlSpeed={200} 
        height={3} 
        showSpinner={false} 
        easing="ease"
        speed={500}
      />

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-4 px-6 bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb />
            {/* <div className="ml-auto">
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/auth" })}
            >
              Logout
            </Button>
          </div> */}
          </header>

          {/* Render halaman di dalam layout */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
