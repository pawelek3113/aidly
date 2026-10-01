import { Skeleton } from "../ui/skeleton";

export const JobsDashboardSkeleton = () => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <Skeleton className="size-4 w-full" />
      <Skeleton className="size-4 w-full" />
      <Skeleton className="size-4 w-full" />
      <Skeleton className="size-4 w-full" />
    </div>
  );
};
