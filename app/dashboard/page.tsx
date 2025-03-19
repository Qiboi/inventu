"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Head from "next/head";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Tampilkan loading state saat session sedang dimuat
  if (status === "loading") return <p>Loading...</p>;

  // Jika tidak ada session, arahkan ke halaman login
  if (!session) {
    router.push("/auth");
    return null;
  }

  return (
    <SidebarProvider>
      <Head>
        <title>Dashboard | Projectmu</title>
      </Head>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-4 px-6 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/auth" })}
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Konten Dashboard */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
