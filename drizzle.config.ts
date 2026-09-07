import { defineConfig } from "drizzle-kit";
import { resolve } from "path";

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: import.meta.env.DATABASE_PATH!,
  },
});
