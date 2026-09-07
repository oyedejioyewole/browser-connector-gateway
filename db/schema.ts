import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";

export const allowedClients = sqliteTable("allowed_clients", {
  id: text("allowed_client_id").primaryKey(),
  clientSecret: text("client_secret").unique().notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const insertSchema = createInsertSchema(allowedClients);
export const selectSchema = createSelectSchema(allowedClients);
