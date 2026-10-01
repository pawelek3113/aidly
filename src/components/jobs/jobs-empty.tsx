"use client";

import { useTranslations } from "next-intl";
import { BrandHeading } from "../brand/brand-heading";
import { PlusIcon } from "../icons/plus";

export const JobsEmpty = () => {
  const t = useTranslations("jobs.empty");
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <PlusIcon className="text-chocolate-muted stroke-chocolate-border stroke-4 drop-shadow-2xl" />
      <div className="flex flex-col items-center gap-2">
        <BrandHeading size="large" text={t("heading")} />
        <p>{t("subheading")}</p>
      </div>
    </div>
  );
};
