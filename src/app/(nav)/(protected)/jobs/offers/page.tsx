import { JobsOffers } from "@/components/jobs/jobs-offers";
import { JobsOffersSkeleton } from "@/components/jobs/jobs-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";

const JobOffersPage = () => {
  prefetch(trpc.jobs.getAll.queryOptions());
  return (
    <HydrateClient>
      <Suspense fallback={<JobsOffersSkeleton />}>
        <JobsOffers />
      </Suspense>
    </HydrateClient>
  );
};
export default JobOffersPage;
