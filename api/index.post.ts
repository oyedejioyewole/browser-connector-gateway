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
    .values({
      id: clientId,
      clientSecret: `${event.context.gateway.secretPrefix}${hasher.digest("hex")}`,
    })
    .returning();

  const parsedRow = z
    .array(insertSchema)
    .transform(([row]) => ({
      createdAt: row.createdAt,
      endpoint: `${event.url.protocol === "https:" ? "wss://" : "ws://"}${event.url.host}/client/${row.id}?token=${row.clientSecret}`,
    }))
    .parse(insertedRow);

  event.res.status = 201;
  return parsedRow;
});
