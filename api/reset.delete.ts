import { defineHandler } from "nitro";

import { db } from "#db/index.ts";
import { allowedClients } from "#db/schema.ts";

export default defineHandler(async () => {
  await db.delete(allowedClients);

  return `Allowed client list has been reset`;
});
