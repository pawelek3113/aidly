import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: process.env.ENV_FILE ?? ".env", override: true });

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/server/db/schema/tables/index.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
