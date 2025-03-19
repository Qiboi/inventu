import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter((segment) => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem> */}
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/"); // Buat URL untuk breadcrumb
          const formattedText = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()); // Ubah format teks

          return (
            <Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === segments.length - 1 ? (
                  <BreadcrumbPage>{formattedText}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{formattedText}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
