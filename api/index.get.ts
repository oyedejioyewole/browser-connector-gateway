import { defineHandler } from "nitro";
import { HTTPError } from "nitro/h3";
import { z } from "zod";

import { db } from "#db/index.ts";
import { allowedClients, selectSchema } from "#db/schema.ts";

export default defineHandler(async () => {
  const rows = await db.select().from(allowedClients).all();
  const parsedRows = z.array(selectSchema).safeParse(rows);
  if (!parsedRows.success)
    throw new HTTPError("Failed to validate data", {
      status: 500,
      data: z.treeifyError(parsedRows.error),
    });

  return parsedRows.data;
});
