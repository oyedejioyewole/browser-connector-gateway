import { eq } from "drizzle-orm";
import { defineHandler } from "nitro";
import { getRouterParam, HTTPError } from "nitro/h3";
import { z } from "zod";

import { db } from "#db/index.ts";
import { allowedClients, selectSchema } from "#db/schema.ts";

export default defineHandler(async (event) => {
  const clientId = getRouterParam(event, "client-uuid");
  if (!clientId)
    throw new HTTPError("Client didn't provided :client-uuid parameter", {
      status: 400,
    });

  const deletedRow = await db
    .delete(allowedClients)
    .where(eq(allowedClients.id, clientId))
    .returning();

  const parsedRow = z
    .array(selectSchema)
    .nonempty()
    .transform((row) => row.at(0))
    .safeParse(deletedRow);
  if (!parsedRow.success)
    throw new HTTPError(`Client '${clientId}' doesn't exist`, {
      status: 404,
    });

  return parsedRow.data;
});
