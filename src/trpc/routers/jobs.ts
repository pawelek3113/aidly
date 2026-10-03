import { createJobOfferSchema } from "@/lib/schemas/job-offer";
import {
  jobCompany,
  jobOffer,
  jobOfferAddress,
} from "@/server/db/schema/tables";
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../init";

export const jobsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(createJobOfferSchema)
    .mutation(async ({ ctx, input }) => {
      ctx.db.transaction(async (tx) => {
        const { company, address, ...job } = input;

        let companyId;

        if (company.id) {
          // autocompletion
          const existing = await tx.query.jobCompany.findFirst({
            where: { id: company.id },
          });

          if (!existing) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "jobs.create.errors.company.notFound",
            });
          }
          companyId = company.id;
        } else {
          // user typed company name without autocompletion
          const [match] = await tx
            .select({ id: jobCompany })
            .from(jobCompany)
            .where(
              eq(
                sql`lower(${jobCompany.name})`,
                company.name.trim().toLowerCase()
              )
            )
            .limit(1);

          if (match) {
            companyId = match.id;
          }
          {
            // new company
            const [createdCompany] = await tx
              .insert(jobCompany)
              .values({ ...company })
              .returning({ id: jobCompany.id });

            companyId = createdCompany.id;
          }
        }

        const [newAddress] = address
          ? await tx
              .insert(jobOfferAddress)
              .values(address)
              .returning({ id: jobOfferAddress.id })
          : [undefined];

        const [offer] = await tx
          .insert(jobOffer)
          .values({
            ...job,
            userId: ctx.user.id,
            companyId,
            addressId: newAddress?.id,
          })
          .returning({ id: jobOffer.id });

        return offer.id;
      });
    }),

  getAll: protectedProcedure.query(async (opts) =>
    opts.ctx.db.query.jobOffer.findMany({
      where: { userId: opts.ctx.user.id },
      orderBy: { createdAt: "desc" },
      with: {
        jobCompany: true,
        jobOfferAddress: true,
      },
    })
  ),
});

export type JobsRouter = typeof jobsRouter;
export type Jobs = inferProcedureOutput<JobsRouter["getAll"]>;
export type Job = Jobs[number];
