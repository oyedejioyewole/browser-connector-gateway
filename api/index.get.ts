import { defineHandler } from "nitro";
import { z } from "zod";

import { db } from "#db/index.ts";
import { allowedClients, selectSchema } from "#db/schema.ts";

export default defineHandler(async () => {
  const rows = db.select().from(allowedClients).all();
  const parsedRows = z
    .array(selectSchema.omit({ clientSecret: true }))
    .parse(rows);

  return parsedRows;
});
