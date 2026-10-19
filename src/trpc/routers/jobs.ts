import { createJobOfferSchema } from "@/lib/schemas/job-offer";
import {
  jobCompany,
  jobOffer,
  jobOfferAddress,
  jobOfferSkill,
  jobSalary,
  salaryCurrency,
  skill,
} from "@/server/db/schema/tables";
import { countWhere } from "@/server/db/utils";
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { eq, ne, sql } from "drizzle-orm";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const jobsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(createJobOfferSchema)
    .mutation(async ({ ctx, input }) => {
      ctx.db.transaction(async (tx) => {
        const { company, address, salary, skills, ...job } = input;

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

        if (salary) {
          let currencyId;
          const existingCurrency = await tx.query.salaryCurrency.findFirst({
            where: {
              currency: {
                eq: salary.currency.currency,
              },
            },
          });

          currencyId = existingCurrency?.id;

          if (!existingCurrency) {
            const [createdCurrency] = await tx
              .insert(salaryCurrency)
              .values({ currency: salary.currency.currency })
              .returning({ id: salaryCurrency.id });

            currencyId = createdCurrency?.id;
          }

          if (!currencyId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "jobs.create.errors.currency.notFound",
            });
          }

          await tx
            .insert(jobSalary)
            .values({ ...salary, currencyId, jobId: offer.id })
            .returning({ id: jobSalary.id });
        }

        if (skills && skills?.length > 0) {
          skills.forEach(async (s) => {
            let skillId;
            const existingSkill = await tx.query.skill.findFirst({
              where: {
                title: {
                  eq: s.title,
                },
              },
            });

            if (!existingSkill) {
              const [newSkill] = await tx
                .insert(skill)
                .values({ ...s })
                .returning({ id: skill.id });

              skillId = newSkill.id;
            } else {
              skillId = existingSkill.id;
            }

            await tx
              .insert(jobOfferSkill)
              .values({ offerId: offer.id, skillId });
          });
        }

        return offer.id;
      });
    }),

  getAll: protectedProcedure.query(
    async (opts) =>
      await opts.ctx.db.query.jobOffer.findMany({
        where: { userId: opts.ctx.user.id },
        orderBy: { createdAt: "desc" },
        with: {
          jobCompany: true,
          jobOfferAddress: true,
        },
      })
  ),

  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        saved: countWhere(eq(jobOffer.status, "saved")),
        applied: countWhere(ne(jobOffer.status, "saved")),
        ghosted: countWhere(eq(jobOffer.status, "ghosted")),
        interviews:
          sql<number>`coalesce(sum(${jobOffer.interviewCount}), 0)`.mapWith(
            Number
          ),
        rejections: countWhere(eq(jobOffer.status, "rejected")),
        hired: countWhere(eq(jobOffer.status, "hired")),
      })
      .from(jobOffer)
      .where(eq(jobOffer.userId, ctx.user.id));

    return row;
  }),

  searchCompany: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.jobCompany.findMany({
        where: { name: { ilike: `%${input.name}%` } },
        limit: 10,
      });
    }),

  searchCurrency: protectedProcedure
    .input(z.object({ currency: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.salaryCurrency.findMany({
        where: { currency: { ilike: `%${input.currency}%` } },
        limit: 10,
      });
    }),
});

export type JobsRouter = typeof jobsRouter;
export type Jobs = inferProcedureOutput<JobsRouter["getAll"]>;
export type Job = Jobs[number];

export type Summary = inferProcedureOutput<JobsRouter["getSummary"]>;

export type SearchedCompany = inferProcedureOutput<
  JobsRouter["searchCompany"]
>[number];

export type SearchedCurrency = inferProcedureOutput<
  JobsRouter["searchCurrency"]
>[number];
