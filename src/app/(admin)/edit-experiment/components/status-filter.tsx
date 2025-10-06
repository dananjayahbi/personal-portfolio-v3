'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ExperimentStatus } from "@prisma/client";
import clsx from "clsx";

type StatusFilterProps = {
  currentStatus?: ExperimentStatus;
};

const statuses = [
  { value: null, label: "All Experiments" },
  { value: "DRAFT" as const, label: "Draft" },
  { value: "PUBLISHED" as const, label: "Published" },
  { value: "ARCHIVED" as const, label: "Archived" },
];

export function StatusFilter({ currentStatus }: StatusFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (status: ExperimentStatus | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    router.push(`/edit-experiment?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status.label}
          type="button"
          onClick={() => handleFilterChange(status.value)}
          className={clsx(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            (status.value === currentStatus || (!status.value && !currentStatus))
              ? "border-white/30 bg-white/10 text-white"
              : "border-white/15 bg-white/5 text-white/60 hover:border-white/25 hover:bg-white/8 hover:text-white/80"
          )}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
