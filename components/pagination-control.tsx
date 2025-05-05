import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * PaginationControl
 * Reusable pagination component for listing pages.
 *
 * @param currentPage - Current active page number
 * @param totalPages - Total number of pages
 * @param onPageChange - Callback invoked when page changes
 * @param className - Optional additional className
 */
export default function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationPrevious
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={cn(
          currentPage === 1 && "pointer-events-none opacity-50",
          // tambahkan class user lainnya jika perlu
        )}
      />

      <PaginationContent>
        {Array.from({ length: totalPages }, (_, idx) => {
          const page = idx + 1;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>

      <PaginationNext
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className={cn(
          currentPage === totalPages && "pointer-events-none opacity-50"
        )}
      />
    </Pagination>
  );
}
