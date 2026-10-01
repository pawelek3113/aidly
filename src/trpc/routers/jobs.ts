import { inferProcedureOutput } from "@trpc/server";
import { createTRPCRouter, protectedProcdure } from "../init";

export const jobsRouter = createTRPCRouter({
  // create: protectedProcdure.input(z.object({})).mutation(() => {}),
  getAll: protectedProcdure.query(async (opts) =>
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
