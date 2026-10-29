import { Status } from "@/server/db/schema/tables";
import type { ReactNode } from "react";

export type ConstantEntry = {
  label: string;
  icon: ReactNode;
  badgeClass?: string;
};

export const TERMINAL_STATUSES = [
  "ghosted",
  "hired",
  "rejected",
] as const satisfies readonly Status[];

export type TerminalStatus = Extract<
  Status,
  (typeof TERMINAL_STATUSES)[number]
>;
export type InitialStatus = Extract<Status, "saved">;

export const INITIAL_STATUS: InitialStatus = "saved";
