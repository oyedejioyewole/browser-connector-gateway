import { defineMiddleware, fetch, HTTPError } from "nitro";
import { getRouterParam } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { z } from "zod";

import errors from "#utils/errors.ts";
import {
  getClientSecret,
  validateClientSecret,
} from "#utils/middleware/client-secret.ts";
import { clientUuidSchema, upstreamResponseSchemas } from "#utils/schema.ts";

export default defineMiddleware(async (event) => {
  if (!event.url.pathname.startsWith("/client")) return;

  const parsedClientSecret = getClientSecret(event, "query");
  if (!parsedClientSecret.success)
    throw errors.INVALID_CLIENT_SECRET(
      z.treeifyError(parsedClientSecret.error),
    );

  const { app } = useRuntimeConfig();
  if (app.secret === parsedClientSecret.data.token)
    throw errors.INVALID_SECRET_PERMISSIONS();

  const parsedRows = await validateClientSecret(parsedClientSecret.data.token);
  if (!parsedRows.success)
    throw errors.INVALID_SECRET_PERMISSIONS(z.treeifyError(parsedRows.error));

  const clientUuid = getRouterParam(event, "client-uuid");

  const parsedClientUuid = clientUuidSchema.safeParse(clientUuid);
  if (!parsedClientUuid.success)
    throw errors.ROUTE_NOT_FOUND(event.url.pathname);

  if (parsedRows.data.id !== parsedClientUuid.data)
    throw new HTTPError(
      `The client isn't permitted to access /${parsedClientUuid.data}`,
      {
        status: 403,
      },
    );

  const { upstream } = useRuntimeConfig();
  const upstreamResponse = await fetch(`${upstream.url}/next`);
  const upstreamResponseJson = await upstreamResponse.json();

  const parsedUpstreamResponseJson = z.parse(upstreamResponseSchemas["/next"], {
    status: upstreamResponse.status,
    ...upstreamResponseJson,
  });

  if (parsedUpstreamResponseJson.status === 503)
    throw new HTTPError(parsedUpstreamResponseJson.error, {
      status: parsedUpstreamResponseJson.status,
    });

  const websocketUrl = new URL(parsedUpstreamResponseJson.endpoint);
  websocketUrl.hostname = new URL(upstream.url).hostname;

  event.context.websocketEndpoint = websocketUrl.href;
});
