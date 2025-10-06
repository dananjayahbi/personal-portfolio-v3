import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32 bg-slate-700" />
        <Skeleton className="h-5 w-96 mt-2 bg-slate-700" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-32 w-full bg-slate-700" />
        <Skeleton className="h-32 w-full bg-slate-700" />
      </div>

      {/* Ignored IPs Skeleton */}
      <Skeleton className="h-64 w-full bg-slate-700" />

      {/* Table Skeleton */}
      <Skeleton className="h-96 w-full bg-slate-700" />
    </div>
  );
}
