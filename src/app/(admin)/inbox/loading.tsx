import { Skeleton } from "@/components/ui/skeleton";

export default function InboxLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32 bg-slate-700" />
        <Skeleton className="h-5 w-64 mt-2 bg-slate-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List Skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1 bg-slate-700" />
            <Skeleton className="h-9 flex-1 bg-slate-700" />
            <Skeleton className="h-9 flex-1 bg-slate-700" />
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full bg-slate-700" />
            ))}
          </div>
        </div>

        {/* Message Detail Skeleton */}
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
