import { defineHandler } from "nitro";
import { useRuntimeConfig } from "nitro/runtime-config";
import { z } from "zod";

import { db } from "#db/index.ts";
import { allowedClients, insertSchema } from "#db/schema.ts";
import { getSecretPrefix } from "#utils/secrets.ts";

export default defineHandler(async (event) => {
  const { app } = useRuntimeConfig();
  const hasher = new Bun.CryptoHasher("sha256", app.secret);

  const clientId = Bun.randomUUIDv7();
  hasher.update(clientId);

  const insertedRow = await db
    .insert(allowedClients)
    .values({
      id: clientId,
      clientSecret: `${getSecretPrefix(app.secret)}${hasher.digest("hex")}`,
    })
    .returning();

  const parsedRow = z
    .array(insertSchema)
    .transform((values) => {
      const rowProperties = values.at(0)!;

      return {
        createdAt: rowProperties.createdAt,
        endpoint: `ws://${event.url.host}/client/${rowProperties.id}?token=${rowProperties.clientSecret}`,
      };
    })
    .parse(insertedRow);

  event.res.status = 201;
  return parsedRow;
});
