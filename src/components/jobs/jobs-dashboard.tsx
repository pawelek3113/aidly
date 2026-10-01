"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { JobsEmpty } from "./jobs-empty";
import { JobsSummary } from "./jobs-summary";

export const JobsDashboard = () => {
  const trpc = useTRPC();
  const { data: jobs } = useSuspenseQuery(trpc.jobs.getAll.queryOptions());

  if (jobs.length === 0) {
    return <JobsEmpty />;
  }

  return <JobsSummary jobs={jobs} />;
};
