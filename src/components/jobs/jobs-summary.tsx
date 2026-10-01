"use client";
import { Jobs } from "@/trpc/routers/jobs";
import { useTranslations } from "next-intl";
import { BrandHeading } from "../brand/brand-heading";

type JobsSummaryProps = {
  jobs: Jobs;
};
export const JobsSummary = ({ jobs }: JobsSummaryProps) => {
  const t = useTranslations("jobs.summary");
  return (
    <div className="flex flex-col gap-4">
      <BrandHeading size="gigantic" text={t("heading")} />
      <div className="flex flex-wrap gap-2">{/* ... */}</div>
    </div>
  );
};
