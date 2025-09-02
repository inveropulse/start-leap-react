import { Skeleton } from "@/shared/components/ui/skeleton";

export const MetricCardSkeleton = () => (
  <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-10 w-10 rounded-lg" />
    </div>
    <div className="mt-4 flex items-center gap-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const QuickActionSkeleton = () => (
  <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  </div>
);

export const ActivityItemSkeleton = () => (
  <div className="flex items-start gap-4 p-4">
    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
    <div className="flex-1">
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-3 w-64 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export const DashboardSkeletons = () => (
  <div className="p-6 space-y-8">
    {/* Header */}
    <div>
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-5 w-96" />
    </div>

    {/* Revenue Chart Skeleton */}
    <div>
      <Skeleton className="h-6 w-36 mb-4" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>

    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>

    {/* Quick Actions */}
    <div>
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <QuickActionSkeleton key={i} />
        ))}
      </div>
    </div>

    {/* Recent Activity */}
    <div>
      <Skeleton className="h-6 w-36 mb-4" />
      <div className="rounded-xl border bg-card">
        {Array.from({ length: 5 }).map((_, i) => (
          <ActivityItemSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);