import {
  jobCompany,
  jobOffer,
  jobOfferAddress,
} from "@/server/db/schema/tables";
import { createInsertSchema } from "drizzle-orm/zod";
import z from "zod";

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

export const createJobOfferSchema = createInsertSchema(jobOffer, {
  role: (s) => s.min(1, "jobs.create.errors.offer.role.required"),
  url: (s) =>
    s
      .min(1, "jobs.create.errors.offer.url.required")
      .pipe(z.url("jobs.create.errors.offer.url.notAnUrl")),
  notes: (s) => s.max(300, "jobs.create.errors.offer.notes.maxLength"),
})
  .omit({
    id: true,
    userId: true,
    addressId: true,
    companyId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    company: companySchema,
    address: addressSchema,
  });

export type CreateJobOfferInput = z.infer<typeof createJobOfferSchema>;
