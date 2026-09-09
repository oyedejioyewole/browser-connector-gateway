import { defineHandler, fetch } from "nitro";
import { useRuntimeConfig } from "nitro/runtime-config";

import { db } from "#db/index.ts";
import { allowedClients } from "#db/schema.ts";

export default defineHandler(async (event) => {
  await db.select({ id: allowedClients.id }).from(allowedClients).limit(1);

  const { upstream } = useRuntimeConfig();
  const upstreamResponse = await fetch(`${upstream.url}/health`, {
    method: "HEAD",
  });

  event.res.status = upstreamResponse.status;

  return upstreamResponse.ok ? ":-)" : ":-(";
});
