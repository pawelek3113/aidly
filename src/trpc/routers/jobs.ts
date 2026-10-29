import { isTerminalStatus } from "@/lib/is-terminal-job-status";
import { createJobOfferSchema } from "@/lib/schemas/job-offer";
import { getPortal } from "@/lib/utils";
import {
  jobCompany,
  jobOffer,
  jobOfferAddress,
  jobOfferSkill,
  jobSalary,
  salaryCurrency,
  skill as skillTable,
} from "@/server/db/schema/tables";
import { countWhere } from "@/server/db/utils";
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { endOfDay } from "date-fns";
import { eq, inArray, ne, sql } from "drizzle-orm";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const jobsRouter = createTRPCRouter({
  add: protectedProcedure
    .input(createJobOfferSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const {
          company,
          address,
          salary,
          skills,
          expirationDate,
          status,
          ...job
        } = input;

        let newStatus = status;

        if (status && !isTerminalStatus(status) && job.interviewHappened) {
          newStatus = "interviewed";
        }

        const exp = expirationDate ? endOfDay(expirationDate) : null;

        const portal = getPortal(job?.url);

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
          // user typed company name without picking a suggestion
          const name = company.name.trim();
          await tx.insert(jobCompany).values({ name }).onConflictDoNothing();

          const [row] = await tx
            .select({ id: jobCompany.id })
            .from(jobCompany)
            .where(eq(sql`lower(${jobCompany.name})`, name.toLowerCase()))
            .limit(1);

          companyId = row.id;
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
            status: newStatus,
            expirationDate: exp,
            portal,
            userId: ctx.user.id,
            companyId,
            addressId: newAddress?.id,
          })
          .returning({ id: jobOffer.id });

        if (salary?.value != null) {
          const code = salary.currency.currency.trim().toUpperCase();

          await tx
            .insert(salaryCurrency)
            .values({ currency: code })
            .onConflictDoNothing();

          const [cur] = await tx
            .select({ id: salaryCurrency.id })
            .from(salaryCurrency)
            .where(eq(salaryCurrency.currency, code));

          await tx
            .insert(jobSalary)
            .values({
              value: salary.value,
              currencyId: cur.id,
              jobId: offer.id,
            })
            .returning({ id: jobSalary.id });
        }

        if (skills && skills?.length > 0) {
          const titles = [...new Set(skills.map((s) => s.title.trim()))];

          await tx
            .insert(skillTable)
            .values(titles.map((title) => ({ title })))
            .onConflictDoNothing();

          const rows = await tx
            .select({ id: skillTable.id })
            .from(skillTable)
            .where(inArray(skillTable.title, titles));

          await tx
            .insert(jobOfferSkill)
            .values(rows.map((r) => ({ offerId: offer.id, skillId: r.id })))
            .onConflictDoNothing();
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
          salary: { with: { currency: true } },
          skills: true,
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

  searchSkill: protectedProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.skill.findMany({
        where: { title: { ilike: `%${input.title}%` } },
        limit: 10,
        columns: { id: true, title: true },
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

export type SearchedSkill = inferProcedureOutput<
  JobsRouter["searchSkill"]
>[number];
