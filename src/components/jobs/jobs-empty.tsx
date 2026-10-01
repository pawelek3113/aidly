"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { BrandHeading } from "../brand/brand-heading";
import { PlusIcon } from "../icons/plus";

export const JobsEmpty = () => {
  const t = useTranslations("jobs.empty");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <Link href="/jobs/create">
        <PlusIcon className="text-chocolate-muted stroke-chocolate-border stroke-4 drop-shadow-2xl" />
      </Link>
      <div className="flex flex-col items-center gap-2">
        <BrandHeading
          size="xlarge"
          text={t("heading")}
          className="text-center"
        />
        <p>{t("subheading")}</p>
      </div>
    </div>
  );
};
