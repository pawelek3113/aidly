import { SQL, sql } from "drizzle-orm";

export const countWhere = (cond: SQL) =>
  sql<number>`count(*) filter (where ${cond})`.mapWith(Number);
