"use client";
import { cn } from "@/lib/utils";
import { Job } from "@/trpc/routers/jobs";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { differenceInCalendarDays, isPast } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../shared/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { WORK_MODE_LABELS_ICONS } from "./constants";
import { Field } from "./offer-row-field";
import { Label } from "./offer-row-label";

type OfferRowProps = {
  job: Job;
  initialExpanded?: boolean;
};

export const OfferRow = ({ job, initialExpanded = false }: OfferRowProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const t = useTranslations();
  const formatter = useFormatter();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const workMode = WORK_MODE_LABELS_ICONS[job.workMode];

  const formattedAddress = [
    job?.jobOfferAddress?.street,
    [job?.jobOfferAddress?.streetNumber, job?.jobOfferAddress?.apartmentNumber]
      .filter(Boolean)
      .join("/"),
    job?.jobOfferAddress?.country,
  ]
    .filter(Boolean)
    .join(" ");

  let hasExpired = false;
  let expiringIn = null;
  if (job?.expirationDate) {
    const dif = differenceInCalendarDays(job.expirationDate, new Date());
    if (dif < 7 && dif > 0) {
      expiringIn = formatter.relativeTime(job.expirationDate);
    }
    hasExpired = isPast(job.expirationDate);
  }

  return (
    <div
      className={cn(
        "border-chocolate-border hover:bg-chocolate-muted flex w-full flex-col justify-between rounded-4xl border-4 px-5 py-3 hover:cursor-pointer",
        hasExpired && "bg-chocolate-muted opacity-50"
      )}
      tabIndex={0}
      onClick={handleClick}
    >
      <div className="flex w-full flex-row justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              {hasExpired && (
                <Label
                  text={t("jobs.offers.row.labels.expired")}
                  className="text-destructive"
                />
              )}
              {expiringIn && (
                <Label
                  text={t("jobs.offers.row.labels.expiring", {
                    exp: expiringIn,
                  })}
                />
              )}
            </div>
            <p className={cn("text-lg font-extrabold", hasExpired && "italic")}>
              {job.role}
            </p>
            <p className="font-light tracking-wider">{job.jobCompany?.name}</p>
          </div>

          <div className="text-muted-foreground inline-flex items-center gap-2 font-light tracking-wider">
            <Badge
              className={workMode.badgeClass}
              text={t(workMode.label)}
              icon={workMode.icon}
            />
            {job.jobOfferAddress?.city && <p>{job.jobOfferAddress?.city}</p>}
          </div>
        </div>
        {job.url && (
          <Button
            nativeButton={false}
            variant="outline_fat"
            size="icon-lg"
            onClick={(e) => e.stopPropagation()}
            render={<Link href={job.url} target="_blank" />}
          >
            <ArrowSquareOutIcon weight="duotone" />
          </Button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="flex flex-col gap-2 overflow-hidden pt-4"
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >
            {formattedAddress && (
              <p className="text-muted-foreground font-light tracking-wider">
                {formattedAddress}
              </p>
            )}

            <Separator />
            {job.notes && (
              <Field labelText={t("jobs.offers.row.labels.notes")}>
                {<p className="leading-tight">{job.notes}</p>}
              </Field>
            )}
            <Field labelText={t("jobs.offers.row.labels.createdAt")}>
              {
                <p className="leading-tight">
                  {formatter.dateTime(job.createdAt, { dateStyle: "short" })}
                </p>
              }
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
