import { drizzle } from "drizzle-orm/bun-sqlite";
import { useDatabase } from "nitro/database";

const { filename: databasePath } = (await useDatabase().getInstance()) as {
  filename: string;
};

export const db = drizzle(databasePath);
