import { defineConfig } from "drizzle-kit";

// Same schema and migrations folder as drizzle.config.ts — only the target
// database differs. Use this for generating/testing migrations against the
// dev database before ever applying them to production via drizzle.config.ts.
export default defineConfig({
  schema: "./src/backend/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_DEV!,
  },
});
