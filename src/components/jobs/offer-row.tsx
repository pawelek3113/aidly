"use client";
import { Job } from "@/trpc/routers/jobs";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../shared/badge";
import { Button } from "../ui/button";
import { Field } from "./offer-row-field";

type OfferRowProps = {
  job: Job;
  initialExpanded?: boolean;
};

export const OfferRow = ({ job, initialExpanded = false }: OfferRowProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const t = useTranslations("jobs.offers.row");
  const formatter = useFormatter();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className="border-chocolate-border hover:bg-chocolate-muted flex w-full flex-col justify-between rounded-4xl border-4 px-5 py-3 hover:cursor-pointer"
      tabIndex={0}
      onClick={handleClick}
    >
      <div className="flex w-full flex-row justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-extrabold">{job.role}</p>
            <p className="font-light tracking-wider">{job.jobCompany?.name}</p>
          </div>

          <div className="text-muted-foreground inline-flex items-center gap-2 font-light tracking-wider">
            {job.isRemote && <Badge text={t("features.remote")} />}
            {job.jobOfferAddress?.city && <p>{job.jobOfferAddress?.city}</p>}
          </div>
        </div>
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
            {job.notes && (
              <Field labelText={t("labels.notes")}>
                {<p className="leading-tight">{job.notes}</p>}
              </Field>
            )}
            <Field labelText={t("labels.createdAt")}>
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
