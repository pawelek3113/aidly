import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { jobsRouter } from "./jobs";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
        locale: z.string(),
      })
    )
    .query(async (opts) => {
      const t = await getTranslations();
      return {
        greeting: `text: ${t("HomePage.title", { value: opts.input.text })}`,
      };
    }),
  jobs: jobsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
