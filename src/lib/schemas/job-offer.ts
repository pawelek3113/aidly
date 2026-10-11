import {
  jobCompany,
  jobOffer,
  jobOfferAddress,
  jobSalary,
  salaryCurrency,
  skill,
} from "@/server/db/schema/tables";
import { createInsertSchema } from "drizzle-orm/zod";
import z, { boolean, output, type ZodType } from "zod";

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

export const currencySchema = createInsertSchema(
  salaryCurrency

  // TODO: handle Invalid input: expected string, received undefined
).omit({
  id: true,
});

export const salarySchema = createInsertSchema(jobSalary, {
  value: (i) => i.min(0, "jobs.create.errors.offer.salary.minValue"),
  // TODO: handle Invalid input: expected number, received undefined
})
  .omit({
    id: true,
    currencyId: true,
    jobId: true,
  })
  .extend({ currency: currencySchema });

export const salaryFormSchema = salarySchema.nullable();

type SalaryInput = z.input<typeof salarySchema>;

export type SalaryDraft =
  | {
      value?: SalaryInput["value"] | null;
      currency?: Partial<SalaryInput["currency"]>;
    }
  | null
  | undefined;

const emptyToNull = (s: unknown) => {
  const salary = s as SalaryDraft;

  const hasValue = salary?.value != null;
  const hasCurrency = !!salary?.currency?.currency?.trim();

  return hasValue || hasCurrency ? salary : null;
};

export const salaryFieldSchema = z.preprocess(
  emptyToNull,
  salaryFormSchema
) as ZodType<output<typeof salaryFormSchema>, SalaryDraft>;

export const skillsSchema = createInsertSchema(skill);

export const createJobOfferSchema = createInsertSchema(jobOffer, {
  role: (s) => s.min(1, "jobs.create.errors.offer.role.required"),
  url: (s) =>
    s
      .min(1, "jobs.create.errors.offer.url.required")
      .pipe(z.url("jobs.create.errors.offer.url.notAnUrl")),
  notes: (s) => s.max(300, "jobs.create.errors.offer.notes.maxLength"),
  interviewCount: (i) =>
    i.min(0, "jobs.create.errors.offer.interview.count.minValue").nullable(),
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
    // skills: skillsSchema.nullable(), TODO
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
