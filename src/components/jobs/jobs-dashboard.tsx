"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { JobsEmpty } from "./jobs-empty";
import { JobsSummary } from "./jobs-summary";

export const JobsDashboard = () => {
  const trpc = useTRPC();
  const { data: summary } = useSuspenseQuery(
    trpc.jobs.getSummary.queryOptions()
  );

  if (summary.total === 0) {
    return <JobsEmpty />;
  }

  return <JobsSummary summary={summary} />;
};
