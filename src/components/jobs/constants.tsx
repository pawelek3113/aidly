"use client";

import {
  Contract,
  Level,
  Status,
  type WorkMode,
} from "@/server/db/schema/tables";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  FileTextIcon,
  GhostIcon,
  HandshakeIcon,
  HouseLineIcon,
  LeafIcon,
  OfficeChairIcon,
  PenNibIcon,
  PlantIcon,
  ReadCvLogoIcon,
  SmileySadIcon,
  TreeIcon,
} from "@phosphor-icons/react";
import { ReactNode } from "react";

export type TerminalStatus = Extract<Status, "ghosted" | "hired" | "rejected">;
export type InitialStatus = Extract<Status, "saved">;

export const INITIAL_STATUS: InitialStatus = "saved";

export const isTerminalStatus = (s: Status): s is TerminalStatus =>
  s in STATUS_LABELS_ICONS;

export const LEVEL_LABELS_ICONS = {
  junior: {
    label: "jobs.create.form.labels.levels.junior",
    icon: <LeafIcon className="size-full" weight="duotone" />,
  },
  mid: {
    label: "jobs.create.form.labels.levels.mid",
    icon: <PlantIcon className="size-full" weight="duotone" />,
  },
  senior: {
    label: "jobs.create.form.labels.levels.senior",
    icon: <TreeIcon className="size-full" weight="duotone" />,
  },
} as const satisfies Record<Level, { label: string; icon: ReactNode }>;

export const CONTRACT_LABELS_ICONS = {
  mandate: {
    label: "jobs.create.form.labels.contracts.mandate",
    icon: <FileTextIcon className="size-full" weight="duotone" />,
  },
  employment: {
    label: "jobs.create.form.labels.contracts.employment",
    icon: <BriefcaseIcon className="size-full" weight="duotone" />,
  },
  B2B: {
    label: "jobs.create.form.labels.contracts.b2b",
    icon: <HandshakeIcon className="size-full" weight="duotone" />,
  },
  specific_work: {
    label: "jobs.create.form.labels.contracts.specificWork",
    icon: <PenNibIcon className="size-full" weight="duotone" />,
  },
} as const satisfies Record<Contract, { label: string; icon: ReactNode }>;

export const WORK_MODE_LABELS_ICONS = {
  remote: {
    label: "jobs.create.form.labels.workModes.remote",
    badgeClass: "bg-[#67419c]",
    icon: <HouseLineIcon className="size-full" weight="duotone" />,
  },
  on_site: {
    label: "jobs.create.form.labels.workModes.onSite",
    badgeClass: "bg-[#5ebf59]",
    icon: <BuildingOfficeIcon className="size-full" weight="duotone" />,
  },
  hybrid: {
    label: "jobs.create.form.labels.workModes.hybrid",
    badgeClass: "bg-[#408add]",
    icon: <OfficeChairIcon className="size-full" weight="duotone" />,
  },
} as const satisfies Record<
  WorkMode,
  { label: string; icon: ReactNode; badgeClass: string }
>;

export const STATUS_LABELS_ICONS = {
  ghosted: {
    label: "jobs.create.form.labels.application.ghosted",
    icon: <GhostIcon className="size-full" weight="duotone" />,
  },
  hired: {
    label: "jobs.create.form.labels.application.hired",
    icon: <ReadCvLogoIcon className="size-full" weight="duotone" />,
  },
  rejected: {
    label: "jobs.create.form.labels.application.rejected",
    icon: <SmileySadIcon className="size-full" weight="duotone" />,
  },
} as const satisfies Record<TerminalStatus, { label: string; icon: ReactNode }>;
