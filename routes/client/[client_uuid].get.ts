import { createWebSocketProxy } from "crossws";
import { defineWebSocketHandler, HTTPError } from "nitro";
import { useRuntimeConfig } from "nitro/runtime-config";
import { z } from "zod";

import { upstreamResponseSchemas } from "#utils/schema.ts";

export default defineWebSocketHandler(async () => {
  const { upstream } = useRuntimeConfig();
  const upstreamResponse = await fetch(`${upstream.url}/next`);
  const upstreamResponseJson = await upstreamResponse.json();

  if (!upstreamResponse.ok) {
    const { error } = z.parse(
      upstreamResponseSchemas["/next"].error,
      upstreamResponseJson,
    );

    throw new HTTPError(error, {
      status: upstreamResponse.status,
    });
  }

  const { endpoint } = z.parse(
    upstreamResponseSchemas["/next"].success,
    upstreamResponseJson,
  );

  const websocketUrl = new URL(endpoint);
  websocketUrl.hostname = new URL(upstream.url).hostname;

  return createWebSocketProxy(websocketUrl.href);
});
