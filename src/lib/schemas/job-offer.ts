import {
  jobCompany,
  jobOffer,
  jobOfferAddress,
  jobSalary,
  salaryCurrency,
  skill,
} from "@/server/db/schema/tables";
import { createInsertSchema } from "drizzle-orm/zod";
import z, { boolean, type ZodType } from "zod";
import { emptyToNull, SalaryDraft, SalaryOutput } from "../salary-helpers";

export const companySchema = createInsertSchema(jobCompany, {
  name: (s) => s.min(1, "jobs.create.errors.company.name"),
})
  .omit({
    id: true,
  })
  .extend({ id: z.string().optional() });

export const addressSchema = createInsertSchema(jobOfferAddress).omit({
  id: true,
});

export const currencySchema = createInsertSchema(salaryCurrency, {
  currency: () =>
    z
      .string({ error: "jobs.create.errors.offer.currency.required" })
      .trim()
      .min(1, "jobs.create.errors.offer.currency.required")
      .regex(/^[A-Z]{3}$/, "jobs.create.errors.offer.currency.invalid"),
});

export const salarySchema = createInsertSchema(jobSalary, {
  value: () =>
    z
      .number({ error: "jobs.create.errors.offer.salary.required" })
      .min(0, "jobs.create.errors.offer.salary.minValue"),
})
  .omit({
    id: true,
    currencyId: true,
    jobId: true,
  })
  .extend({ currency: currencySchema });

export const salaryFormSchema = salarySchema.nullable();

export const salaryFieldSchema = z.preprocess(
  emptyToNull,
  salaryFormSchema
) as ZodType<SalaryOutput, SalaryDraft>;

export const skillsSchema = createInsertSchema(skill, {
  title: (s) => s.max(20, "jobs.create.errors.skills.maxLength"),
})
  .array()
  .nullable();

export const createJobOfferSchema = createInsertSchema(jobOffer, {
  role: (s) => s.min(1, "jobs.create.errors.offer.role.required"),
  url: z
    .union([
      z.url("jobs.create.errors.offer.url.notAnUrl"),
      z.literal("").transform(() => null),
      z.null(),
    ])
    .default(null),
  notes: (s) => s.max(300, "jobs.create.errors.offer.notes.maxLength"),
  interviewCount: (i) =>
    i.min(0, "jobs.create.errors.offer.interview.count.minValue").optional(),
})
  .omit({
    id: true,
    userId: true,
    addressId: true,
    companyId: true,
    createdAt: true,
    updatedAt: true,
    portal: true, // TODO: based on the URL!!!
  })
  .extend({
    company: companySchema,
    address: addressSchema,
    salary: salaryFieldSchema,
    skills: skillsSchema,
    hasApplied: boolean().default(false),
    interviewHappened: boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.interviewHappened && data.interviewCount == null) {
      ctx.addIssue({
        code: "custom",
        path: ["interviewCount"],
        message: "jobs.create.errors.offer.interview.count.required",
      });
    }
  });

export type JobOfferFormInput = z.input<typeof createJobOfferSchema>;
export type CreateJobOfferInput = z.infer<typeof createJobOfferSchema>;
