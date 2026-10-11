import { pgEnum } from "drizzle-orm/pg-core";

export const jobContractEnum = pgEnum("contract_enum", [
  "mandate",
  "employment",
  "specific_work",
  "B2B",
]);

export const jobLevelEnum = pgEnum("job_level_enum", [
  "junior",
  "mid",
  "senior",
]);

export const workModeEnum = pgEnum("work_mode_enum", [
  "remote",
  "on_site",
  "hybrid",
]);

export const offerStatusEnum = pgEnum("offer_status_enum", [
  "saved",
  "applied", // instead of hasApplied
  "interviewed", // after interview
  "rejected",
  "hired",
  "ghosted",
]);
