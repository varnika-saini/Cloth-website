import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div className={cn("skeleton", className)} />;
}

export function ProductSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}
