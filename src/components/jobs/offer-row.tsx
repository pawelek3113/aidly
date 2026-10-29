"use client";
import { isTerminalStatus } from "@/lib/is-terminal-job-status";
import { cn } from "@/lib/utils";
import { Job } from "@/trpc/routers/jobs";
import {
  ArrowSquareOutIcon,
  ClockCountdownIcon,
  HourglassSimpleIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { differenceInCalendarDays, isPast } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../shared/badge";
import { ToolTip } from "../shared/tooltip";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  CONTRACT_LABELS_ICONS,
  LEVEL_LABELS_ICONS,
  STATUS_LABELS_ICONS,
  WORK_MODE_LABELS_ICONS,
} from "./constants";
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
  const jobLevel = LEVEL_LABELS_ICONS[job.level];
  const jobStatus = STATUS_LABELS_ICONS[job.status];
  const jobContract = CONTRACT_LABELS_ICONS[job.contract];

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
    if (dif < 7 && dif >= 0) {
      expiringIn = formatter.relativeTime(job.expirationDate);
    }

    hasExpired = isPast(job.expirationDate);
  }

  return (
    <div
      className={cn(
        "border-chocolate-border hover:bg-chocolate-muted relative flex w-full flex-col justify-between overflow-clip rounded-4xl border-4 px-5 py-3 hover:cursor-pointer",
        hasExpired && "bg-chocolate-muted opacity-50",
        job.status === "hired" &&
          "border-success from-success-muted bg-linear-to-l from-0% to-transparent to-70%",
        job.status === "rejected" &&
          "border-destructive from-destructive-muted bg-linear-to-l from-0% to-transparent to-70%",
        job.status === "ghosted" &&
          "border-gray-400 bg-linear-to-l from-gray-500 from-0% to-transparent to-70%"
      )}
      tabIndex={0}
      onClick={handleClick}
    >
      <div className="flex w-full flex-row justify-between">
        <div className="z-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              {job.isFavorite && (
                <Badge
                  variant="ghost"
                  noPadding="enabled"
                  text={t("jobs.offers.row.labels.favorite")}
                  textClassName="text-yellow-500"
                  icon={
                    <StarIcon
                      weight="fill"
                      className="shrink-0 text-yellow-500"
                    />
                  }
                />
              )}
              {hasExpired && (
                <Badge
                  variant="ghost"
                  noPadding="enabled"
                  text={t("jobs.offers.row.labels.expired")}
                  textClassName="text-destructive"
                  icon={
                    <HourglassSimpleIcon
                      weight="bold"
                      className="text-destructive shrink-0"
                    />
                  }
                />
              )}
              {expiringIn && (
                <Badge
                  variant="ghost"
                  noPadding="enabled"
                  text={t("jobs.offers.row.labels.expiring", {
                    exp: expiringIn,
                  })}
                  textClassName="text-muted-foreground"
                  icon={
                    <ClockCountdownIcon
                      weight="bold"
                      className="text-muted-foreground shrink-0"
                    />
                  }
                />
              )}
            </div>
            <div className="flex flex-col items-start gap-1 md:flex-row md:items-center">
              {!isTerminalStatus(job.status) && (
                <ToolTip
                  trigger={
                    <Badge
                      icon={jobStatus.icon}
                      text={t(jobStatus.label)}
                      variant="outline"
                      borderRadius="lg"
                      size="icon_sm"
                      textClassName="md:hidden"
                    />
                  }
                  content={t(jobStatus.label)}
                />
              )}
              <p
                className={cn("text-lg font-extrabold", hasExpired && "italic")}
              >
                {job.role}
              </p>
              <div className="flex gap-1">
                <Badge
                  text={t(jobLevel.label)}
                  variant="outline"
                  className={jobLevel.badgeClass}
                  borderRadius="md"
                  size="sm"
                />
                <Badge
                  text={t(jobContract.label)}
                  variant="outline"
                  className={jobContract.badgeClass}
                  borderRadius="md"
                  size="sm"
                />
              </div>
            </div>
            <p className="font-light tracking-wider">{job.jobCompany?.name}</p>
          </div>

          <div className="text-muted-foreground inline-flex items-center gap-2 font-light tracking-wider">
            <Badge
              className={workMode.badgeClass}
              text={t(workMode.label)}
              icon={workMode.icon}
              size="sm"
            />
            {job.jobOfferAddress?.city && <p>{job.jobOfferAddress?.city}</p>}
          </div>
        </div>
        {isTerminalStatus(job.status) && (
          <>
            <div className="pointer-events-none absolute top-1/2 right-2 grid -translate-y-1/2 md:right-6">
              <div className="col-start-1 row-start-1 size-40 justify-self-end opacity-20 sm:size-60">
                {jobStatus.icon}
              </div>
              <p
                className={cn(
                  "col-start-1 row-start-1 self-center text-end text-3xl font-extrabold tracking-tighter whitespace-nowrap uppercase opacity-60 sm:text-start md:text-5xl",
                  job.status === "hired" && "text-success",
                  job.status === "rejected" && "text-destructive",
                  job.status === "ghosted" && "text-gray-400"
                )}
              >
                {t(jobStatus.label)}
              </p>
            </div>
          </>
        )}
        {job.url && (
          <div className="flex h-fit flex-col items-end gap-2 sm:flex-row sm:items-center">
            <Label text={job.portal ?? ""} />
            <Button
              nativeButton={false}
              variant="outline_fat"
              size="icon-lg"
              onClick={(e) => e.stopPropagation()}
              render={<Link href={job.url} target="_blank" />}
            >
              <ArrowSquareOutIcon weight="duotone" />
            </Button>
          </div>
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

            <Separator className="from-border bg-transparent bg-linear-to-r to-transparent to-60%" />
            {job.skills.length > 0 && (
              <Field labelText={t("jobs.offers.row.labels.skills")}>
                <div className="flex flex-row flex-wrap gap-1">
                  {job.skills.map((s) => (
                    <Badge
                      borderRadius="sm"
                      uppercase={false}
                      text={s.title}
                      key={s.id}
                      variant="outline"
                      className="w-fit"
                    />
                  ))}
                </div>
              </Field>
            )}
            {job.salary && (
              <Field labelText={t("jobs.offers.row.labels.salary")}>
                <p className="w-1/2 leading-tight">
                  {formatter.number(job.salary.value, {
                    style: "currency",
                    currency: job.salary.currency?.currency,
                  })}
                </p>
              </Field>
            )}
            {job.interviewCount > 0 && (
              <Field labelText={t("jobs.offers.row.labels.interviews")}>
                <p className="w-1/2 leading-tight">{job.interviewCount}</p>
              </Field>
            )}
            {job.feedback && (
              <Field labelText={t("jobs.offers.row.labels.feedback")}>
                <p className="w-1/2 leading-tight">{job.feedback}</p>
              </Field>
            )}
            {job.notes && (
              <Field labelText={t("jobs.offers.row.labels.notes")}>
                <p className="w-1/2t leading-tight">{job.notes}</p>
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
