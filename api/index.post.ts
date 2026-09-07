import { defineHandler } from "nitro";
import { useRuntimeConfig } from "nitro/runtime-config";
import { z } from "zod";

import { db } from "#db/index.ts";
import { allowedClients, insertSchema } from "#db/schema.ts";

export default defineHandler(async (event) => {
  const { app } = useRuntimeConfig();
  const hasher = new Bun.CryptoHasher("sha256", app.secret);

  const clientId = Bun.randomUUIDv7();
  hasher.update(clientId);

  const insertedRow = await db
    .insert(allowedClients)
    .values({ id: clientId, clientSecret: hasher.digest("base64") })
    .returning();

  const parsedRow = z
    .array(insertSchema)
    .transform((value) => value.at(0))
    .parse(insertedRow);

  event.res.status = 201;
  return parsedRow;
});
