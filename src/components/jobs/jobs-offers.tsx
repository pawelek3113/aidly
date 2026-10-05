"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { BrandHeading } from "../brand/brand-heading";
import { JobsEmpty } from "./jobs-empty";
import { OfferRow } from "./offer-row";

export const JobsOffers = () => {
  const trpc = useTRPC();
  const { data: jobs } = useSuspenseQuery(trpc.jobs.getAll.queryOptions());

  const t = useTranslations("jobs.offers");

  if (!jobs) {
    return <JobsEmpty />;
  }

  return (
    <div className="flex w-full flex-col gap-4 md:max-w-11/12">
      <BrandHeading text={t("heading")} variant="pageHeading" size="gigantic" />
      <div className="flex flex-col gap-4">
        {jobs.map((j) => (
          <OfferRow job={j} key={j.id} />
        ))}
      </div>
    </div>
  );
};
