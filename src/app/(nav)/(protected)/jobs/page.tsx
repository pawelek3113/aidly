import { JobsDashboard } from "@/components/jobs/jobs-dashboard";
import { JobsSummarySkeleton } from "@/components/jobs/jobs-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";

const JobsPage = async () => {
  prefetch(trpc.jobs.getSummary.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<JobsSummarySkeleton />}>
        <JobsDashboard />
      </Suspense>
    </HydrateClient>
  );
};
export default JobsPage;
