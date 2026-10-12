import z from "zod";
import { salaryFormSchema, salarySchema } from "./schemas/job-offer";

export type SalaryInput = z.input<typeof salarySchema>;
export type SalaryOutput = z.output<typeof salaryFormSchema>;

export type SalaryDraft =
  | {
      value?: SalaryInput["value"] | null;
      currency?: Partial<SalaryInput["currency"]>;
    }
  | null
  | undefined;

const isBlank = (v: unknown) =>
  v == null ||
  (typeof v === "string" && v.trim() === "") ||
  (typeof v === "number" && Number.isNaN(v));

export const emptyToNull = (input: unknown) => {
  const salary = input as SalaryDraft;

  const isEmpty = isBlank(salary?.value) && isBlank(salary?.currency?.currency);
  return isEmpty ? null : salary;
};
