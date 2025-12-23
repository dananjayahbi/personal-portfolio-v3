'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ProjectStatus } from "@prisma/client";
import clsx from "clsx";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  statusFilter?: ProjectStatus;
};

export function Pagination({ currentPage, totalPages, statusFilter }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (statusFilter) {
      params.set("status", statusFilter);
    }
    return `/edit-project?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    router.push(createPageUrl(page));
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="h-10 w-10 rounded-lg border border-white/15 bg-white/5 text-sm text-white/60 transition-colors hover:border-white/25 hover:bg-white/8 hover:text-white/80"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="flex items-center px-2 text-white/40">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={clsx(
            "h-10 w-10 rounded-lg border text-sm transition-colors",
            i === currentPage
              ? "border-white/30 bg-white/10 text-white font-medium"
              : "border-white/15 bg-white/5 text-white/60 hover:border-white/25 hover:bg-white/8 hover:text-white/80"
          )}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="flex items-center px-2 text-white/40">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="h-10 w-10 rounded-lg border border-white/15 bg-white/5 text-sm text-white/60 transition-colors hover:border-white/25 hover:bg-white/8 hover:text-white/80"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "h-10 rounded-lg border px-4 text-sm transition-colors",
          currentPage === 1
            ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
            : "border-white/15 bg-white/5 text-white/60 hover:border-white/25 hover:bg-white/8 hover:text-white/80"
        )}
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          "h-10 rounded-lg border px-4 text-sm transition-colors",
          currentPage === totalPages
            ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
            : "border-white/15 bg-white/5 text-white/60 hover:border-white/25 hover:bg-white/8 hover:text-white/80"
        )}
      >
        Next
      </button>
    </div>
  );
}
