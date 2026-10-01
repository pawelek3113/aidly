import { JobsDashboard } from "@/components/jobs/jobs-dashboard";
import { JobsDashboardSkeleton } from "@/components/jobs/jobs-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";

const JobsPage = async () => {
  prefetch(trpc.jobs.getAll.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<JobsDashboardSkeleton />}>
        <JobsDashboard />
      </Suspense>
    </HydrateClient>
  );
};
export default JobsPage;
