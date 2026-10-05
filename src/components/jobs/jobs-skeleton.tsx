import { Skeleton } from "../ui/skeleton";

export const JobsSummarySkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="bg-chocolate-muted h-6 w-2/3" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="bg-chocolate-muted size-52" />
        <Skeleton className="bg-chocolate-muted size-52" />
        <Skeleton className="bg-chocolate-muted size-52" />
        <Skeleton className="bg-chocolate-muted size-52" />
        <Skeleton className="bg-chocolate-muted size-52" />
        <Skeleton className="bg-chocolate-muted size-52" />
      </div>
    </div>
  );
};

export const JobsOffersSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
      <Skeleton className="bg-chocolate-muted h-11 w-2/3" />
    </div>
  );
};
