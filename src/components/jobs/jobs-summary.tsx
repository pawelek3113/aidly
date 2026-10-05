"use client";
import { Summary } from "@/trpc/routers/jobs";
import { useTranslations } from "next-intl";
import { BrandHeading } from "../brand/brand-heading";
import { SummaryTile } from "./summary-tile";

type JobsSummaryProps = {
  summary: Summary;
};
export const JobsSummary = ({ summary }: JobsSummaryProps) => {
  const t = useTranslations("jobs.summary");
  return (
    <div className="flex flex-col gap-4">
      <BrandHeading size="gigantic" text={t("heading")} variant="pageHeading" />
      <div className="flex flex-wrap justify-center gap-2 md:justify-start">
        {Object.entries(summary).map(([name, value]) => (
          <SummaryTile key={name} text={t(name)} value={value} />
        ))}
      </div>
    </div>
  );
};
