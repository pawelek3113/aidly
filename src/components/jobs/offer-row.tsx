"use client";
import { Job } from "@/trpc/routers/jobs";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "../ui/button";

type OfferRowProps = {
  job: Job;
};

export const OfferRow = ({ job }: OfferRowProps) => {
  return (
    <div className="border-chocolate-border hover:bg-chocolate-muted flex w-full flex-row justify-between rounded-4xl border-4 px-4 py-3">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-extrabold">{job.role}</p>
        <p className="font-light tracking-wider">{job.jobCompany?.name}</p>
      </div>
      <Button
        nativeButton={false}
        variant="outline_fat"
        size="icon-lg"
        render={<Link href={job.url} target="_blank" />}
      >
        <ArrowSquareOutIcon weight="duotone" />
      </Button>
    </div>
  );
};
